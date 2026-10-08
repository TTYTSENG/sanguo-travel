# 三國行旅 Sanguo Travel

發表人：凸肚男 · 聯繫：[tzesmann@gmail.com](mailto:tzesmann@gmail.com)

網頁入口：https://ttytseng.github.io/sanguo-travel/

操作與維護說明見本頁下方；Word 手冊另行提供給使用者保管。

繁體中文與英文介面，提供當代地名對照、三國志正文與裴注、三國演義章回、博物館文物、12306 官方查詢入口、個人旅遊紀錄，以及可暫停的朗讀。原始史料保留中文，並未逐篇翻譯。

The bilingual interface includes locations, source passages, museum entries, official 12306 links, a local trip journal and read-aloud controls. Original source passages remain in Chinese.

## 資料與限制

目前涵蓋 34 個城市、6,040 筆來源紀錄、2,830 筆地名關聯、15 筆文物或遺址、3,404 個車站。地名與人物多為字串命中候選，需核對原文；不可直接當作已確認的事件所在地。文物包含後世紀念物，並非全部為三國時期出土文物。博物館資料查核日期為 2026-10-04，車站整理於 2026-10-05；是否展出、開館、車票與時刻請以官方公告為準。APP 不提供即時餘票、不代購、不登入 12306。

資料承接使用者提供及整理的 Excel；原文來源連結保留於每筆紀錄。來源版本詳見網頁「說明與無障礙」。本儲存庫未替第三方資料新增授權；重用前請自行確認來源條款。

## 隱私

個人旅遊紀錄存在瀏覽器 localStorage，不會提交到儲存庫。JSON 備份與 CSV 匯出由使用者自行保管。不同網址或浏览器的紀錄互不相通；Android APK 與網頁須以 JSON 手動移轉。主機仍可能記錄一般 HTTP 存取，裝置語音服務是否連線取決於瀏覽器與作業系統。

## 維護

GitHub Pages 設定：Settings → Pages → Deploy from a branch → main → /docs。

`docs/` 是發布檔案，`tools/` 是資料更新工具，`tests/` 是驗證腳本。公開儲存庫勿放私人旅遊紀錄、帳密、金鑰、Android 簽章檔或整份私人 Excel。

先備份並下載儲存庫。安裝 Python 和 openpyxl 後，在專案根目錄執行：

```sh
python -m pip install openpyxl
python tools/update_data.py --xlsx "最新版.xlsx"
node tests/core.test.cjs
```

更新工具只讀取公開資料分頁與車站庫，不讀取旅遊紀錄或旅遊統計。若新增城市或館藏，需先同步 `docs/i18n.js` 的順序與英文翻譯；檢核不符時工具會停止。

變更後提高 `docs/sw.js` 的 VERSION，並同步網頁顯示版本。提交 main，等 Pages 部署成功後再測試公開網址。既有使用者需關閉本網站所有分頁及獨立 APP 視窗，再重新開啟，使更新的離線快取啟用。資料欄位更動還需同步 travel-schema.js、i18n.js、web.js 與匯入相容性測試。

無障礙目標依 WCAG 2.2 AA 原則設計：語意結構、鍵盤、可見焦點、標籤、狀態提示、對比、縮放及語言標示。此說明不代表第三方無障礙認證。朗讀需瀏覽器支援 Web Speech API 與已安裝語音。

維護參考：[WCAG 2.2](https://www.w3.org/TR/WCAG22/)、[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Window/speechSynthesis)。
