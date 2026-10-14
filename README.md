# 三國行旅 Sanguo Travel

發表人：凸肚男 · 聯繫：[tzesmann@gmail.com](mailto:tzesmann@gmail.com)

網頁入口：https://sanguo-travel.pages.dev/

操作與維護說明見本頁下方；Word 手冊另行提供給使用者保管。

繁體中文與英文介面，提供當代地名對照、三國志正文與裴注、三國演義章回、博物館文物、12306 官方查詢入口、個人旅遊紀錄，以及可暫停的朗讀。原始史料保留中文，並未逐篇翻譯。

The bilingual interface includes locations, source passages, museum entries, official 12306 links, a local trip journal and read-aloud controls. Original source passages remain in Chinese.

## 資料與限制

目前涵蓋 34 個城市、6,040 筆來源紀錄、2,830 筆地名關聯、15 筆文物或遺址、3,404 個車站。地名與人物多為字串命中候選，需核對原文；不可直接當作已確認的事件所在地。文物包含後世紀念物，並非全部為三國時期出土文物。博物館資料查核日期為 2026-10-04，車站整理於 2026-10-05；是否展出、開館、車票與時刻請以官方公告為準。APP 不提供即時餘票、不代購、不登入 12306。

資料承接使用者提供及整理的 Excel；原文來源連結保留於每筆紀錄。來源版本詳見網頁「說明與無障礙」。本儲存庫未替第三方資料新增授權；重用前請自行確認來源條款。

## 隱私

個人旅遊紀錄存在瀏覽器 localStorage，不會提交到儲存庫。JSON 備份與 CSV 匯出由使用者自行保管。不同網址或浏览器的紀錄互不相通；Android APK 與網頁須以 JSON 手動移轉。主機仍可能記錄一般 HTTP 存取，裝置語音服務是否連線取決於瀏覽器與作業系統。

## 維護

Cloudflare Pages 專案：sanguo-travel，採 Direct Upload；GitHub Pages 發布已停用，儲存庫保留作原始碼管理。

`docs/` 是發布檔案，`tools/` 是資料更新工具，`tests/` 是驗證腳本。公開儲存庫勿放私人旅遊紀錄、帳密、金鑰、Android 簽章檔或整份私人 Excel。

先備份並下載儲存庫。安裝 Python 和 openpyxl 後，在專案根目錄執行：

```sh
python -m pip install openpyxl
python tools/update_data.py --xlsx "最新版.xlsx"
python tools/build_discovery.py
node tests/core.test.cjs
node tests/webmcp.test.cjs
node tests/discovery.test.cjs
```

更新工具只讀取公開資料分頁與車站庫，不讀取旅遊紀錄或旅遊統計。若新增城市或館藏，需先同步 `docs/i18n.js` 的順序與英文翻譯；檢核不符時工具會停止。

變更後提高 `docs/sw.js` 的 VERSION，並同步網頁顯示版本。更新 GitHub main 以保存原始碼；將 docs 內容（不包含外層 docs 資料夾）打包成 ZIP，再到 Cloudflare 專案建立新部署並上傳。提交 GitHub 不會自動部署 Cloudflare。既有使用者需關閉本網站所有分頁及獨立 APP 視窗，再重新開啟，使更新的離線快取啟用。資料欄位更動還需同步 travel-schema.js、i18n.js、web.js 與匯入相容性測試。

無障礙目標依 WCAG 2.2 AA 原則設計：語意結構、鍵盤、可見焦點、標籤、狀態提示、對比、縮放及語言標示。此說明不代表第三方無障礙認證。朗讀需瀏覽器支援 Web Speech API 與已安裝語音。

