# Trail Guide 工作狀態記錄

**更新日期**: 2026-01-27

## 專案概述

Trail Guide 是一個台灣步道導覽 App，包含：
- **前端**: React 19 + TypeScript + Vite + MUI (Material UI)
- **後端**: ASP.NET Core 8 Web API
- **資料庫**: PostgreSQL (原 SQL Server，已遷移)

## 部署狀態

| 服務 | 平台 | URL |
|------|------|-----|
| 前端 | Vercel | https://trail-guide-eight.vercel.app |
| 後端 API | Render | https://trailguide-api-5yf3.onrender.com |
| 資料庫 | Neon PostgreSQL | (已設定) |
| GitHub | GitHub | https://github.com/yiqu26/Trail-Guide |

## 本次完成工作

### 1. 地圖功能實作
- 安裝 `leaflet`, `react-leaflet`, `@types/leaflet`
- 建立 `TrailMap.tsx` 組件，使用 OpenStreetMap (免費)
- 在步道詳情頁顯示地圖，標記步道位置（藍色）與入口（綠色）

### 2. 響應式設計優化
修改以下檔案，改善桌面端排版：

| 檔案 | 改動 |
|------|------|
| `TrailCard.tsx` | 響應式圖片尺寸 (110/140/160px)、hover 動畫 |
| `Home.tsx` | 熱門步道 grid 排版 (1→2 columns) |
| `Search.tsx` | 搜尋結果 grid 排版 |
| `Collection.tsx` | 精選集 grid 排版 |
| `Favorites.tsx` | 收藏 grid 排版 |
| `Nearby.tsx` | 附近步道 grid 排版（**原本缺少間距**） |

### 3. 待解決問題

#### 登入頁返回首頁問題
- **現象**: 在線上版本，點擊登入後按「返回首頁」看不到首頁內容
- **可能原因**:
  1. API 連線問題（Render 冷啟動需 ~30 秒）
  2. CORS 設定問題
  3. 首頁 API 回傳失敗導致空白
- **建議排查**:
  - 檢查瀏覽器 Console 錯誤訊息
  - 確認 Render 的 `AllowedOrigins` 環境變數包含 Vercel 網址
  - 考慮在 Home.tsx 加入錯誤處理與 fallback UI

## 本地開發環境

### 啟動方式

```bash
# 啟動 PostgreSQL
cd Trail-Guide
docker-compose up -d

# 啟動後端 (Terminal 1)
cd backend/TrailGuide.API
dotnet run

# 啟動前端 (Terminal 2)
cd frontend
npm run dev
```

### 本地網址
- 前端: http://localhost:5174
- 後端: http://localhost:5159

### 測試帳號
- Email: `test@example.com`
- Password: `Test123!`

## 下次待處理事項

1. **排查線上版登入返回問題** - 需要實際測試並查看 Console
2. **考慮加入骨架屏/錯誤處理** - 改善 UX
3. **提交並部署變更** - 目前響應式改動尚未 push
4. **效能優化** - 考慮圖片懶加載

## Git 狀態

目前有未提交的變更：
- `frontend/src/components/TrailCard.tsx`
- `frontend/src/pages/Home.tsx`
- `frontend/src/pages/Search.tsx`
- `frontend/src/pages/Collection.tsx`
- `frontend/src/pages/Favorites.tsx`
- `frontend/src/pages/Nearby.tsx`

建議執行：
```bash
cd Trail-Guide
git add frontend/
git commit -m "feat: 響應式 TrailCard 設計與 grid 排版優化"
git push
```

## 專案結構

```
Trail-Guide/
├── frontend/           # React 前端
│   ├── src/
│   │   ├── components/ # TrailCard, TrailMap, BottomNav 等
│   │   ├── pages/      # Home, Search, TrailDetail, Nearby 等
│   │   ├── services/   # API 服務
│   │   └── contexts/   # AuthContext
│   └── package.json
├── backend/
│   └── TrailGuide.API/ # .NET API
├── database/
│   └── postgres/       # PostgreSQL 初始化 SQL
├── docker-compose.yml  # PostgreSQL 容器
├── DEPLOYMENT.md       # 部署指南
└── render.yaml         # Render 配置
```
