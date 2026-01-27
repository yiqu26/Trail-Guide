-- =============================================
-- Trail Guide - 匯入舊專案步道資料
-- 執行順序: 003
-- =============================================

USE TrailGuideDB;
GO

-- =============================================
-- 新增缺少的縣市/地區
-- =============================================

-- 檢查並新增缺少的縣市
IF NOT EXISTS (SELECT 1 FROM Counties WHERE Name = N'桃園市')
    INSERT INTO Counties (Name) VALUES (N'桃園市');

-- 新增缺少的地區
INSERT INTO Locations (Name, CountyId)
SELECT N'貢寮區', Id FROM Counties WHERE Name = N'新北市'
WHERE NOT EXISTS (SELECT 1 FROM Locations WHERE Name = N'貢寮區');

INSERT INTO Locations (Name, CountyId)
SELECT N'八里區', Id FROM Counties WHERE Name = N'新北市'
WHERE NOT EXISTS (SELECT 1 FROM Locations WHERE Name = N'八里區');

INSERT INTO Locations (Name, CountyId)
SELECT N'復興區', Id FROM Counties WHERE Name = N'桃園市'
WHERE NOT EXISTS (SELECT 1 FROM Locations WHERE Name = N'復興區');

INSERT INTO Locations (Name, CountyId)
SELECT N'鹿谷鄉', Id FROM Counties WHERE Name = N'南投縣'
WHERE NOT EXISTS (SELECT 1 FROM Locations WHERE Name = N'鹿谷鄉');

INSERT INTO Locations (Name, CountyId)
SELECT N'礁溪鄉', Id FROM Counties WHERE Name = N'宜蘭縣'
WHERE NOT EXISTS (SELECT 1 FROM Locations WHERE Name = N'礁溪鄉');

INSERT INTO Locations (Name, CountyId)
SELECT N'三芝區', Id FROM Counties WHERE Name = N'新北市'
WHERE NOT EXISTS (SELECT 1 FROM Locations WHERE Name = N'三芝區');

INSERT INTO Locations (Name, CountyId)
SELECT N'中和區', Id FROM Counties WHERE Name = N'新北市'
WHERE NOT EXISTS (SELECT 1 FROM Locations WHERE Name = N'中和區');

INSERT INTO Locations (Name, CountyId)
SELECT N'大安區', Id FROM Counties WHERE Name = N'臺北市'
WHERE NOT EXISTS (SELECT 1 FROM Locations WHERE Name = N'大安區');

INSERT INTO Locations (Name, CountyId)
SELECT N'桃源區', Id FROM Counties WHERE Name = N'高雄市'
WHERE NOT EXISTS (SELECT 1 FROM Locations WHERE Name = N'桃源區');

INSERT INTO Locations (Name, CountyId)
SELECT N'萬里區', Id FROM Counties WHERE Name = N'新北市'
WHERE NOT EXISTS (SELECT 1 FROM Locations WHERE Name = N'萬里區');

GO

-- =============================================
-- 匯入步道資料 (避免重複)
-- =============================================

-- 草嶺古道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'草嶺古道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'草嶺古道', 8500,
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    2, 4.5, 375, N'郊山步道', 240, N'水泥階梯',
    N'草嶺古道是淡蘭古道中的一段，橫跨新北市貢寮區與宜蘭縣頭城鎮，全長約8.5公里。沿途可見清代遺留的「雄鎮蠻煙」與「虎字碑」石碑，秋季時芒花盛開，景色壯觀。埡口處可遠眺龜山島與太平洋，是北台灣熱門的健行路線。',
    l.Id, 3, 25.0033, 121.9456
FROM Locations l WHERE l.Name = N'貢寮區';

-- 擎天崗環形步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'擎天崗環形步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'擎天崗環形步道', 2400,
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    1, 4.6, 811, N'郊山步道', 60, N'石板路',
    N'擎天崗位於陽明山國家公園內，海拔約800公尺，是大屯火山群中央的一片草原。步道平緩好走，沿途可見成群水牛悠閒吃草，天氣好時可遠眺台北盆地。春秋兩季最適合造訪，夏季午後常有雷陣雨，需注意天氣變化。',
    l.Id, 7, 25.1636, 121.5544
FROM Locations l WHERE l.Name = N'北投區';

