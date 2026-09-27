import {weaveEntries, weaveById, weaveCategories, findWeaves, parseWeaveSelection, weavePageNumber} from './weaves.js';
import {weaveCard, weaveBody, weaveSwatch} from './weaves-render.js';
import {escapeHTML as e} from './glossary-render.js';

export function mountWeaves(root, route, {title, setQuery, notFound}) {
  const $ = selector => root.querySelector(selector);
  if (route.id) {
    if (!Object.hasOwn(weaveById, route.id)) return notFound('This weave or pattern is not in the guide.');
    const entry = weaveById[route.id];
    title(entry.name + ' | Weaves & patterns');
    root.innerHTML = `<article class="page pattern-article"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="#/weaves">Weaves &amp; patterns</a><span> / ${e(entry.name)}</span></nav><header class="pattern-heading"><div class="eyebrow">${e(entry.category)}</div><h1>${e(entry.name)}</h1><p class="definition-lead">${e(entry.summary)}</p>${entry.aliases.length?`<p class="muted">Also searched as: ${entry.aliases.map(e).join(', ')}</p>`:''}<div class="actions"><a class="button small" href="weaves/${entry.id}/index.html">Reading edition ↗</a><a class="button small" href="#/weaves?compare=${entry.id}">Compare with another pattern</a><button class="button small" data-action="share">Share this view</button></div></header>${entry.visual.kind==='draft'?`<fieldset class="pattern-view-options"><legend>View the weave</legend><label><input type="radio" name="pattern-view" value="color" checked> Example cloth colors</label><label><input type="radio" name="pattern-view" value="structure"> Warp and weft contrast</label><span class="muted">In contrast view, green is warp and gold is weft.</span></fieldset>`:''}${weaveBody(entry)}</article>`;
    root.querySelectorAll('[name="pattern-view"]').forEach(input => input.addEventListener('change', () => {
      $('#pattern-visual').innerHTML = weaveSwatch(entry, {structure: input.value === 'structure'});
    }));
    return;
  }
  title('Weaves & patterns');
  let selected = parseWeaveSelection(route.params.get('compare') || '');
  let page = route.params.get('page') || 1;
  root.innerHTML = `<div class="page"><header class="page-intro"><div class="eyebrow">READ THE CLOTH</div><h1>Weaves &amp; patterns.</h1><p>${weaveEntries.length} ways to construct, color and finish cloth. Recognize familiar patterns, learn how they are made, and compare names that are easy to confuse.</p><p class="muted">A growing guide, not a list of every regional name or possible design. Trade names overlap; a pattern alone does not identify the fiber.</p><div class="actions"><a class="text-link" href="weaves/index.html">Reading edition ↗</a><a class="text-link" href="#/weaves?compare=herringbone,houndstooth">Compare herringbone and houndstooth ↗</a><button class="text-link" data-action="share">Share this view</button></div></header><aside class="notice pattern-intro"><strong>Structure, pattern, finish.</strong> A weave describes how yarns cross; a knit describes connected loops. A color pattern can be woven, knitted or printed. A finish changes the surface. The category on each entry tells you which question its name answers.</aside><form class="pattern-filters"><label>Search the guide<input id="pattern-search" type="search" placeholder="Herringbone, houndstooth, paisley…" value="${e(route.params.get('q')||'')}" aria-label="Search weaves and patterns"></label><label>Category<select id="pattern-category" aria-label="Category"><option value="">All categories</option>${weaveCategories.map(category=>`<option value="${e(category)}" ${category===route.params.get('category')?'selected':''}>${e(category)}</option>`).join('')}</select></label><label>Order<select id="pattern-sort"><option value="relevance">Best match / A–Z</option><option value="category" ${route.params.get('sort')==='category'?'selected':''}>Category, then name</option></select></label><button class="button small" type="reset">Reset filters</button></form><div class="pattern-results-heading"><p id="pattern-count" tabindex="-1" class="result-count" role="status"></p><p class="muted">Choose up to three entries to compare.</p></div><div id="pattern-comparison" role="region" aria-label="Pattern comparison"></div><p id="pattern-message" class="sr-only" role="status"></p><div id="pattern-results" class="pattern-grid"></div><nav id="pattern-pagination" aria-label="Weave and pattern pages"></nav></div>`;

  function compare() {
    $('#pattern-comparison').innerHTML = selected.length ? `<section class="pattern-compare"><div class="section-head"><h2>Your comparison</h2><button class="text-link" id="clear-pattern-comparison">Clear comparison</button></div><div class="pattern-compare-grid">${selected.map(id => {
      const entry = weaveById[id];
      return `<article class="pattern-compare-card"><div class="pattern-compare-art">${weaveSwatch(entry,{decorative:true})}</div><div class="eyebrow">${e(entry.category)}</div><h3><a href="#/weaves/${id}">${e(entry.name)}</a></h3><h4>Recognize it</h4><p>${e(entry.recognize)}</p><h4>What to distinguish</h4><p>${e(entry.distinguish)}</p><button class="button small" data-weave-compare="${id}" aria-label="Remove ${e(entry.name)} from comparison">Remove</button></article>`;
    }).join('')}</div><p class="muted">Compare terminology and appearance, not quality ratings. Swatches are schematic; open an entry for its source references and diagram limits.</p></section>` : '';
  }
  function draw(reset = false) {
    const q = $('#pattern-search').value, category = $('#pattern-category').value, sort = $('#pattern-sort').value;
    const matches = findWeaves({q,category});
    if (sort === 'category') matches.sort((a,b)=>a.category.localeCompare(b.category)||a.name.localeCompare(b.name));
    page = weavePageNumber(reset ? 1 : page, matches.length);
    setQuery({q,category,sort:sort==='relevance'?'':sort,page,compare:selected.join(',')});
    $('#pattern-count').textContent = `${matches.length} entries${matches.length ? ` · Page ${page} of ${Math.ceil(matches.length/18)}` : ''}`;
    $('#pattern-results').innerHTML = matches.length ? matches.slice((page-1)*18,page*18).map(entry=>weaveCard(entry,{selected:selected.includes(entry.id)})).join('') : '<div class="empty"><h2>No matching weaves or patterns.</h2><p>Try a broader term or reset the category filter.</p></div>';
    $('#pattern-pagination').innerHTML = matches.length>18 ? `<div class="pagination"><button class="button small" type="button" data-pattern-page="${page-1}" ${page===1?'disabled':''}>Previous</button><span>Page ${page} of ${Math.ceil(matches.length/18)}</span><button class="button small" type="button" data-pattern-page="${page+1}" ${page*18>=matches.length?'disabled':''}>Next</button></div>` : '';
    compare();
  }
  $('.pattern-filters').addEventListener('submit',event=>event.preventDefault());
  $('#pattern-search').addEventListener('input',()=>draw(true));
  $('#pattern-category').addEventListener('change',()=>draw(true));
  $('#pattern-sort').addEventListener('change',()=>draw(true));
  $('.pattern-filters').addEventListener('reset',event=>{
    event.preventDefault(); $('#pattern-search').value=''; $('#pattern-category').value=''; $('#pattern-sort').value='relevance'; draw(true);
  });
  root.addEventListener('click',event=>{
    const button=event.target.closest('[data-weave-compare]');
    if(button){
      const id=button.dataset.weaveCompare;
      if(selected.includes(id))selected=selected.filter(value=>value!==id);
      else if(selected.length<3)selected.push(id);
      else {$('#pattern-message').textContent='Choose up to three entries. Remove one before adding another.';return;}
      const inCard=!!button.closest('.pattern-card');
      draw();
      $('#pattern-message').textContent=`${selected.length} entries in your comparison.`;
      const replacement=root.querySelector(`${inCard?'.pattern-card ':''}[data-weave-compare="${id}"]`);
      if(replacement)replacement.focus();
      else $('#pattern-count').focus();
    }
    if(event.target.closest('#clear-pattern-comparison')){selected=[];draw();$('#pattern-search').focus();}
    const pager=event.target.closest('[data-pattern-page]');
    if(pager){page=pager.dataset.patternPage;draw();$('#pattern-results').scrollIntoView({block:'start'});$('#pattern-results a:not([aria-hidden])')?.focus();}
  });
  draw();
}
