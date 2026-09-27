import fs from 'node:fs/promises';
import {weaveEntries, weaveReviewed, weaveCategories} from '../src/weaves.js';
import {weaveBody} from '../src/weaves-render.js';
import {escapeHTML as e} from '../src/glossary-render.js';

export async function buildWeaves(cssFile, base) {
  const paths = ['weaves/'];
  async function write(path, name, description, body, detail = false, references = []) {
    const home = detail ? '../../' : '../', url = new URL(path, base).href;
    const schema = {'@context':'https://schema.org', '@type':detail?'Article':'CollectionPage',
      name, ...(detail ? {headline:name} : {}), description, url, dateModified:weaveReviewed,
      inLanguage:'en', author:{'@type':'Person',name:'Chaos'}, ...(detail ? {citation:references.map(ref=>ref.url)} : {})};
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(name)} | Fibers of Earth</title><meta name="description" content="${e(description)}"><link rel="canonical" href="${e(url)}"><link rel="stylesheet" href="${home}${cssFile}"><meta property="og:title" content="${e(name)}"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${e(url)}"><meta property="og:type" content="${detail?'article':'website'}"><script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script></head><body><a class="skip" href="#main">Skip to content</a><header><nav class="glossary-static-nav" aria-label="Main navigation"><a href="${home}index.html">Fibers of Earth</a><a href="${detail?'../':'./'}index.html">Weaves &amp; patterns</a><a href="${home}materials/index.html">Materials</a><a href="${home}glossary/index.html">Textile glossary</a></nav></header><main id="main" class="page">${body}</main><footer class="site-footer"><p>Fibers of Earth · An independent field guide by Chaos.</p><a href="${home}index.html#/sources">Sources &amp; method</a></footer></body></html>`;
    await fs.mkdir('dist/'+path, {recursive:true});
    await fs.writeFile('dist/'+path+'index.html', html);
  }
  for (const entry of weaveEntries) {
    const path='weaves/'+entry.id+'/';
    const body=`<nav class="breadcrumb" aria-label="Breadcrumb"><a href="../index.html">Weaves &amp; patterns</a></nav><header class="pattern-heading"><div class="eyebrow">${e(entry.category)}</div><h1>${e(entry.name)}</h1><p class="definition-lead">${e(entry.summary)}</p>${entry.aliases.length?`<p class="muted">Also searched as: ${entry.aliases.map(e).join(', ')}</p>`:''}<a href="../../index.html#/weaves/${entry.id}">Open the interactive guide ↗</a></header>${weaveBody(entry,{link:id=>'../'+id+'/'})}`;
    await write(path, entry.name, entry.summary, body, true, entry.references);
    paths.push(path);
  }
  const body=`<header class="page-intro"><div class="eyebrow">READ THE CLOTH</div><h1>Weaves &amp; patterns.</h1><p>${weaveEntries.length} sourced entries about woven structures, knitted loops, color patterns, motifs and surface techniques. This growing guide is not an exhaustive list of every textile design or regional name.</p><a href="../index.html#/weaves">Search and compare in the interactive guide ↗</a></header><p class="notice">Construction, appearance and finishing are different descriptions. A weave name does not identify the fiber; a printed motif can imitate a woven pattern. Diagrams are labeled teaching examples, not manufacturing instructions.</p><nav class="pattern-related" aria-label="Pattern categories">${weaveCategories.map((category,i)=>`<a href="#category-${i}">${e(category)}</a>`).join('')}</nav>${weaveCategories.map((category,i)=>`<section id="category-${i}"><h2>${e(category)}</h2><ul class="pattern-static-list">${weaveEntries.filter(entry=>entry.category===category).map(entry=>`<li><a href="${entry.id}/">${e(entry.name)}</a><small>${e(entry.summary)}</small></li>`).join('')}</ul></section>`).join('')}`;
  await write('weaves/','Weaves & patterns','Learn to recognize textile structures, color patterns and finishes, with sources and schematic diagrams.',body);
  await fs.writeFile('dist/weaves/directory.json',JSON.stringify({schemaVersion:1,reviewed:weaveReviewed,entries:weaveEntries}));
  console.log(`Built ${paths.length} readable weave and pattern pages`);
  return paths;
}
