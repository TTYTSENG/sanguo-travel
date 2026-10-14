'use strict';
let queue=[],current=null;
const supported='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
const status=document.getElementById('static-speech-status');
function stop(){queue=[];current=null;if(supported)speechSynthesis.cancel();status.textContent='已停止 Stopped';}
function next(){if(!queue.length){status.textContent='朗讀完成 Finished';current=null;return;}const item=queue.shift();current=new SpeechSynthesisUtterance(item.text);current.lang=item.lang;const utterance=current;current.onend=()=>{if(current===utterance)next();};current.onerror=()=>{if(current!==utterance)return;queue=[];current=null;status.textContent='朗讀中斷，請重試 Read-aloud interrupted';};speechSynthesis.speak(current);}
document.getElementById('static-read').onclick=()=>{stop();const walker=document.createTreeWalker(document.getElementById('main'),NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){const el=n.nodeType===3?n.parentElement:n;if(!el||!el.getClientRects().length||el.closest('button,input,select,textarea,script,style,[hidden],[aria-hidden="true"],#static-reader'))continue;const text=n.nodeType===3?n.textContent.trim():el.tagName==='IMG'?el.getAttribute('alt')?.trim():'';if(text)queue.push({text,lang:el.closest('[lang]')?.lang||'zh-Hant'});}status.textContent='正在朗讀 Reading';next();};
document.getElementById('static-pause').onclick=()=>{if(supported){speechSynthesis.pause();status.textContent='已暫停 Paused';}};
document.getElementById('static-resume').onclick=()=>{if(supported){speechSynthesis.resume();status.textContent='繼續朗讀 Reading';}};
document.getElementById('static-stop').onclick=stop;
for(const id of ['static-read','static-pause','static-resume','static-stop'])document.getElementById(id).disabled=!supported;
if(!supported)status.textContent='此瀏覽器不支援朗讀；可使用螢幕閱讀器 Read-aloud unavailable; use a screen reader.';
window.addEventListener('pagehide',()=>{if(supported)speechSynthesis.cancel();});

