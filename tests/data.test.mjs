import test from 'node:test';
import assert from 'node:assert/strict';
import {materials,byId,networks,journeys,sources,getMaterials,distance,articles} from '../src/data.js';
import {diameterFromDenier} from '../src/science.js';
test('catalog has unique, complete entries with source references and histories',()=>{assert.equal(materials.length,112);assert.equal(new Set(materials.map(m=>m.id)).size,112);for(const m of materials){for(const f of ['name','family','composition','feel','uses','care','tradeoff','question','history'])assert.ok(m[f]?.length>0,`${m.id}: ${f}`);for(const s of m.sources)assert.ok(sources.some(x=>x.id===s),`${m.id}: ${s}`);if(m.brand)assert.ok(byId[m.base]);}});
test('every route follows its network, has valid coordinates and an origin and destination',()=>{assert.equal(journeys.length,115);assert.equal(new Set(journeys.map(j=>j.id)).size,journeys.length);for(const j of journeys){const n=networks[j.fiber];assert.equal(j.stops[0].role,'Origin');assert.equal(j.stops.at(-1).role,'Destination');assert.ok(j.km>0);for(const s of j.stops){assert.ok(Number.isFinite(s.lat)&&Math.abs(s.lat)<=90);assert.ok(Number.isFinite(s.lon)&&Math.abs(s.lon)<=180);assert.ok(s.country);}for(let i=1;i<j.keys.length;i++)assert.ok(n.flows.some(([a,b])=>a===j.keys[i-1]&&b===j.keys[i]));}});
test('search is accent-insensitive and aliases, filters and sorting compose',()=>{assert.ok(getMaterials({q:'vicuna'}).some(m=>m.id==='vicuna'));assert.ok(getMaterials({q:'pashmina'}).some(m=>m.id==='cashmere'));assert.ok(getMaterials({family:'Plant',q:'fiber'}).every(m=>m.family==='Plant'));const xs=getMaterials({sort:'az'});assert.deepEqual(xs.map(x=>x.name),[...xs].sort((a,b)=>a.name.localeCompare(b.name)).map(x=>x.name));assert.equal(getMaterials({q:'no-such-material-123'}).length,0);});
test('distance and filament dimensional model have independent reference values',()=>{assert.ok(Math.abs(distance({lat:0,lon:0},{lat:0,lon:90})-10007.543)<.01);assert.equal(distance({lat:20,lon:40},{lat:20,lon:40}),0);assert.ok(Math.abs(diameterFromDenier(5,1.38)-22.640)<.01);assert.ok(Math.abs(diameterFromDenier(20,1.38)/diameterFromDenier(5,1.38)-2)<1e-10);});
test('editorial cross references and public text are safe and coherent',()=>{for(const a of articles){for(const id of a.fibers)assert.ok(byId[id]);for(const s of a.sources)assert.ok(sources.some(x=>x.id===s));}const text=JSON.stringify({materials,journeys,sources,articles});assert.ok(!/\u2014/.test(text));assert.ok(sources.every(s=>new URL(s.url).protocol==='https:'));});

