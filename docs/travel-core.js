(()=>{
'use strict';
const schema=globalThis.TRAVEL_SCHEMA, D=globalThis.SANGUO_DATA;
const options={relation:['正史','演義','考古文物','後世紀念','其他'],status:['想去','已規劃','已預約','已到訪','取消'],seen:['待確認','已看到','未展出','展廳關閉'],transport:['高鐵','動車','普鐵','地鐵','公車','步行','計程車','自駕','其他'],booking:['未預約','已預約','無需預約'],currency:['人民幣','新臺幣'],recommend:['推薦','普通','不推薦'],revisit:['願意再訪','不確定','不再訪']};
const costKeys=['transportCost','ticketCost','hotelCost','foodCost','otherCost'];
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cleanCsv=x=>{let s=String(x??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
const sum=r=>costKeys.some(k=>r[k]!==null&&r[k]!==''&&r[k]!==undefined)?Math.round(costKeys.reduce((a,k)=>a+(Number(r[k])||0),0)*100)/100:null;
function normalize(input){
 const r={};for(const [key,,type] of schema){const v=input[key];r[key]=type==='number'?(v===''||v===null||v===undefined?null:Number(v)):String(v??'').slice(0,8000);if(type==='number'&&r[key]!==null&&!Number.isFinite(r[key]))throw Error('數值格式錯誤');}
 if(!r.city.trim()||!r.place.trim())throw Error('請填寫城市與景點名稱');
 for(const k of costKeys)if(r[k]!==null&&r[k]<0)throw Error('費用不可小於零');
 if(r.rating!==null&&(!Number.isInteger(r.rating)||r.rating<1||r.rating>5))throw Error('評分須為1～5的整數');
 if(r.day!==null&&(!Number.isInteger(r.day)||r.day<1))throw Error('行程天數須為正整數');
 for(const [k,vals] of Object.entries(options))if(r[k]&&!vals.includes(r[k]))throw Error('選項格式錯誤：'+k);
 for(const [k,,type] of schema)if((type==='date'||type==='datetime')&&r[k]){const date=r[k].slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date+'T00:00:00Z'))||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date)throw Error('日期格式錯誤');if(type==='datetime'&&!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(r[k]))throw Error('時間格式錯誤');}
 const alias=new Map(D.aliases),city=D.cities.find(c=>c[0]===alias.get(r.city.trim()));r.cityId=city?.[0]||'';if(city){r.city=city[1];r.province=r.province||city[2];r.ancient=r.ancient||city[3];}
 r.total=sum(r);return r;
}
function csv(records){return '\uFEFF'+[schema.map(x=>x[1]),...records.map(r=>schema.map(([k])=>r[k]??''))].map(row=>row.map(cleanCsv).join(',')).join('\r\n');}
function summary(records){const visited=records.filter(r=>r.status==='已到訪');return {count:records.length,cities:new Set(visited.map(r=>r.cityId||r.city)).size,museums:new Set(visited.filter(r=>r.museum.trim()).map(r=>r.city+'|'+r.museum)).size,cny:records.filter(r=>r.currency==='人民幣'&&r.status!=='取消').reduce((a,r)=>a+(sum(r)||0),0),twd:records.filter(r=>r.currency==='新臺幣'&&r.status!=='取消').reduce((a,r)=>a+(sum(r)||0),0)};}
function merge(current, incoming){const map=new Map(current.map(r=>[r.id,r]));for(const r of incoming){if(!r.id)throw Error('備份缺少紀錄ID');if(!map.has(r.id)||String(r.updated)>String(map.get(r.id).updated))map.set(r.id,r);}return [...map.values()].sort((a,b)=>b.updated.localeCompare(a.updated));}
globalThis.TravelCore={normalize,sum,csv,summary,merge};
})();
