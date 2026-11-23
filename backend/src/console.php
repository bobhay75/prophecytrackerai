<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
require __DIR__.'/bootstrap.php';
try{
    $app=new \Prophecy\Service(\Prophecy\loadConfig(__DIR__));
    $action=$argv[1]??'check';
    if($action==='poll'){
        $lock=fopen(__DIR__.'/data/cron.lock','c');
        if(!$lock || !flock($lock,LOCK_EX|LOCK_NB))throw new \RuntimeException('A poll is already running.');
        try{$result=$app->evaluate();$app->cleanup();$s=$app->db->prepare('INSERT OR REPLACE INTO cache(name,value,stored_at) VALUES(?,?,?)');$s->execute(['last_background_poll',json_encode($result,JSON_THROW_ON_ERROR),time()]);}
        finally{flock($lock,LOCK_UN);fclose($lock);}
        echo json_encode(['ok'=>true]+$result,JSON_THROW_ON_ERROR).PHP_EOL;
    }elseif($action==='check'){
        echo json_encode(['ok'=>true,'php'=>PHP_VERSION,'sqlite'=>in_array('sqlite',PDO::getAvailableDrivers(),true),'curl'=>extension_loaded('curl'),'capabilities'=>$app->publicConfig()],JSON_THROW_ON_ERROR).PHP_EOL;
    }else{throw new \RuntimeException('Use check or poll.');}
}catch(\Throwable $e){fwrite(STDERR,'Prophecy command failed: '.($e instanceof \Prophecy\Failure?$e->getMessage():get_class($e)).PHP_EOL);exit(1);}