-- 硬漢嶺步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'硬漢嶺步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'硬漢嶺步道', 1600,
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    2, 4.4, 616, N'郊山步道', 80, N'石階',
    N'硬漢嶺位於觀音山最高峰，海拔616公尺。步道名稱源自早期憲兵隊在此訓練時所設的「硬漢路」。沿途石階陡峭，但登頂後視野遼闊，可同時眺望淡水河、台北盆地及大屯山系。建議清晨或傍晚前往，可欣賞日出或夕陽美景。',
    l.Id, 3, 25.1275, 121.4267
FROM Locations l WHERE l.Name = N'八里區';

-- 十分瀑布步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'十分瀑布步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'十分瀑布步道', 1200,
    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800',
    1, 4.7, 190, N'瀑布步道', 50, N'柏油路、木棧道、石階',
    N'十分瀑布是台灣最大的簾幕式瀑布，落差約20公尺，有「台灣尼加拉瀑布」之稱。步道規劃完善，沿途設有觀景平台，可近距離欣賞瀑布的壯觀景象。搭配平溪線火車一日遊，可同時體驗放天燈的樂趣。',
    l.Id, 3, 25.0464, 121.7761
FROM Locations l WHERE l.Name = N'平溪區';

-- 合歡北峰步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'合歡北峰步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'合歡北峰步道', 2000,
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800',
    3, 4.8, 3422, N'高山步道', 180, N'枕木步道、箭竹山徑',
    N'合歡北峰海拔3,422公尺，為合歡群峰最高峰，也是台灣百岳之一。步道前段穿越茂密的箭竹林，登頂後視野開闘，可360度眺望中央山脈群峰。需注意高山症及天氣變化，建議有高山健行經驗者挑戰。',
    l.Id, 5, 24.1567, 121.2719
FROM Locations l WHERE l.Name = N'秀林鄉';

-- 東眼山自導式步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'東眼山自導式步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'東眼山自導式步道', 3500,
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
    1, 4.5, 1212, N'森林步道', 120, N'石階、枕木階、木棧道',
    N'東眼山國家森林遊樂區位於桃園市復興區，海拔約1,200公尺。自導式步道全程林蔭茂密，設有詳細的解說牌，是認識台灣中海拔森林生態的好去處。園區內還保留早期的集材運材遺跡，極具歷史價值。',
    l.Id, 3, 24.8189, 121.3658
FROM Locations l WHERE l.Name = N'復興區';

-- 溪頭觀景步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'溪頭觀景步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'溪頭觀景步道', 1100,
    'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?w=800',
    1, 4.4, 1233, N'森林步道', 20, N'碎石子、木屑',
    N'溪頭自然教育園區內的觀景步道，穿梭於高聳的柳杉林間，空氣清新宜人。步道平緩好走，終點設有觀景台，可俯瞰整個園區。適合各年齡層遊客，是避暑休閒的絕佳選擇。',
    l.Id, 3, 23.6728, 120.7972
FROM Locations l WHERE l.Name = N'鹿谷鄉';

-- 合歡東峰步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'合歡東峰步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'合歡東峰步道', 1100,
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    2, 4.7, 3421, N'高山步道', 150, N'石階、山徑、木棧道',
    N'合歡東峰海拔3,421公尺，是合歡群峰中展望最佳的山頭。從松雪樓旁的登山口出發，沿途可見玉山杜鵑及台灣冷杉。登頂後可同時眺望奇萊連峰、屏風山及中央尖山，是百岳入門的絕佳選擇。',
    l.Id, 5, 24.1419, 121.2806
FROM Locations l WHERE l.Name = N'仁愛鄉';

-- 合歡石門山步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'合歡石門山步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'合歡石門山步道', 784,
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    1, 4.9, 3237, N'高山步道', 60, N'木棧道、石階',
    N'石門山海拔3,237公尺，是台灣百岳中最容易親近的一座。從登山口到山頂僅需30分鐘，沿途鋪設完善的木棧道。山頂視野遼闘，可飽覽合歡群峰及奇萊山脈，非常適合初次挑戰百岳的登山者。',
    l.Id, 5, 24.1375, 121.2861
FROM Locations l WHERE l.Name = N'秀林鄉';

