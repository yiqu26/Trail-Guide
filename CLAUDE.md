# Trail Guide - Claude 工作記錄

> 最後更新: 2026-02-06

## 專案概述

**Trail Guide 步道導覽系統** - 台灣步道資訊平台，重構自 2021 年 GoHiking 專案。

| 項目 | 技術 |
|------|------|
| 前端 | React 19 + TypeScript + Vite + MUI v7 |
| 後端 | ASP.NET Core 8 Web API |
| 資料庫 | PostgreSQL (Docker) / SQL Server |
| 認證 | JWT |
| 地圖 | Leaflet + OpenStreetMap |

---

## 本地開發

### 端口配置 (避免與 NGO 系統衝突)

| 服務 | URL |
|------|-----|
| Frontend | http://localhost:5174 |
| Backend API | http://localhost:5274 |
| Swagger | http://localhost:5274/swagger |

### 啟動方式

```bash
# 方法 1: 啟動腳本
scripts\start-all.bat

# 方法 2: 手動啟動
# Terminal 1 - 資料庫
docker-compose up -d

# Terminal 2 - Backend
cd backend/TrailGuide.API && dotnet run

# Terminal 3 - Frontend
cd frontend && npm run dev
```

### 測試帳號
```
Email: test@example.com
Password: Test123!
```

---

## 線上環境

### 雲端部署 (24/7 可用)

| 服務 | 平台 | URL |
|------|------|-----|
| Frontend | Vercel | https://trail-guide-eight.vercel.app |
| Backend | Render | https://trailguide-api-5yf3.onrender.com |
| Database | Neon | PostgreSQL 雲端 |
| GitHub | - | https://github.com/yiqu26/Trail-Guide |

### Cloudflare Tunnel (本機展示)

| 服務 | URL |
|------|-----|
| Frontend | https://trail.ngo-management-hub.com |
| Backend API | https://trail-api.ngo-management-hub.com |

啟動方式：
```bash
# 1. 啟動本地服務
scripts\start-demo.bat

# 2. 啟動 Cloudflare Tunnel (另開視窗)
cloudflared tunnel run ngo-demo
```

---

## 專案結構

```
Trail-Guide/
├── frontend/                 # React 前端
│   ├── src/
│   │   ├── components/       # TrailCard, BentoTrailCard, TrailMap, BottomNav
│   │   ├── pages/            # Home, Search, TrailDetail, Favorites, Profile, Nearby
│   │   ├── services/         # api.ts, auth.ts, trails.ts, home.ts
│   │   ├── contexts/         # AuthContext
│   │   └── types/
│   ├── .env.development      # API_BASE_URL=localhost:5274
│   └── vite.config.ts        # port: 5174
│
├── backend/TrailGuide.API/
│   ├── Controllers/          # Auth, Trails, Home, Favorites, Comments
│   ├── Models/Domain/        # Trail, User, Collection, Comment, Favorite
│   ├── Services/             # JwtService
│   └── Data/                 # TrailGuideDbContext
│
├── database/
│   ├── postgres/             # PostgreSQL 版本 (現用)
│   └── *.sql                 # SQL Server 版本
│
├── docker-compose.yml        # PostgreSQL 容器
├── render.yaml               # Render 部署配置
└── DEPLOYMENT.md             # 部署指南
```

---

## 已完成功能

- [x] 用戶註冊/登入 (JWT)
- [x] 首頁 Banner + 精選集 + 熱門步道 (Bento Grid)
- [x] 步道搜尋 (關鍵字、分類、縣市、難度)
- [x] 步道詳情 + 地圖 + 入口標記
- [x] GPS 附近步道
- [x] 口袋名單 (收藏功能)
- [x] 評論系統 (查看、發表、點讚)
- [x] 個人資料頁面
- [x] 錯誤處理與重試機制
- [x] 響應式設計
- [x] 第三方登入 (Google) ✅ 2026-01-28
- [x] PWA 支援 ✅ 2026-02-03
- [x] 搜尋歷史紀錄 ✅ 2026-02-06
- [x] 已去過標記功能 ✅ 2026-02-06
- [x] 我的評論頁面 ✅ 2026-02-06
- [x] 評論圖片上傳 ✅ 2026-02-06
- [x] 用戶頭像上傳 ✅ 2026-02-06

