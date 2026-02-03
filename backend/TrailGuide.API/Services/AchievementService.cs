using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using TrailGuide.API.Data;
using TrailGuide.API.Models.Domain;
using TrailGuide.API.Models.DTOs;

namespace TrailGuide.API.Services;

public interface IAchievementService
{
    Task<List<AchievementDto>> CheckAndUnlockAchievements(int userId, Checkin checkin);
    Task<MyAchievementsDto> GetUserAchievements(int userId);
    Task<CheckinStatsDto> GetUserCheckinStats(int userId);
}

public class AchievementService : IAchievementService
{
    private readonly TrailGuideDbContext _context;

    public AchievementService(TrailGuideDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// 打卡後檢查並解鎖成就
    /// </summary>
    public async Task<List<AchievementDto>> CheckAndUnlockAchievements(int userId, Checkin checkin)
    {
        var unlockedAchievements = new List<AchievementDto>();

        // 取得用戶尚未解鎖的成就
        var unlockedIds = await _context.UserAchievements
            .Where(ua => ua.UserId == userId)
            .Select(ua => ua.AchievementId)
            .ToListAsync();

        var pendingAchievements = await _context.Achievements
            .Where(a => !unlockedIds.Contains(a.Id))
            .ToListAsync();

        if (!pendingAchievements.Any())
            return unlockedAchievements;

        // 計算用戶統計數據
        var stats = await CalculateUserStats(userId);

        // 取得此次打卡的步道資訊
        var trail = await _context.Trails
            .Include(t => t.Location)
                .ThenInclude(l => l!.County)
            .FirstOrDefaultAsync(t => t.Id == checkin.TrailId);

        foreach (var achievement in pendingAchievements)
        {
            var isUnlocked = await CheckAchievementCondition(achievement, stats, checkin, trail);

            if (isUnlocked)
            {
                var userAchievement = new UserAchievement
                {
                    UserId = userId,
                    AchievementId = achievement.Id,
                    CheckinId = checkin.Id,
                    UnlockedAt = DateTime.UtcNow
                };

                _context.UserAchievements.Add(userAchievement);

                unlockedAchievements.Add(new AchievementDto
                {
                    Id = achievement.Id,
                    Code = achievement.Code,
                    Name = achievement.Name,
                    Description = achievement.Description,
                    IconUrl = achievement.IconUrl,
                    Category = achievement.Category,
                    Points = achievement.Points,
                    IsHidden = achievement.IsHidden,
                    SortOrder = achievement.SortOrder
                });
            }
        }

        if (unlockedAchievements.Any())
        {
            await _context.SaveChangesAsync();
        }

        return unlockedAchievements;
    }

    /// <summary>
    /// 取得用戶成就進度
    /// </summary>
    public async Task<MyAchievementsDto> GetUserAchievements(int userId)
    {
        var userUnlocked = await _context.UserAchievements
            .Where(ua => ua.UserId == userId)
            .ToDictionaryAsync(ua => ua.AchievementId, ua => ua.UnlockedAt);

        var stats = await CalculateUserStats(userId);

        // 取得所有成就（非隱藏 + 已解鎖的隱藏成就）
        var achievements = await _context.Achievements
            .Where(a => !a.IsHidden || userUnlocked.Keys.Contains(a.Id))
            .OrderBy(a => a.SortOrder)
            .ToListAsync();

        var result = new MyAchievementsDto
        {
            TotalCount = achievements.Count,
            UnlockedCount = userUnlocked.Count,
            TotalPoints = achievements.Where(a => userUnlocked.ContainsKey(a.Id)).Sum(a => a.Points),
            Achievements = new List<UserAchievementProgressDto>()
        };

        foreach (var achievement in achievements)
        {
            var isUnlocked = userUnlocked.ContainsKey(achievement.Id);
            var (progress, target) = CalculateProgress(achievement, stats);

            result.Achievements.Add(new UserAchievementProgressDto
            {
                Id = achievement.Id,
                Code = achievement.Code,
                Name = achievement.Name,
                Description = achievement.Description,
                IconUrl = achievement.IconUrl,
                Category = achievement.Category,
                Points = achievement.Points,
                IsHidden = achievement.IsHidden,
                SortOrder = achievement.SortOrder,
                IsUnlocked = isUnlocked,
                UnlockedAt = isUnlocked ? userUnlocked[achievement.Id] : null,
                Progress = progress,
                Target = target
            });
        }

        return result;
    }

    /// <summary>
    /// 取得用戶打卡統計
    /// </summary>
    public async Task<CheckinStatsDto> GetUserCheckinStats(int userId)
    {
        var checkins = await _context.Checkins
            .Include(c => c.Trail)
            .Where(c => c.UserId == userId)
            .ToListAsync();

        var achievements = await _context.UserAchievements
            .Include(ua => ua.Achievement)
            .Where(ua => ua.UserId == userId)
            .ToListAsync();

        var difficultyDistribution = checkins
            .Where(c => c.Trail?.Difficulty != null)
            .GroupBy(c => c.Trail!.Difficulty!.Value)
            .ToDictionary(g => g.Key, g => g.Count());

        return new CheckinStatsDto
        {
            TotalCheckins = checkins.Count,
            UniqueTrails = checkins.Select(c => c.TrailId).Distinct().Count(),
            VerifiedCheckins = checkins.Count(c => c.IsLocationVerified),
            TotalMinutes = checkins.Sum(c => c.DurationMinutes ?? 0),
            TotalPoints = achievements.Sum(ua => ua.Achievement?.Points ?? 0),
            AchievementCount = achievements.Count,
            DifficultyDistribution = difficultyDistribution,
            FirstCheckinDate = checkins.OrderBy(c => c.CheckinTime).FirstOrDefault()?.CheckinTime,
            LastCheckinDate = checkins.OrderByDescending(c => c.CheckinTime).FirstOrDefault()?.CheckinTime
        };
    }

    // =============================================
    // Private Methods
    // =============================================

    private async Task<UserStats> CalculateUserStats(int userId)
    {
        var checkins = await _context.Checkins
            .Include(c => c.Trail)
                .ThenInclude(t => t!.Location)
                    .ThenInclude(l => l!.County)
            .Where(c => c.UserId == userId)
            .ToListAsync();

        var stats = new UserStats
        {
            TotalCheckins = checkins.Count,
            UniqueTrails = checkins.Select(c => c.TrailId).Distinct().Count(),
            VerifiedCheckins = checkins.Count(c => c.IsLocationVerified),
            DifficultyCounts = checkins
                .Where(c => c.Trail?.Difficulty != null)
                .GroupBy(c => c.Trail!.Difficulty!.Value)
                .ToDictionary(g => g.Key, g => g.Count()),
            RegionCounts = checkins
                .Where(c => c.Trail?.Location?.County != null)
                .GroupBy(c => c.Trail!.Location!.County!.Name)
                .ToDictionary(g => g.Key, g => g.Count()),
            CheckinDates = checkins.Select(c => c.CheckinTime.Date).Distinct().OrderBy(d => d).ToList()
        };

        return stats;
    }

    private async Task<bool> CheckAchievementCondition(Achievement achievement, UserStats stats, Checkin checkin, Trail? trail)
    {
        try
        {
            var condition = JsonSerializer.Deserialize<JsonElement>(achievement.ConditionValue);

            return achievement.ConditionType switch
            {
                "checkin_count" => CheckCheckinCount(condition, stats),
                "unique_trails" => CheckUniqueTrails(condition, stats),
                "verified_checkins" => CheckVerifiedCheckins(condition, stats),
                "difficulty_level" => CheckDifficultyLevel(condition, stats, trail),
                "all_difficulties" => CheckAllDifficulties(condition, stats),
                "region" => CheckRegion(condition, stats, trail),
                "checkin_time" => CheckCheckinTime(condition, checkin),
                "streak_days" => await CheckStreakDays(condition, stats),
                _ => false
            };
        }
        catch
        {
            return false;
        }
    }

    private bool CheckCheckinCount(JsonElement condition, UserStats stats)
    {
        if (condition.TryGetProperty("count", out var countElement))
        {
            var requiredCount = countElement.GetInt32();
            return stats.TotalCheckins >= requiredCount;
        }
        return false;
    }

    private bool CheckUniqueTrails(JsonElement condition, UserStats stats)
    {
        if (condition.TryGetProperty("count", out var countElement))
        {
            var requiredCount = countElement.GetInt32();
            return stats.UniqueTrails >= requiredCount;
        }
        return false;
    }

    private bool CheckVerifiedCheckins(JsonElement condition, UserStats stats)
    {
        if (condition.TryGetProperty("count", out var countElement))
        {
            var requiredCount = countElement.GetInt32();
            return stats.VerifiedCheckins >= requiredCount;
        }
        return false;
    }

    private bool CheckDifficultyLevel(JsonElement condition, UserStats stats, Trail? trail)
    {
        if (condition.TryGetProperty("difficulty", out var diffElement) &&
            condition.TryGetProperty("count", out var countElement))
        {
            var requiredDifficulty = diffElement.GetInt32();
            var requiredCount = countElement.GetInt32();

            // 檢查目前打卡的步道是否符合難度
            if (trail?.Difficulty != requiredDifficulty)
                return false;

            // 檢查該難度的打卡次數
            var count = stats.DifficultyCounts.GetValueOrDefault(requiredDifficulty, 0);
            return count >= requiredCount;
        }
        return false;
    }

    private bool CheckAllDifficulties(JsonElement condition, UserStats stats)
    {
        if (condition.TryGetProperty("difficulties", out var difficultiesElement))
        {
            var requiredDifficulties = new List<int>();
            foreach (var item in difficultiesElement.EnumerateArray())
            {
                requiredDifficulties.Add(item.GetInt32());
            }

            return requiredDifficulties.All(d => stats.DifficultyCounts.ContainsKey(d) && stats.DifficultyCounts[d] > 0);
        }
        return false;
    }

    private bool CheckRegion(JsonElement condition, UserStats stats, Trail? trail)
    {
        if (condition.TryGetProperty("county", out var countyElement) &&
            condition.TryGetProperty("count", out var countElement))
        {
            var requiredCounty = countyElement.GetString() ?? "";
            var requiredCount = countElement.GetInt32();

            // 檢查目前打卡的步道是否在該縣市
            var trailCounty = trail?.Location?.County?.Name ?? "";
            if (!trailCounty.Contains(requiredCounty) && !requiredCounty.Contains(trailCounty))
                return false;

            // 檢查該縣市的打卡次數
            var count = stats.RegionCounts
                .Where(kvp => kvp.Key.Contains(requiredCounty) || requiredCounty.Contains(kvp.Key))
                .Sum(kvp => kvp.Value);

            return count >= requiredCount;
        }
        return false;
    }

    private bool CheckCheckinTime(JsonElement condition, Checkin checkin)
    {
        var checkinHour = checkin.CheckinTime.Hour;

        if (condition.TryGetProperty("before_hour", out var beforeElement))
        {
            var beforeHour = beforeElement.GetInt32();
            return checkinHour < beforeHour;
        }

        if (condition.TryGetProperty("after_hour", out var afterElement))
        {
            var afterHour = afterElement.GetInt32();
            return checkinHour >= afterHour;
        }

        return false;
    }

    private async Task<bool> CheckStreakDays(JsonElement condition, UserStats stats)
    {
        if (condition.TryGetProperty("days", out var daysElement))
        {
            var requiredDays = daysElement.GetInt32();

            if (stats.CheckinDates.Count < requiredDays)
                return false;

            // 檢查是否有連續 N 天的打卡紀錄
            var streak = 1;
            var maxStreak = 1;

            for (int i = 1; i < stats.CheckinDates.Count; i++)
            {
                var diff = (stats.CheckinDates[i] - stats.CheckinDates[i - 1]).Days;
                if (diff == 1)
                {
                    streak++;
                    maxStreak = Math.Max(maxStreak, streak);
                }
                else if (diff > 1)
                {
                    streak = 1;
                }
            }

            return maxStreak >= requiredDays;
        }
        return false;
    }

    private (int? progress, int? target) CalculateProgress(Achievement achievement, UserStats stats)
    {
        try
        {
            var condition = JsonSerializer.Deserialize<JsonElement>(achievement.ConditionValue);

            return achievement.ConditionType switch
            {
                "checkin_count" => GetProgressFromCount(condition, stats.TotalCheckins),
                "unique_trails" => GetProgressFromCount(condition, stats.UniqueTrails),
                "verified_checkins" => GetProgressFromCount(condition, stats.VerifiedCheckins),
                "difficulty_level" => GetDifficultyProgress(condition, stats),
                "all_difficulties" => GetAllDifficultiesProgress(condition, stats),
                _ => (null, null)
            };
        }
        catch
        {
            return (null, null);
        }
    }

    private (int? progress, int? target) GetProgressFromCount(JsonElement condition, int current)
    {
        if (condition.TryGetProperty("count", out var countElement))
        {
            var target = countElement.GetInt32();
            return (Math.Min(current, target), target);
        }
        return (null, null);
    }

    private (int? progress, int? target) GetDifficultyProgress(JsonElement condition, UserStats stats)
    {
        if (condition.TryGetProperty("difficulty", out var diffElement) &&
            condition.TryGetProperty("count", out var countElement))
        {
            var difficulty = diffElement.GetInt32();
            var target = countElement.GetInt32();
            var current = stats.DifficultyCounts.GetValueOrDefault(difficulty, 0);
            return (Math.Min(current, target), target);
        }
        return (null, null);
    }

    private (int? progress, int? target) GetAllDifficultiesProgress(JsonElement condition, UserStats stats)
    {
        if (condition.TryGetProperty("difficulties", out var difficultiesElement))
        {
            var requiredDifficulties = new List<int>();
            foreach (var item in difficultiesElement.EnumerateArray())
            {
                requiredDifficulties.Add(item.GetInt32());
            }

            var completedCount = requiredDifficulties.Count(d => stats.DifficultyCounts.ContainsKey(d) && stats.DifficultyCounts[d] > 0);
            return (completedCount, requiredDifficulties.Count);
        }
        return (null, null);
    }

    // =============================================
    // Helper Classes
    // =============================================

    private class UserStats
    {
        public int TotalCheckins { get; set; }
        public int UniqueTrails { get; set; }
        public int VerifiedCheckins { get; set; }
        public Dictionary<int, int> DifficultyCounts { get; set; } = new();
        public Dictionary<string, int> RegionCounts { get; set; } = new();
        public List<DateTime> CheckinDates { get; set; } = new();
    }
}
