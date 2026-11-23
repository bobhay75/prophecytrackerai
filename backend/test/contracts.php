<?php
declare(strict_types=1);
require __DIR__.'/../src/bootstrap.php';
use Prophecy\Service;
use Prophecy\Failure;
$checks=0;
function check(bool $truth,string $label):void{global $checks;$checks++;if(!$truth)throw new RuntimeException('FAILED: '.$label);}
function refuses(callable $fn,string $reason):void{try{$fn();}catch(Failure $e){check($e->reason===$reason,'expected '.$reason.', received '.$e->reason);return;}throw new RuntimeException('FAILED: did not refuse '.$reason);}
function fixture():array{
 $now=(int)floor(microtime(true)*1000);
 $record=fn($id,$mag,$place,$time)=>['type'=>'Feature','id'=>$id,'properties'=>['mag'=>$mag,'place'=>$place,'time'=>$time,'url'=>'https://earthquake.usgs.gov/earthquakes/eventpage/'.$id,'status'=>'reviewed'],'geometry'=>['coordinates'=>[-92.3,37.2,8.2]]];
 return ['type'=>'FeatureCollection','metadata'=>['generated'=>$now],'features'=>[$record('test-new',4.7,'12 km from Missouri',$now),$record('test-small',2.6,'Missouri',$now),$record('test-other',6.2,'Alaska',$now),$record('test-old',4.9,'Missouri',$now-2*86400000)]];
}
$dir=sys_get_temp_dir().'/prophecy-contracts-'.bin2hex(random_bytes(6));mkdir($dir,0700);
$config=Prophecy\loadConfig($dir);$calls=[];$orderPayload=[];$remoteStatus='CREATED';$captureStatus='COMPLETED';$captureAmount=null;$remoteMerchant=null;$remoteCustom=null;$remoteCurrency='USD';$captureFinal=true;$aiMode='valid';
$transport=function($method,$url,$headers,$body)use(&$calls,&$orderPayload,&$remoteStatus,&$captureStatus,&$captureAmount,&$remoteMerchant,&$remoteCustom,&$remoteCurrency,&$captureFinal,&$aiMode){
 $calls[]=[$method,$url];
 if(str_contains($url,'earthquake.usgs.gov'))return ['status'=>200,'body'=>json_encode(fixture())];
 if(str_ends_with($url,'/v1/oauth2/token'))return ['status'=>200,'body'=>json_encode(['access_token'=>'synthetic-test-token-only'])];
 if(str_ends_with($url,'/v2/checkout/orders') && $method==='POST'){$orderPayload=json_decode($body,true);return ['status'=>201,'body'=>json_encode(['id'=>'TESTORDER12345678','links'=>[['rel'=>'payer-action','href'=>'https://www.sandbox.paypal.com/checkoutnow?token=TESTORDER12345678']]])];}
 if(str_ends_with($url,'/capture')){$remoteStatus='COMPLETED';return ['status'=>201,'body'=>'{}'];}
 if(str_contains($url,'/v2/payments/captures/'))return ['status'=>200,'body'=>json_encode(['id'=>'TESTCAPTURE123456','status'=>$captureStatus,'amount'=>['currency_code'=>$remoteCurrency,'value'=>$captureAmount??$orderPayload['purchase_units'][0]['amount']['value']]])];
 if(str_contains($url,'/v2/checkout/orders/')){
  $unit=$orderPayload['purchase_units'][0];$unit['payee']['merchant_id']=$remoteMerchant??$unit['payee']['merchant_id'];$unit['custom_id']=$remoteCustom??$unit['custom_id'];
  $unit['payments']=['captures'=>[['id'=>'TESTCAPTURE123456','status'=>$captureStatus,'final_capture'=>$captureFinal,'amount'=>['currency_code'=>$remoteCurrency,'value'=>$captureAmount??$unit['amount']['value']]]]];
  return ['status'=>200,'body'=>json_encode(['id'=>'TESTORDER12345678','intent'=>'CAPTURE','status'=>$remoteStatus,'purchase_units'=>[$unit]])];
 }
 if(str_contains($url,'api.openai.com')){
  $request=json_decode($body,true);check($request['store']===false,'AI persistence disabled');check(!str_contains($body,'alice') && !str_contains($body,'correct horse'),'no account or password in AI payload');
  $brief=['summary'=>'The supplied source reports observations.','source_ids'=>[$aiMode==='bad-source'?'invented-source':'usgs-week'],'conditional_scenarios'=>[['condition'=>'If reporting coverage remains comparable','interpretation'=>'Counts can be compared descriptively.','uncertainty'=>'One week does not establish a long-term trend.','source_ids'=>['usgs-week']]],'questions_to_check'=>['Did reporting coverage change?']];
  return ['status'=>200,'body'=>json_encode(['choices'=>[['finish_reason'=>$aiMode==='truncated'?'length':'stop','message'=>['content'=>json_encode($brief),'refusal'=>$aiMode==='refusal'?'Cannot complete':null]]]])];
 }
 throw new RuntimeException('Unexpected test URL');
};
$app=new Service($config,$transport);
$alice=$app->register('alice','correct horse battery staple');$a=(int)$alice['user']['id'];$bob=$app->register('bob-test','other correct horse battery');$b=(int)$bob['user']['id'];
check(strlen($alice['recovery_code'])===48,'recovery code generated');
$raw=$app->db->query('SELECT * FROM users WHERE id='.$a)->fetch();check($raw['password_hash']!=='correct horse battery staple','password hashed');check($raw['recovery_hash']!==$alice['recovery_code'],'recovery hashed');
check($app->login('ALICE','correct horse battery staple')['id']===$a,'case-insensitive login');
refuses(fn()=>$app->login('alice','wrong'),'credentials');refuses(fn()=>$app->register('alice','another good long password'),'username_used');refuses(fn()=>$app->register('../bad','another good long password'),'username');refuses(fn()=>$app->register('short-pass','short'),'password');refuses(fn()=>$app->register('long-pass',str_repeat('a',73)),'password');
$recovered=$app->recover('alice',$alice['recovery_code'],'new correct horse battery');check($recovered['user']['auth_version']===2,'recovery revokes sessions');refuses(fn()=>$app->recover('alice',$alice['recovery_code'],'third long pass phrase'),'recovery');refuses(fn()=>$app->login('alice','correct horse battery staple'),'credentials');
$changed=$app->changePassword($a,'new correct horse battery','fourth correct horse phrase');check($changed['auth_version']===3,'password change revokes earlier sessions');
refuses(fn()=>$app->saveRule($a,['label'=>'bad','minimum'=>1,'location'=>'','enabled'=>true]),'rule');
$rules=$app->saveRule($a,['label'=>'Missouri','minimum'=>4.5,'location'=>'Missouri','enabled'=>true]);$rule=$rules[0];
refuses(fn()=>$app->saveRule($b,['id'=>$rule['id'],'label'=>'takeover','minimum'=>4.5,'location'=>'','enabled'=>true]),'not_found');refuses(fn()=>$app->deleteRule($b,$rule['id']),'not_found');
$snap=Service::normalizeFeed(fixture(),time());$result=$app->evaluate($a,$snap);check($result['new_alerts']===1,'new matching observation only');check($app->evaluate($a,$snap)['new_alerts']===0,'alert deduplication');check(count($app->alerts($a))===1 && $app->alerts($b)===[],'private inbox ownership');
$alert=$app->alerts($a)[0];refuses(fn()=>$app->readAlert($b,(int)$alert['id']),'not_found');$app->readAlert($a,(int)$alert['id']);check($app->alerts($a)[0]['read_at']!==null,'mark owned alert read');
$stale=$snap;$stale['generated']-=3600000;$stale['stale']=true;refuses(fn()=>$app->evaluate($a,$stale),'source_stale');
$bad=fixture();$bad['features'][0]['properties']['url']='https://earthquake.usgs.gov.evil.test/x';check(Service::normalizeFeed($bad,time())['skipped']===1,'reject deceptive source host');$bad['features'][1]['properties']['url']='https://user:password@earthquake.usgs.gov/x';check(Service::normalizeFeed($bad,time())['skipped']===2,'reject source URL credentials');
$app->saveRule($a,['label'=>'two','minimum'=>7,'location'=>'','enabled'=>true]);$app->saveRule($a,['label'=>'three','minimum'=>8,'location'=>'','enabled'=>false]);refuses(fn()=>$app->saveRule($a,['label'=>'four','minimum'=>8,'location'=>'','enabled'=>true]),'rule_limit');
$report=$app->analyze($a,['minimum'=>4.5,'location'=>'Missouri','mode'=>'scenario']);check($report['report']['observed_count']===2,'seven-day filtered analysis');check($report['report']['last_day_count']===1,'source-timestamp daily count');check($report['report']['ai']===null,'no fake AI output');check(count($app->reports($a))===1 && !$app->reports($b),'private saved reports');refuses(fn()=>$app->analyze($a,['mode'=>'ai']),'ai_disabled');
refuses(fn()=>$app->createOrder($a),'checkout_disabled');check(!array_filter($calls,fn($c)=>str_contains($c[1],'paypal')),'disabled checkout makes no provider requests');
$paidConfig=array_replace($config,['paypal_enabled'=>true,'paypal_mode'=>'sandbox','paypal_client_id'=>'synthetic-client','paypal_client_secret'=>'synthetic-secret','paypal_merchant_id'=>'TESTMERCHANT123','pass_price_usd'=>'5.00','ai_enabled'=>true,'openai_api_key'=>'synthetic-ai-key','openai_model'=>'configured-test-model']);
$app=new Service($paidConfig,$transport);$order=$app->createOrder($a);check($order['mode']==='sandbox','sandbox clearly labeled');check($orderPayload['purchase_units'][0]['amount']['value']==='5.00','price fixed on server');check($orderPayload['purchase_units'][0]['payee']['merchant_id']==='TESTMERCHANT123','merchant fixed on server');
$before=count($calls);$again=$app->createOrder($a);check($again===$order && count($calls)===$before,'reuse pending order, no duplicate API request');refuses(fn()=>$app->captureOrder($b,$order['order_id']),'order_not_found');
$before=count(array_filter($calls,fn($c)=>str_ends_with($c[1],'/capture')));$read=$app->reconcileOrder($a,$order['order_id']);check(!$read['confirmed'],'unapproved order not fulfilled');check(count(array_filter($calls,fn($c)=>str_ends_with($c[1],'/capture')))===$before,'reconcile never captures');refuses(fn()=>$app->captureOrder($a,$order['order_id']),'approval_required');
$remoteStatus='APPROVED';$salesDisabled=new Service(array_replace($paidConfig,['paypal_enabled'=>false]),$transport);refuses(fn()=>$salesDisabled->createOrder($a),'checkout_disabled');$before=count(array_filter($calls,fn($c)=>str_ends_with($c[1],'/capture')));refuses(fn()=>$salesDisabled->captureOrder($a,$order['order_id']),'checkout_disabled');check(!$salesDisabled->reconcileOrder($a,$order['order_id'])['confirmed'] && count(array_filter($calls,fn($c)=>str_ends_with($c[1],'/capture')))===$before,'disabled sales allow status reads but never capture an approved order');$captureAmount='0.01';refuses(fn()=>$app->captureOrder($a,$order['order_id']),'capture_unconfirmed');check(!$app->pass($a)['active'],'amount mismatch grants no access');$captureAmount=null;
$remoteMerchant='WRONGMERCHANT';refuses(fn()=>$app->reconcileOrder($a,$order['order_id']),'payment_mismatch');$remoteMerchant=null;
$remoteCustom='prophecy:wrong';refuses(fn()=>$app->reconcileOrder($a,$order['order_id']),'payment_mismatch');$remoteCustom=null;
$remoteCurrency='EUR';refuses(fn()=>$app->reconcileOrder($a,$order['order_id']),'capture_unconfirmed');$remoteCurrency='USD';$captureFinal=false;refuses(fn()=>$app->reconcileOrder($a,$order['order_id']),'capture_unconfirmed');$captureFinal=true;$captureStatus='PENDING';refuses(fn()=>$app->reconcileOrder($a,$order['order_id']),'capture_unconfirmed');$captureStatus='COMPLETED';
$capturesBefore=count(array_filter($calls,fn($c)=>str_ends_with($c[1],'/capture')));$confirmed=$app->reconcileOrder($a,$order['order_id']);check($confirmed['confirmed'] && $app->pass($a)['active'],'verified completed capture grants pass');check(count(array_filter($calls,fn($c)=>str_ends_with($c[1],'/capture')))===$capturesBefore,'interrupted capture recovered without another charge');
$app->db->exec('UPDATE orders SET verified_at=0');check($salesDisabled->reconcileOrder($a,$order['order_id'])['confirmed'] && $salesDisabled->pass($a)['active'],'disabled sales preserve verification and recovery of paid purchases');
$expires=$app->pass($a)['expires_at'];$app->captureOrder($a,$order['order_id']);check($app->pass($a)['expires_at']===$expires,'repeat capture cannot extend entitlement');refuses(fn()=>$app->createOrder($a),'pass_active');
$app->saveRule($a,['label'=>'paid fourth','minimum'=>8,'location'=>'','enabled'=>true]);check(count($app->rules($a))===4,'paid rule allowance fulfilled');
$app->db->exec('DELETE FROM limits');$ai=$app->analyze($a,['mode'=>'ai']);check($ai['report']['ai']['label']==='AI interpretation — review against the source','AI clearly labeled');$aiMode='bad-source';refuses(fn()=>$app->analyze($a,['mode'=>'ai']),'ai_invalid');$aiMode='truncated';refuses(fn()=>$app->analyze($a,['mode'=>'ai']),'ai_incomplete');$aiMode='refusal';refuses(fn()=>$app->analyze($a,['mode'=>'ai']),'ai_incomplete');$aiMode='valid';
$app->db->exec('UPDATE orders SET expires_at=1');$expired=$app->reconcileOrder($a,$order['order_id']);check($expired['confirmed'] && !$expired['pass']['active'] && (int)$app->db->query('SELECT expires_at FROM orders')->fetchColumn()===1,'reconciling an expired completed payment never renews the pass');$app->db->exec('UPDATE orders SET expires_at='.$expires);
$captureStatus='REFUNDED';$app->db->exec('UPDATE orders SET verified_at=0');check(!$app->pass($a)['active'],'refunded capture revokes paid allowance');
$app->db->exec('DELETE FROM limits');$app->limit('test-limit',1,60);refuses(fn()=>$app->limit('test-limit',1,60),'rate_limit');
$export=$app->export($a);check(!str_contains(json_encode($export),'password_hash') && !str_contains(json_encode($export),'recovery_hash'),'export omits authentication hashes');
$statement=$app->db->prepare('INSERT INTO alerts(user_id,rule_id,event_id,event_json,created_at) VALUES(?,?,?,?,?)');
for($i=0;$i<230;$i++)$statement->execute([$a,$rule['id'],'export-'.$i,json_encode($snap['observations'][0]),time()]);
$first=$app->export($a);$next=$app->export($a,$first['next_cursor'],$first['through']);check(count($first['alerts'])===200 && count($next['alerts'])===31 && $next['next_cursor']===null,'account export includes all alerts beyond the inbox display limit');
$app->deleteAccount($a,'fourth correct horse phrase');check($app->user($a)===null && !$app->rules($a) && !$app->reports($a) && !$app->alerts($a),'account deletion removes private research');check($app->db->query('SELECT user_id FROM orders')->fetchColumn()===null,'financial record detached on account deletion');check($app->user($b)!==null,'other account preserved');
echo "PASS: $checks backend account, ownership, source, alert, scenario, AI, rate-limit and PayPal assertions. No real provider or payment requests.\n";
unset($app);
$iterator=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir,FilesystemIterator::SKIP_DOTS),RecursiveIteratorIterator::CHILD_FIRST);foreach($iterator as $item){$item->isDir()?rmdir($item->getPathname()):unlink($item->getPathname());}rmdir($dir);
