(()=>{
'use strict';
const load=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>reject(Error('Script load failed'));document.head.append(s);});
(async()=>{
 try{
  if('DecompressionStream' in window){
   try{const r=await fetch('data.json.gz');if(!r.ok||!r.body)throw Error('Data unavailable');globalThis.SANGUO_DATA=JSON.parse(await new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).text());}
   catch(e){await load('data.js');}
  }else await load('data.js');
  for(const s of ['travel-schema.js','history-core.js','travel-core.js','i18n.js','web.js','webmcp.js'])await load(s);
 }catch(e){const el=document.getElementById('loading');el.hidden=false;el.setAttribute('role','alert');el.textContent='互動查詢載入失敗，請重新載入。您仍可使用下方城市資料頁。 Interactive tools could not load. Reload, or use the city source pages below.';}
})();
})();