import {glossaryEntries,glossarySources,findTerms,searchTerms,suggestTerms} from '../src/glossary.js';
import {termRefs,linkTerms} from '../src/glossary-render.js';
import {glossary as originalTerms} from '../src/content.js';
import {searchMaterials,suggestMaterials,propertyColumns,propertyCell} from '../src/data.js';
import {toTex,fromTex,toGsm,fromGsm} from '../src/science.js';
import {editDistance,parseQuery,tokenize} from '../src/search.js';
const words=s=>String(s).split(/\s+/).filter(Boolean).length;
const noDash=x=>!/[–—]/.test(JSON.stringify(x));
test('glossary preserves terms, valid references, detailed content and composed search',()=>{
 for(const term of Object.keys(originalTerms))assert.ok(glossaryEntries.some(t=>t.term===term),term);
 assert.ok(glossaryEntries.length>=90);
 assert.equal(new Set(glossaryEntries.map(t=>t.id)).size,glossaryEntries.length);
 for(const t of glossaryEntries){assert.match(t.id,/^[a-z]+(?:-[a-z]+)*$/);assert.ok(words(t.definition)>=5,t.term+' definition');for(const k of ['explanation','example','caution'])assert.ok(words(t[k])>=25,t.term+' '+k);for(const k of ['deeper','origins'])assert.ok(words(t[k])>=30,t.term+' '+k);assert.ok(termRefs(t).length>=2,t.term+' refs');for(const r of termRefs(t))assert.equal(new URL(r.url).protocol,'https:');assert.ok(t.related.length>=2,t.term+' related');for(const name of t.related)assert.ok(glossaryEntries.some(x=>x.term===name));assert.ok(noDash(t),t.term+' dash');}
 for(const s of Object.values(glossarySources))assert.equal(new URL(s.url).protocol,'https:');
 assert.equal(findTerms({q:'spandex'})[0].id,'elastane');
 assert.equal(findTerms({q:'cottonisation'})[0].id,'cottonization');
 const md=findTerms({category:'Measurements',letter:'D'});assert.ok(md.some(t=>t.id==='denier'));assert.ok(md.every(t=>t.category==='Measurements'&&t.term[0]==='D'));
 assert.equal(findTerms({q:'<script>nothing'}).length,0);
 assert.equal(findTerms({q:'denier'})[0].id,'denier');
 assert.equal(suggestTerms('dennier'),'denier');
});
test('every catalog entry has a complete, sourced research profile',()=>{
 for(const m of materials){const d=m.detail;assert.ok(d,m.id+' detail');for(const k of ['origin','structure','process','performance','identify','labeling','past'])assert.ok(words(d[k])>=30,`${m.id}: ${k}`);assert.ok(Array.isArray(d.facts)&&d.facts.length>=2,m.id+' facts');for(const f of d.facts)assert.ok(f.length===2&&f[0]&&f[1],m.id+' fact');assert.ok(d.refs.length>=1,m.id+' refs');for(const r of d.refs){assert.ok(r.title);assert.equal(new URL(r.url).protocol,'https:');}assert.ok(['verified','editorial'].includes(d.evidence),m.id+' evidence');assert.ok(noDash(d),m.id+' dash');}
});
test('every catalog entry has a complete reader guide',()=>{
 for(const m of materials){const g=m.guide;assert.ok(g,m.id+' guide');for(const k of ['types','fabrics','quality','impact','care'])assert.ok(words(g[k])>=40,`${m.id}: ${k}`);for(const k of ['pros','cons'])assert.ok(g[k].length>=3,`${m.id}: ${k}`);assert.ok(g.notable.length>=2,m.id+' notable');assert.ok(g.faq.length>=3&&g.faq.every(([q,a])=>q&&words(a)>=12),m.id+' faq');assert.ok(g.refs.length>=1&&g.refs.every(r=>new URL(r.url).protocol==='https:'),m.id+' refs');assert.ok(noDash(g),m.id+' dash');}
 assert.ok(searchMaterials('denim').slice(0,2).some(r=>r.material.id==='cotton'));assert.equal(searchMaterials('charmeuse')[0].material.id,'silk');
});
test('data sheets cite a valid source for every property, event and production figure',()=>{
 let rows=0;for(const m of materials){const d=m.data;if(!d)continue;for(const r of d.refs)assert.equal(new URL(r.url).protocol,'https:',m.id);const ok=i=>Number.isInteger(i)&&i>=0&&i<d.refs.length;
  for(const p of d.properties){assert.ok(p.label&&p.value&&ok(p.ref),m.id+' property');rows++;}for(const t of d.timeline)assert.ok(t.year&&t.event&&ok(t.ref),m.id+' event');if(d.production)assert.ok(d.production.figure&&ok(d.production.ref),m.id+' production');assert.ok(noDash(d),m.id+' dash');}
 assert.ok(rows>=100);
 const tex=propertyCell({data:{properties:[{key:'tenacity',label:'Tenacity',value:'2 to 4',unit:'g/denier',conditions:'',ref:0}],refs:[{title:'t',url:'https://x.org'}]}},propertyColumns.find(c=>c.key==='tenacity'));
 assert.ok(Math.abs(tex.value-26.49)<.01);
});
test('ranked search tolerates typos and spelling variants and supports phrases, exclusions and fields',()=>{
 assert.equal(editDistance('cashmer','cashmere'),1);assert.equal(editDistance('ab','ba'),1);assert.equal(editDistance('wool','silk',1),2);
 assert.deepEqual(tokenize('Colour of the fibres'),['color','fiber']);
 assert.deepEqual(parseQuery('"artificial silk" -muga family:plant',{family:'family'}),{terms:[],phrases:[['artificial','silk']],exclude:[['muga']],fields:[{field:'family',term:'plant'}]});
 assert.equal(searchMaterials('cashmer')[0].material.id,'cashmere');
 assert.equal(searchMaterials('sillk')[0].material.id,'silk');
 assert.equal(searchMaterials('kevlar')[0].material.id,'kevlar');
 assert.ok(searchMaterials('silk -muga').every(r=>r.material.id!=='muga-silk'));
 assert.ok(searchMaterials('family:plant rope').every(r=>r.material.family==='Plant'));
 const phrase=searchMaterials('"artificial silk"');assert.ok(phrase.length>0);
 const top=searchMaterials('wool')[0];assert.ok(top.matched.name||top.matched.aliases);
 assert.equal(suggestMaterials('polyestr'),'polyester');
 for(const [query,id] of [['Ermenegildo Zegna','zegna'],['VBC','vitale-barberis-canonico'],['Reda 1865','reda']])assert.equal(searchMaterials(query)[0].material.id,id);
 for(const id of ['zegna','brunello-cucinelli','john-smedley','johnstons-of-elgin','vitale-barberis-canonico','reda']){assert.ok(byId[id].referenceOnly);assert.ok(!networks[id]);}
 assert.ok(searchMaterials('law:cites').every(r=>/cites/i.test(r.material.detail.labeling)));
 assert.ok(getMaterials({q:'fibre'}).length===getMaterials({q:'fiber'}).length);
});
test('unit converters match exact reference conversions',()=>{
 assert.ok(Math.abs(fromTex(toTex(30,'ne'),'tex')-19.6847)<1e-3);
 assert.ok(Math.abs(fromTex(toTex(150,'denier'),'dtex')-166.667)<1e-3);
 assert.ok(Math.abs(fromTex(toTex(50,'nm'),'tex')-20)<1e-9);
 assert.ok(Math.abs(toGsm(1,'oz')-33.9057)<1e-3);assert.ok(Math.abs(toGsm(1,'momme')-4.33994)<1e-4);
 for(const u of ['tex','dtex','denier','nm','ne'])assert.ok(Math.abs(fromTex(toTex(7.3,u),u)-7.3)<1e-9);
 assert.ok(Number.isNaN(toTex(0,'tex'))&&Number.isNaN(toGsm(-1,'oz')));
});
test('glossary auto-links escape safely and link each term once',()=>{
 assert.ok(!linkTerms('keratin intermediate filaments').includes('glossary/filament'));assert.ok(linkTerms('a continuous filament').includes('term-link'));
 const html=linkTerms('Carding &amp; carding precede combing.');assert.equal((html.match(/term-link/g)||[]).length,2);assert.ok(html.includes('&amp;'));
});