-- 五峰旗瀑布步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'五峰旗瀑布步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'五峰旗瀑布步道', 500,
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    1, 4.6, 164, N'瀑布步道', 40, N'木棧道、石板路、階梯',
    N'五峰旗瀑布位於宜蘭縣礁溪鄉，因瀑布分為五層如同旗幟排列而得名。步道平緩好走，沿途設有涼亭供休息。三層瀑布各有特色，水量豐沛時氣勢磅礡。遊覽後可順道前往礁溪溫泉區泡湯。',
    l.Id, 3, 24.8306, 121.7456
FROM Locations l WHERE l.Name = N'礁溪鄉';

-- 無耳茶壺山步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'無耳茶壺山步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'無耳茶壺山步道', 4500,
    'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800',
    2, 4.5, 580, N'郊山步道', 120, N'泥土路、木棧道、柏油路',
    N'茶壺山因山形酷似沒有把手的茶壺而得名，位於金瓜石地區。步道沿途可見昔日採礦遺跡，山頂視野極佳，可俯瞰陰陽海、基隆山及整個金瓜石聚落。建議與報時山、黃金博物館安排一日遊。',
    l.Id, 3, 25.1100, 121.8633
FROM Locations l WHERE l.Name = N'瑞芳區';

-- 劍潭山親山步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'劍潭山親山步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'劍潭山親山步道', 3300,
    'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800',
    1, 4.3, 190, N'郊山步道', 90, N'石階、石板路、木棧道',
    N'劍潭山位於士林區，是台北市區最容易抵達的親山步道之一。從劍潭捷運站出發，沿途經過多處觀景平台，可欣賞台北101及松山機場飛機起降。老地方觀機平台是賞夜景的熱門地點，吸引許多攝影愛好者前往。',
    l.Id, 3, 25.0847, 121.5250
FROM Locations l WHERE l.Name = N'士林區';

-- 夢幻湖步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'夢幻湖步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'夢幻湖步道', 3000,
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    1, 4.4, 904, N'生態步道', 70, N'石階、石板路',
    N'夢幻湖位於七星山東南山腰，是陽明山國家公園內的高山湖泊。湖中生長著世界僅存於此的台灣水韭，已列為生態保護區。步道沿途景色優美，常有雲霧繚繞，如夢似幻。可連走冷水坑、七星山形成環狀路線。',
    l.Id, 7, 25.1658, 121.5639
FROM Locations l WHERE l.Name = N'北投區';

-- 天母古道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'天母古道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'天母古道', 2600,
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800',
    1, 4.3, 300, N'郊山步道', 90, N'石階、原始路徑',
    N'天母古道又稱水管路步道，是早期天母地區汲取山泉水的運送路線。步道沿著黑色大水管蜿蜒而上，林蔭茂密，夏日涼爽宜人。沿途可見日治時期的水道設施遺跡，是台北市區熱門的晨運路線。',
    l.Id, 3, 25.1197, 121.5350
FROM Locations l WHERE l.Name = N'北投區';

-- 大屯主峰步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'大屯主峰步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'大屯主峰步道', 900,
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    2, 4.5, 1092, N'郊山步道', 90, N'石階、石板路',
    N'大屯山主峰海拔1,092公尺，是大屯火山群的最高峰。從鞍部停車場出發，沿著陡峭的石階攀升，約45分鐘可登頂。山頂視野遼闘，可同時眺望台北盆地、淡水河口及七星山。秋冬季節芒花盛開，景色迷人。',
    l.Id, 3, 25.1756, 121.5194
FROM Locations l WHERE l.Name = N'北投區';

-- 虎山親山步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'虎山親山步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'虎山親山步道', 2500,
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    1, 4.2, 130, N'郊山步道', 150, N'水泥路、石板路、石階',
    N'虎山是四獸山步道系統的一部分，鄰近松山奉天宮。步道規劃完善，沿途設有多處涼亭及觀景平台。虎山峰頂及虎山溪步道是熱門路段，可欣賞螢火蟲生態。交通便利，是台北市民假日健行的好選擇。',
    l.Id, 3, 25.0322, 121.5833
FROM Locations l WHERE l.Name = N'信義區';

-- 林美石磐步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'林美石磐步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'林美石磐步道', 1700,
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    1, 4.6, 300, N'溪谷步道', 60, N'原始路徑、木棧道、碎石路',
    N'林美石磐步道位於宜蘭礁溪，因溪谷中巨大的石磐而得名。步道沿著得子口溪而建，沿途綠意盎然，溪水清澈。石磐瀑布是步道精華所在，水流沖刷形成天然滑水道。夏季戲水消暑，深受親子遊客喜愛。',
    l.Id, 3, 24.8478, 121.7325
