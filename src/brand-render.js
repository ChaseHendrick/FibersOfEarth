import {escapeHTML as e} from './glossary-render.js';
import {brandDirectory,depthLabels,factValues} from './brand-directory.js';
import {byId,materials} from './data.js';
export function brandCard(b,link){
 const countries=factValues(b,'country'),ended=factValues(b,'dissolved');
 return `<article class="source-card brand-card"><div class="eyebrow">${e(b.category)}</div><h2><a href="${e(link)}">${e(b.name)}</a></h2><p>${e(b.summary)}</p><p class="muted">${e(countries.slice(0,3).join(' · ')||'Country not recorded')}${ended.length?' · End date reported: '+e(ended.join(', ')):''}</p><small>${e(depthLabels[b.depth])}</small></article>`;
}
// Materials named word for word in an entry's catalog description, product or type statements. Down and
// feather are skipped because the words also occur in unrelated phrases.
const namedMaterials=materials.filter(m=>m.family!=='Brands & technologies'&&!['down','feather'].includes(m.id)).map(m=>[m,new RegExp('\\b'+m.name.replace(/[.*+?^${}()|[\]\\/]/g,'\\$&')+'\\b','i')]);
export function materialsNamed(b){
 const text=[b.summary,...b.facts.filter(f=>f.field==='products'||f.field==='type').map(f=>f.value)].join(' ');
 return namedMaterials.filter(([,re])=>re.test(text)).map(([m])=>m);
}
// Other entries in the same category, preferring a shared country association, then alphabetical neighbours.
const byCategory=new Map();
for(const x of [...brandDirectory].sort((x,y)=>x.name.localeCompare(y.name,'en')))byCategory.set(x.category,[...(byCategory.get(x.category)||[]),x]);
export function relatedBrands(b,limit=10){
 const same=byCategory.get(b.category)||[],i=same.findIndex(x=>x.id===b.id);
 const ordered=[...same.slice(i+1),...same.slice(0,Math.max(i,0))],countries=new Set(factValues(b,'country'));
 const shared=countries.size?ordered.filter(x=>factValues(x,'country').some(c=>countries.has(c))):[];
 return [...new Set([...shared,...ordered])].slice(0,limit);
}
export function brandBody(b,{profileLink,readingLink,materialHref,brandHref}={}){
 const labels={inception:'Inception year reported',dissolved:'Dissolution year reported',founder:'Founder',country:'Country association',headquarters:'Headquarters reported',products:'Products reported',type:'Entity classification'};
 const stated=Object.keys(labels).filter(field=>b.facts.some(f=>f.field===field));
 const facts=`<section><h2>Catalog statements</h2>${stated.length?`<div class="fact-box">${stated.map(field=>`<div class="fact-row"><small>${labels[field]}</small>${b.facts.filter(f=>f.field===field).map(f=>`${e(f.value)} <a href="${e(f.source)}" rel="noopener noreferrer">[Wikidata]</a>`).join('<br>')}</div>`).join('')}</div>`:'<p class="muted">No dated, place or product statements were imported for this entry.</p>'}</section>`;
 const profile=b.profileId?byId[b.profileId]:null,base=profile?.base?byId[profile.base]:null;
 const named=materialsNamed(b).filter(m=>m.id!==base?.id),href=id=>materialHref?materialHref(id):null,link=(m,text=m.name)=>href(m.id)?`<a href="${e(href(m.id))}">${e(text)}</a>`:e(text);
 const material=base?`<section><h2>Underlying material: ${link(base)}</h2><p>The atlas profile for ${e(b.name)} links it to ${e(base.name)} as its underlying material. A brand or product name does not change the generic fiber named on a label.</p><div class="fact-box">${profile.type?`<div class="fact-row"><small>Atlas profile type</small>${e(profile.type)}</div>`:''}<div class="fact-row"><small>Composition</small>${e(base.composition)}</div><div class="fact-row"><small>Feel</small>${e(base.feel)}</div><div class="fact-row"><small>Typical uses</small>${e(base.uses)}</div></div>${profile.question?`<h3>A question to ask at the label</h3><p>${e(profile.question)}</p>`:''}</section>`:'';
 const namedHTML=named.length?`<section><h2>Materials named in this record</h2><p>These atlas profiles match words in the catalog description or product statements above. A match does not show what this business uses or makes today.</p><ul class="source-links">${named.map(m=>`<li>${link(m)}<small>${e(m.tagline||m.composition)}</small></li>`).join('')}</ul></section>`:'';
 const related=relatedBrands(b),relatedHTML=related.length?`<section><h2>More in ${e(b.category)}</h2><ul class="directory-index">${related.map(x=>`<li>${brandHref?`<a href="${e(brandHref(x.id))}">${e(x.name)}</a>`:e(x.name)}<small>${e(factValues(x,'country').slice(0,2).join(' · ')||depthLabels[x.depth])}</small></li>`).join('')}</ul></section>`:'';
 const websites=b.facts.filter(f=>f.field==='website');
 return `<div class="eyebrow">${e(b.category)}</div><h1>${e(b.name)}</h1><p class="definition-lead">${e(b.summary)}</p>
<p class="muted">${e(depthLabels[b.depth])} · Snapshot ${e(b.retrieved)}${readingLink?` · <a href="${e(readingLink)}">Reading edition</a>`:''}</p>
${profileLink?`<p><a class="button" href="${e(profileLink)}">Read the full textile profile</a></p>`:''}
<div class="reading">${b.history?`<section><h2>Textile context</h2><p>${e(b.history)}</p></section>`:''}
${b.findings?.length?`<section><h2>Producer research notes</h2>${b.findings.map(f=>`<p>${e(f.text)} <a href="${e(f.url)}">${e(f.title)}</a></p>`).join('')}</section>`:''}
<div class="notice">${b.depth==='catalog'?'This is a structured catalog record. Its statements have not been independently checked against primary sources.':'Company sources describe the producer’s own history and products. They do not independently verify environmental or performance claims.'} ${b.facts.length?'Dates and places below are reported by Wikidata and may describe different periods or entities. ':''}An absent end date does not establish that a business is still trading. Country and headquarters do not establish manufacturing or fiber origin.</div>
${facts}${material}${namedHTML}<section><h2>Sources & further research</h2><ul class="source-links">${b.sources.map(s=>`<li><a href="${e(s.url)}" rel="noopener noreferrer">${e(s.title)}</a><small>${e(s.kind)}</small></li>`).join('')}${websites.map(f=>`<li><a href="${e(f.value)}" rel="noopener noreferrer">Website listed by Wikidata</a> <a href="${e(f.source)}">[record]</a><small>Destination and current ownership have not been verified.</small></li>`).join('')}</ul>
${b.research.length?`<h3>Company reading trail</h3><p>These linked pages were fetched during discovery. Their presence is not a verification of all statements on the page.</p><ul>${b.research.map(s=>`<li><a href="${e(s.url)}" rel="noopener noreferrer">${e(s.title)}</a></li>`).join('')}</ul>`:''}
${b.siteCheck?`<p class="muted">Automated company-site check: ${e(b.siteCheck)}. A fetched page is not a complete editorial review.</p>`:''}</section>
<section><h2>Open research questions</h2><ul>${!factValues(b,'inception').length?'<li>What primary source documents the business or label’s founding, and is that distinct from earlier family activity?</li>':''}${!factValues(b,'founder').length?'<li>Who founded this business or label, and which source identifies them?</li>':''}<li>Which current products document their fiber percentages, yarn and fabric construction?</li><li>Which manufacturing stages take place in owned facilities, and which are contracted out?</li><li>Which product-specific sources substantiate sourcing, traceability or certification claims?</li><li>Do historical names, ownership changes or closures affect the identity of this entry?</li></ul></section>
${relatedHTML}</div>`;
}
