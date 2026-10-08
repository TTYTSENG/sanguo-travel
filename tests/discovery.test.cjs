const fs=require('node:fs'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const dir=__dirname+'/../docs/';
const original=JSON.parse(fs.readFileSync(dir+'data.js','utf8').split('=').slice(1).join('=').trim().replace(/;$/,''));
assert.deepEqual(JSON.parse(zlib.gunzipSync(fs.readFileSync(dir+'data.json.gz'))),original);
const pages=fs.readdirSync(dir).filter(f=>/^c\d{3}\.html$/.test(f));assert.equal(pages.length,34);
for(const file of [...pages,'index.html']){
 const html=fs.readFileSync(dir+file,'utf8');assert.match(html,/<h1[ >]/);
 for(const [,json]of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs))JSON.parse(json);
}
console.log('Passed gzip equality, 34 static pages, initial headings and JSON-LD syntax.');
