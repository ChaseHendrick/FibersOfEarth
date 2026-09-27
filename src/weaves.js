import woven from './data/weaves-woven.json' with {type:'json'};
import patterns from './data/weaves-patterns.json' with {type:'json'};
import knits from './data/weaves-knits.json' with {type:'json'};
import {createIndex} from './search.js';

export const weaveReviewed = '2026-09-27';
export const weaveEntries = [...woven, ...patterns, ...knits].sort((a,b) => a.name.localeCompare(b.name, 'en'));
export const weaveById = Object.fromEntries(weaveEntries.map(entry => [entry.id, entry]));
export const weaveCategories = [...new Set(weaveEntries.map(entry => entry.category))].sort();
let index;
export function findWeaves({q = '', category = ''} = {}) {
  const filter = entry => !category || entry.category === category;
  if (!q.trim()) return weaveEntries.filter(filter);
  index ||= createIndex(weaveEntries, {name: 12, aliases: 8, summary: 3, category: 2, construction: 1, recognize: 1, uses: 1, distinguish: .5});
  return index.search(q, {filter}).map(result => result.doc);
}
export function parseWeaveSelection(value = '') {
  return [...new Set(String(value).split(',').filter(id => Object.hasOwn(weaveById, id)))].slice(0, 3);
}
export function weavePageNumber(value, total, size = 18) {
  const parsed = Number(value);
  return Math.max(1, Math.min(Number.isSafeInteger(parsed) ? parsed : 1, Math.max(1, Math.ceil(total / size))));
}
