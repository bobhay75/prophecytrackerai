import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../out/', import.meta.url));
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
assert.ok(html.includes('Start with what the record supports.'));
assert.ok(html.includes('Earthquake observations'));
assert.ok(html.includes('No AI prediction is generated.'));
let count=0;
function visit(directory) {
 for (const name of fs.readdirSync(directory)) {
  const filename=path.join(directory,name), relative=path.relative(root,filename);
  assert.ok(!/(^|\/)(\.env[^/]*|node_modules|\.git|admin_access_info\.txt)(\/|$)/.test(relative));
  assert.ok(!/\.(pem|key|log)$/i.test(name));
  if(fs.statSync(filename).isDirectory())visit(filename);else count++;
 }
}
visit(root);
let assets = 0;
for(const match of html.matchAll(/(?:src|href)="([^"?#]*\/_next\/[^"?#]+)[^" ]*"/g)) {
 const relative = match[1].slice(match[1].indexOf('/_next/') + 1);
 assert.ok(fs.existsSync(path.join(root, relative)), 'missing runtime asset '+match[1]);
 assets++;
}
assert.ok(assets > 0, 'export contains no referenced runtime assets');
console.log('Static export passed: expected dashboard, honest capabilities, local runtime assets, and private-file exclusion ('+count+' files).');
