# Trail Guide 步道導覽系統

台灣步道資訊平台，提供步道搜尋、GPS 附近步道、登山打卡、成就徽章等功能。

## 線上展示

| 服務 | URL |
|------|-----|
| 前端 | https://trail-guide-eight.vercel.app |
| 後端 API | https://trailguide-api-5yf3.onrender.com |

> 後端使用 Render 免費方案，首次訪問可能需等待冷啟動

## 技術棧

| 層級 | 技術 |
|------|------|
| **前端** | React 19 + TypeScript + Vite |
| **UI** | Material UI v7 + Framer Motion |
| **後端** | ASP.NET Core 8 Web API |
| **資料庫** | PostgreSQL |
| **認證** | JWT + Google OAuth |
| **地圖** | Leaflet + OpenStreetMap |

## 功能特色

- **步道瀏覽** - 搜尋、分類、縣市、難度篩選
- **GPS 附近步道** - 根據定位顯示周邊步道
- **互動地圖** - 步道位置與入口標記
- **登山打卡** - GPS 驗證、記錄登山時間與心得
- **成就徽章** - 37 種成就，解鎖條件包含打卡次數、特定步道等
- **收藏功能** - 建立個人收藏清單
- **評論系統** - 查看與點讚評論
- **Google 登入** - 支援第三方快速登入

## 快速開始

### 環境需求

- Node.js 18+
- .NET 8 SDK
- Docker (PostgreSQL)

### 啟動服務

```bash
# 1. Clone 專案
git clone https://github.com/yiqu26/Trail-Guide.git
cd Trail-Guide

# 2. 啟動資料庫
docker-compose up -d

# 3. 執行 SQL 遷移
docker exec -i trailguide-db psql -U postgres -d trailguide < database/postgres/001_init.sql
docker exec -i trailguide-db psql -U postgres -d trailguide < database/postgres/002_seed_data.sql
docker exec -i trailguide-db psql -U postgres -d trailguide < database/postgres/003_checkin_achievement.sql
docker exec -i trailguide-db psql -U postgres -d trailguide < database/postgres/004_seed_achievements.sql

# 4. 啟動後端
cd backend/TrailGuide.API
dotnet run

# 5. 啟動前端 (另開終端)
cd frontend
npm install
npm run dev
```

或使用啟動腳本：`scripts/start-all.bat`

### 本地網址

| 服務 | URL |
|------|-----|
| 前端 | http://localhost:5174 |
| 後端 API | http://localhost:5274 |
| Swagger | http://localhost:5274/swagger |

### 測試帳號

```
Email: test@example.com
Password: Test123!
```

## API 端點

### 認證
- `POST /api/auth/register` - 註冊
- `POST /api/auth/login` - 登入
- `POST /api/auth/google` - Google 登入
- `GET /api/auth/me` - 當前用戶

### 步道
- `GET /api/trails` - 步道列表（支援搜尋）
- `GET /api/trails/{id}` - 步道詳情
- `GET /api/trails/nearby` - 附近步道

### 打卡
- `GET /api/checkins` - 我的打卡紀錄
- `POST /api/checkins` - 新增打卡
- `GET /api/checkins/trail/{trailId}` - 步道打卡紀錄

### 成就
- `GET /api/achievements` - 所有成就
- `GET /api/achievements/user` - 我的成就

### 收藏
- `GET /api/favorites` - 我的收藏
- `POST /api/favorites/{trailId}` - 加入收藏
- `DELETE /api/favorites/{trailId}` - 移除收藏

## 專案結構

```
Trail-Guide/
├── frontend/                 # React 前端
│   ├── src/
│   │   ├── components/       # 組件 (TrailCard, CheckinDialog, AchievementCard)
│   │   ├── pages/            # 頁面 (Home, TrailDetail, Achievements, MyCheckins)
│   │   ├── services/         # API 服務
│   │   └── contexts/         # AuthContext
│   └── package.json
│
├── backend/TrailGuide.API/   # ASP.NET Core API
│   ├── Controllers/          # API 控制器
│   ├── Models/               # Domain & DTOs
│   ├── Services/             # 服務層
│   └── Data/                 # DbContext
│
├── database/postgres/        # PostgreSQL SQL 腳本
├── scripts/                  # 啟動腳本
└── docker-compose.yml        # PostgreSQL 容器
```

## License

MIT
