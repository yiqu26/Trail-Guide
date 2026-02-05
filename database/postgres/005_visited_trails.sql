-- =============================================
-- Trail Guide 步道導覽系統 - 已去過功能
-- 執行順序: 005
-- =============================================

-- 已去過步道（簡化版，取代複雜的打卡系統）
CREATE TABLE IF NOT EXISTS VisitedTrails (
    Id SERIAL PRIMARY KEY,
    UserId INT NOT NULL,
    TrailId INT NOT NULL,
    VisitedAt DATE,                               -- 去的日期（可選）
    CreatedAt TIMESTAMP DEFAULT NOW(),
    CONSTRAINT FK_VisitedTrails_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_VisitedTrails_Trails FOREIGN KEY (TrailId) REFERENCES Trails(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_VisitedTrails UNIQUE (UserId, TrailId)
);

-- 索引：加速查詢
CREATE INDEX IF NOT EXISTS IX_VisitedTrails_UserId ON VisitedTrails(UserId);
CREATE INDEX IF NOT EXISTS IX_VisitedTrails_TrailId ON VisitedTrails(TrailId);
