<?php
declare(strict_types=1);
require __DIR__.'/../src/bootstrap.php';
use Prophecy\Service;
use Prophecy\Failure;
function testConfig(string $directory):array{return array_replace(Prophecy\loadConfig($directory),['paypal_enabled'=>true,'paypal_mode'=>'sandbox','paypal_client_id'=>'synthetic-client','paypal_client_secret'=>'synthetic-secret','paypal_merchant_id'=>'TESTMERCHANT123','pass_price_usd'=>'5.00']);}
function provider(string $directory):callable{return function($method,$url,$headers,$body)use($directory){
 if(str_ends_with($url,'/v1/oauth2/token'))return ['status'=>200,'body'=>'{"access_token":"synthetic-provider-token"}'];
 $file=fopen($directory.'/provider.json','c+');flock($file,LOCK_EX);$data=json_decode(stream_get_contents($file),true)?:['orders'=>[],'created'=>0,'captured'=>0];
 try{
  usleep(150000); // Widen the real race window between read, provider and commit.
  if(str_ends_with($url,'/v2/checkout/orders') && $method==='POST'){
   $data['created']++;$id='TESTORDER'.str_pad((string)$data['created'],8,'0',STR_PAD_LEFT);$payload=json_decode($body,true);$data['orders'][$id]=['unit'=>$payload['purchase_units'][0],'status'=>'APPROVED','capture'=>'TESTCAPTURE'.str_pad((string)$data['created'],8,'0',STR_PAD_LEFT)];
   $result=['id'=>$id,'links'=>[['rel'=>'approve','href'=>'https://www.sandbox.paypal.com/checkoutnow?token='.$id]]];
  }elseif(preg_match('~/v2/checkout/orders/([A-Z0-9]+)/capture$~',$url,$m)){$data['captured']++;$data['orders'][$m[1]]['status']='COMPLETED';$result=[];}
  elseif(preg_match('~/v2/checkout/orders/([A-Z0-9]+)$~',$url,$m)){$order=$data['orders'][$m[1]];$unit=$order['unit'];$unit['payments']=['captures'=>[['id'=>$order['capture'],'status'=>'COMPLETED','final_capture'=>true,'amount'=>$unit['amount']]]];$result=['id'=>$m[1],'intent'=>'CAPTURE','status'=>$order['status'],'purchase_units'=>[$unit]];}
  elseif(preg_match('~/v2/payments/captures/([A-Z0-9]+)$~',$url,$m)){$result=['id'=>$m[1],'status'=>'COMPLETED','amount'=>['currency_code'=>'USD','value'=>'5.00']];}
  else throw new RuntimeException('Unexpected synthetic URL');
  rewind($file);ftruncate($file,0);fwrite($file,json_encode($data,JSON_THROW_ON_ERROR));fflush($file);
  return ['status'=>200,'body'=>json_encode($result,JSON_THROW_ON_ERROR)];
 }finally{flock($file,LOCK_UN);fclose($file);}
};}
if(($argv[1]??'')==='worker'){
 try{$app=new Service(testConfig($argv[2]),provider($argv[2]));$result=$argv[3]==='create'?$app->createOrder(1):$app->captureOrder(1,$argv[4]);echo json_encode(['ok'=>true,'result'=>$result]);}
 catch(Failure $e){echo json_encode(['ok'=>false,'reason'=>$e->reason]);}
 exit;
}
function concurrent(string $directory,array $operations):array{
 $php=getenv('PROPHECY_PHP')?:PHP_BINARY;$children=[];
 foreach($operations as $operation){$pipes=[];$process=proc_open(array_merge([$php,__FILE__,'worker',$directory],$operation),[0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']],$pipes);if(!is_resource($process))throw new RuntimeException('Child process unavailable');fclose($pipes[0]);$children[]=[$process,$pipes];}
 $results=[];
 foreach($children as [$process,$pipes]){$out=stream_get_contents($pipes[1]);$error=stream_get_contents($pipes[2]);fclose($pipes[1]);fclose($pipes[2]);$status=proc_close($process);if($status!==0)throw new RuntimeException('Concurrent worker failed: '.$error);$results[]=json_decode($out,true,64,JSON_THROW_ON_ERROR);}
 return $results;
}
$dir=sys_get_temp_dir().'/prophecy-race-'.bin2hex(random_bytes(6));mkdir($dir,0700);$app=new Service(testConfig($dir),provider($dir));$app->register('parallel-user','correct horse battery staple');
$created=concurrent($dir,[['create'],['create']]);
if(!$created[0]['ok'] || !$created[1]['ok'] || $created[0]['result']['order_id']!==$created[1]['result']['order_id'])throw new RuntimeException('Parallel sessions did not reuse one pending order.');
$state=json_decode(file_get_contents($dir.'/provider.json'),true);if($state['created']!==1)throw new RuntimeException('Parallel sessions created duplicate provider orders.');
// Simulate two outstanding orders recovered from an older deployment. Only one may be captured.
$old=$app->db->query('SELECT * FROM orders LIMIT 1')->fetch();$second='TESTORDER00000002';$secondLocal=bin2hex(random_bytes(16));
$statement=$app->db->prepare('INSERT INTO orders(id,user_id,provider_id,amount,merchant,mode,status,created_at) VALUES(?,?,?,?,?,?,?,?)');$statement->execute([$secondLocal,1,$second,'5.00','TESTMERCHANT123','sandbox','created',time()]);
$state['orders'][$second]=['status'=>'APPROVED','capture'=>'TESTCAPTURE00000002','unit'=>array_replace($state['orders'][$old['provider_id']]['unit'],['custom_id'=>'prophecy:'.$secondLocal])];file_put_contents($dir.'/provider.json',json_encode($state));
$captured=concurrent($dir,[['capture',$old['provider_id']],['capture',$second]]);
$state=json_decode(file_get_contents($dir.'/provider.json'),true);
$successful=array_filter($captured,fn($r)=>$r['ok']);$denied=array_filter($captured,fn($r)=>!$r['ok'] && in_array($r['reason'],['pass_active','payment_busy'],true));
if(count($successful)!==1 || count($denied)!==1 || $state['captured']!==1)throw new RuntimeException('Parallel approved orders caused duplicate charging.');
// Unknown old orders are financial reconciliation evidence, not disposable cache.
$app->db->exec("UPDATE orders SET created_at=1 WHERE status='created'");$app->cleanup();if((int)$app->db->query("SELECT COUNT(*) FROM orders WHERE status='created'")->fetchColumn()!==1)throw new RuntimeException('Unresolved order was deleted.');
echo "PASS: parallel account sessions share one pending order; concurrent approved orders permit only one capture; unresolved orders survive cleanup.\n";
unset($app);$iterator=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir,FilesystemIterator::SKIP_DOTS),RecursiveIteratorIterator::CHILD_FIRST);foreach($iterator as $item){$item->isDir()?rmdir($item->getPathname()):unlink($item->getPathname());}rmdir($dir);
