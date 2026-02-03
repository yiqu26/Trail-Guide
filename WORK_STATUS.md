# Trail Guide 工作狀態記錄

**更新日期**: 2026-02-03

## 當前狀態

### 登山打卡與成就徽章系統 (剛完成，需重啟測試)

**已完成：**
- ✅ 資料庫遷移已執行 (checkins, checkin_images, achievements, user_achievements)
- ✅ 37 個預設成就已插入
- ✅ 代碼已 commit (1a8a974)

**下一步：**
1. **重啟後端** - 關閉 start-all.bat 再重新執行，載入新的 Controller
2. 測試打卡功能（步道詳情頁 → 打卡按鈕）
3. 測試成就頁面 (/achievements)

### 新增的 API 端點
- `GET/POST /api/checkins` - 打卡 CRUD
- `GET /api/checkins/trail/{trailId}` - 步道打卡紀錄
- `GET /api/achievements` - 成就列表
- `GET /api/achievements/user` - 用戶成就

---

## 待優化事項

### Bento Grid 設計細節優化

已選定 **A. Bento Grid** 設計並套用到首頁，可考慮的優化方向：

- [ ] 格子比例/大小調整
- [ ] hover 動畫效果加強
- [ ] 陰影/圓角風格微調
- [ ] 資訊顯示方式優化
- [ ] 色彩/漸層調整
- [ ] 響應式斷點微調

---

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

### 0. 熱門步道 Bento Grid 設計 (2026-01-28)
- 研究 4 種 UI 設計趨勢（Bento Grid、Tall Card、Image-First、Glassmorphism）
- 建立 `DesignDemo.tsx` 演示頁面供比較
- 選定 **Bento Grid** 設計
- 新增 `BentoTrailCard.tsx` 組件
- 修改 `Home.tsx` 套用 Bento Grid 布局（1大+4小）

### 1. 最新消息區塊優化
- 改用 Paper 容器 + 漸層背景
- 新增公告 icon、NEW 標籤、外連 icon
- 左側彩色邊框強調最新消息
- **已修復置中問題**

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
- `frontend/src/components/BentoTrailCard.tsx` (新增)
- `frontend/src/pages/DesignDemo.tsx` (新增)
- `frontend/src/pages/Home.tsx` (修改 - Bento Grid)
- `frontend/src/App.tsx` (修改 - 新增路由)
- 其他響應式優化檔案

建議執行：
```bash
cd Trail-Guide
git add frontend/
git commit -m "feat: 熱門步道區塊改用 Bento Grid 設計"
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
