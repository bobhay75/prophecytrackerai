<?php
declare(strict_types=1);
namespace Prophecy;

final class Failure extends \RuntimeException
{
    public function __construct(public int $status, public string $reason, string $message) { parent::__construct($message); }
}

final class Service
{
    public const DAY_FEED = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson';
    public const WEEK_FEED = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson';
    public const SCIENCE = 'https://www.usgs.gov/faqs/can-you-predict-earthquakes';
    public \PDO $db;
    private $transport;
    public function __construct(public array $config, ?callable $transport = null)
    {
        umask(0077);
        $directory = $config['directory'] . '/data';
        if (!is_dir($directory) && !mkdir($directory, 0700, true)) throw new \RuntimeException('Private storage unavailable.');
        if (is_link($directory) || (fileperms($directory) & 0077)) throw new \RuntimeException('Private storage permissions must be 0700.');
        $file = $directory . '/prophecy.sqlite';
        if (is_link($file) || (is_file($file) && (fileperms($file)&0077))) throw new \RuntimeException('Database must be a regular private file with 0600 permissions.');
        $this->db = new \PDO('sqlite:' . $file, null, null, [\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION, \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC]);
        $this->db->exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL;');
        $this->db->exec(<<<'SQL'
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT NOT NULL UNIQUE COLLATE NOCASE, password_hash TEXT NOT NULL, recovery_hash TEXT NOT NULL, auth_version INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS rules (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, label TEXT NOT NULL, minimum REAL NOT NULL, location TEXT NOT NULL, enabled INTEGER NOT NULL, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS alerts (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, rule_id TEXT NOT NULL REFERENCES rules(id) ON DELETE CASCADE, event_id TEXT NOT NULL, event_json TEXT NOT NULL, created_at INTEGER NOT NULL, read_at INTEGER, UNIQUE(rule_id,event_id));
CREATE TABLE IF NOT EXISTS reports (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, report_json TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, provider_id TEXT UNIQUE, capture_id TEXT UNIQUE, amount TEXT NOT NULL, merchant TEXT NOT NULL, mode TEXT NOT NULL, status TEXT NOT NULL, approval_url TEXT, created_at INTEGER NOT NULL, paid_at INTEGER, expires_at INTEGER, verified_at INTEGER);
CREATE TABLE IF NOT EXISTS limits (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, until_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS cache (name TEXT PRIMARY KEY, value TEXT NOT NULL, stored_at INTEGER NOT NULL);
SQL);
        $this->transport = $transport;
    }

    private function one(string $sql, array $params = []): ?array { $s=$this->db->prepare($sql); $s->execute($params); return $s->fetch() ?: null; }
    private function all(string $sql, array $params = []): array { $s=$this->db->prepare($sql); $s->execute($params); return $s->fetchAll(); }
    private function run(string $sql, array $params = []): int { $s=$this->db->prepare($sql); $s->execute($params); return $s->rowCount(); }
    public function user(int $id): ?array { $u=$this->one('SELECT id,username,auth_version,created_at FROM users WHERE id=?',[$id]); return $u ?: null; }
    public function limit(string $bucket, int $maximum, int $seconds): void
    {
        $now=time(); $key=hash('sha256',$bucket);
        $this->db->exec('BEGIN IMMEDIATE');
        try {
            $old=$this->one('SELECT count,until_at FROM limits WHERE bucket=?',[$key]);
            if ($old && (int)$old['until_at']>$now && (int)$old['count'] >= $maximum) throw new Failure(429,'rate_limit','Too many requests. Please wait before trying again.');
            $count=$old && (int)$old['until_at']>$now ? (int)$old['count']+1 : 1;
            $until=$old && (int)$old['until_at']>$now ? (int)$old['until_at'] : $now+$seconds;
            $this->run('INSERT OR REPLACE INTO limits(bucket,count,until_at) VALUES(?,?,?)',[$key,$count,$until]);
            $this->db->exec('COMMIT');
        } catch (\Throwable $e) { $this->db->exec('ROLLBACK'); throw $e; }
    }
    private function password(string $password): void { if (strlen($password)<12 || strlen($password)>72 || str_contains($password,"\0")) throw new Failure(422,'password','Use a password containing 12–72 bytes. A long, unique passphrase works well.'); }
    private function username(string $username): string { $username=strtolower(trim($username)); if (!preg_match('/^[a-z0-9][a-z0-9._-]{2,31}$/D',$username)) throw new Failure(422,'username','Use 3–32 letters, numbers, dots, underscores or hyphens for the username.'); return $username; }
    public function register(string $username, string $password): array
    {
        if (!$this->config['registration_open']) throw new Failure(403,'registration_closed','New account registration is currently closed.');
        $username=$this->username($username); $this->password($password);
        $this->limit('registration:global', (int)$this->config['registration_daily_limit'],86400);
        $recovery=bin2hex(random_bytes(24));
        try { $this->run('INSERT INTO users(username,password_hash,recovery_hash,created_at) VALUES(?,?,?,?)',[$username,password_hash($password,PASSWORD_DEFAULT),hash('sha256',$recovery),time()]); }
        catch (\PDOException $e) { if ($this->one('SELECT id FROM users WHERE username=?',[$username])) throw new Failure(409,'username_used','That username is unavailable.'); throw $e; }
        return ['user'=>$this->user((int)$this->db->lastInsertId()),'recovery_code'=>$recovery];
    }
    public function login(string $username, string $password): array
    {
        $u=$this->one('SELECT * FROM users WHERE username=?',[strtolower(trim($username))]);
        $fallback='$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.';
        $valid=password_verify($password, $u['password_hash'] ?? $fallback);
        if (!$u || !$valid || strlen($password)>72) throw new Failure(401,'credentials','The username or password is incorrect.');
        if (password_needs_rehash($u['password_hash'],PASSWORD_DEFAULT)) $this->run('UPDATE users SET password_hash=? WHERE id=?',[password_hash($password,PASSWORD_DEFAULT),$u['id']]);
        return $this->user((int)$u['id']);
    }
    public function recover(string $username, string $code, string $password): array
    {
        $this->password($password); $u=$this->one('SELECT * FROM users WHERE username=?',[strtolower(trim($username))]);
        if (!$u || !preg_match('/^[a-f0-9]{48}$/D',$code) || !hash_equals($u['recovery_hash'],hash('sha256',$code))) throw new Failure(401,'recovery','The username or recovery code is incorrect.');
        $next=bin2hex(random_bytes(24));
        $changed=$this->run('UPDATE users SET password_hash=?,recovery_hash=?,auth_version=auth_version+1 WHERE id=? AND recovery_hash=?',[password_hash($password,PASSWORD_DEFAULT),hash('sha256',$next),$u['id'],$u['recovery_hash']]);
        if ($changed!==1) throw new Failure(409,'recovery_used','This recovery code has already been used.');
        return ['user'=>$this->user((int)$u['id']),'recovery_code'=>$next];
    }
    public function changePassword(int $id, string $old, string $next): array { $u=$this->user($id); $this->login($u['username'],$old); $this->password($next); $this->run('UPDATE users SET password_hash=?,auth_version=auth_version+1 WHERE id=?',[password_hash($next,PASSWORD_DEFAULT),$id]); return $this->user($id); }
    public function deleteAccount(int $id,string $password): void { $this->paymentLock($id,function()use($id,$password){$u=$this->user($id);$this->login($u['username'],$password);$this->run('DELETE FROM users WHERE id=?',[$id]);}); }

    public function rules(int $id): array { return $this->all('SELECT id,label,minimum,location,enabled,created_at FROM rules WHERE user_id=? ORDER BY created_at DESC',[$id]); }
    public function saveRule(int $id,array $data): array
    {
        $label=trim((string)($data['label']??'')); $location=trim((string)($data['location']??'')); $min=$data['minimum']??null;
        if ($label==='' || mb_strlen($label)>80 || mb_strlen($location)>100 || !is_numeric($min) || !is_finite((float)$min) || $min<2.5 || $min>9.9 || !is_bool($data['enabled']??null)) throw new Failure(422,'rule','Enter a label, a magnitude from 2.5 to 9.9, and an optional location phrase.');
        if (preg_match('/[\x00-\x1f\x7f]/',$label.$location)) throw new Failure(422,'rule','Control characters are not allowed.');
        $ruleId=(string)($data['id']??'');
        if ($ruleId!=='') {
            if (!$this->one('SELECT id FROM rules WHERE id=? AND user_id=?',[$ruleId,$id])) throw new Failure(404,'not_found','Alert rule not found.');
            // Editing starts a new monitoring window; old alerts remain in the inbox.
            $this->run('UPDATE rules SET label=?,minimum=?,location=?,enabled=?,created_at=? WHERE id=? AND user_id=?',[$label,(float)$min,$location,(int)$data['enabled'],time(),$ruleId,$id]);
        } else {
            $maximum=$this->pass($id)['active'] ? 20 : 3;
            $this->db->exec('BEGIN IMMEDIATE');
            try {
                $count=$this->one('SELECT COUNT(*) AS n FROM rules WHERE user_id=?',[$id]);
                if ((int)$count['n']>=$maximum) throw new Failure(409,'rule_limit','Your current plan has reached its saved-rule limit.');
                $ruleId=bin2hex(random_bytes(12));
                $this->run('INSERT INTO rules(id,user_id,label,minimum,location,enabled,created_at) VALUES(?,?,?,?,?,?,?)',[$ruleId,$id,$label,(float)$min,$location,(int)$data['enabled'],time()]);
                $this->db->exec('COMMIT');
            } catch(\Throwable $e) { $this->db->exec('ROLLBACK'); throw $e; }
        }
        return $this->rules($id);
    }
    public function deleteRule(int $id,string $rule): void { if (!$this->run('DELETE FROM rules WHERE id=? AND user_id=?',[$rule,$id])) throw new Failure(404,'not_found','Alert rule not found.'); }
    public function alerts(int $id): array { $rows=$this->all('SELECT a.id,a.rule_id,r.label,a.event_json,a.created_at,a.read_at FROM alerts a JOIN rules r ON r.id=a.rule_id WHERE a.user_id=? ORDER BY a.id DESC LIMIT 100',[$id]); return array_map(function($r){$r['event']=json_decode($r['event_json'],true,32,JSON_THROW_ON_ERROR);unset($r['event_json']);return $r;},$rows); }
    public function readAlert(int $id,int $alert): void { if (!$this->run('UPDATE alerts SET read_at=? WHERE user_id=? AND id=?',[time(),$id,$alert])) throw new Failure(404,'not_found','Alert not found.'); }
    public static function normalizeFeed(array $feed, int $now): array
    {
        $generated=$feed['metadata']['generated']??null;
        if (($feed['type']??'')!=='FeatureCollection' || !is_int($generated) || $generated<1 || !isset($feed['features']) || !is_array($feed['features']) || count($feed['features'])>10000) throw new Failure(502,'source_invalid','USGS returned an invalid source feed.');
        $seen=[]; $records=[]; $skipped=0;
        foreach($feed['features'] as $f) {
            $p=$f['properties']??[]; $id=$f['id']??null; $m=$p['mag']??null; $t=$p['time']??null; $url=$p['url']??''; $u=is_string($url)?parse_url($url):false;
            if (!is_string($id) || !preg_match('/^[A-Za-z0-9_-]{1,100}$/D',$id) || isset($seen[$id]) || !is_numeric($m) || !is_finite((float)$m) || $m< -2 || $m>10 || !is_int($t) || $t<1 || $t>$generated+300000 || !is_string($p['place']??null) || !$u || ($u['scheme']??'')!=='https' || ($u['host']??'')!=='earthquake.usgs.gov' || isset($u['user']) || isset($u['pass']) || isset($u['port'])) { $skipped++; continue; }
            $seen[$id]=true; $depth=$f['geometry']['coordinates'][2]??null;
            $records[]=['id'=>$id,'magnitude'=>(float)$m,'place'=>mb_substr($p['place'],0,300),'time'=>$t,'url'=>$url,'depth'=>is_numeric($depth)?(float)$depth:null,'review'=>($p['status']??'')==='reviewed'?'USGS reviewed':'USGS automatic / unreviewed'];
        }
        if (count($feed['features']) && !$records) throw new Failure(502,'source_invalid','No valid USGS observations were available.');
        usort($records,fn($a,$b)=>$b['time']<=>$a['time']);
        return ['generated'=>$generated,'observations'=>$records,'skipped'=>$skipped,'stale'=>$now*1000-$generated>900000 || $generated-$now*1000>300000];
    }
    public function snapshot(string $period='day'): array
    {
        $period=$period==='week'?'week':'day'; $key='feed:'.$period; $cached=$this->one('SELECT value,stored_at FROM cache WHERE name=?',[$key]);
        if ($cached && time()-(int)$cached['stored_at']<60) { $feed=json_decode($cached['value'],true,64,JSON_THROW_ON_ERROR); return self::normalizeFeed($feed,time()); }
        $lock=fopen($this->config['directory'].'/data/feed-'.$period.'.lock','c');
        if (!$lock || !flock($lock,LOCK_EX|LOCK_NB)) { if ($lock) fclose($lock); throw new Failure(503,'source_busy','A source refresh is in progress. Try again shortly.'); }
        try {
            $raw=$this->request('GET',$period==='day'?self::DAY_FEED:self::WEEK_FEED,[],null,4194304);
            if ($raw['status']!==200) throw new Failure(502,'source_unavailable','USGS could not be reached. No new alerts were generated.');
            $feed=json_decode($raw['body'],true,64,JSON_THROW_ON_ERROR); if (!is_array($feed)) throw new Failure(502,'source_invalid','USGS returned an invalid source feed.');
            $snapshot=self::normalizeFeed($feed,time());
            $this->run('INSERT OR REPLACE INTO cache(name,value,stored_at) VALUES(?,?,?)',[$key,json_encode($feed,JSON_THROW_ON_ERROR),time()]);
            return $snapshot;
        } finally { flock($lock,LOCK_UN); fclose($lock); }
    }
    public function evaluate(?int $userId=null,?array $snapshot=null): array
    {
        $snapshot??=$this->snapshot();
        if (($snapshot['stale']??true) || time()*1000-$snapshot['generated']>900000 || $snapshot['generated']-time()*1000>300000) throw new Failure(503,'source_stale','The source is stale. Alert evaluation is paused until a fresh feed is available.');
        $rules=$userId===null ? $this->all('SELECT * FROM rules WHERE enabled=1 ORDER BY created_at DESC,id DESC') : $this->all('SELECT * FROM rules WHERE user_id=? AND enabled=1 ORDER BY created_at DESC,id DESC',[$userId]);
        $added=0;$counts=[];$plans=[];
        foreach($rules as $rule) {
            $owner=(int)$rule['user_id'];$plans[$owner]??=$this->pass($owner)['active']?20:3;$counts[$owner]=($counts[$owner]??0)+1;
            if($counts[$owner]>$plans[$owner])continue;
            foreach($snapshot['observations'] as $event) {
            if ($event['time'] < (int)$rule['created_at']*1000 || $event['magnitude']<(float)$rule['minimum'] || ($rule['location']!=='' && mb_stripos($event['place'],$rule['location'])===false)) continue;
            $added+=$this->run('INSERT OR IGNORE INTO alerts(user_id,rule_id,event_id,event_json,created_at) VALUES(?,?,?,?,?)',[$rule['user_id'],$rule['id'],$event['id'],json_encode($event,JSON_THROW_ON_ERROR),time()]);
            }
        }
        $this->run('INSERT OR REPLACE INTO cache(name,value,stored_at) VALUES(?,?,?)',['last_evaluation',json_encode(['source_generated'=>$snapshot['generated'],'new_alerts'=>$added]),time()]);
        return ['new_alerts'=>$added,'source_generated'=>$snapshot['generated'],'evaluated_at'=>time()];
    }
    public function request(string $method,string $url,array $headers=[],?string $body=null,int $maxBytes=1048576): array
    {
        if ($this->transport) return ($this->transport)($method,$url,$headers,$body,$maxBytes);
        $parts=parse_url($url);
        if (!$parts || ($parts['scheme']??'')!=='https' || !in_array($parts['host']??'', ['earthquake.usgs.gov','api.openai.com','api-m.paypal.com','api-m.sandbox.paypal.com'],true) || isset($parts['user']) || isset($parts['pass']) || isset($parts['port'])) throw new \RuntimeException('Unapproved provider destination.');
        $ch=curl_init($url);$response='';
        curl_setopt_array($ch,[CURLOPT_CUSTOMREQUEST=>$method,CURLOPT_HTTPHEADER=>array_merge(['Accept: application/json'],$headers),CURLOPT_FOLLOWLOCATION=>false,CURLOPT_PROTOCOLS=>CURLPROTO_HTTPS,CURLOPT_CONNECTTIMEOUT=>5,CURLOPT_TIMEOUT=>25,CURLOPT_PROXY=>'',CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_SSL_VERIFYHOST=>2,CURLOPT_WRITEFUNCTION=>function($handle,$chunk)use(&$response,$maxBytes){if(strlen($response)+strlen($chunk)>$maxBytes)return 0;$response.=$chunk;return strlen($chunk);}]);
        if($body!==null)curl_setopt($ch,CURLOPT_POSTFIELDS,$body);
        $ok=curl_exec($ch);$status=(int)curl_getinfo($ch,CURLINFO_HTTP_CODE);curl_close($ch);
        if($ok===false)throw new Failure(502,'provider_unavailable','The external service did not complete the request. Please try again later.');
        return ['status'=>$status,'body'=>$response];
    }
    public function publicConfig(): array
    {
        $last=$this->one('SELECT value,stored_at FROM cache WHERE name=?',['last_background_poll']);
        return ['registration_open'=>(bool)$this->config['registration_open'],'ai_available'=>$this->aiReady(),'checkout_available'=>$this->paypalReady(),'checkout_mode'=>$this->config['paypal_mode'],'pass_price_usd'=>$this->paypalReady()?$this->config['pass_price_usd']:null,'pass_days'=>30,'free_rules'=>3,'pass_rules'=>20,'last_background_poll'=>$last?(int)$last['stored_at']:null];
    }
    public function cleanup(): void
    {
        $this->run('DELETE FROM limits WHERE until_at<?',[time()]);
        $this->run('DELETE FROM alerts WHERE created_at<?',[time()-30*86400]);
        $this->run('DELETE FROM reports WHERE created_at<?',[time()-90*86400]);
        // Unknown/created orders may hide a successful capture with a lost response. Preserve them for reconciliation.
        $this->run("DELETE FROM orders WHERE status IN ('closed','failed') AND created_at<?",[time()-365*86400]);
    }
    public function export(int $id,int $after=0,int $through=0): array
    {
        $max=(int)($this->one('SELECT MAX(id) AS n FROM alerts WHERE user_id=?',[$id])['n']??0);
        $through=$through>0?min($through,$max):$max;$after=max(0,$after);
        $rows=$this->all('SELECT a.id,a.rule_id,r.label,a.event_json,a.created_at,a.read_at FROM alerts a JOIN rules r ON r.id=a.rule_id WHERE a.user_id=? AND a.id>? AND a.id<=? ORDER BY a.id ASC LIMIT 200',[$id,$after,$through]);
        $alerts=array_map(function($r){$r['event']=json_decode($r['event_json'],true,32,JSON_THROW_ON_ERROR);unset($r['event_json']);return $r;},$rows);
        $last=$alerts?(int)$alerts[array_key_last($alerts)]['id']:$after;
        return ['schema'=>1,'exported_at'=>gmdate('c'),'account'=>$this->user($id),'rules'=>$this->rules($id),'alerts'=>$alerts,'reports'=>$this->reports($id),'purchases'=>$this->all('SELECT provider_id,capture_id,amount,mode,status,created_at,paid_at,expires_at FROM orders WHERE user_id=? ORDER BY created_at DESC',[$id]),'through'=>$through,'next_cursor'=>count($alerts)===200 && $last<$through?$last:null];
    }

    // Payment and analysis implementations are composed from the same private source release.
    use Payments;
    use Analysis;
}
