import fs from 'node:fs/promises';
import {articles, byId, sources} from '../src/data.js';
import {reviewed} from '../src/glossary.js';
import {escapeHTML as e, linkTerms} from '../src/glossary-render.js';

// The same editorial data serves the interactive atlas and the reading edition.
export async function buildArticles(cssFile, base) {
  const url = path => new URL(path, base).href;
  const paths = ['learn/'];
  async function write(path, name, description, body, schema, detail = false) {
    const home = detail ? '../../' : '../';
    const json = JSON.stringify(schema).replaceAll('<', '\\u003c');
    const html = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(name)} | Fibers of Earth</title><meta name="description" content="${e(description)}">
<link rel="canonical" href="${e(url(path))}"><link rel="stylesheet" href="${home}${cssFile}">
<meta property="og:type" content="${detail ? 'article' : 'website'}"><meta property="og:title" content="${e(name)}">
<meta property="og:description" content="${e(description)}"><meta property="og:url" content="${e(url(path))}">
<script type="application/ld+json">${json}</script></head><body>
<a class="skip" href="#main">Skip to content</a><header><nav class="glossary-static-nav" aria-label="Main navigation">
<a href="${home}index.html">Fibers of Earth</a><a href="${detail ? '../' : './'}index.html">Field notes</a>
<a href="${home}materials/index.html">Materials</a><a href="${home}glossary/index.html">Textile glossary</a>
<a href="${home}weaves/index.html">Weaves &amp; patterns</a></nav></header><main id="main" class="page ${detail ? 'glossary-article' : ''}">${body}</main>
<footer class="site-footer"><p>Fibers of Earth · An independent field guide by Chaos.</p>
<a href="${home}index.html#/sources">Sources &amp; method</a></footer></body></html>`;
    await fs.mkdir('dist/' + path, {recursive: true});
    await fs.writeFile('dist/' + path + 'index.html', html);
  }
  for (const a of articles) {
    const path = `learn/${a.id}/`, used = new Set();
    const refs = a.sources.map(id => sources.find(s => s.id === id));
    const body = `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="../index.html">Field notes</a></nav>
<div class="eyebrow">${e(a.tag)} · ${a.time} MIN READ</div><h1>${e(a.title)}</h1><p class="definition-lead">${e(a.dek)}</p>
<p class="muted">Reviewed ${e(a.reviewed || reviewed)}. <a href="../../index.html#/article/${a.id}">Open in the interactive atlas</a>.</p>
<div class="reading"><nav class="toc" aria-label="On this page"><h2>On this page</h2><ol>
${a.sections.map(([h], i) => `<li><a href="#section-${i}">${e(h)}</a></li>`).join('')}</ol></nav>
${a.sections.map(([h, p], i) => `<section id="section-${i}"><h2>${e(h)}</h2><p>${linkTerms(e(p), id => '../../glossary/' + id + '/', used)}</p></section>`).join('')}
<section><h2>Sources &amp; further reading</h2><ul class="source-links">${refs.map(s => `<li><a href="${e(s.url)}" rel="noopener noreferrer">${e(s.name)}: ${e(s.title)}</a><p>${e(s.note)}</p></li>`).join('')}</ul></section>
<section><h2>Meet the materials</h2><ul>${a.fibers.map(id => `<li><a href="../../materials/${id}/">${e(byId[id].name)}</a></li>`).join('')}</ul></section></div>`;
    const schema = {'@context':'https://schema.org', '@type':'Article', headline:a.title, description:a.dek,
      url:url(path), dateModified:a.reviewed || reviewed, inLanguage:'en',
      author:{'@type':'Person', name:'Chaos'}, citation:refs.map(s => s.url)};
    await write(path, a.title, a.dek, body, schema, true);
    paths.push(path);
  }
  await write('learn/', 'Textile field notes', 'Practical guides to textile labels, cloth construction, care and sourcing.',
    `<div class="page-intro"><div class="eyebrow">THE FIELD NOTES</div><h1>Look a little closer.</h1>
<p>${articles.length} guides to the language, craft and tradeoffs of textiles. These pages work without JavaScript.</p>
<a href="../index.html#/learn">Explore in the interactive atlas</a></div><ul class="glossary-static-list">
${articles.map(a => `<li><div class="eyebrow">${e(a.tag)}</div><h2><a href="${a.id}/">${e(a.title)}</a></h2><p>${e(a.dek)}</p></li>`).join('')}</ul>`,
    {'@context':'https://schema.org', '@type':'CollectionPage', name:'Textile field notes', url:url('learn/'),
      hasPart:articles.map(a => ({'@type':'Article', headline:a.title, url:url(`learn/${a.id}/`)}))});
  console.log(`Built ${paths.length} readable field-note pages`);
  return paths;
}