test('brand directory search composes filters and clamps malformed pagination',async()=>{
 const {brandDirectory,directoryById,searchBrands,directoryPage,factValues}=await import('../src/brand-directory.js');
 assert.ok(brandDirectory.length>2000);assert.equal(Object.keys(directoryById).length,brandDirectory.length);
 assert.ok(searchBrands({q:'Ermenegildo Zegna'}).some(b=>b.id==='zegna'));
 assert.ok(searchBrands({q:'John Smedly'}).some(b=>b.id==='john-smedley'));
 const result=searchBrands({country:'Italy',depth:'catalog'});assert.ok(result.length>0);assert.ok(result.every(b=>b.depth==='catalog'&&factValues(b,'country').includes('Italy')));
 const ended=searchBrands({history:'ended'});assert.ok(ended.length>0);assert.ok(ended.every(b=>factValues(b,'dissolved').length));
 assert.deepEqual(searchBrands({savedIds:['zegna']}).map(b=>b.id),['zegna']);assert.equal(searchBrands({savedIds:[]}).length,0);
 for(const page of ['NaN','Infinity','-4','0'])assert.equal(directoryPage({},page).page,1);
 assert.equal(directoryPage({},'999999').page,directoryPage().pages);assert.equal(directoryPage({},2).entries.length,24);
 assert.equal(directoryPage({q:'zzzznonexistentbrandzzzz'},10).page,1);assert.equal(directoryPage({q:'zzzznonexistentbrandzzzz'}).total,0);
});
test('brand shortlists recover from malformed or blocked storage',async()=>{
 const {readBrandShortlist,writeBrandShortlist}=await import('../src/brand-shortlist.js');const valid=new Set(['zegna','reda']);
 assert.deepEqual(readBrandShortlist({getItem:()=> '["zegna","zegna","missing",12]'},valid),['zegna']);
 assert.deepEqual(readBrandShortlist({getItem:()=> '{broken'},valid),[]);
 assert.deepEqual(readBrandShortlist({getItem:()=> '{"id":"zegna"}'},valid),[]);
 assert.equal(writeBrandShortlist({setItem:()=>{throw Error('blocked');}},['zegna']),false);
});

