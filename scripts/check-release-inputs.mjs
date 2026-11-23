import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const unsafe = [];
for (const path of files) {
  if (!existsSync(path)) continue; // permits checking a pending removal locally
  const name = path.split('/').at(-1);
  if (name === 'admin_access_info.txt' || (name.startsWith('.env') && name !== '.env.example') || /\.(pem|key)$/i.test(name) || /^service-account.*\.json$/i.test(name)) unsafe.push(path);
  if (name === 'config.local.php' || /\.(sqlite|sqlite-wal|sqlite-shm|db)$/i.test(name) || /(^|\/)sessions\//.test(path)) unsafe.push(path);
  if (/\.json$/i.test(name)) {
    const text = readFileSync(path, 'utf8');
    if (/"type"\s*:\s*"service_account"/.test(text) && /"private_key"\s*:/.test(text)) unsafe.push(path);
  }
}
if (unsafe.length) { console.error('Private configuration must not be tracked: ' + [...new Set(unsafe)].join(', ')); process.exitCode = 1; }
else console.log('Tracked release inputs exclude known private configuration files.');
