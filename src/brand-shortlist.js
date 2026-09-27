// Shortlists remain on this device. Bad or unavailable storage never blocks reading.
export const brandStorageKey='fibersOfEarth.brands.v1';
export function readBrandShortlist(storage,validIds){
 try{const data=JSON.parse(storage.getItem(brandStorageKey)||'[]');return Array.isArray(data)?[...new Set(data.filter(id=>typeof id==='string'&&validIds.has(id)))]:[];}catch{return [];}
}
export function writeBrandShortlist(storage,ids){try{storage.setItem(brandStorageKey,JSON.stringify(ids));return true;}catch{return false;}}