## 待完成功能

- [ ] 評論編輯/刪除
- [ ] 步道分享功能
- [ ] Facebook/Apple 登入 (申請較複雜，暫緩)

## 已棄用功能

- ~~登山打卡系統~~ (改為簡化的「已去過」標記)
- ~~成就徽章系統~~ (產品定位調整為資訊平台)

---

## API 端點

### 認證
- `POST /api/auth/register` - 註冊
- `POST /api/auth/login` - 登入
- `GET /api/auth/me` - 當前用戶

### 步道
- `GET /api/trails` - 列表 (支援搜尋)
- `GET /api/trails/{id}` - 詳情
- `GET /api/trails/nearby` - 附近步道

### 首頁
- `GET /api/home` - Banner、精選集、熱門步道

### 口袋名單 (收藏)
- `GET /api/favorites` - 我的口袋名單
- `POST /api/favorites/{trailId}` - 加入
- `DELETE /api/favorites/{trailId}` - 移除

### 已去過
- `GET /api/visitedtrails` - 已去過清單
- `GET /api/visitedtrails/check/{trailId}` - 檢查是否已去過
- `POST /api/visitedtrails/{trailId}` - 標記已去過
- `DELETE /api/visitedtrails/{trailId}` - 取消標記
- `GET /api/visitedtrails/stats` - 統計

### 我的評論
- `GET /api/mycomments` - 我的評論列表

---

## 注意事項

1. **端口**: 使用 5174/5274 避免與 NGO 系統 (5173/5264) 衝突
2. **資料庫**: 本地用 Docker PostgreSQL，線上用 Neon
3. **Render 冷啟動**: 免費版會休眠，首次請求需等待
4. **舊版備份**: `.archive/` 包含原始 GoHiking 專案

---

## 工作日誌

### 2026-02-06

**完成項目：產品定位調整與功能重構**

1. **產品定位調整**
   - 從「登山社群平台」調整為「步道資訊平台」
   - 移除複雜的打卡/成就系統
   - 專注於步道資訊 + 用戶評論

2. **搜尋歷史紀錄**
   - 新增 `hooks/useSearchHistory.ts` - localStorage 管理
   - 搜尋頁面顯示最近搜尋紀錄
   - 支援刪除單筆/清除全部

3. **已去過功能** (取代打卡系統)
   - 新增 `VisitedTrails` 資料表
   - 新增 `VisitedTrailsController` - 標記/取消/查詢 API
   - 新增 `MyVisited.tsx` - 已去過頁面
   - `TrailDetail.tsx` - 簡化的「標記已去過」按鈕

4. **我的評論功能**
   - 新增 `MyCommentsController` - 取得用戶評論 API
   - 新增 `MyComments.tsx` - 我的評論頁面

5. **個人資料頁面重構**
   - 統計卡片：已去過、想去、評論
   - 選單：已去過的步道、口袋名單、我的評論、設定、登出
   - 移除打卡/成就相關入口

6. **收藏改名為「口袋名單」**
   - `Favorites.tsx` 標題和文案調整

**新增檔案：**
- `database/postgres/005_visited_trails.sql`
- `backend/.../Controllers/VisitedTrailsController.cs`
- `backend/.../Controllers/MyCommentsController.cs`
- `frontend/src/hooks/useSearchHistory.ts`
- `frontend/src/services/visited.ts`
- `frontend/src/pages/MyVisited.tsx`
- `frontend/src/pages/MyComments.tsx`

**修改檔案：**
- `types/index.ts` - 新增 MyComment, VisitedTrail 類型
- `services/comments.ts` - 新增 getMyComments
- `pages/Profile.tsx` - 重構統計卡片和選單
- `pages/TrailDetail.tsx` - 打卡 → 標記已去過
- `pages/Favorites.tsx` - 收藏 → 口袋名單
- `pages/Search.tsx` - 搜尋歷史紀錄
- `App.tsx` - 新增路由

