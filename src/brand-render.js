import {escapeHTML as e} from './glossary-render.js';
import {depthLabels,factValues} from './brand-directory.js';
export function brandCard(b,link){
 const countries=factValues(b,'country'),ended=factValues(b,'dissolved');
 return `<article class="source-card brand-card"><div class="eyebrow">${e(b.category)}</div><h2><a href="${e(link)}">${e(b.name)}</a></h2><p>${e(b.summary)}</p><p class="muted">${e(countries.slice(0,3).join(' · ')||'Country not recorded')}${ended.length?' · End date reported: '+e(ended.join(', ')):''}</p><small>${e(depthLabels[b.depth])}</small></article>`;
}
export function brandBody(b,{profileLink,readingLink}={}){
 const groups=[['Catalog history & people',['inception','dissolved','founder']],['Catalog places & products',['country','headquarters','products','type']]];
 const labels={inception:'Inception year reported',dissolved:'Dissolution year reported',founder:'Founder',country:'Country association',headquarters:'Headquarters reported',products:'Products reported',type:'Entity classification'};
 const facts=groups.map(([title,fields])=>`<section><h2>${title}</h2>${fields.map(field=>{
  const list=b.facts.filter(f=>f.field===field);return `<h3>${labels[field]}</h3>${list.length?`<ul>${list.map(f=>`<li>${e(f.value)} <a href="${e(f.source)}" rel="noopener noreferrer">[Wikidata]</a></li>`).join('')}</ul>`:'<p class="muted">No imported catalog statement.</p>'}`;
 }).join('')}</section>`).join('');
 const websites=b.facts.filter(f=>f.field==='website');
 return `<div class="eyebrow">${e(b.category)}</div><h1>${e(b.name)}</h1><p class="definition-lead">${e(b.summary)}</p>
<p class="muted">${e(depthLabels[b.depth])} · Snapshot ${e(b.retrieved)}${readingLink?` · <a href="${e(readingLink)}">Reading edition</a>`:''}</p>
${profileLink?`<p><a class="button" href="${e(profileLink)}">Read the full textile profile</a></p>`:''}
<div class="reading">${b.history?`<section><h2>Textile context</h2><p>${e(b.history)}</p></section>`:''}
${b.findings?.length?`<section><h2>Producer research notes</h2>${b.findings.map(f=>`<p>${e(f.text)} <a href="${e(f.url)}">${e(f.title)}</a></p>`).join('')}</section>`:''}
<div class="notice">${b.depth==='catalog'?'This is a structured catalog record. Its statements have not been independently checked against primary sources.':'Company sources describe the producer’s own history and products. They do not independently verify environmental or performance claims.'} Dates and places below are reported by Wikidata and may describe different periods or entities. An absent end date does not establish that a business is still trading. Country and headquarters do not establish manufacturing or fiber origin.</div>
${facts}<section><h2>Sources & further research</h2><ul class="source-links">${b.sources.map(s=>`<li><a href="${e(s.url)}" rel="noopener noreferrer">${e(s.title)}</a><small>${e(s.kind)}</small></li>`).join('')}${websites.map(f=>`<li><a href="${e(f.value)}" rel="noopener noreferrer">Website listed by Wikidata</a> <a href="${e(f.source)}">[record]</a><small>Destination and current ownership have not been verified.</small></li>`).join('')}</ul>
${b.research.length?`<h3>Company reading trail</h3><p>These linked pages were fetched during discovery. Their presence is not a verification of all statements on the page.</p><ul>${b.research.map(s=>`<li><a href="${e(s.url)}" rel="noopener noreferrer">${e(s.title)}</a></li>`).join('')}</ul>`:''}
${b.siteCheck?`<p class="muted">Automated company-site check: ${e(b.siteCheck)}. A fetched page is not a complete editorial review.</p>`:''}</section>
<section><h2>Open research questions</h2><ul>${!factValues(b,'inception').length?'<li>What primary source documents the business or label’s founding, and is that distinct from earlier family activity?</li>':''}${!factValues(b,'founder').length?'<li>Who founded this business or label, and which source identifies them?</li>':''}<li>Which current products document their fiber percentages, yarn and fabric construction?</li><li>Which manufacturing stages take place in owned facilities, and which are contracted out?</li><li>Which product-specific sources substantiate sourcing, traceability or certification claims?</li><li>Do historical names, ownership changes or closures affect the identity of this entry?</li></ul></section></div>`;
}
