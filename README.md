# Stock Dashboard

一個現代化的股票資訊儀表板，類似於 Grafana，提供即時股票數據視覺化。

## 功能特色

- 🎯 **多股票支援**: 支援多個股票代碼切換 (AAPL, GOOGL, TSLA)
- 🌙 **深色/淺色模式**: 完整的主題切換支援
- 📊 **豐富圖表**: 價格走勢圖和成交量圖表
- 📱 **響應式設計**: 完美支援手機和桌面設備
- 📰 **相關新聞**: 顯示選定股票的最新新聞
- ⚡ **靜態部署**: 可部署到 GitHub Pages

## 技術棧

- **框架**: Next.js 14 (App Router)
- **樣式**: Tailwind CSS + shadcn/ui
- **圖表**: Recharts
- **主題**: next-themes
- **部署**: GitHub Pages

## 本地開發

1. 克隆專案
\`\`\`bash
git clone <your-repo-url>
cd stock-dashboard
\`\`\`

2. 安裝依賴
\`\`\`bash
npm install
\`\`\`

3. 啟動開發服務器
\`\`\`bash
npm run dev
\`\`\`

4. 打開瀏覽器訪問 `http://localhost:3000`

## 部署到 GitHub Pages

1. 確保您的 GitHub 倉庫名稱為 `stock-dashboard`
2. 推送代碼到 `main` 分支
3. GitHub Actions 會自動構建並部署到 GitHub Pages
4. 在倉庫設置中啟用 GitHub Pages，選擇 `gh-pages` 分支

## 自定義

### 添加新股票

在 `app/page.tsx` 中的 `stockData` 對象中添加新的股票數據：

\`\`\`typescript
const stockData = {
  // 現有股票...
  MSFT: {
    name: "Microsoft Corporation",
    price: 380.00,
    // ... 其他數據
  }
}
\`\`\`

### 修改主題

在 `app/globals.css` 中自定義 CSS 變量來調整主題顏色。

## 許可證

MIT License
