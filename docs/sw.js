const VERSION='2.0.0';
const PREFIX='sanguo-travel:'+self.registration.scope;
const CACHE=PREFIX+':'+VERSION;
const FILES=['./','index.html','style.css','data.js','travel-schema.js','history-core.js','travel-core.js','i18n.js','web.js','icon.svg','icon-192.png','icon-512.png','manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX+':')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||!e.request.url.startsWith(self.registration.scope))return;e.respondWith(fetch(e.request).then(response=>{if(response.ok){const copy=response.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy)));}return response;}).catch(()=>caches.match(e.request).then(cached=>cached||(e.request.mode==='navigate'?caches.match('index.html'):Response.error()))));});
