# Trail Guide 部署指南

## 架構

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Vercel    │────▶│   Render    │────▶│    Neon     │
│  (前端)     │     │  (後端API)  │     │ (PostgreSQL)│
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## 步驟 1：設定 Neon 資料庫

1. 前往 https://neon.tech 註冊/登入
2. 建立新專案 (Create Project)
   - Name: `trailguide`
   - Region: 選擇離你最近的區域
3. 複製連接字串 (Connection string)，格式如下：
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. 在 Neon 的 SQL Editor 中執行以下 SQL 檔案（按順序）：
   - `database/postgres/001_create_tables.sql`
   - `database/postgres/002_seed_data.sql`

---

## 步驟 2：部署後端到 Render

1. 前往 https://render.com 註冊/登入
2. 點擊 **New** → **Web Service**
3. 連接你的 GitHub repository: `yiqu26/Trail-Guide`
4. 設定：
   - **Name**: `trailguide-api`
   - **Region**: Singapore (離台灣最近)
   - **Branch**: `master`
   - **Root Directory**: `backend/TrailGuide.API`
   - **Runtime**: `Docker`
   - **Instance Type**: `Free`

5. 設定環境變數 (Environment Variables)：
   | Key | Value |
   |-----|-------|
   | `ConnectionStrings__DefaultConnection` | 從 Neon 複製的連接字串，但要改格式：`Host=ep-xxx.region.aws.neon.tech;Database=neondb;Username=xxx;Password=xxx;SSL Mode=Require` |
   | `Jwt__Key` | 自己設定一個至少 32 字元的密鑰 |
   | `Jwt__Issuer` | `TrailGuideAPI` |
   | `Jwt__Audience` | `TrailGuideApp` |
   | `AllowedOrigins` | 先留空，等前端部署完成後填入 Vercel 網址 |

6. 點擊 **Create Web Service**
7. 等待部署完成，記下 API URL (例如: `https://trailguide-api.onrender.com`)

---

## 步驟 3：部署前端到 Vercel

1. 前往 https://vercel.com 註冊/登入 (可用 GitHub 登入)
2. 點擊 **Add New** → **Project**
3. 匯入 GitHub repository: `yiqu26/Trail-Guide`
4. 設定：
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`

5. 設定環境變數：
   | Key | Value |
   |-----|-------|
   | `VITE_API_BASE_URL` | `https://trailguide-api.onrender.com/api` |

6. 點擊 **Deploy**
7. 完成！你的前端網址會是 `https://trail-guide-xxx.vercel.app`

---

## 連接字串格式轉換

Neon 提供的格式：
```
postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

轉換成 .NET 格式：
```
Host=ep-xxx.region.aws.neon.tech;Database=neondb;Username=username;Password=password;SSL Mode=Require
```

---

## 測試

部署完成後測試：
1. 開啟前端網址
2. 確認首頁有顯示步道資料
3. 測試登入功能 (test@example.com / Test123!)

---

## 常見問題

### Q: Render 免費方案會休眠？
A: 是的，15 分鐘無流量會休眠，首次訪問需等待約 30 秒喚醒。

### Q: 如何查看後端日誌？
A: 在 Render Dashboard → 你的服務 → Logs

### Q: 如何更新部署？
A: 推送程式碼到 GitHub，Render 和 Vercel 會自動重新部署。
