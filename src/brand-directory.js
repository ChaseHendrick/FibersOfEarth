import dataset from './data/brand-directory.json' with {type:'json'};
import {createIndex} from './search.js';
export const directoryDate=dataset.retrieved;
export const depthLabels={profile:'Textile profile',reference:'Producer references',catalog:'Catalog research'};
export const brandDirectory=dataset.entries;
export const directoryById=Object.fromEntries(brandDirectory.map(b=>[b.id,b]));
export const factValues=(b,field)=>[...new Set(b.facts.filter(f=>f.field===field).map(f=>f.value))];
export const directoryCategories=[...new Set(brandDirectory.map(b=>b.category))].sort();
export const directoryCountries=[...new Set(brandDirectory.flatMap(b=>factValues(b,'country')))].sort();
const index=createIndex(brandDirectory.map(b=>({...b,country:factValues(b,'country'),products:factValues(b,'products'),founder:factValues(b,'founder')})),{name:10,aliases:8,summary:2,category:2,country:2,products:3,founder:2});
export function searchBrands({q='',category='',country='',depth='',history='',savedIds=null}={}){
 return index.search(q).map(r=>directoryById[r.doc.id]).filter(b=>(!savedIds||savedIds.includes(b.id))&&(!category||b.category===category)&&(!country||factValues(b,'country').includes(country))&&(!depth||b.depth===depth)&&(!history||(history==='ended'?factValues(b,'dissolved').length>0:factValues(b,'dissolved').length===0)));
}
export function directoryPage(options={},requestedPage=1,size=24){
 const results=searchBrands(options),pages=Math.max(1,Math.ceil(results.length/size));
 const n=Number(requestedPage),page=Number.isFinite(n)?Math.max(1,Math.min(pages,Math.trunc(n))):1;
 return {entries:results.slice((page-1)*size,page*size),total:results.length,page,pages};
}
