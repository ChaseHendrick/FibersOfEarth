import fs from 'node:fs/promises';
import {brandDirectory,directoryDate} from '../src/brand-directory.js';
import {brandBody} from '../src/brand-render.js';
import {escapeHTML as e} from '../src/glossary-render.js';
export async function buildBrands(cssFile,base){
 const paths=['brands/'];
 async function write(path,name,body,depth=1){
  const home='../'.repeat(depth),url=new URL(path,base).href;
  const schema={'@context':'https://schema.org','@type':depth===1?'CollectionPage':'WebPage',name,url,dateModified:directoryDate};
  await fs.mkdir('dist/'+path,{recursive:true});
  await fs.writeFile('dist/'+path+'index.html',`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(name)} | Fibers of Earth</title><meta name="description" content="${e(name)}: textile research, historical context and source references."><link rel="canonical" href="${e(url)}"><link rel="stylesheet" href="${home}${cssFile}"><script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script></head><body><a class="skip" href="#main">Skip to content</a><header><nav class="glossary-static-nav" aria-label="Main navigation"><a href="${home}index.html">Fibers of Earth</a><a href="${depth===1?'./':'../'}index.html">Brand directory</a><a href="${home}materials/index.html">Materials</a><a href="${home}learn/index.html">Field notes</a><a href="${home}weaves/index.html">Weaves &amp; patterns</a></nav></header><main id="main" class="page ${depth===2?'glossary-article':''}">${body}</main><footer class="site-footer"><p>Fibers of Earth · An independent field guide by Chaos.</p><a href="${home}index.html#/sources">Sources &amp; method</a></footer></body></html>`);
 }
 // A compact alphabetical index avoids rendering thousands of full cards at once.
 const letters=[...new Set(brandDirectory.map(b=>/^[a-z]/i.test(b.name)?b.name[0].toUpperCase():'#'))].sort();
 await write('brands/','Brands, mills & makers',`<div class="page-intro"><h1>Brands, mills & makers.</h1><p>${brandDirectory.length.toLocaleString()} entries. A finite research snapshot including historical businesses; depth varies by entry.</p><p><a href="../index.html#/brands">Search and filter the interactive directory</a> · <a href="directory.json" download>Download JSON</a></p><p>Snapshot ${directoryDate}. Catalog facts are source-reported, not independently verified. Country associations are not manufacturing locations.</p></div><nav class="alphabet" aria-label="Brand initial">${letters.map(l=>`<a href="#letter-${l==='#'?'other':l}">${e(l)}</a>`).join(' ')}</nav>${letters.map(l=>`<section id="letter-${l==='#'?'other':l}"><h2>${e(l)}</h2><ul class="directory-index">${brandDirectory.filter(b=>(/^[a-z]/i.test(b.name)?b.name[0].toUpperCase():'#')===l).map(b=>`<li><a href="${b.id}/">${e(b.name)}</a><small> ${e(b.category)}</small></li>`).join('')}</ul></section>`).join('')}`);
 for(const b of brandDirectory){const path='brands/'+b.id+'/';await write(path,b.name,`<nav class="breadcrumb" aria-label="Breadcrumb"><a href="../index.html">Brand directory</a></nav>${brandBody(b,{profileLink:b.profileId?'../../materials/'+b.profileId+'/':null,materialHref:id=>'../../materials/'+id+'/',brandHref:id=>'../'+id+'/'})}`,2);paths.push(path);}
 await fs.copyFile('src/data/brand-directory.json','dist/brands/directory.json');
 console.log(`Built ${paths.length} readable brand directory pages`);return paths;
}
