-- =============================================
-- Trail Guide 步道導覽系統 - 資料庫建立腳本
-- 執行順序: 001
-- =============================================

-- 建立資料庫
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'TrailGuideDB')
BEGIN
    CREATE DATABASE TrailGuideDB;
END
GO

USE TrailGuideDB;
GO

-- =============================================
-- 基礎資料表 (無外鍵依賴)
-- =============================================

-- 縣市
CREATE TABLE Counties (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- 地區/鄉鎮
CREATE TABLE Locations (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Zip NVARCHAR(10),
    CountyId INT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Locations_Counties FOREIGN KEY (CountyId) REFERENCES Counties(Id)
);

-- 國碼
CREATE TABLE CountryCodes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Code NVARCHAR(10) NOT NULL,
    Country NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- 步道分類
CREATE TABLE Classifications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- 標籤 (Chips)
CREATE TABLE Chips (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- =============================================
-- 用戶相關
-- =============================================

CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Name NVARCHAR(100),
    Avatar NVARCHAR(500),                    -- 改用 URL 而非 binary
    Gender BIT NULL,                          -- 1=男, 0=女, NULL=未指定
    PhoneNumber NVARCHAR(20),
    Birth DATE NULL,
    CountyId INT NULL,
    CountryCodeId INT NULL,

    -- 第三方登入
    GoogleId NVARCHAR(255) NULL,
    FacebookId NVARCHAR(255) NULL,
    AppleId NVARCHAR(255) NULL,

    -- 驗證相關
    EmailVerifiedAt DATETIME2 NULL,
    VerificationCode NVARCHAR(10) NULL,
    VerificationCodeExpiry DATETIME2 NULL,

    -- Token
    RefreshToken NVARCHAR(500) NULL,
    RefreshTokenExpiry DATETIME2 NULL,

    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_Users_Counties FOREIGN KEY (CountyId) REFERENCES Counties(Id),
    CONSTRAINT FK_Users_CountryCodes FOREIGN KEY (CountryCodeId) REFERENCES CountryCodes(Id)
);

-- =============================================
-- 步道相關
-- =============================================

CREATE TABLE Trails (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Latitude DECIMAL(10, 7),
    Longitude DECIMAL(10, 7),
    Distance INT,                             -- 公尺
    CoverImage NVARCHAR(500),                 -- 封面圖 URL
    Difficulty INT,                           -- 1-5 難度
    Evaluation DECIMAL(3, 2),                 -- 評價 (平均星數)
    Altitude INT,                             -- 海拔 (公尺)

    -- 擴充欄位
    Class NVARCHAR(50),                       -- 步道等級分類
    CostTime INT,                             -- 預估時間 (分鐘)
    RoadStatus NVARCHAR(200),                 -- 路況
    Intro NVARCHAR(MAX),                      -- 簡介
    TrailStatus NVARCHAR(MAX),                -- 步道狀態說明

    -- 關聯
    LocationId INT NULL,
    ClassificationId INT NULL,

    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_Trails_Locations FOREIGN KEY (LocationId) REFERENCES Locations(Id),
    CONSTRAINT FK_Trails_Classifications FOREIGN KEY (ClassificationId) REFERENCES Classifications(Id)
);

-- 步道相簿
CREATE TABLE TrailImages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TrailId INT NOT NULL,
    ImageUrl NVARCHAR(500) NOT NULL,
    SortOrder INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_TrailImages_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE
);

-- 步道入口
CREATE TABLE TrailHeads (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TrailId INT NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Latitude DECIMAL(10, 7),
    Longitude DECIMAL(10, 7),
    BannerImage NVARCHAR(500),
    Description NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_TrailHeads_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE
);

-- 步道標籤關聯 (多對多)
CREATE TABLE ChipTrails (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ChipId INT NOT NULL,
    TrailId INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_ChipTrails_Chips FOREIGN KEY (ChipId) REFERENCES Chips(Id) ON DELETE CASCADE,
    CONSTRAINT FK_ChipTrails_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_ChipTrails UNIQUE (ChipId, TrailId)
);

-- =============================================
-- 內容管理
-- =============================================

-- 精選集
CREATE TABLE Collections (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    SubTitle NVARCHAR(500),
    IconImage NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- 精選集-步道關聯 (多對多)
CREATE TABLE CollectionTrails (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CollectionId INT NOT NULL,
    TrailId INT NOT NULL,
    SortOrder INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_CollectionTrails_Collections FOREIGN KEY (CollectionId) REFERENCES Collections(Id) ON DELETE CASCADE,
    CONSTRAINT FK_CollectionTrails_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_CollectionTrails UNIQUE (CollectionId, TrailId)
);

-- 文章/專欄
CREATE TABLE Articles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Content NVARCHAR(MAX),
    CoverImage NVARCHAR(500),
    TrailId INT NULL,
    AuthorId INT NULL,
    PublishedAt DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Articles_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id),
    CONSTRAINT FK_Articles_Users FOREIGN KEY (AuthorId) REFERENCES Users(Id)
);

-- 公告
CREATE TABLE Announcements (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TrailId INT NULL,
    Title NVARCHAR(200) NOT NULL,
    ImageUrl NVARCHAR(500),
    Date DATE,
    Source NVARCHAR(200),
    Link NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Announcements_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE
);

-- 附近景點
CREATE TABLE Attractions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TrailId INT NOT NULL,
    Category NVARCHAR(50),                    -- 餐廳、停車場、景點等
    Title NVARCHAR(200) NOT NULL,
    Link NVARCHAR(500),
    Latitude DECIMAL(10, 7),
    Longitude DECIMAL(10, 7),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Attractions_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE
);

-- 橫幅廣告
CREATE TABLE Banners (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200),
    ImageUrl NVARCHAR(500) NOT NULL,
    Link NVARCHAR(500),
    SortOrder INT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- =============================================
-- 用戶互動
-- =============================================

-- 收藏
CREATE TABLE Favorites (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    TrailId INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Favorites_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Favorites_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_Favorites UNIQUE (UserId, TrailId)
);

-- 評論
CREATE TABLE Comments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    TrailId INT NOT NULL,
    Date DATE,
    Star INT,                                 -- 總評 1-5
    Difficulty INT,                           -- 難度評分 1-5
    Beauty INT,                               -- 風景評分 1-5
    Duration INT,                             -- 實際花費時間 (分鐘)
    Content NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Comments_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Comments_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE
);

-- 評論圖片
CREATE TABLE CommentImages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CommentId INT NOT NULL,
    ImageUrl NVARCHAR(500) NOT NULL,
    SortOrder INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_CommentImages_Comments FOREIGN KEY (CommentId) REFERENCES Comments(Id) ON DELETE CASCADE
);

-- 評論按讚
CREATE TABLE UserLikeComments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    CommentId INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_UserLikeComments_Users FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT FK_UserLikeComments_Comments FOREIGN KEY (CommentId) REFERENCES Comments(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_UserLikeComments UNIQUE (UserId, CommentId)
);

GO

PRINT '資料庫建立完成！'
