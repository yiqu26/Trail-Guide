-- =============================================
-- Trail Guide 步道導覽系統 - PostgreSQL 資料庫建立腳本
-- 執行順序: 001
-- =============================================

-- =============================================
-- 基礎資料表 (無外鍵依賴)
-- =============================================

-- 縣市
CREATE TABLE Counties (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    UpdatedAt TIMESTAMP DEFAULT NOW()
);

-- 地區/鄉鎮
CREATE TABLE Locations (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Zip VARCHAR(10),
    CountyId INT NULL,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    UpdatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT FK_Locations_Counties FOREIGN KEY (CountyId) REFERENCES Counties(Id)
);

-- 國碼
CREATE TABLE CountryCodes (
    Id SERIAL PRIMARY KEY,
    Code VARCHAR(10) NOT NULL,
    Country VARCHAR(100) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    UpdatedAt TIMESTAMP DEFAULT NOW()
);

-- 步道分類
CREATE TABLE Classifications (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    UpdatedAt TIMESTAMP DEFAULT NOW()
);

-- 標籤 (Chips)
CREATE TABLE Chips (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    UpdatedAt TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 用戶相關
-- =============================================

CREATE TABLE Users (
    Id SERIAL PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Name VARCHAR(100),
    Avatar VARCHAR(500),
    Gender BOOLEAN NULL,                          -- true=男, false=女, NULL=未指定
    PhoneNumber VARCHAR(20),
    Birth DATE NULL,
    CountyId INT NULL,
    CountryCodeId INT NULL,

    -- 第三方登入
    GoogleId VARCHAR(255) NULL,
    FacebookId VARCHAR(255) NULL,
    AppleId VARCHAR(255) NULL,

    -- 驗證相關
    EmailVerifiedAt TIMESTAMP NULL,
    VerificationCode VARCHAR(10) NULL,
    VerificationCodeExpiry TIMESTAMP NULL,

    -- Token
    RefreshToken VARCHAR(500) NULL,
    RefreshTokenExpiry TIMESTAMP NULL,

    CreatedAt TIMESTAMP DEFAULT NOW(),
    UpdatedAt TIMESTAMP DEFAULT NOW(),

    CONSTRAINT FK_Users_Counties FOREIGN KEY (CountyId) REFERENCES Counties(Id),
    CONSTRAINT FK_Users_CountryCodes FOREIGN KEY (CountryCodeId) REFERENCES CountryCodes(Id)
);

-- =============================================
-- 步道相關
-- =============================================

CREATE TABLE Trails (
    Id SERIAL PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Latitude DECIMAL(10, 7),
    Longitude DECIMAL(10, 7),
    Distance INT,                             -- 公尺
    CoverImage VARCHAR(500),                  -- 封面圖 URL
    Difficulty INT,                           -- 1-5 難度
    Evaluation DECIMAL(3, 2),                 -- 評價 (平均星數)
    Altitude INT,                             -- 海拔 (公尺)

    -- 擴充欄位
    Class VARCHAR(50),                        -- 步道等級分類
    CostTime INT,                             -- 預估時間 (分鐘)
    RoadStatus VARCHAR(200),                  -- 路況
    Intro TEXT,                               -- 簡介
    TrailStatus TEXT,                         -- 步道狀態說明

    -- 關聯
    LocationId INT NULL,
    ClassificationId INT NULL,

    CreatedAt TIMESTAMP DEFAULT NOW(),
    UpdatedAt TIMESTAMP DEFAULT NOW(),

    CONSTRAINT FK_Trails_Locations FOREIGN KEY (LocationId) REFERENCES Locations(Id),
    CONSTRAINT FK_Trails_Classifications FOREIGN KEY (ClassificationId) REFERENCES Classifications(Id)
);

-- 步道相簿
CREATE TABLE TrailImages (
    Id SERIAL PRIMARY KEY,
    TrailId INT NOT NULL,
    ImageUrl VARCHAR(500) NOT NULL,
    SortOrder INT DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT FK_TrailImages_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE
);

-- 步道入口
CREATE TABLE TrailHeads (
    Id SERIAL PRIMARY KEY,
    TrailId INT NOT NULL,
    Name VARCHAR(200) NOT NULL,
    Latitude DECIMAL(10, 7),
    Longitude DECIMAL(10, 7),
    BannerImage VARCHAR(500),
    Description TEXT,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    UpdatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT FK_TrailHeads_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE
);

-- 步道標籤關聯 (多對多)
CREATE TABLE ChipTrails (
    Id SERIAL PRIMARY KEY,
    ChipId INT NOT NULL,
    TrailId INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT FK_ChipTrails_Chips FOREIGN KEY (ChipId) REFERENCES Chips(Id) ON DELETE CASCADE,
    CONSTRAINT FK_ChipTrails_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_ChipTrails UNIQUE (ChipId, TrailId)
);

-- =============================================
-- 內容管理
-- =============================================

-- 精選集
CREATE TABLE Collections (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    SubTitle VARCHAR(500),
    IconImage VARCHAR(500),
    CreatedAt TIMESTAMP DEFAULT NOW(),
    UpdatedAt TIMESTAMP DEFAULT NOW()
);

-- 精選集-步道關聯 (多對多)
CREATE TABLE CollectionTrails (
    Id SERIAL PRIMARY KEY,
    CollectionId INT NOT NULL,
    TrailId INT NOT NULL,
    SortOrder INT DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT FK_CollectionTrails_Collections FOREIGN KEY (CollectionId) REFERENCES Collections(Id) ON DELETE CASCADE,
    CONSTRAINT FK_CollectionTrails_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_CollectionTrails UNIQUE (CollectionId, TrailId)
);

-- 文章/專欄
CREATE TABLE Articles (
    Id SERIAL PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Content TEXT,
    CoverImage VARCHAR(500),
    TrailId INT NULL,
    AuthorId INT NULL,
    PublishedAt TIMESTAMP,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    UpdatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT FK_Articles_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id),
    CONSTRAINT FK_Articles_Users FOREIGN KEY (AuthorId) REFERENCES Users(Id)
);