維護參考：[WCAG 2.2](https://www.w3.org/TR/WCAG22/)、[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Window/speechSynthesis)。

## 2.1.0：公開來源頁與 WebMCP

新增34個不依賴JavaScript的城市頁、結構化資料、sitemap及llms.txt。資料優先以gzip載入，不支援時使用既有data.js。更新Excel後需執行build_discovery.py重新產生城市頁。頁面日期目前在該工具內設定，發布前同步調整。

6個網站工具：城市清單、史料搜尋、原文、館藏、12306查詢連結、未儲存旅遊草稿。工具不讀取私人旅遊紀錄，不登入或購票。草稿須本人確認儲存；有既存草稿時拒絕覆蓋。

WebMCP支援依瀏覽器與ChatGPT帳號而異；不支援時仍可使用手動查詢。採用document.modelContext並相容早期navigator.modelContext。維護時使用node tests/webmcp.test.cjs驗證。

## 2.2.0：獨立勢力演進地圖

主頁的「勢力演進地圖 ↗（新分頁）」以新分頁開啟 `timeline.html`，不加入原頁面的查詢分頁。直接入口：https://sanguo-travel.pages.dev/timeline.html 。

184–280年，48個城市／戰場節點、67個精選正史事件。可切換年份、逐年播放、跳到上一／下一事件年、搜尋城市或人物、縮放和平移。城市詳情保留正史段落ID、完整原文、紀年與定位限制，演義為可關閉的章回提示。英文介面和摘要另列，原文保留中文。這是年末城市節點的演進，不是完整疆界、行政區或軍力復原；戰場菱形不算城市控制。

6個起始年度未核定的基準預設不參與控制權計算。其餘節點也可能是區域歸屬推定，或沿用前一次記錄，詳情均標示。政權滅亡與承接另有規則，避免把袁術延續到其死後、把蜀延長到264年，或把司馬氏掌實權提前當成晉朝。進攻未成功不改色，例如215合肥與219樊城。

獨立朗讀控制可讀城市事件、當年摘要或所選正史原文，提供語音、速度、暫停、繼續及停止。朗讀會停止時間軸播放，改年份、事件、語言、切到背景會停止朗讀。裝置沒有Web Speech API時保留文字與螢幕閱讀器操作；這些控制不保證每台裝置有中英文語音。

`tools/build_timeline.py` 是事件與控制變更的維護來源，生成 `docs/timeline-data.js`。需提供既有公開史料JSON及Natural Earth陸地資料，例如在本專案根目錄：

```sh
python tools/build_timeline.py --history-json ../work/prepared.json --novel-json ../work/romance_parsed.json --land-json ../work/natural-earth-land.json
node tests/timeline.test.cjs
```

預設路徑對應本地整理工作目錄；其他裝置須指定自己的三個JSON路徑。`prepared.json` 為正史段落集合，`romance_parsed.json` 為演義章回集合，均不含私人旅遊紀錄。控制權只能由人工核對年序的記錄更新，不能用地名字串命中自動生成。若追加事件，保留既有MAP編號，新增編號並按年排序，以免分享連結及來源關聯失效。

海岸資料來自 [Natural Earth公共領域陸地資料](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson)，比例尺1:110m。地圖只使用現代陸地輪廓，不畫現代國界；古海岸、河道和城址仍需另考。未加入外部地圖圖磚、追蹤器或新帳號需求，離線快取包含整個地圖頁。

本網站已移植到Cloudflare Pages獨立根網址；robots.txt、llms.txt與sitemap.xml皆由正式網址根目錄提供。

## 2.3.1：Cloudflare 移植與 GEO 結構

正式網址：https://sanguo-travel.pages.dev/ 。39個HTML頁的canonical、sitemap與公開索引統一使用Cloudflare正式網址（HTML頁使用平台的無副檔名網址）。新資料方法頁 /sources 及事件來源年表 /timeline-sources 可不開JavaScript直接閱讀67個精選正史事件與來源。

每次更新資料執行 python tools/build_discovery.py，會接續呼叫 node tools/optimize_geo.cjs；地圖資料修改後也需重跑 optimize_geo.cjs。頁面更新日期常數在 optimize_geo.cjs 的 UPDATED，資料原始查核日期獨立保留。已加入網站／頁面／麵包屑結構化資料、公開索引導覽、靜態頁朗讀及圖片 alt 朗讀。

驗證：node tests/geo.test.cjs，加上既有 core、webmcp、discovery、timeline 測試。所有後續內容以WCAG 2.2 AA為驗收目標；資訊圖片須提供與語言、語境一致的alt，複雜圖表另附詳細文字說明。自動測試不等於完整WCAG合規認證。GEO改善搜尋可讀性與可核對性，不保證AI引用或排名。

個人旅遊紀錄屬於網址與瀏覽器的本機儲存；新網址不會自動讀取舊網址紀錄。移轉方式為舊頁匯出JSON、新頁匯入。GitHub Pages已停用；如須取回舊紀錄，可暫時恢復旧頁供使用者匯出，再關閉。



## 2.4.0：頂端閱讀工具與導覽

所有公開頁面頂端提供朗讀、對比及字體大小工具列；暫停、繼續、停止、語音與速度在朗讀設定內。閱讀偏好保存在本機並跨頁使用。主頁導覽順序為地名與史料、勢力演進地圖（新分頁）、旅遊紀錄、無障礙閱讀說明、12306動車訊息。關於我新增合作開發與意見反饋邀請，提供中英文字。tools/update_layout.cjs由GEO建置腳本接續執行，重建資料頁後保留布局。


## 2.5.1：免費資源下載（已發布）

resources.html提供四份PPTX與一份MP4下載，入口在地圖旁且另開分頁。MP4依使用者確認先提供原檔下載，待有字幕／逐字稿後再評估內嵌播放。AI生成與未審核聲明置於頁尾。五個附件已依使用者明確核准公開上傳至GitHub發行版 free-resources-2026-10-14，檔案校驗碼與原始附件一致。Cloudflare版已發布；四份PPTX及MP4經/downloads路由重新導向GitHub附件。原檔校驗副本與manifest位於網站群的三國行旅免費資源資料夾。




