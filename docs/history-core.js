(()=>{
'use strict';
const D=globalThis.SANGUO_DATA;
const cities=new Map(D.cities.map(r=>[r[0],r]));
const alias=new Map(D.aliases);
const stationMap=new Map(D.stations.map(r=>[r[0],r]));
const relations=new Map();
for(const r of D.relations){const key=r[1]+'_'+r[3];if(!relations.has(key))relations.set(key,[]);relations.get(key).push(r);}
const pairs=[['臺','台'],['東','东'],['長','长'],['陽','阳'],['慶','庆'],['漢','汉'],['廣','广'],['寧','宁'],['鎮','镇'],['蘇','苏'],['遼','辽'],['運','运'],['臨','临'],['鄭','郑'],['關','关'],['門','门'],['縣','县'],['陝','陕'],['連','连'],['齊','齐'],['爾','尔'],['龍','龙'],['烏','乌'],['蘭','兰'],['錫','锡'],['興','兴'],['紹','绍'],['綿','绵'],['淵','渊'],['義','义'],['橋','桥'],['張','张'],['淮','淮'],['島','岛'],['頭','头'],['雙','双'],['樂','乐'],['灣','湾'],['莊','庄'],['豐','丰'],['嶺','岭'],['壽','寿'],['紅','红'],['廈','厦'],['棗','枣'],['閩','闽'],['諸','诸'],['黃','黄'],['滄','沧'],['許','许'],['譙','谯'],['郟','郏'],['濟','济'],['鄒','邹'],['銅','铜']];
const simplify=s=>pairs.reduce((v,[a,b])=>v.split(a).join(b),String(s||'')).trim().replace(/\s+/g,'');
const resolveCity=s=>cities.get(alias.get(String(s||'').trim().replace(/\s+/g,''))||alias.get(simplify(s)));
const stationFor=s=>stationMap.get(simplify(s));
const today=()=>{const x=new Date();return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');};
function railModel(from,to,date,seat='二等座'){
 const a=stationFor(from),b=stationFor(to);
 if(!a)return {error:'出發站未命中官方清單，請從建議站名選取。'};
 if(!b)return {error:'到達站未命中官方清單，請從建議站名選取。'};
 if(a[1]===b[1])return {error:'出發站與到達站相同，請修改。'};
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date+'T00:00:00Z'))||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date)return {error:'請輸入有效乘車日期。'};
 if(date<today())return {error:'乘車日期已過，請改為欲查詢日期。'};
 return {a,b,date,seat,city:cities.get(b[5]),url:'https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc&fs='+encodeURIComponent(a[0])+','+a[1]+'&ts='+encodeURIComponent(b[0])+','+b[1]+'&date='+date+'&flag=N,N,Y'};
}
function eventPage(id,book,page){
 const all=relations.get(id+'_'+book)||[],max=Math.max(1,Math.ceil(all.length/10));
 const current=Math.min(max,Math.max(1,Number(page)||1));
 return {count:all.length,max,page:current,rows:all.slice((current-1)*10,current*10).map(r=>({relation:r,record:D.master[r[5]-5]}))};
}
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const serial=x=>new Date(Math.round((x-25569)*86400000)).toISOString().slice(0,16).replace('T',' ');
globalThis.SanguoCore={resolveCity,stationFor,railModel,eventPage,simplify,serial};
})();