-- 公告
CREATE TABLE Announcements (
    Id SERIAL PRIMARY KEY,
    TrailId INT NULL,
    Title VARCHAR(200) NOT NULL,
    ImageUrl VARCHAR(500),
    Date DATE,
    Source VARCHAR(200),
    Link VARCHAR(500),
    CreatedAt TIMESTAMP DEFAULT NOW(),
    UpdatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT FK_Announcements_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE
);

-- 附近景點
CREATE TABLE Attractions (
    Id SERIAL PRIMARY KEY,
    TrailId INT NOT NULL,
    Category VARCHAR(50),                     -- 餐廳、停車場、景點等
    Title VARCHAR(200) NOT NULL,
    Link VARCHAR(500),
    Latitude DECIMAL(10, 7),
    Longitude DECIMAL(10, 7),
    CreatedAt TIMESTAMP DEFAULT NOW(),
    UpdatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT FK_Attractions_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE
);

-- 橫幅廣告
CREATE TABLE Banners (
    Id SERIAL PRIMARY KEY,
    Title VARCHAR(200),
    ImageUrl VARCHAR(500) NOT NULL,
    Link VARCHAR(500),
    SortOrder INT DEFAULT 0,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    UpdatedAt TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 用戶互動
-- =============================================

-- 收藏
CREATE TABLE Favorites (
    Id SERIAL PRIMARY KEY,
    UserId INT NOT NULL,
    TrailId INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT FK_Favorites_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Favorites_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_Favorites UNIQUE (UserId, TrailId)
);

-- 評論
CREATE TABLE Comments (
    Id SERIAL PRIMARY KEY,
    UserId INT NOT NULL,
    TrailId INT NOT NULL,
    Date DATE,
    Star INT,                                 -- 總評 1-5
    Difficulty INT,                           -- 難度評分 1-5
    Beauty INT,                               -- 風景評分 1-5
    Duration INT,                             -- 實際花費時間 (分鐘)
    Content TEXT,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    UpdatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT FK_Comments_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Comments_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE
);

-- 評論圖片
CREATE TABLE CommentImages (
    Id SERIAL PRIMARY KEY,
    CommentId INT NOT NULL,
    ImageUrl VARCHAR(500) NOT NULL,
    SortOrder INT DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT FK_CommentImages_Comments FOREIGN KEY (CommentId) REFERENCES Comments(Id) ON DELETE CASCADE
);

-- 評論按讚
CREATE TABLE UserLikeComments (
    Id SERIAL PRIMARY KEY,
    UserId INT NOT NULL,
    CommentId INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT FK_UserLikeComments_Users FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT FK_UserLikeComments_Comments FOREIGN KEY (CommentId) REFERENCES Comments(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_UserLikeComments UNIQUE (UserId, CommentId)
);