7. **評論圖片上傳功能**
   - `CommentSection.tsx` - 新增可選圖片上傳 (最多 5 張)
   - 使用 Cloudinary 上傳
   - 圖片預覽、刪除、上傳進度提示
   - 評論列表顯示圖片
   - `CreateCommentDto` 新增 `ImageUrls` 欄位
   - `CommentsController.CreateComment` 儲存圖片到 CommentImages

8. **用戶頭像上傳功能**
   - `Profile.tsx` - 點擊頭像選擇圖片
   - 支援 JPG、PNG、GIF、WebP (上限 5MB)
   - 上傳到 Cloudinary (avatars 資料夾)
   - 上傳中顯示 loading 效果

---

### 2026-02-05

**完成項目：打卡照片展示與 UI 修正**

1. **打卡照片展示功能**
   - 新增 `CheckinImages.tsx` - Strava 風格橫向滑動縮圖條
   - 新增 `ImageLightbox.tsx` - 全螢幕圖片檢視器 (支援左右滑動、鍵盤操作)
   - `MyCheckins.tsx` - 打卡卡片顯示照片
   - `TrailDetail.tsx` - 打卡區塊顯示照片
   - 使用 Cloudinary URL 優化縮圖載入

2. **UI 修正**
   - `Search.tsx` - 暗黑模式難度 Chip 配色修正 (`white` → `background.paper`)
   - `Login.tsx` - Google 登入按鈕改用 pill 形狀並置中
   - `CheckinDialog.tsx` - 修正 HTML 結構錯誤 (h5 嵌套在 h2 內)

**Git commits：**
```
b25277b feat: 打卡照片展示功能 - Lightbox 與縮圖組件
078151b fix: UI 修正 - 暗黑模式、照片樣式、Google 按鈕
64e359a fix: 修正 HTML 結構警告與 Google 按鈕錯誤
```

**下次可繼續：**
- [ ] 成就分享到社群
- [ ] 用戶頭像上傳
- [ ] 測試線上環境打卡功能

---

### 2026-02-04

**完成項目：UX 優化與暗黑模式**

1. **載入體驗優化**
   - 安裝 `nprogress` - 頂部綠色進度條
   - 新增 `LoadingProgress.tsx` - 頁面切換進度條
   - 新增 `Skeletons.tsx` - 多種骨架屏組件
   - Suspense fallback 改用骨架屏

2. **PWA 支援**
   - 安裝 `vite-plugin-pwa`
   - 可安裝到手機桌面
   - 離線緩存 (圖片 7 天、API 1 小時)
   - 新版本更新提示 (`PWAUpdatePrompt.tsx`)

3. **設定頁面與暗黑模式**
   - 新增 `ThemeContext.tsx` - 主題狀態管理
   - 新增 `Settings.tsx` - 設定頁面 (/settings)
   - 三種模式：淺色 / 深色 / 跟隨系統
   - localStorage 持久化

4. **暗黑模式配色修正**
   - 頁面背景改用 `background.default`
   - 卡片背景改用 `background.paper`
   - Hover 效果改用 `action.hover`
   - 文字顏色改用 `text.primary/secondary`

5. **暗黑模式配色修正 (第二輪)**
   - `Home.tsx` - 新消息區塊：移除硬編碼漸層 `#f8f9fa`，改用 `background.paper` + 邊框
   - `TrailDetail.tsx` - 打卡空狀態卡片：`grey.50` → `action.hover`
   - `CommentSection.tsx` - 評論空狀態卡片：`grey.50` → `action.hover`

6. **UI/UX 設計大優化**
   - 精選集圖標暗黑模式適配 (alpha 動態背景色)
   - 空狀態插圖設計 (Favorites, Search, Collection, MyCheckins, Nearby)
   - 圖片載入優化 (新增 `ProgressiveImage.tsx`)
   - 返回頂部按鈕 (新增 `ScrollToTop.tsx`)
   - 收藏按鈕心跳動畫
   - 卡片 hover 效果加強 (陰影 + 縮放)
   - 頁面轉場動畫優化 (Material Design easing)
   - 統一圓角設計規範 (8/12/16/24px)
   - 統一陰影層級定義
   - 擴展主色調配置
   - 下拉刷新功能 (新增 `PullToRefresh.tsx`)
   - 底部導航動畫 (彈跳 + 滑動指示線)

