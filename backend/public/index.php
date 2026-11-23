<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private, max-age=0');
header('Pragma: no-cache');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
ini_set('display_errors','0');
ini_set('log_errors','1');
try {
    $root=realpath($_SERVER['DOCUMENT_ROOT']??'');
    $private=getenv('PROPHECY_PRIVATE_DIR')?:($root?dirname($root).'/prophecy-private':'');
    $private=realpath($private);
    if(!$private || !$root || $private===$root || str_starts_with($private,$root.DIRECTORY_SEPARATOR) || !is_file($private.'/bootstrap.php')) {
        http_response_code(503);echo json_encode(['ok'=>false,'code'=>'setup_required','message'=>'The account service is not installed yet. Public USGS observations remain available.']);exit;
    }
    require $private.'/bootstrap.php';
    $config=\Prophecy\loadConfig($private);
    $host=$_SERVER['HTTP_HOST']??'';$origin=parse_url($config['origin']);
    $expectedHost=$origin['host'].(isset($origin['port'])?':'.$origin['port']:'');
    if(!hash_equals(strtolower($expectedHost),strtolower($host)))throw new \Prophecy\Failure(400,'host','Unexpected application host.');
    $https=isset($_SERVER['HTTPS']) && $_SERVER['HTTPS']!=='' && strtolower($_SERVER['HTTPS'])!=='off';
    $loopback=in_array($_SERVER['REMOTE_ADDR']??'', ['127.0.0.1','::1'],true) && in_array($origin['host'],['localhost','127.0.0.1','::1'],true);
    if(!$https && !($config['development']===true && $loopback))throw new \Prophecy\Failure(426,'https_required','Use the secure HTTPS application address.');
    if(isset($_SERVER['HTTP_ORIGIN']) && !hash_equals($config['origin'],$_SERVER['HTTP_ORIGIN']))throw new \Prophecy\Failure(403,'origin','This request came from a different site.');
    if(($_SERVER['HTTP_SEC_FETCH_SITE']??'')==='cross-site')throw new \Prophecy\Failure(403,'origin','Cross-site API requests are not accepted.');
    umask(0077);$sessions=$private.'/sessions';
    if(!is_dir($sessions) && !mkdir($sessions,0700,true))throw new \RuntimeException('Session storage unavailable.');
    if(is_link($sessions) || (fileperms($sessions)&0077))throw new \RuntimeException('Private session permissions invalid.');
    ini_set('session.use_strict_mode','1');ini_set('session.use_only_cookies','1');ini_set('session.use_trans_sid','0');
    session_name('PROPHECYSESSID');session_save_path($sessions);
    session_set_cookie_params(['lifetime'=>0,'path'=>$config['base_path'].'/','secure'=>!$config['development'],'httponly'=>true,'samesite'=>'Lax']);
    session_start();
    if(session_status()!==PHP_SESSION_ACTIVE)throw new \RuntimeException('Private sessions unavailable.');
    if(!isset($_SESSION['csrf']))$_SESSION['csrf']=bin2hex(random_bytes(32));
    $app=new \Prophecy\Service($config);
    $user=null;
    if(isset($_SESSION['user_id'])){
        $candidate=$app->user((int)$_SESSION['user_id']);
        if(!$candidate || (int)$candidate['auth_version']!==($_SESSION['auth_version']??0) || time()-($_SESSION['issued_at']??0)>43200 || time()-($_SESSION['seen_at']??0)>1800){$_SESSION=['csrf'=>bin2hex(random_bytes(32))];session_regenerate_id(true);}
        else {$user=$candidate;$_SESSION['seen_at']=time();}
    }
    $action=(string)($_GET['action']??'session');
    $reads=['session','health','rules','alerts','reports','export','orders'];
    $writes=['register','login','recover','logout','change-password','delete-account','save-rule','delete-rule','read-alert','evaluate','analyze','create-order','capture-order','reconcile-order'];
    if(!in_array($action,array_merge($reads,$writes),true))throw new \Prophecy\Failure(404,'not_found','Unknown application action.');
    $method=$_SERVER['REQUEST_METHOD']??'GET';
    $expected=in_array($action,$reads,true)?'GET':'POST';
    if($method!==$expected){header('Allow: '.$expected);throw new \Prophecy\Failure(405,'method','This action requires '.$expected.'.');}
    $input=[];
    if($method==='POST'){
        if(strtolower(trim(explode(';',$_SERVER['CONTENT_TYPE']??'')[0]))!=='application/json')throw new \Prophecy\Failure(415,'content_type','Send a JSON request.');
        $csrf=$_SERVER['HTTP_X_CSRF_TOKEN']??'';
        if(!is_string($csrf) || !hash_equals($_SESSION['csrf'],$csrf))throw new \Prophecy\Failure(403,'csrf','Your session changed. Refresh the page and try again.');
        if((int)($_SERVER['CONTENT_LENGTH']??0)>32768)throw new \Prophecy\Failure(413,'request_size','This request is too large.');
        $body=file_get_contents('php://input',false,null,0,32769);
        if($body===false || strlen($body)>32768)throw new \Prophecy\Failure(413,'request_size','This request is too large.');
        try{$input=json_decode($body,true,32,JSON_THROW_ON_ERROR);}catch(\JsonException){throw new \Prophecy\Failure(400,'json','The request body is invalid JSON.');}
        if(!is_array($input) || array_is_list($input) && $input!==[])throw new \Prophecy\Failure(400,'json','The request must be a JSON object.');
    }
    $anonymous=['session','health','register','login','recover'];
    if(!in_array($action,$anonymous,true) && !$user)throw new \Prophecy\Failure(401,'sign_in','Sign in to use your private workspace.');
    $ip=$_SERVER['REMOTE_ADDR']??'unknown';
    if(in_array($action,['register','login','recover'],true)){
        $app->limit('auth-ip:'.$ip,20,900);
        $app->limit('auth-name:'.strtolower((string)($input['username']??'')),15,900);
    }
    $signedIn=function(array $u):void{session_regenerate_id(true);$_SESSION=['user_id'=>(int)$u['id'],'auth_version'=>(int)$u['auth_version'],'issued_at'=>time(),'seen_at'=>time(),'csrf'=>bin2hex(random_bytes(32))];};
    $id=(int)($user['id']??0);
    $result=match($action){
        'health'=>['configured'=>true,'source_status'=>'not_checked','capabilities'=>$app->publicConfig()],
        'session'=>['user'=>$user,'csrf'=>$_SESSION['csrf'],'capabilities'=>$app->publicConfig(),'pass'=>$user?$app->pass($id):null],
        'register'=>$app->register((string)($input['username']??''),(string)($input['password']??'')),
        'login'=>['user'=>$app->login((string)($input['username']??''),(string)($input['password']??''))],
        'recover'=>$app->recover((string)($input['username']??''),(string)($input['recovery_code']??''),(string)($input['password']??'')),
        'change-password'=>['user'=>$app->changePassword($id,(string)($input['old_password']??''),(string)($input['password']??''))],
        'logout'=>(function(){$_SESSION=[];session_regenerate_id(true);$_SESSION['csrf']=bin2hex(random_bytes(32));return ['signed_out'=>true];})(),
        'delete-account'=>(function()use($app,$id,$input){$app->deleteAccount($id,(string)($input['password']??''));$_SESSION=[];session_regenerate_id(true);$_SESSION['csrf']=bin2hex(random_bytes(32));return ['deleted'=>true];})(),
        'rules'=>['rules'=>$app->rules($id)],
        'alerts'=>['alerts'=>$app->alerts($id)],
        'reports'=>['reports'=>$app->reports($id)],
        'orders'=>['orders'=>$app->orders($id)],
        'export'=>['export'=>$app->export($id,(int)($_GET['after']??0),(int)($_GET['through']??0))],
        'save-rule'=>['rules'=>$app->saveRule($id,$input)],
        'delete-rule'=>(function()use($app,$id,$input){$app->deleteRule($id,(string)($input['id']??''));return ['deleted'=>true];})(),
        'read-alert'=>(function()use($app,$id,$input){$app->readAlert($id,(int)($input['id']??0));return ['read'=>true];})(),
        'evaluate'=>(function()use($app,$id){$app->limit('evaluate:'.$id,6,60);return $app->evaluate($id);})(),
        'analyze'=>$app->analyze($id,$input),
        'create-order'=>$app->createOrder($id),
        'capture-order'=>$app->captureOrder($id,(string)($input['order_id']??'')),
        'reconcile-order'=>$app->reconcileOrder($id,(string)($input['order_id']??'')),
    };
    if(in_array($action,['register','login','recover','change-password'],true)){$signedIn($result['user']);$result['csrf']=$_SESSION['csrf'];}
    echo json_encode(['ok'=>true]+$result,JSON_THROW_ON_ERROR|JSON_INVALID_UTF8_SUBSTITUTE|JSON_UNESCAPED_SLASHES);
}catch(\Prophecy\Failure $e){http_response_code($e->status);echo json_encode(['ok'=>false,'code'=>$e->reason,'message'=>$e->getMessage()]);}
catch(\Throwable $e){http_response_code(500);error_log('Prophecy service error: '.get_class($e));echo json_encode(['ok'=>false,'code'=>'service_unavailable','message'=>'The private service could not complete the request. Public observations are still available.']);}