import {weaveEntries,weaveById,weaveCategories,findWeaves,parseWeaveSelection,weavePageNumber} from '../src/weaves.js';
import {weaveSwatch,weaveBody} from '../src/weaves-render.js';
test('weave and pattern research has distinct categories, source links and coherent cross-references',()=>{
 assert.ok(weaveEntries.length>=100);
 assert.equal(new Set(weaveEntries.map(entry=>entry.id)).size,weaveEntries.length);
 assert.ok(weaveCategories.includes('Weave structure')&&weaveCategories.includes('Color pattern')&&weaveCategories.includes('Knit structure'));
 for(const entry of weaveEntries){
  assert.match(entry.id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  for(const key of ['name','category','summary','construction','recognize','distinguish'])assert.ok(typeof entry[key]==='string'&&entry[key].trim(),entry.id+': '+key);
  assert.ok(entry.aliases.every(alias=>typeof alias==='string'));
  assert.ok(entry.uses.length>=2&&entry.references.length>=1,entry.id);
  for(const ref of entry.references){assert.ok(ref.title);assert.equal(new URL(ref.url).protocol,'https:');}
  for(const id of entry.related)assert.ok(Object.hasOwn(weaveById,id)&&id!==entry.id,entry.id+': related '+id);
  assert.ok(!/\u2014/.test(JSON.stringify(entry)),entry.id);
  if(entry.visual.kind==='draft'){
   const rows=entry.visual.draft,width=rows[0].length;
   assert.ok(rows.length>=2&&width>=2&&rows.length<=48&&width<=48,entry.id);
   assert.ok(rows.every(row=>row.length===width&&/^[01]+$/.test(row)&&row.includes('0')&&row.includes('1')),entry.id);
   for(let x=0;x<width;x++)assert.equal(new Set(rows.map(row=>row[x])).size,2,entry.id+': unbound warp');
   for(const colors of [entry.visual.warp,entry.visual.weft].filter(Boolean))assert.ok(colors.length&&colors.every(color=>/^#[0-9a-f]{6}$/i.test(color)),entry.id);
  }else assert.ok(['stripe','check','dot','chevron','diamond','floral','paisley','animal','geometric','texture','loops'].includes(entry.visual.motif),entry.id);
 }
});
test('weave search combines aliases and category filters, and comparisons reject unknown identifiers',()=>{
 assert.equal(findWeaves({q:'houndstooth'})[0].id,'houndstooth');
 assert.equal(findWeaves({q:'puppytooth'})[0].id,'houndstooth');
 assert.ok(findWeaves({q:'herringbone'}).some(entry=>entry.id==='herringbone'));
 assert.ok(findWeaves({category:'Knit structure'}).every(entry=>entry.category==='Knit structure'));
 assert.equal(findWeaves({q:'houndstooth',category:'Knit structure'}).length,0);
 assert.equal(findWeaves({q:'no-such-pattern-zzzz'}).length,0);
 assert.deepEqual(parseWeaveSelection('houndstooth,constructor,herringbone,houndstooth,__proto__,twill,plain-weave'),['houndstooth','herringbone','twill']);
 assert.equal(weavePageNumber('NaN',100),1);assert.equal(weavePageNumber('-9',100),1);assert.equal(weavePageNumber('999',100),6);assert.equal(weavePageNumber('3',0),1);
});
test('pattern diagrams distinguish a woven color repeat from its interlacing structure',()=>{
 const entry=weaveById.houndstooth;
 assert.equal(entry.category,'Color pattern');assert.equal(entry.visual.kind,'draft');
 assert.ok(new Set(entry.visual.warp).size>=2&&new Set(entry.visual.weft).size>=2);
 assert.notEqual(weaveSwatch(entry),weaveSwatch(entry,{structure:true}));
 assert.match(weaveSwatch(entry),/role="img"/);
 assert.match(weaveSwatch(entry,{decorative:true}),/aria-hidden="true"/);
 const escaped=weaveSwatch({...entry,name:'<img src=x onerror=alert(1)>'});
 assert.ok(!escaped.includes('<img'));assert.ok(escaped.includes('&lt;img'));
 assert.match(weaveBody(entry),/What to distinguish/);assert.match(weaveBody(entry),/Sources &amp; further reading/);
});
test('brand pages omit empty catalog fields and show related atlas content',async()=>{
 const {brandBody,relatedBrands}=await import('../src/brand-render.js');const {brandDirectory,directoryById}=await import('../src/brand-directory.js');
 const opts={materialHref:id=>'m/'+id,brandHref:id=>'b/'+id};
 for(const b of brandDirectory)assert.ok(!brandBody(b,opts).includes('No imported catalog statement'),b.id);
 const w=brandBody(directoryById['wolf-vs-goat'],opts);assert.ok(w.includes('href="m/wool"'));assert.ok(!w.includes('reported by Wikidata'));
 const r=relatedBrands(directoryById['wolf-vs-goat']);assert.ok(r.length>0&&r.length<=10&&r.every(x=>x.category==='Textile houses & apparel'&&x.id!=='wolf-vs-goat'));
});