FROM Locations l WHERE l.Name = N'礁溪鄉';

-- 烘爐地登山步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'烘爐地登山步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'烘爐地登山步道', 2000,
    'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800',
    2, 4.3, 302, N'郊山步道', 120, N'石階、水泥、泥土路',
    N'烘爐地位於新北市中和區，以南山福德宮土地公廟聞名。步道入口處有巨大的土地公神像，夜間點燈時相當壯觀。登頂後可俯瞰大台北地區夜景，是北部賞夜景的熱門地點。廟方設有參拜祈福服務，假日人潮眾多。',
    l.Id, 3, 24.9728, 121.4947
FROM Locations l WHERE l.Name = N'中和區';

-- 玉山主峰步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'玉山主峰步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'玉山主峰步道', 10900,
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800',
    5, 4.9, 3952, N'高山步道', 1440, N'土石山徑、木棧橋、碎石坡',
    N'玉山主峰海拔3,952公尺，是台灣最高峰，也是東北亞第一高峰。攀登玉山需事先申請入園及入山許可，建議安排兩天一夜行程並住宿排雲山莊。沿途景觀多變，從亞熱帶森林到高山草原，是登山者畢生必訪的聖山。',
    l.Id, 5, 23.4700, 120.9575
FROM Locations l WHERE l.Name = N'桃源區';

-- 五寮尖登山步道
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'五寮尖登山步道')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'五寮尖登山步道', 5500,
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    4, 4.4, 639, N'岩稜步道', 300, N'土石樹根路、枕木步道、繩梯',
    N'五寮尖位於新北市三峽區，因山頂有五座尖峰而得名，有「北部三尖之首」美譽。全程需攀爬多處岩壁、拉繩、走稜線，具有相當挑戰性。沿途展望極佳，可眺望大台北地區及插天山脈。建議有攀岩經驗者挑戰。',
    l.Id, 4, 24.8917, 121.3917
FROM Locations l WHERE l.Name = N'三峽區';

-- 奧萬大步道群
IF NOT EXISTS (SELECT 1 FROM Trails WHERE Title = N'奧萬大國家森林遊樂區步道群')
INSERT INTO Trails (Title, Distance, CoverImage, Difficulty, Evaluation, Altitude, Class, CostTime, RoadStatus, Intro, LocationId, ClassificationId, Latitude, Longitude)
SELECT N'奧萬大國家森林遊樂區步道群', 7000,
    'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?w=800',
    2, 4.6, 2600, N'森林步道', 360, N'柏油路、山徑、木階梯、吊橋',
    N'奧萬大國家森林遊樂區位於南投縣仁愛鄉，以楓紅聞名全台。園區內有多條步道可選擇，楓林步道及賞鳥步道最受歡迎。每年深秋楓葉轉紅時節，滿山遍野的楓紅景色令人驚艷。園區也是賞鳥勝地，可觀察多種台灣特有鳥類。',
    l.Id, 4, 24.0250, 121.1722
FROM Locations l WHERE l.Name = N'仁愛鄉';

GO

-- =============================================
-- 新增步道標籤關聯
-- =============================================

-- 草嶺古道: 賞花、生態豐富
INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'賞花' AND t.Title = N'草嶺古道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'生態豐富' AND t.Title = N'草嶺古道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

-- 擎天崗: 親子友善、攝影熱點
INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'親子友善' AND t.Title = N'擎天崗環形步道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'攝影熱點' AND t.Title = N'擎天崗環形步道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

-- 十分瀑布: 瀑布、親子友善
INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'瀑布' AND t.Title = N'十分瀑布步道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'親子友善' AND t.Title = N'十分瀑布步道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

-- 合歡北峰: 日出、登頂
INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'日出' AND t.Title = N'合歡北峰步道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'登頂' AND t.Title = N'合歡北峰步道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

-- 東眼山: 森林浴、生態豐富
INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'森林浴' AND t.Title = N'東眼山自導式步道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'生態豐富' AND t.Title = N'東眼山自導式步道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

-- 五峰旗瀑布: 瀑布、親子友善
INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'瀑布' AND t.Title = N'五峰旗瀑布步道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'親子友善' AND t.Title = N'五峰旗瀑布步道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

