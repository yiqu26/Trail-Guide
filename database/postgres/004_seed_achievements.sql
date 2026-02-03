-- =============================================
-- Trail Guide 步道導覽系統 - 成就種子資料
-- 執行順序: 004
-- =============================================

-- =============================================
-- 里程碑成就 (Milestone)
-- =============================================

INSERT INTO Achievements (Code, Name, Description, Category, ConditionType, ConditionValue, SortOrder, Points, IsHidden) VALUES
-- 打卡次數里程碑
('first_checkin', '初次登頂', '完成第一次步道打卡', 'milestone', 'checkin_count', '{"count": 1}', 1, 10, FALSE),
('checkin_5', '步道新手', '累積 5 次步道打卡', 'milestone', 'checkin_count', '{"count": 5}', 2, 20, FALSE),
('checkin_10', '登山愛好者', '累積 10 次步道打卡', 'milestone', 'checkin_count', '{"count": 10}', 3, 30, FALSE),
('checkin_25', '步道達人', '累積 25 次步道打卡', 'milestone', 'checkin_count', '{"count": 25}', 4, 50, FALSE),
('checkin_50', '山林專家', '累積 50 次步道打卡', 'milestone', 'checkin_count', '{"count": 50}', 5, 80, FALSE),
('checkin_100', '百岳征服者', '累積 100 次步道打卡', 'milestone', 'checkin_count', '{"count": 100}', 6, 150, FALSE),

-- 不同步道數里程碑
('unique_3', '探索者', '完成 3 條不同步道', 'milestone', 'unique_trails', '{"count": 3}', 10, 15, FALSE),
('unique_10', '冒險家', '完成 10 條不同步道', 'milestone', 'unique_trails', '{"count": 10}', 11, 40, FALSE),
('unique_25', '步道收藏家', '完成 25 條不同步道', 'milestone', 'unique_trails', '{"count": 25}', 12, 70, FALSE),
('unique_50', '台灣走透透', '完成 50 條不同步道', 'milestone', 'unique_trails', '{"count": 50}', 13, 120, FALSE),

-- GPS 驗證里程碑
('verified_5', '定位達人', '完成 5 次 GPS 驗證打卡', 'milestone', 'verified_checkins', '{"count": 5}', 20, 25, FALSE),
('verified_20', '真實登山家', '完成 20 次 GPS 驗證打卡', 'milestone', 'verified_checkins', '{"count": 20}', 21, 60, FALSE);

-- =============================================
-- 難度挑戰 (Difficulty)
-- =============================================

INSERT INTO Achievements (Code, Name, Description, Category, ConditionType, ConditionValue, SortOrder, Points, IsHidden) VALUES
('difficulty_1', '輕鬆漫步', '完成一條難度 1 的步道', 'difficulty', 'difficulty_level', '{"difficulty": 1, "count": 1}', 30, 10, FALSE),
('difficulty_3', '穩健前行', '完成一條難度 3 的步道', 'difficulty', 'difficulty_level', '{"difficulty": 3, "count": 1}', 31, 25, FALSE),
('difficulty_5', '極限挑戰者', '完成一條難度 5 的步道', 'difficulty', 'difficulty_level', '{"difficulty": 5, "count": 1}', 32, 50, FALSE),
('difficulty_5_x3', '高手中的高手', '完成 3 條難度 5 的步道', 'difficulty', 'difficulty_level', '{"difficulty": 5, "count": 3}', 33, 100, FALSE),
('all_difficulties', '全能登山家', '完成難度 1-5 各至少一條步道', 'difficulty', 'all_difficulties', '{"difficulties": [1, 2, 3, 4, 5]}', 34, 80, FALSE);

-- =============================================
-- 地區探索 (Region) - 台灣主要縣市
-- =============================================

INSERT INTO Achievements (Code, Name, Description, Category, ConditionType, ConditionValue, SortOrder, Points, IsHidden) VALUES
('region_taipei', '台北探索者', '完成台北市的步道', 'region', 'region', '{"county": "台北市", "count": 1}', 50, 15, FALSE),
('region_newtaipei', '新北探索者', '完成新北市的步道', 'region', 'region', '{"county": "新北市", "count": 1}', 51, 15, FALSE),
('region_taoyuan', '桃園探索者', '完成桃園市的步道', 'region', 'region', '{"county": "桃園市", "count": 1}', 52, 15, FALSE),
('region_hsinchu', '新竹探索者', '完成新竹縣市的步道', 'region', 'region', '{"county": "新竹", "count": 1}', 53, 15, FALSE),
('region_miaoli', '苗栗探索者', '完成苗栗縣的步道', 'region', 'region', '{"county": "苗栗縣", "count": 1}', 54, 15, FALSE),
('region_taichung', '台中探索者', '完成台中市的步道', 'region', 'region', '{"county": "台中市", "count": 1}', 55, 15, FALSE),
('region_nantou', '南投探索者', '完成南投縣的步道', 'region', 'region', '{"county": "南投縣", "count": 1}', 56, 15, FALSE),
('region_changhua', '彰化探索者', '完成彰化縣的步道', 'region', 'region', '{"county": "彰化縣", "count": 1}', 57, 15, FALSE),
('region_yunlin', '雲林探索者', '完成雲林縣的步道', 'region', 'region', '{"county": "雲林縣", "count": 1}', 58, 15, FALSE),
('region_chiayi', '嘉義探索者', '完成嘉義縣市的步道', 'region', 'region', '{"county": "嘉義", "count": 1}', 59, 15, FALSE),
('region_tainan', '台南探索者', '完成台南市的步道', 'region', 'region', '{"county": "台南市", "count": 1}', 60, 15, FALSE),
('region_kaohsiung', '高雄探索者', '完成高雄市的步道', 'region', 'region', '{"county": "高雄市", "count": 1}', 61, 15, FALSE),
('region_pingtung', '屏東探索者', '完成屏東縣的步道', 'region', 'region', '{"county": "屏東縣", "count": 1}', 62, 15, FALSE),
('region_yilan', '宜蘭探索者', '完成宜蘭縣的步道', 'region', 'region', '{"county": "宜蘭縣", "count": 1}', 63, 15, FALSE),
('region_hualien', '花蓮探索者', '完成花蓮縣的步道', 'region', 'region', '{"county": "花蓮縣", "count": 1}', 64, 15, FALSE),
('region_taitung', '台東探索者', '完成台東縣的步道', 'region', 'region', '{"county": "台東縣", "count": 1}', 65, 15, FALSE),
('region_keelung', '基隆探索者', '完成基隆市的步道', 'region', 'region', '{"county": "基隆市", "count": 1}', 66, 15, FALSE);

-- =============================================
-- 隱藏成就 (Hidden)
-- =============================================

INSERT INTO Achievements (Code, Name, Description, Category, ConditionType, ConditionValue, SortOrder, Points, IsHidden) VALUES
('early_bird', '早起的鳥兒', '在早上 6 點前完成打卡', 'hidden', 'checkin_time', '{"before_hour": 6}', 100, 30, TRUE),
('night_hiker', '夜行者', '在晚上 8 點後完成打卡', 'hidden', 'checkin_time', '{"after_hour": 20}', 101, 30, TRUE),
('streak_7', '連續登山王', '連續 7 天都有打卡紀錄', 'hidden', 'streak_days', '{"days": 7}', 102, 100, TRUE);
