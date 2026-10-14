// Rebuild crawlable metadata and public evidence pages after build_discovery.py.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),docs=path.join(root,'docs');
const BASE='https://sanguo-travel.pages.dev/',UPDATED='2026-10-14';
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=f=>fs.readFileSync(path.join(docs,f),'utf8'),write=(f,s)=>fs.writeFileSync(path.join(docs,f),s);
const url=f=>BASE+(f==='index.html'?'':f.replace(/\.html$/,''));
const ld=o=>'<script type="application/ld+json">'+JSON.stringify(o).replace(/</g,'\\u003c')+'</script>';
const timeline=JSON.parse(read('timeline-data.js').split('=').slice(1).join('=').trim().replace(/;$/,''));
const site={'@type':'WebSite','@id':BASE+'#website',name:'三國行旅 Sanguo Travel',url:BASE,inLanguage:['zh-Hant','en']};
const author={'@type':'Person',name:'凸肚男',url:BASE};
function page(title,description,body){return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | 三國行旅</title><meta name="description" content="${esc(description)}"><link rel="stylesheet" href="style.css"></head><body><a class="skip" href="#main">跳至主要內容 <span lang="en">Skip to content</span></a><header><div class="header-inner"><a href="/">三國行旅 <span lang="en">Sanguo Travel</span></a></div></header><main id="main" tabindex="-1"><h1>${esc(title)}</h1>${body}</main><footer>發表人：凸肚男 · 頁面更新 <time datetime="${UPDATED}">${UPDATED}</time> · <a href="/">返回首頁</a></footer></body></html>`;}
write('sources.html',page('資料來源與閱讀方法 Sources and methods','說明三國志正文、裴注與演義的區別、地名候選、地圖限制及資料查核日期。',`<p>三國行旅以當代城市連結正史、小說及館藏；本頁提供讀者與搜尋服務相同的資料範圍和引用方式。</p><p lang="en">A public evidence guide to historical passages, fictional references and modern locations. Chinese source texts are not a complete English translation.</p><h2>正史、裴注與演義</h2><p>三國志正文與裴松之注分開標記；演義只作小說對讀，不能用來決定正史紀年或城市控制。每筆節錄保留紀錄 ID、卷／回與原始來源連結。</p><ul><li><a href="https://ancient-china-books.github.io/sanguozhi/">三國志原文</a></li><li><a href="https://www.donglishuzhai.net/books/maopingsanguoyanyi.html">三國演義版本來源</a></li><li><a href="https://www.12306.cn/">12306 官方交通查詢</a></li><li><a href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth 公共領域陸地輪廓</a></li></ul><h2>資料範圍與查核日期</h2><p>34個城市、6,040筆來源紀錄、2,830筆候選地名關聯、15筆文物或遺址、3,404個車站。館藏查核日期為2026-10-04，車站整理日期為2026-10-05；頁面更新不代表重新查核開館、展出或列車狀態。</p><h2>怎樣引用資料</h2><ol><li>選擇城市，區分正文、裴注與小說。</li><li>開啟原文核對紀年、人物和上下文；地名字串命中可能是籍貫、引文或回顧。</li><li>引用原始來源、卷／回、紀錄ID；推定與待考項目另行標示。</li></ol><h2>地圖的解讀限制</h2><p>184–280年年末城市／戰場節點示意，48個節點與67個精選正史事件；不是精確國界或完整行政區復原。戰場不計城市控制，現代海岸不代表古海岸。</p><h2>旅遊紀錄與網址移轉</h2><p>個人紀錄只保存在目前網站網址與瀏覽器內。從舊GitHub Pages搬到Cloudflare後，需在舊頁面匯出JSON，再於新網站匯入；若舊頁已停用，可由維護者暫時恢復供備份。紀錄不會提交GitHub或Cloudflare，也不是公開索引內容。</p><p><a href="cities">城市來源索引</a> · <a href="timeline" target="_blank" rel="noopener">互動地圖（新分頁）</a> · <a href="timeline-sources">完整事件來源年表</a></p>`));
const nodeNames=new Map(timeline.cities.map(n=>[n.id,n.zh]));
write('timeline-sources.html',page('勢力演進事件來源年表 Timeline evidence','184–280年67個精選正史事件，以紀年、人物與來源逐筆列出；演義提示獨立標示。',`<p>本頁不需要JavaScript即可閱讀全部${timeline.events.length}個精選事件，供核對、朗讀與引用；事件不等於完整年代史。</p><p lang="en">Selected historical events, with source record IDs and citations. Fictional hints are kept separate from historical evidence.</p><p><a href="timeline" target="_blank" rel="noopener">開啟互動地圖（新分頁）</a> · <a href="sources">閱讀方法及限制</a></p>${timeline.events.map(e=>`<article class="card" id="${esc(e.id)}"><h2>${esc(e.year)}年 · ${esc(e.titleZh||e.zh||e.title||e.id)}</h2><p>${esc(e.summaryZh||e.summary||'')}</p><p lang="en">${esc(e.summaryEn||'')}</p><p>城市／節點：${esc(nodeNames.get(e.city)||e.city)} · 人物：${esc((e.people||[]).join('、'))}</p><p>正史紀錄ID：${esc(e.source.id||'')} · 卷 ${esc(e.source.volume||'')}</p><p><a href="${esc(e.source.url)}">核對原始正史來源</a></p><details><summary>正史原文（可能含其他年份）</summary><p>${esc(e.source.text)}</p></details>${e.novel?`<p>演義提示（不作正史證據）：${esc(e.novel.noteZh||e.novel.note||'小說章回對讀')} <a href="${esc(e.novel.url)}">第${esc(e.novel.chapter)}回</a></p>`:''}</article>`).join('')}`));
const htmlFiles=fs.readdirSync(docs).filter(f=>f.endsWith('.html'));
for(const f of htmlFiles){
 let s=read(f).replaceAll('https://ttytseng.github.io/sanguo-travel/',BASE).replaceAll('2026-10-09',UPDATED);
 s=s.replace(/<link rel="canonical"[^>]*>/g,'').replace(/<!-- geo:start -->[\s\S]*?<!-- geo:end -->/g,'');
 const title=(s.match(/<title>(.*?)<\/title>/s)||[])[1]||'三國行旅';
 const description=(s.match(/<meta name="description" content="([^"]*)"/s)||[])[1]||'三國行旅公開城市史料、來源與閱讀指引。';
 const webPage={'@type':f==='cities.html'?'CollectionPage':'WebPage','@id':url(f)+'#page',url:url(f),name:title,description,dateModified:UPDATED,inLanguage:['zh-Hant','en'],isPartOf:{'@id':site['@id']},author};
 const breadcrumbs={'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'三國行旅',item:BASE},...(f==='index.html'?[]:[{'@type':'ListItem',position:2,name:title,item:url(f)}])]};
 const graph={'@context':'https://schema.org','@graph':[site,webPage,breadcrumbs]};
 s=s.replace('</head>',`<!-- geo:start --><link rel="canonical" href="${url(f)}">${ld(graph)}<!-- geo:end --></head>`);
 // Normalize metadata to Cloudflare's extensionless canonical URLs; preserve original source links.
 s=s.replace(/(<meta property="og:url" content=")[^"]*/g,'$1'+url(f));
 s=s.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(_,j)=>ld(JSON.parse(j,(k,v)=>typeof v==='string'&&v.startsWith(BASE)?v.replace(/\.html(?=$|#)/,''):v)));
 if(f==='index.html'&&!s.includes('class="button-link map-entry"'))s=s.replace('</section>','<p><a class="button-link map-entry" href="timeline.html" target="_blank" rel="noopener">勢力演進地圖 ↗（開啟新分頁） / Power timeline map (new tab)</a></p></section>');
 const nav='<nav aria-label="公開資料導覽 Public evidence navigation" id="evidence-navigation"><p><a href="/">首頁</a> · <a href="cities">城市索引</a> · <a href="sources">資料來源與方法</a> · <a href="timeline-sources">事件來源年表</a></p></nav>';
 s=s.replace(/<nav[^>]*id="evidence-navigation"[\s\S]*?<\/nav>/g,'');
 s=s.replace('</main>',nav+'</main>');
 if(!['index.html','timeline.html'].includes(f)){
 s=s.replace(/<aside id="static-reader"[\s\S]*?<\/aside>/g,'').replace(/<script defer src="static-reader.js"><\/script>/g,'');
 s=s.replace('</main>','<aside id="static-reader" aria-label="朗讀控制 Read-aloud controls"><h2>朗讀本頁 <span lang="en">Read aloud</span></h2><button type="button" id="static-read">朗讀 Read</button> <button type="button" id="static-pause">暫停 Pause</button> <button type="button" id="static-resume">繼續 Resume</button> <button type="button" id="static-stop">停止 Stop</button><p id="static-speech-status" role="status"></p></aside></main>');
 s=s.replace('</head>','<script defer src="static-reader.js"></script></head>');
 }
 write(f,s);
}
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+htmlFiles.map(f=>`<url><loc>${url(f)}</loc><lastmod>${UPDATED}</lastmod></url>`).join('')+'</urlset>');
write('robots.txt','User-agent: *\nAllow: /\nSitemap: '+BASE+'sitemap.xml\n');
write('llms.txt',read('llms.txt').split('## Event evidence and methods')[0].trimEnd().replaceAll('2026-10-09',UPDATED).replaceAll('https://ttytseng.github.io/sanguo-travel/',BASE).replace(/\.html(?=\))/g,'')+'\n## Event evidence and methods\n\n- [Timeline evidence]('+BASE+'timeline-sources): 67 historical events, original citations and separate fictional hints.\n- [Methods and provenance]('+BASE+'sources): limitations, source dates and citation guidance.\n- [Interactive map]('+BASE+'timeline): 184–280 year-end city nodes; not precise borders.\n');
write('sw.js',read('sw.js').replace("'sources.html','timeline-sources.html','static-reader.js',",'').replace(/const VERSION='[^']+';/,"const VERSION='2.3.1';").replace("'./','index.html'","'./','index.html','sources.html','timeline-sources.html','static-reader.js'"));
write('web.js',read('web.js').replaceAll('2.2.1','2.3.1'));
console.log('GEO updated: '+htmlFiles.length+' canonical pages, '+timeline.events.length+' cited events.');


