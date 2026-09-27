import {weaveById, weaveReviewed} from './weaves.js';
import {escapeHTML as e} from './glossary-render.js';

const safeColor = (value, fallback) => /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback;
const dark = '#294e3c', light = '#eeeadd', gold = '#a57437';
const rect = (x,y,w,h,fill,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
export function weaveSwatch(entry, {structure = false, decorative = false} = {}) {
  const visual = entry.visual, size = 240;
  let drawing = rect(0, 0, size, size, light);
  if (visual.kind === 'draft') {
    const rows = visual.draft, cols = rows[0].length;
    const count = Math.max(16, Math.ceil(16 / Math.max(rows.length, cols)) * Math.max(rows.length, cols));
    const cell = size / count;
    for (let y = 0; y < count; y++) for (let x = 0; x < count; x++) {
      const over = rows[y % rows.length][x % cols] === '1';
      const warp = structure ? dark : safeColor(visual.warp?.[x % visual.warp.length], dark);
      const weft = structure ? gold : safeColor(visual.weft?.[y % visual.weft.length], light);
      drawing += rect(x*cell, y*cell, cell+.1, cell+.1, over ? weft : warp);
      drawing += over ? rect(x*cell+cell*.09, y*cell, cell*.82, cell+.1, warp) : rect(x*cell, y*cell+cell*.09, cell+.1, cell*.82, weft);
    }
  } else {
    const motif = visual.motif, id = entry.id;
    const background = safeColor(visual.colors?.[0], light), ink = safeColor(visual.colors?.[1], dark), accent = safeColor(visual.colors?.[2], gold);
    drawing = rect(0,0,240,240,background);
    if (motif === 'stripe') {
      const thin = /pin|pencil|chalk/.test(id), broad = /awning|bengal/.test(id);
      const step = thin ? 26 : /awning/.test(id) ? 64 : broad ? 32 : 24;
      const width = thin ? (/chalk/.test(id) ? 3 : 1.5) : step/2;
      if (/regimental/.test(id)) {
        drawing += '<g transform="rotate(-45 120 120)">';
        for(let x=-240;x<480;x+=52) drawing+=rect(x,-240,18,720,ink)+rect(x+23,-240,4,720,accent);
        drawing += '</g>';
      } else for (let x = 0; x < 240; x += step) {
        if (/ticking/.test(id)) drawing+=rect(x,0,4,240,ink)+rect(x-4,0,1,240,ink)+rect(x+7,0,1,240,ink);
        else drawing += /breton/.test(id) ? rect(0,x,240,7,ink) : rect(x,0,width,240,ink);
      }
    } else if (motif === 'check') {
      const grid = /window|tattersall/.test(id), plaid = /tartan|madras|glen|gun-club/.test(id);
      const step = /buffalo/.test(id) ? 60 : grid ? 48 : 24;
      if (grid) for (let x = 0; x < 240; x += step) {
        const color = /tattersall/.test(id) && x/step%2 ? accent : ink;
        drawing += rect(x,0,2,240,color)+rect(0,x,240,2,color);
      } else for (let y=0;y<240;y+=step) for (let x=0;x<240;x+=step) {
        drawing += rect(x,y,step,step,((x/step)%2 && (y/step)%2) ? ink : ((x/step+y/step)%2 ? safeColor(visual.colors?.[2],'#a5b39e') : background));
      }
      if (plaid) for (let x=12;x<240;x+=72) drawing += rect(x,0,3,240,accent)+rect(0,x,240,3,accent);
    } else if (motif === 'dot') {
      for(let y=18;y<240;y+=36) for(let x=18+(y/36%2>.5?18:0);x<240;x+=36) drawing+=`<circle cx="${x}" cy="${y}" r="${/pin/.test(id)?2:6}" fill="${ink}"/>`;
    } else if (motif === 'chevron') {
      for(let y=-32;y<270;y+=40) drawing+=`<path d="M-20 ${y}l40 24 40-24 40 24 40-24 40 24 40-24 40 24" fill="none" stroke="${ink}" stroke-width="13"/>`;
    } else if (motif === 'diamond') {
      if(id==='harlequin')drawing+='<g transform="translate(0,-80) scale(1,1.8)">';
      for(let y=-60;y<300;y+=80) for(let x=-40;x<280;x+=80) drawing+=`<path d="M${x+40} ${y}l40 40-40 40-40-40z" fill="${((x+40)/80+(y+60)/80)%2 ? ink : accent}"/>`;
      if (/argyle/.test(id)) for(let x=-240;x<480;x+=80) drawing+=`<path d="M${x} 0l240 240M${x} 0l-240 240" stroke="${light}" stroke-width="1.5" fill="none"/>`;
      if(id==='harlequin')drawing+='</g>';
    } else if (motif === 'floral' || motif === 'paisley') {
      const spacing = /ditsy/.test(id) ? 42 : 72;
      for(let y=12;y<240;y+=spacing) for(let x=16;x<240;x+=spacing) {
        if(id==='botanical') drawing+=`<path d="M${x+22} ${y+60}q-10-30 1-57m-3 25q-23-20-16-5 4 10 16 5m1 16q25-28 22-9-5 11-22 9" fill="none" stroke="${ink}" stroke-width="2"/>`;
        else if(id==='arabesque') drawing+=`<path d="M${x+20} ${y-12}c-40 20 40 25 0 45-30 15 30 15 0 40m0-55c25-22 31 10 5 5m-5 24c-26-20-32 10-4 4" fill="none" stroke="${ink}" stroke-width="2"/>`;
        else if(motif==='paisley') drawing+=`<path d="M${x+28} ${y+2}c-35-8-33 52-6 52 27 0 29-42 6-52zm-9 16c13 0 17 24 3 27-15 2-17-24-3-27z" fill="${ink}" fill-rule="evenodd"/>`;
        else drawing+=`<path d="M${x+22} ${y+59}q-5-30 0-47m0 26q-23-21-18 0m18 7q22-24 20-4" fill="none" stroke="${ink}" stroke-width="2"/><g fill="${ink}"><circle cx="${x+22}" cy="${y+12}" r="7"/><circle cx="${x+14}" cy="${y+18}" r="7"/><circle cx="${x+30}" cy="${y+18}" r="7"/><circle cx="${x+22}" cy="${y+24}" r="7"/></g><circle cx="${x+22}" cy="${y+18}" r="4" fill="${accent}"/>`;
      }
    } else if (motif === 'loops') {
      for(let y=-12;y<240;y+=28) for(let x=8;x<240;x+=24) drawing+=`<path d="M${x} ${y}q-13 17 0 26 13-9 0-26m0 26v5" fill="none" stroke="${ink}" stroke-width="3"/>`;
    } else if (motif === 'animal') {
      for(let y=-10;y<240;y+=48) for(let x=8;x<240;x+=58) {
        if(id==='camouflage') drawing+=`<path d="M${x} ${y}c20-10 15 12 34 8 29-3 27 29 1 25-15-2-4 28-30 16-27-12-30-30-5-49z" fill="${(x+y)%3 ? ink : accent}"/>`;
        else drawing+= /zebra/.test(id) ? `<path d="M${x} ${y}q20 15-4 47l17-4q18-27 1-47z" fill="${ink}"/>` : `<path d="M${x} ${y+12}q-9 22 13 22 21-4 15-20-12-17-28-2z" fill="none" stroke="${ink}" stroke-width="6"/>`;
      }
    } else if (motif === 'geometric') {
      for(let y=0;y<240;y+=48) for(let x=0;x<240;x+=48) {
        if (/greek/.test(id)) drawing+=`<path d="M${x} ${y+6}h40v34h-30v-23h19v12" stroke="${ink}" stroke-width="5" fill="none"/>`;
        else if(id==='quatrefoil') drawing+=`<path d="M${x+24} ${y+12}c-16-21-29 13-12 12-21 16 13 29 12 12 16 21 29-13 12-12 21-16-13-29-12-12z" fill="none" stroke="${ink}" stroke-width="2"/>`;
        else if(id==='ogee') drawing+=`<path d="M${x+24} ${y}c0 14-24 10-24 24s24 10 24 24c0-14 24-10 24-24s-24-10-24-24z" fill="none" stroke="${ink}" stroke-width="2"/>`;
        else if(id==='trellis') drawing+=`<path d="M${x+24} ${y}l24 24-24 24-24-24z" fill="none" stroke="${ink}" stroke-width="3"/>`;
        else if(id==='medallion') drawing+=`<circle cx="${x+24}" cy="${y+24}" r="17" fill="none" stroke="${ink}" stroke-width="2"/><path d="M${x+24} ${y+10}l6 8 8 6-8 6-6 8-6-8-8-6 8-6z" fill="${accent}"/>`;
        else if(id==='toile-de-jouy') drawing+=`<path d="M${x} ${y+42}q20-14 48-1m-20-3v-17l10-7 9 7v17zm-3-17h25M${x+8} ${y+35}v-20m0 0c-18 9 18 16 1-10-12 15 9 19 3 5" fill="none" stroke="${ink}" stroke-width="1.2"/>`;
        else if(id==='tie-dye'||id==='shibori') drawing+=`<circle cx="${x+24}" cy="${y+24}" r="17" fill="none" stroke="${ink}" stroke-width="7"/><circle cx="${x+24}" cy="${y+24}" r="6" fill="none" stroke="${accent}" stroke-width="3"/>`;
        else drawing+=`<path d="M${x+24} ${y+4}l20 20-20 20-20-20z" stroke="${ink}" stroke-width="2" fill="none"/><circle cx="${x+24}" cy="${y+24}" r="5" fill="${accent}"/>`;
      }
    } else {
      // A surface symbol for techniques with no single repeat, not a fabric photograph.
      for(let y=8;y<240;y+=14) for(let x=4;x<240;x+=24) drawing+=`<path d="M${x} ${y}q8-8 16 0" stroke="${ink}" stroke-opacity=".55" stroke-width="2" fill="none"/>`;
    }
  }
  return `<svg class="weave-swatch" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" ${decorative ? 'aria-hidden="true"' : `role="img" aria-label="${e(entry.name)}: ${entry.visual.kind==='draft'?'illustrative interlacing diagram':'symbolic pattern study'}"`}>${drawing}</svg>`;
}
export function weaveVisualCaption(entry) {
  if (entry.visual.kind === 'draft') return 'Illustrative face of a repeating weave. Warp runs vertically; weft runs horizontally. Colors, yarn thickness and spacing are examples, not a production specification.';
  if (entry.category === 'Knit structure') return 'Symbolic loop study, not a stitch chart. The text explains this construction; actual loop paths and surfaces vary.';
  if (['Textile technique','Surface & finish'].includes(entry.category)) return 'A symbolic surface study. This technique has no single fixed pattern; this is not a construction diagram or photograph.';
  return 'Schematic motif family, not an exact swatch or registered design. Color, scale and repeats vary; closely related names can overlap in trade use.';
}
export function weaveCard(entry, {selected=false} = {}) {
  return `<article class="pattern-card"><a class="pattern-card-art" href="#/weaves/${entry.id}" tabindex="-1" aria-hidden="true">${weaveSwatch(entry,{decorative:true})}<span class="pattern-preview-label">${entry.visual.kind==='draft'?'Weave diagram':'Schematic study'}</span></a><div class="pattern-card-copy"><div class="eyebrow">${e(entry.category)}</div><h2><a href="#/weaves/${entry.id}">${e(entry.name)}</a></h2><p>${e(entry.summary)}</p><button class="button small" data-weave-compare="${entry.id}" aria-pressed="${selected}">${selected?'Remove from comparison':'Compare'}<span class="sr-only"> ${e(entry.name)}</span></button></div></article>`;
}
export function weaveBody(entry, {link = id => '#/weaves/'+id, structure = false} = {}) {
  const related = [...new Set(entry.related)].filter(id => id !== entry.id && Object.hasOwn(weaveById,id));
  return `<div class="pattern-detail"><figure class="pattern-figure"><div id="pattern-visual">${weaveSwatch(entry,{structure})}</div><figcaption>${e(weaveVisualCaption(entry))}</figcaption></figure><div class="reading"><section><h2>How it is made</h2><p>${e(entry.construction)}</p></section><section><h2>How to recognize it</h2><p>${e(entry.recognize)}</p></section><section><h2>Common uses</h2><ul>${entry.uses.map(use=>`<li>${e(use)}</li>`).join('')}</ul></section><section><h2>What to distinguish</h2><p>${e(entry.distinguish)}</p></section></div></div><section class="reading pattern-sources"><h2>Sources &amp; further reading</h2><p class="muted">Research checked ${weaveReviewed}. Descriptions are original summaries; references support terminology and construction, not every product sold under a name.</p><ul class="source-links">${entry.references.map(ref=>`<li><a href="${e(ref.url)}" target="_blank" rel="noopener noreferrer">${e(ref.title)} ↗</a></li>`).join('')}</ul>${related.length?`<h2>Compare related terms</h2><ul class="pattern-related">${related.map(id=>`<li><a href="${e(link(id))}">${e(weaveById[id].name)}</a></li>`).join('')}</ul>`:''}</section>`;
}