**Git commits：**
```
b95acbe feat: 優化載入體驗 - 頂部進度條 + 骨架屏
465a72c feat: 新增 PWA 支援 - 可安裝到手機桌面
f77a720 feat: 新增設定頁面與暗黑模式支援
a51999c fix: 修正暗黑模式下的配色問題
4f29674 fix: 修正暗黑模式下新消息、打卡、評論區塊配色
55169da feat: UI/UX 設計優化 - 動畫、空狀態、視覺一致性
```

**下次可繼續：**
- [ ] 測試打卡功能 (需重啟後端)
- [ ] 打卡照片上傳 (需 Cloudinary)
- [ ] 成就分享到社群
- [ ] 用戶頭像上傳

---

### 2026-02-03

**完成項目：登山打卡與成就徽章系統**

後端 (ASP.NET Core)：
- `database/postgres/003_checkin_achievement.sql` - 打卡與成就資料表
- `database/postgres/004_seed_achievements.sql` - 預設成就種子資料 (37 個成就)
- `Models/Domain/CheckinAchievement.cs` - Checkin, CheckinImage, Achievement, UserAchievement
- `Models/DTOs/CheckinAchievementDtos.cs` - 所有 API 請求/回應 DTO
- `Services/AchievementService.cs` - 成就檢查與解鎖邏輯
- `Controllers/CheckinsController.cs` - 打卡 CRUD API
- `Controllers/AchievementsController.cs` - 成就查詢 API

前端 (React + TypeScript)：
- `types/index.ts` - 新增 Checkin, Achievement 相關類型
- `services/checkins.ts` - 打卡 API 服務
- `services/achievements.ts` - 成就 API 服務
- `components/CheckinDialog.tsx` - 打卡彈窗 (GPS 驗證、心得、時間)
- `components/AchievementCard.tsx` - 成就卡片組件
- `pages/MyCheckins.tsx` - 我的打卡紀錄頁面
- `pages/Achievements.tsx` - 成就徽章頁面
- `pages/TrailDetail.tsx` - 新增打卡按鈕和打卡紀錄區塊
- `pages/Profile.tsx` - 新增統計卡片和選單入口
- `App.tsx` - 新增路由 /my-checkins, /achievements

**Git commits：**
```
1a8a974 feat: 新增登山打卡與成就徽章系統
```

**PWA 支援：**
- 安裝 `vite-plugin-pwa`
- 配置 `vite.config.ts` - manifest、緩存策略
- 新增 `PWAUpdatePrompt.tsx` - 更新提示組件
- 新增 app icons (192x192, 512x512)
- 更新 `index.html` - meta 標籤、apple-touch-icon

**Git commits：**
```
465a72c feat: 新增 PWA 支援 - 可安裝到手機桌面
```

**下次可繼續：**
- [ ] 打卡照片上傳 (需 Cloudinary)
- [ ] 成就分享到社群
- [ ] 用戶頭像上傳
- [ ] 重啟後端測試打卡功能

---

### 2026-01-28

**完成項目：**
- ✅ Google OAuth 登入功能
  - 整合 `@react-oauth/google` 套件
  - 設定 Google Cloud Console OAuth 2.0
  - 前端 Login 頁面新增 Google 登入按鈕
  - 環境變數：`VITE_GOOGLE_CLIENT_ID`
- ✅ 修復 Profile 頁面性別顯示 bug（null 判斷）
- ✅ 修復所有 ESLint 錯誤和警告（7 個問題）
- ✅ 更新文檔

**Git commits：**
```
8c624f7 fix: 修復 ESLint 錯誤和警告
a54067c feat: 實現 Google OAuth 登入功能
```

**下次可繼續：**
- [ ] 用戶頭像上傳（需 Cloudinary 或其他雲端儲存）
- [ ] PWA 支援（讓 App 可安裝到手機）
- [ ] UI/UX 細節優化
- [ ] 線上環境測試 Google 登入（需更新 Vercel 環境變數）
