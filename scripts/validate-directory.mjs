import assert from 'node:assert/strict';
import {brandDirectory,directoryById,directoryDate} from '../src/brand-directory.js';
import {byId} from '../src/data.js';
const validURL=s=>{try{const u=new URL(s);return ['http:','https:'].includes(u.protocol)&&!!u.hostname&&!u.username&&!u.password&&!/[\s<>"\x00-\x1f]/.test(s);}catch{return false;}};
const fields=new Set(['website','inception','dissolved','country','headquarters','founder','products','type']);
assert.equal(Object.keys(directoryById).length,brandDirectory.length,'Duplicate directory IDs');
assert.match(directoryDate,/^\d{4}-\d{2}-\d{2}$/);
for(const b of brandDirectory){
 assert.match(b.id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);assert.ok(b.name&&b.summary&&b.category,`${b.id}: missing identity`);
 assert.ok(['profile','reference','catalog'].includes(b.depth));assert.equal(b.retrieved,directoryDate);
 assert.ok(b.sources.length,`${b.id}: no sources`);assert.ok(Array.isArray(b.aliases)&&Array.isArray(b.research));
 if(b.profileId)assert.ok(byId[b.profileId]?.brand,`${b.id}: broken textile profile`);
 const sources=new Set(b.sources.map(s=>s.url));
 for(const f of b.facts){assert.ok(fields.has(f.field)&&f.value&&sources.has(f.source),`${b.id}: unsupported fact`);if(f.field==='website')assert.ok(validURL(f.value),`${b.id}: unsafe website`);}
 for(const s of [...b.sources,...b.research,...b.findings||[]])assert.ok(validURL(s.url),`${b.id}: unsafe source`);
 for(const f of b.findings||[])assert.ok(f.text&&f.title&&b.research.some(s=>s.url===f.url),`${b.id}: research note lacks reading-trail evidence`);
}
console.log(`Directory integrity: ${brandDirectory.length} unique entries, ${brandDirectory.reduce((n,b)=>n+b.facts.length,0)} source-linked statements, valid references and profile links.`);
