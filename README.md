# Trail Guide 步道導覽系統

基於 React + ASP.NET Core 的步道導覽網站，重構自 2021 年的 GoHiking 專案。

## 技術棧

| 層級 | 技術 |
|------|------|
| **前端** | React 18 + TypeScript + Vite |
| **UI** | Material UI v5 |
| **狀態管理** | React Query + Context API |
| **後端** | ASP.NET Core 8 Web API |
| **資料庫** | SQL Server |
| **認證** | JWT |

## 專案結構

```
Trail-Guide/
├── frontend/              # React 前端
│   ├── src/
│   │   ├── components/    # 共用組件
│   │   ├── pages/         # 頁面
│   │   ├── services/      # API 服務
│   │   ├── contexts/      # Context
│   │   ├── hooks/         # Custom Hooks
│   │   └── types/         # TypeScript 型別
│   └── package.json
│
├── backend/               # ASP.NET Core API
│   └── TrailGuide.API/
│       ├── Controllers/   # API 控制器
│       ├── Models/        # Domain & DTOs
│       ├── Services/      # 服務層
│       └── Data/          # DbContext
│
├── database/              # SQL 腳本
│   ├── 001_create_database.sql
│   └── 002_seed_data.sql
│
├── scripts/               # 啟動腳本
│   ├── start-all.bat
│   └── setup-database.bat
│
├── docs/                  # 文件
└── .archive/              # 舊版程式碼備份
    ├── hikingserver-laravel/
    └── gohiking-web-react/
```

## 快速開始

### 1. 設定資料庫

1. 開啟 SSMS，連接到本地 SQL Server
2. 執行 `database/001_create_database.sql`
3. 執行 `database/002_seed_data.sql`

### 2. 啟動服務

執行 `scripts/start-all.bat` 或手動啟動：

```bash
# 後端 (Terminal 1)
cd backend/TrailGuide.API
dotnet run --urls=http://localhost:5264

# 前端 (Terminal 2)
cd frontend
npm install
npm run dev
```

### 3. 訪問

| 服務 | URL |
|------|-----|
| 前端 | http://localhost:5173 |
| 後端 API | http://localhost:5264 |
| Swagger | http://localhost:5264/swagger |

## 測試帳號

```
Email: test@example.com
Password: Test123!
```

## API 端點

### 認證
- `POST /api/auth/register` - 註冊
- `POST /api/auth/login` - 登入
- `POST /api/auth/social` - 第三方登入
- `GET /api/auth/me` - 取得當前用戶

### 步道
- `GET /api/trails` - 步道列表（支援搜尋）
- `GET /api/trails/{id}` - 步道詳情
- `GET /api/trails/nearby` - 附近步道

### 首頁
- `GET /api/home` - 首頁資料（Banner、精選集、熱門步道）
- `GET /api/home/collections/{id}` - 精選集詳情

### 收藏
- `GET /api/favorites` - 我的收藏
- `POST /api/favorites/{trailId}` - 加入收藏
- `DELETE /api/favorites/{trailId}` - 移除收藏

## 功能清單

- [x] 用戶註冊/登入
- [x] 首頁 Banner 輪播
- [x] 精選集展示
- [x] 步道列表與搜尋
- [x] 步道詳情頁
- [x] 附近步道 (GPS)
- [x] 收藏功能
- [ ] 評論系統
- [ ] 第三方登入 (Google/Facebook/Apple)
- [ ] 個人資料編輯