-- 石門山: 日出、登頂、親子友善
INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'日出' AND t.Title = N'合歡石門山步道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'登頂' AND t.Title = N'合歡石門山步道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'親子友善' AND t.Title = N'合歡石門山步道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

-- 玉山主峰: 日出、登頂
INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'日出' AND t.Title = N'玉山主峰步道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'登頂' AND t.Title = N'玉山主峰步道'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

-- 奧萬大: 賞楓、森林浴
INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'賞楓' AND t.Title = N'奧萬大國家森林遊樂區步道群'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

INSERT INTO ChipTrails (ChipId, TrailId)
SELECT c.Id, t.Id FROM Chips c, Trails t
WHERE c.Name = N'森林浴' AND t.Title = N'奧萬大國家森林遊樂區步道群'
AND NOT EXISTS (SELECT 1 FROM ChipTrails WHERE ChipId = c.Id AND TrailId = t.Id);

GO

-- =============================================
-- 更新精選集
-- =============================================

-- 新增步道到「百岳入門挑戰」
INSERT INTO CollectionTrails (CollectionId, TrailId, SortOrder)
SELECT c.Id, t.Id, 3 FROM Collections c, Trails t
WHERE c.Name = N'百岳入門挑戰' AND t.Title = N'合歡北峰步道'
AND NOT EXISTS (SELECT 1 FROM CollectionTrails WHERE CollectionId = c.Id AND TrailId = t.Id);

INSERT INTO CollectionTrails (CollectionId, TrailId, SortOrder)
SELECT c.Id, t.Id, 4 FROM Collections c, Trails t
WHERE c.Name = N'百岳入門挑戰' AND t.Title = N'合歡東峰步道'
AND NOT EXISTS (SELECT 1 FROM CollectionTrails WHERE CollectionId = c.Id AND TrailId = t.Id);

INSERT INTO CollectionTrails (CollectionId, TrailId, SortOrder)
SELECT c.Id, t.Id, 5 FROM Collections c, Trails t
WHERE c.Name = N'百岳入門挑戰' AND t.Title = N'合歡石門山步道'
AND NOT EXISTS (SELECT 1 FROM CollectionTrails WHERE CollectionId = c.Id AND TrailId = t.Id);

-- 新增步道到「瀑布秘境探險」
INSERT INTO CollectionTrails (CollectionId, TrailId, SortOrder)
SELECT c.Id, t.Id, 4 FROM Collections c, Trails t
WHERE c.Name = N'瀑布秘境探險' AND t.Title = N'十分瀑布步道'
AND NOT EXISTS (SELECT 1 FROM CollectionTrails WHERE CollectionId = c.Id AND TrailId = t.Id);

INSERT INTO CollectionTrails (CollectionId, TrailId, SortOrder)
SELECT c.Id, t.Id, 5 FROM Collections c, Trails t
WHERE c.Name = N'瀑布秘境探險' AND t.Title = N'五峰旗瀑布步道'
AND NOT EXISTS (SELECT 1 FROM CollectionTrails WHERE CollectionId = c.Id AND TrailId = t.Id);

-- 新增步道到「親子同遊首選」
INSERT INTO CollectionTrails (CollectionId, TrailId, SortOrder)
SELECT c.Id, t.Id, 5 FROM Collections c, Trails t
WHERE c.Name = N'親子同遊首選' AND t.Title = N'擎天崗環形步道'
AND NOT EXISTS (SELECT 1 FROM CollectionTrails WHERE CollectionId = c.Id AND TrailId = t.Id);

INSERT INTO CollectionTrails (CollectionId, TrailId, SortOrder)
SELECT c.Id, t.Id, 6 FROM Collections c, Trails t
WHERE c.Name = N'親子同遊首選' AND t.Title = N'溪頭觀景步道'
AND NOT EXISTS (SELECT 1 FROM CollectionTrails WHERE CollectionId = c.Id AND TrailId = t.Id);

GO

PRINT '舊專案資料匯入完成！';

-- 顯示匯入結果
SELECT '總步道數' as [項目], COUNT(*) as [數量] FROM Trails
UNION ALL
SELECT '總精選集步道關聯', COUNT(*) FROM CollectionTrails
UNION ALL
SELECT '總標籤關聯', COUNT(*) FROM ChipTrails;

GO
