# Trail Guide - Claude 工作記錄

> 最後更新: 2026-01-28

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

| 服務 | 平台 | URL |
|------|------|-----|
| Frontend | Vercel | https://trail-guide-eight.vercel.app |
| Backend | Render | https://trailguide-api-5yf3.onrender.com |
| Database | Neon | PostgreSQL 雲端 |
| GitHub | - | https://github.com/yiqu26/Trail-Guide |

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
- [x] 收藏功能
- [x] 評論系統 (查看、點讚)
- [x] 個人資料頁面
- [x] 錯誤處理與重試機制
- [x] 響應式設計

## 待完成功能

- [ ] 第三方登入 (Google/Facebook/Apple) - 後端已支援
- [ ] 新增評論功能
- [ ] 用戶頭像上傳
- [ ] 骨架屏 Loading

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

### 收藏
- `GET /api/favorites` - 我的收藏
- `POST /api/favorites/{trailId}` - 加入
- `DELETE /api/favorites/{trailId}` - 移除

---

## 注意事項

1. **端口**: 使用 5174/5274 避免與 NGO 系統 (5173/5264) 衝突
2. **資料庫**: 本地用 Docker PostgreSQL，線上用 Neon
3. **Render 冷啟動**: 免費版會休眠，首次請求需等待
4. **舊版備份**: `.archive/` 包含原始 GoHiking 專案
