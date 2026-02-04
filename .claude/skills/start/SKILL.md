---
name: start
description: 啟動 Trail-Guide 本地開發環境，顯示端口和測試帳號資訊
disable-model-invocation: true
user-invocable: true
---

# Trail-Guide 開發環境啟動

## 服務端口

| 服務 | URL |
|------|-----|
| Frontend | http://localhost:5174 |
| Backend API | http://localhost:5274 |
| Swagger | http://localhost:5274/swagger |
| PostgreSQL | localhost:5432 |

## 啟動方式

### 方法 1: 使用啟動腳本 (推薦)
```bash
scripts\start-all.bat
```

### 方法 2: 手動啟動
```bash
# Terminal 1 - 資料庫 (如果需要本地 DB)
docker-compose up -d

# Terminal 2 - 後端 API
cd backend/TrailGuide.API && dotnet run --urls=http://localhost:5274

# Terminal 3 - 前端
cd frontend && npm run dev
```

## 測試帳號
- Email: `test@example.com`
- Password: `Test123!`

## 注意事項
- 端口 5174/5274 是為了避免與 NGO 系統 (5173/5264) 衝突
- 線上環境: Vercel (前端) + Render (後端) + Neon (DB)
- Render 免費版有冷啟動，首次請求需等待

## 技術棧速覽
- **前端**: React 19 + TypeScript + Vite + MUI v7 + React Query
- **後端**: ASP.NET Core 8 + EF Core + JWT
- **資料庫**: PostgreSQL
