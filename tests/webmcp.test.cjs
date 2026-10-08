const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const base=path.join(__dirname,'../docs');
async function run(){
 const registered=[],context={registerTool:async t=>registered.push(t)};
 const ctx=vm.createContext({URL,location:{href:'https://ttytseng.github.io/sanguo-travel/'},document:{modelContext:context,getElementById:()=>null},SanguoUI:{prepareTripDraft:(city,place)=>({draftPrepared:true,saved:false,city,place})}});
 for(const file of ['data.js','history-core.js','i18n.js','webmcp.js'])vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),ctx);
 await new Promise(r=>setImmediate(r));assert.equal(registered.length,6);
 const call=async(name,args)=>{const r=await registered.find(t=>t.name===name).execute(args);return r.isError?r:JSON.parse(r.content[0].text);};
 assert.equal((await call('sanguo_list_cities',{})).cities.length,34);
 assert.equal((await call('sanguo_search_sources',{city:'Chengdu',book:'SGZ',query:''})).total,109);
 assert.equal((await call('sanguo_search_sources',{city:'成都',book:'SGY',limit:1})).records.length,1);
 assert((await call('sanguo_search_sources',{city:'成都',limit:-1})).isError);
 assert((await call('sanguo_search_sources',{city:'成都',query:42})).isError);
 assert((await call('sanguo_search_sources',{city:'<script>alert(1)</script>'})).isError);
 assert((await call('sanguo_get_source',{id:'not-a-record'})).isError);
 assert.equal((await call('sanguo_list_museum_objects',{city:'成都'})).objects.length,3);
 assert.equal((await call('sanguo_build_rail_query',{fromStation:'成都东',toStation:'重庆西',date:'2099-01-01'})).liveAvailability,false);
 assert((await call('sanguo_build_rail_query',{fromStation:'成都东',toStation:'成都东',date:'2099-01-01'})).isError);
 assert.equal((await call('sanguo_prepare_trip_draft',{city:'Chengdu',place:'武侯祠'})).saved,false);
 const legacy=[];ctx.document.modelContext=null;ctx.navigator={modelContext:{registerTool:async t=>legacy.push(t)}};vm.runInContext(fs.readFileSync(path.join(base,'webmcp.js'),'utf8'),ctx);await new Promise(r=>setImmediate(r));assert.equal(legacy.length,6);
 console.log('Passed 6 WebMCP tools, input validation, provenance, unsaved drafts, Document and Navigator registration.');
}
run().catch(e=>{console.error(e);process.exitCode=1;});
