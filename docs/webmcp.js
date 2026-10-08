(()=>{
'use strict';
const D=globalThis.SANGUO_DATA,H=globalThis.SanguoCore,I=globalThis.SG_I18N;
const cities=D.cities.map((c,i)=>({id:c[0],name:c[1],nameEnglish:I.cities[i],province:c[2],ancientNames:c[3],scope:c[4]}));
const city=x=>D.cities.find(c=>c[0]===x)||H.resolveCity(x)||D.cities.find((c,i)=>I.cities[i].toLowerCase()===String(x).trim().toLowerCase());
const text=(v,label,max=120)=>{if(typeof v!=='string'||!v.trim()||v.length>max)throw Error('Invalid '+label);return v.trim();};
const findCity=x=>{const c=city(text(x,'city'));if(!c)throw Error('City not in the public catalog');return c;};
const integer=(x,def,max)=>{if(x===undefined)return def;if(!Number.isInteger(x)||x<0||x>max)throw Error('Invalid pagination');return x;};
const record=r=>({id:r[0],book:r[1],materialType:r[3],volumeOrChapter:r[4],title:r[5],candidatePeople:r[8],excerpt:r[13],sourceUrl:r[11],limitations:r[12]});
const object=(properties,required=[])=>({type:'object',properties,required,additionalProperties:false});
const str={type:'string',minLength:1,maxLength:120};
const make=(name,description,inputSchema,fn,readOnly=true)=>({name,description,inputSchema,annotations:{readOnlyHint:readOnly,untrustedContentHint:true,consequentialHint:false},execute:async args=>{
 try{if(!args||typeof args!=='object'||Array.isArray(args))throw Error('Expected an object');for(const k of Object.keys(args))if(!(k in inputSchema.properties))throw Error('Unknown input field');return {content:[{type:'text',text:JSON.stringify(fn(args))}]};}
 catch(e){return {isError:true,content:[{type:'text',text:e.message}]};}
}});
const tools=[
 make('sanguo_list_cities','List public modern cities and ancient-name mapping limitations. Does not read personal trip records.',object({}),()=>({cities,sourcePage:new URL('cities.html',location.href).href})),
 make('sanguo_search_sources','Find public Chinese historical or novel passages for a city. Matches are candidate place mentions, not confirmed event locations. Returns source URLs and record IDs.',object({city:str,book:{type:'string',enum:['SGZ','SGY','all']},query:{type:'string',maxLength:120},offset:{type:'integer',minimum:0,maximum:6040},limit:{type:'integer',minimum:1,maximum:20}},['city']),a=>{
  const c=findCity(a.city),book=a.book||'all';if(!['all','SGZ','SGY'].includes(book))throw Error('Unknown book');if(a.query!==undefined&&(typeof a.query!=='string'||a.query.length>120))throw Error('Invalid query');const q=(a.query||'').trim();
  const limit=integer(a.limit,10,20),offset=integer(a.offset,0,6040);if(limit<1)throw Error('Limit must be positive');
  const rows=D.relations.filter(r=>r[1]===c[0]&&(book==='all'||r[3]===book)).map(r=>D.master[r[5]-5]).filter(r=>!q||[r[5],r[8],r[10]].some(v=>v.includes(q)));
  return {city:c[1],total:rows.length,offset,records:rows.slice(offset,offset+limit).map(record),limitations:c[4]};
 }),
 make('sanguo_get_source','Read one public source record by its ID. Returns original Chinese text, provenance and limitations. Long passages are explicitly truncated at 12,000 characters.',object({id:str},['id']),a=>{const r=D.master.find(r=>r[0]===text(a.id,'id'));if(!r)throw Error('Source ID not found');return {...record(r),originalText:r[10].slice(0,12000),originalLength:r[10].length,truncated:r[10].length>12000};}),
 make('sanguo_list_museum_objects','List public museum objects or sites for a city, distinguishing Three Kingdoms-era material from later commemorations. Verify current exhibition with the museum.',object({city:str},['city']),a=>{const c=findCity(a.city);return {city:c[1],objects:D.museum.filter(r=>r[0]===c[0]).map(r=>({museum:r[2],name:r[3],period:r[4],relationship:r[5],originalSite:r[6],limitations:r[7],sourceUrl:r[8],verifiedDate:r[9]}))};}),
 make('sanguo_build_rail_query','Build official 12306 query URLs from exact official Chinese station names and a future/current travel date. Does not open a page, log in, buy tickets, or retrieve live fares or availability.',object({fromStation:str,toStation:str,date:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}$'},seat:{type:'string',enum:['二等座','一等座','商务座','动卧','不限']}},['fromStation','toStation','date']),a=>{if(a.seat&&!['二等座','一等座','商务座','动卧','不限'].includes(a.seat))throw Error('Invalid seat preference');const r=H.railModel(text(a.fromStation,'fromStation'),text(a.toStation,'toStation'),text(a.date,'date'),a.seat);if(r.error)throw Error(r.error);return {fromStation:r.a[0],toStation:r.b[0],date:r.date,officialUrl:r.url,transferUrl:'https://kyfw.12306.cn/otn/lcQuery/init',liveAvailability:false,seatPreferenceApplied:false};}),
 make('sanguo_prepare_trip_draft','Fill an unsaved trip-journal draft using the supplied city and place. Opens the form for the user to review and press Save. Does not read, return or save personal journal records, overwrite an existing draft, or import files.',object({city:str,place:{type:'string',minLength:1,maxLength:120}},['city','place']),a=>{const c=findCity(a.city),place=text(a.place,'place');return globalThis.SanguoUI.prepareTripDraft(c[0],place);},false)
];
globalThis.SanguoPublicTools=tools;
async function register(){
 const status=document.getElementById('ai-tool-status');
 const context=(typeof document!=='undefined'&&document.modelContext)||(typeof navigator!=='undefined'&&navigator.modelContext);
 if(!context||typeof context.registerTool!=='function'){if(status)status.textContent='此瀏覽器尚未提供 AI 網站工具介面；一般查詢功能可正常使用。 This browser does not expose site tools; regular controls remain available.';return;}
 let count=0;for(const t of tools){try{await context.registerTool(t);count++;}catch(e){/* A registration failure must not disable the human interface. */}}
 if(status)status.textContent=count===tools.length?'6 個 AI 工具已啟用。草稿需由您確認儲存。 Six site tools are ready. Drafts require you to press Save.':'部分 AI 工具未能啟用，請使用一般查詢介面。 Some site tools could not register; use the regular controls.';
}
if(typeof document!=='undefined')register();
})();
