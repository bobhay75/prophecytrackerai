<?php
declare(strict_types=1);
namespace Prophecy;

trait Payments
{
    private ?string $paypalToken = null;
    private function paymentLock(int $userId,callable $operation):mixed
    {
        $path=$this->config['directory'].'/data/payment-'.$userId.'.lock';
        if(is_link($path))throw new \RuntimeException('Invalid private lock.');
        $lock=fopen($path,'c');if(!$lock)throw new \RuntimeException('Private payment lock unavailable.');
        $deadline=microtime(true)+2;
        while(!flock($lock,LOCK_EX|LOCK_NB)){
            if(microtime(true)>=$deadline){fclose($lock);throw new Failure(409,'payment_busy','Another payment operation is in progress for this account. Check the existing order shortly.');}
            usleep(20000);
        }
        try{
            if(!$this->user($userId))throw new Failure(401,'sign_in','The account no longer exists.');
            return $operation();
        }finally{flock($lock,LOCK_UN);fclose($lock);}
    }
    public function paypalReady(): bool
    {
        $c=$this->config;
        return $c['paypal_enabled']===true && in_array($c['paypal_mode'],['sandbox','live'],true) && preg_match('/^[A-Z0-9]{6,32}$/D',$c['paypal_merchant_id'])===1 && $c['paypal_client_id']!=='' && $c['paypal_client_secret']!=='' && is_string($c['pass_price_usd']) && preg_match('/^(?:[1-9][0-9]{0,3}|0)\.[0-9]{2}$/D',$c['pass_price_usd'])===1 && (float)$c['pass_price_usd']>0;
    }
    private function paypal(string $method,string $path,?array $payload=null,?string $requestId=null): array
    {
        if(!$this->paypalReady()) throw new Failure(503,'checkout_disabled','PayPal checkout has not been activated. No payment was started.');
        $base=$this->config['paypal_mode']==='live'?'https://api-m.paypal.com':'https://api-m.sandbox.paypal.com';
        if($this->paypalToken===null){
            $r=$this->request('POST',$base.'/v1/oauth2/token',['Authorization: Basic '.base64_encode($this->config['paypal_client_id'].':'.$this->config['paypal_client_secret']),'Content-Type: application/x-www-form-urlencoded'],'grant_type=client_credentials');
            $token=json_decode($r['body'],true);
            if($r['status']!==200 || !is_string($token['access_token']??null) || !preg_match('/^[A-Za-z0-9_.-]{10,2048}$/D',$token['access_token'])) throw new Failure(503,'paypal_auth','PayPal could not authorize this checkout. No new payment was confirmed.');
            $this->paypalToken=$token['access_token'];
        }
        $headers=['Authorization: Bearer '.$this->paypalToken,'Content-Type: application/json','Prefer: return=representation'];
        if($requestId!==null)$headers[]='PayPal-Request-Id: '.$requestId;
        $r=$this->request($method,$base.$path,$headers,$payload!==null?json_encode($payload,JSON_THROW_ON_ERROR):null);
        $data=json_decode($r['body'],true,64);
        if(!is_array($data) || $r['status']<200 || $r['status']>=300) throw new Failure(502,'paypal_request','PayPal has not confirmed this request. Check your existing purchase before starting another payment.');
        return $data;
    }
    public function createOrder(int $userId): array
    {
        return $this->paymentLock($userId,fn()=>$this->createOrderLocked($userId));
    }
    private function createOrderLocked(int $userId): array
    {
        if(!$this->paypalReady()) throw new Failure(503,'checkout_disabled','PayPal checkout is not currently available. No payment was started.');
        if($this->pass($userId)['active']) throw new Failure(409,'pass_active','Your Research Pass is already active.');
        $this->limit('checkout:'.$userId,10,3600);
        $order=$this->one("SELECT * FROM orders WHERE user_id=? AND status IN ('creating','created') ORDER BY created_at DESC LIMIT 1",[$userId]);
        if($order && ($order['amount']!==$this->config['pass_price_usd'] || $order['merchant']!==$this->config['paypal_merchant_id'] || $order['mode']!==$this->config['paypal_mode'])) throw new Failure(409,'checkout_changed','An existing order requires support before the payment configuration can change.');
        if($order && $order['approval_url']) return ['order_id'=>$order['provider_id'],'approval_url'=>$order['approval_url'],'amount'=>$order['amount'],'mode'=>$order['mode']];
        if(!$order){
            $id=bin2hex(random_bytes(16));
            $this->run('INSERT INTO orders(id,user_id,amount,merchant,mode,status,created_at) VALUES(?,?,?,?,?,?,?)',[$id,$userId,$this->config['pass_price_usd'],$this->config['paypal_merchant_id'],$this->config['paypal_mode'],'creating',time()]);
            $order=$this->one('SELECT * FROM orders WHERE id=?',[$id]);
        }
        $return=$this->config['origin'].$this->config['base_path'].'/';
        $payload=['intent'=>'CAPTURE','purchase_units'=>[['reference_id'=>'research-pass','custom_id'=>'prophecy:'.$order['id'],'description'=>'30-day Research Pass: up to 20 saved earthquake observation rules. No earthquake prediction or emergency-warning service.','amount'=>['currency_code'=>'USD','value'=>$order['amount']],'payee'=>['merchant_id'=>$order['merchant']]]],'payment_source'=>['paypal'=>['experience_context'=>['brand_name'=>'ProphecyTracker AI','shipping_preference'=>'NO_SHIPPING','user_action'=>'PAY_NOW','return_url'=>$return.'?paypal_return=1','cancel_url'=>$return.'?paypal_cancel=1']]]];
        $created=$this->paypal('POST','/v2/checkout/orders',$payload,'create-'.$order['id']);
        $providerId=$created['id']??'';$approval=null;
        foreach($created['links']??[] as $link)if(in_array($link['rel']??'', ['approve','payer-action'],true))$approval=$link['href']??null;
        $u=is_string($approval)?parse_url($approval):false;
        $host=$order['mode']==='live'?'www.paypal.com':'www.sandbox.paypal.com';
        if(!is_string($providerId) || !preg_match('/^[A-Z0-9]{8,36}$/D',$providerId) || !$u || ($u['scheme']??'')!=='https' || ($u['host']??'')!==$host || isset($u['user']) || isset($u['pass']) || isset($u['port'])) throw new Failure(502,'paypal_order','PayPal returned an unusable approval link. No payment was confirmed.');
        $this->run('UPDATE orders SET provider_id=?,approval_url=?,status=? WHERE id=?',[$providerId,$approval,'created',$order['id']]);
        return ['order_id'=>$providerId,'approval_url'=>$approval,'amount'=>$order['amount'],'mode'=>$order['mode']];
    }
    private function verifiedCapture(array $remote,array $order): string
    {
        $units=$remote['purchase_units']??[];
        if(($remote['id']??null)!==$order['provider_id'] || ($remote['status']??null)!=='COMPLETED' || ($remote['intent']??null)!=='CAPTURE' || count($units)!==1) throw new Failure(409,'unconfirmed_payment','PayPal has not confirmed the expected completed order.');
        $unit=$units[0];$captures=$unit['payments']['captures']??[];
        if(($unit['custom_id']??'')!=='prophecy:'.$order['id'] || ($unit['reference_id']??'')!=='research-pass' || ($unit['payee']['merchant_id']??'')!==$order['merchant'] || ($unit['amount']['currency_code']??'')!=='USD' || ($unit['amount']['value']??'')!==$order['amount'] || count($captures)!==1) throw new Failure(409,'payment_mismatch','The confirmed order does not match this account’s purchase. Please contact support.');
        $capture=$captures[0];$id=$capture['id']??'';
        if(!is_string($id) || !preg_match('/^[A-Z0-9]{8,36}$/D',$id) || ($capture['status']??'')!=='COMPLETED' || ($capture['final_capture']??false)!==true || ($capture['amount']['currency_code']??'')!=='USD' || ($capture['amount']['value']??'')!==$order['amount']) throw new Failure(409,'capture_unconfirmed','The payment capture is not fully completed. No paid access was granted.');
        return $id;
    }
    private function currentCapture(string $id,array $order):void
    {
        // Read the capture resource too: an older order representation must not restore refunded access.
        $capture=$this->paypal('GET','/v2/payments/captures/'.$id);
        if(($capture['id']??'')!==$id || ($capture['status']??'')!=='COMPLETED' || ($capture['amount']['currency_code']??'')!=='USD' || ($capture['amount']['value']??'')!==$order['amount'])throw new Failure(409,'capture_unconfirmed','The current PayPal capture is not fully paid. No paid access was granted.');
    }
    public function captureOrder(int $userId,string $providerId): array
    {
        return $this->paymentLock($userId,fn()=>$this->captureOrderLocked($userId,$providerId));
    }
    private function captureOrderLocked(int $userId,string $providerId): array
    {
        if(!preg_match('/^[A-Z0-9]{8,36}$/D',$providerId)) throw new Failure(422,'order_id','Invalid PayPal order.');
        $order=$this->one('SELECT * FROM orders WHERE user_id=? AND provider_id=?',[$userId,$providerId]);
        if(!$order)throw new Failure(404,'order_not_found','This order does not belong to the signed-in account.');
        if(!in_array($order['status'],['created','paid'],true))throw new Failure(409,'order_closed','This order is closed. Check its payment status before making another purchase.');
        $existing=$this->one("SELECT id FROM orders WHERE user_id=? AND status='paid' AND expires_at>? AND id<>?",[$userId,time(),$order['id']]);
        if($existing)throw new Failure(409,'pass_active','Another Research Pass is already active. This order was not captured.');
        if($order['merchant']!==$this->config['paypal_merchant_id'] || $order['mode']!==$this->config['paypal_mode']) throw new Failure(409,'checkout_changed','The original payment configuration is required to verify this order.');
        $this->limit('capture:'.$userId,20,3600);
        // GET first recovers an interrupted successful capture without charging again.
        $remote=$this->paypal('GET','/v2/checkout/orders/'.$providerId);
        if(($remote['status']??'')!=='COMPLETED') {
            if(($remote['status']??'')!=='APPROVED')throw new Failure(409,'approval_required','Approve the order on PayPal before completing this purchase.');
            $this->paypal('POST','/v2/checkout/orders/'.$providerId.'/capture',[],'capture-'.$order['id']);
            $remote=$this->paypal('GET','/v2/checkout/orders/'.$providerId);
        }
        $capture=$this->verifiedCapture($remote,$order);
        $this->currentCapture($capture,$order);
        $this->run("UPDATE orders SET capture_id=?,status='paid',paid_at=COALESCE(paid_at,?),expires_at=COALESCE(expires_at,?),verified_at=? WHERE id=?",[$capture,time(),time()+30*86400,time(),$order['id']]);
        return ['confirmed'=>true,'pass'=>$this->pass($userId),'mode'=>$order['mode'],'order_id'=>$providerId];
    }
    public function orders(int $userId): array
    {
        return $this->all('SELECT provider_id AS order_id,amount,mode,status,approval_url,created_at,paid_at,expires_at FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 20',[$userId]);
    }
    public function reconcileOrder(int $userId,string $providerId): array
    {
        return $this->paymentLock($userId,fn()=>$this->reconcileOrderLocked($userId,$providerId));
    }
    private function reconcileOrderLocked(int $userId,string $providerId): array
    {
        if(!preg_match('/^[A-Z0-9]{8,36}$/D',$providerId))throw new Failure(422,'order_id','Invalid PayPal order.');
        $order=$this->one('SELECT * FROM orders WHERE user_id=? AND provider_id=?',[$userId,$providerId]);
        if(!$order)throw new Failure(404,'order_not_found','This order does not belong to the signed-in account.');
        if($order['merchant']!==$this->config['paypal_merchant_id'] || $order['mode']!==$this->config['paypal_mode'])throw new Failure(409,'checkout_changed','The original payment configuration is required to verify this order.');
        $this->limit('reconcile:'.$userId,20,3600);
        $remote=$this->paypal('GET','/v2/checkout/orders/'.$providerId);
        if(($remote['status']??'')==='COMPLETED'){
            $capture=$this->verifiedCapture($remote,$order);
            $this->currentCapture($capture,$order);
            $this->run("UPDATE orders SET capture_id=?,status='paid',paid_at=COALESCE(paid_at,?),expires_at=COALESCE(expires_at,?),verified_at=? WHERE id=?",[$capture,time(),time()+30*86400,time(),$order['id']]);
            return ['confirmed'=>true,'provider_status'=>'COMPLETED','pass'=>$this->pass($userId)];
        }
        $state=$remote['status']??'UNKNOWN';
        if($state==='VOIDED' || ($state==='CREATED' && time()-(int)$order['created_at']>3*3600))$this->run("UPDATE orders SET status='closed' WHERE id=?",[$order['id']]);
        return ['confirmed'=>false,'provider_status'=>in_array($state,['CREATED','APPROVED','PAYER_ACTION_REQUIRED','VOIDED'],true)?$state:'UNKNOWN','closed'=>$state==='VOIDED' || ($state==='CREATED' && time()-(int)$order['created_at']>3*3600)];
    }
    public function pass(int $userId): array
    {
        $order=$this->one("SELECT * FROM orders WHERE user_id=? AND status='paid' AND expires_at>? ORDER BY expires_at DESC LIMIT 1",[$userId,time()]);
        $off=['active'=>false,'expires_at'=>null,'mode'=>null]; if(!$order)return $off;
        if($order['mode']!==$this->config['paypal_mode'] || $order['merchant']!==$this->config['paypal_merchant_id'])return $off+['verification_pending'=>true];
        if(time()-(int)$order['verified_at']>86400){
            try {
                $capture=$this->paypal('GET','/v2/payments/captures/'.$order['capture_id']);
                if(($capture['id']??'')!==$order['capture_id'] || ($capture['status']??'')!=='COMPLETED' || ($capture['amount']['currency_code']??'')!=='USD' || ($capture['amount']['value']??'')!==$order['amount']) {
                    $this->run("UPDATE orders SET status='reversed',verified_at=? WHERE id=?",[time(),$order['id']]);return $off;
                }
                $this->run('UPDATE orders SET verified_at=? WHERE id=?',[time(),$order['id']]);
            }catch(Failure){return $off+['verification_pending'=>true];}
        }
        return ['active'=>true,'expires_at'=>(int)$order['expires_at'],'mode'=>$order['mode']];
    }
}
