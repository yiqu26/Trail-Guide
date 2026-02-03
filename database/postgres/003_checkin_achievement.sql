-- =============================================
-- Trail Guide 步道導覽系統 - 打卡與成就系統
-- 執行順序: 003
-- =============================================

-- =============================================
-- 打卡相關
-- =============================================

-- 打卡紀錄
CREATE TABLE Checkins (
    Id SERIAL PRIMARY KEY,
    UserId INT NOT NULL,
    TrailId INT NOT NULL,
    CheckinTime TIMESTAMP NOT NULL DEFAULT NOW(),
    Latitude DECIMAL(10, 7),                      -- 打卡時的 GPS 緯度
    Longitude DECIMAL(10, 7),                     -- 打卡時的 GPS 經度
    IsLocationVerified BOOLEAN DEFAULT FALSE,     -- GPS 是否在步道範圍內 (1km)
    DistanceFromTrail DECIMAL(10, 2),             -- 與步道的距離 (公尺)
    Note TEXT,                                    -- 心得
    DurationMinutes INT,                          -- 花費時間 (分鐘)
    CreatedAt TIMESTAMP DEFAULT NOW(),
    UpdatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT FK_Checkins_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Checkins_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE
);

-- 打卡照片
CREATE TABLE CheckinImages (
    Id SERIAL PRIMARY KEY,
    CheckinId INT NOT NULL,
    ImageUrl VARCHAR(500) NOT NULL,
    SortOrder INT DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT FK_CheckinImages_Checkins FOREIGN KEY (CheckinId) REFERENCES Checkins(Id) ON DELETE CASCADE
);

-- 索引：加速查詢
CREATE INDEX IX_Checkins_UserId ON Checkins(UserId);
CREATE INDEX IX_Checkins_TrailId ON Checkins(TrailId);
CREATE INDEX IX_Checkins_CheckinTime ON Checkins(CheckinTime DESC);

-- =============================================
-- 成就相關
-- =============================================

-- 成就定義（系統預設）
CREATE TABLE Achievements (
    Id SERIAL PRIMARY KEY,
    Code VARCHAR(50) NOT NULL UNIQUE,             -- 唯一識別碼 (如 first_checkin, trail_master_10)
    Name VARCHAR(100) NOT NULL,                   -- 成就名稱
    Description VARCHAR(500),                     -- 成就描述
    IconUrl VARCHAR(500),                         -- 徽章圖示 URL
    Category VARCHAR(50) NOT NULL,                -- 類別: milestone, difficulty, region, hidden
    ConditionType VARCHAR(50) NOT NULL,           -- 條件類型: checkin_count, unique_trails, verified_checkins, difficulty_level, region
    ConditionValue JSONB NOT NULL,                -- 條件值 (JSON 格式)
    SortOrder INT DEFAULT 0,
    Points INT DEFAULT 10,                        -- 成就點數
    IsHidden BOOLEAN DEFAULT FALSE,               -- 是否為隱藏成就
    CreatedAt TIMESTAMP DEFAULT NOW(),
    UpdatedAt TIMESTAMP DEFAULT NOW()
);

-- 用戶已解鎖成就
CREATE TABLE UserAchievements (
    Id SERIAL PRIMARY KEY,
    UserId INT NOT NULL,
    AchievementId INT NOT NULL,
    UnlockedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    CheckinId INT,                                -- 觸發解鎖的打卡 ID (可選)
    CreatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT FK_UserAchievements_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_UserAchievements_Achievements FOREIGN KEY (AchievementId) REFERENCES Achievements(Id) ON DELETE CASCADE,
    CONSTRAINT FK_UserAchievements_Checkins FOREIGN KEY (CheckinId) REFERENCES Checkins(Id) ON DELETE SET NULL,
    CONSTRAINT UQ_UserAchievements UNIQUE (UserId, AchievementId)
);

-- 索引：加速查詢
CREATE INDEX IX_UserAchievements_UserId ON UserAchievements(UserId);
CREATE INDEX IX_Achievements_Category ON Achievements(Category);
CREATE INDEX IX_Achievements_IsHidden ON Achievements(IsHidden);
