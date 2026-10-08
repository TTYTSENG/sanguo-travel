const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'../docs'),ctx=vm.createContext({console});
for(const f of ['data.js','travel-schema.js','history-core.js','travel-core.js','i18n.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const {SANGUO_DATA:D,SanguoCore:H,TravelCore:F,TRAVEL_SCHEMA:S,SG_I18N:I}=ctx;
assert.equal(D.cities.length,I.cities.length);assert.equal(D.cities.length,I.scope.length);assert.equal(D.museum.length,I.museum.length);assert.equal(S.length,I.fieldEn.length);
for(const r of D.relations){assert.equal(D.master[r[5]-5][0],r[6]);assert(D.cities.some(c=>c[0]===r[1]));}
assert.equal(H.resolveCity('成都市')[0],'C001');assert.equal(H.stationFor('成都東')[0],'成都东');
for(const c of D.cities)for(const book of ['SGZ','SGY']){const p=H.eventPage(c[0],book,1);assert(p.rows.every(r=>r.record));}
assert.equal(H.eventPage('C001','SGZ',1).count,109);
assert.equal(H.eventPage('C001','SGY',1).count,103);
assert(H.railModel('成都东','重庆西','2099-01-01').url.startsWith('https://kyfw.12306.cn/'));
assert(H.railModel('成都东','成都东','2099-01-01').error);assert(H.railModel('成都东','重庆西','2026-02-30').error);
const r=F.normalize({id:'test',city:'成都',place:'博物館',status:'已到訪',museum:'館',currency:'人民幣',transportCost:20.1,ticketCost:10.2,updated:'2026-10-08T10:00'});
assert.equal(r.total,30.3);assert.equal(F.summary([r,r]).cities,1);assert.equal(F.summary([r,r]).museums,1);
assert.throws(()=>F.normalize({...r,ticketCost:-1}));assert.throws(()=>F.normalize({...r,date:'2026-02-30'}));
assert.equal(F.merge([r],[{...r,updated:'2026-10-08T11:00',place:'新景點'}])[0].place,'新景點');
assert(F.csv([{...r,thoughts:'=HYPERLINK("bad")'}]).includes("'=HYPERLINK"));
for(const asset of JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'))).icons)assert(fs.existsSync(path.join(root,asset.src)));
console.log('Passed: relationship integrity, bilingual catalogs, rail validation, journal costs, backup merging and CSV formula escaping.');

