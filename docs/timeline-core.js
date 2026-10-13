(function(root){
'use strict';
function clampYear(data,value){const n=Number(value);return Number.isFinite(n)?Math.max(data.minYear,Math.min(data.maxYear,Math.round(n))):data.minYear;}
function ownerAt(data,city,year,approximate=false){
 year=clampYear(data,year);
 if(city.kind==='battlefield')return {faction:'unknown',change:null,inherited:false,regimes:[],basis:'battlefield'};
 const eligible=city.changes.filter(x=>x.year<=year&&(approximate||x.certainty!=='approximate'));
 const change=eligible[eligible.length-1]||null;let faction=change?.faction||'unknown';const regimes=[];
 for(const r of data.regimeChanges)if(r.year<=year&&r.year>=(change?.year??data.minYear)&&r.from===faction){faction=r.to;regimes.push(r);}
 return {faction,change,inherited:!!change&&year>change.year,regimes,basis:change?.certainty==='approximate'?'approximate':change?'recorded':'unrecorded'};
}
function snapshot(data,year,approximate=false){year=clampYear(data,year);return data.cities.map(city=>({city,...ownerAt(data,city,year,approximate)}));}
function eventWindow(data,year,mode='near',query='',faction='',approximate=false){
 year=clampYear(data,year);const term=query.trim().toLowerCase();
 return data.events.filter(e=>{
  const city=data.cities.find(c=>c.id===e.city),owner=ownerAt(data,city,year,approximate);
  const inTime=mode==='all'?true:mode==='past'?e.year<=year:mode==='year'?e.year===year:e.year<=year&&year-e.year<=3;
  return inTime&&(!faction||owner.faction===faction)&&(!term||[e.title,e.titleEn,e.summary,e.summaryEn,...e.people,city.zh,city.en].join(' ').toLowerCase().includes(term));
 }).sort((a,b)=>a.year-b.year||a.id.localeCompare(b.id));
}
function adjacentYear(data,year,direction){const years=[...new Set(data.events.map(e=>e.year))].sort((a,b)=>a-b);return direction>0?(years.find(y=>y>year)??data.maxYear):([...years].reverse().find(y=>y<year)??data.minYear);}
function projection(lon,lat){return [70+(lon-98)*35,35+(43-lat)*32];}
function validate(data){
 const cities=new Set(),events=new Set(),factions=new Set(data.factions.map(f=>f.id));
 for(const c of data.cities){if(cities.has(c.id))throw Error('Duplicate city');cities.add(c.id);if(!Number.isFinite(c.lon)||!Number.isFinite(c.lat))throw Error('Invalid coordinate');}
 for(const e of data.events){if(events.has(e.id))throw Error('Duplicate event');events.add(e.id);if(!cities.has(e.city)||e.year<data.minYear||e.year>data.maxYear)throw Error('Invalid event');if(!e.source?.id.startsWith('SGZ-')||e.source.layer!=='正文'||!e.source.text.includes(e.source.needle))throw Error('Missing primary evidence');}
 for(const c of data.cities){let previous=-Infinity;for(const x of c.changes){if(x.year<previous||!factions.has(x.faction)||(x.event&&!events.has(x.event)))throw Error('Invalid change');previous=x.year;}}
 for(const r of data.regimeChanges)if(!events.has(r.event)||!factions.has(r.from)||!factions.has(r.to))throw Error('Invalid regime');return true;
}
root.TimelineCore={clampYear,ownerAt,snapshot,eventWindow,adjacentYear,projection,validate};
if(typeof module!=='undefined'&&module.exports)module.exports=root.TimelineCore;
})(globalThis);
