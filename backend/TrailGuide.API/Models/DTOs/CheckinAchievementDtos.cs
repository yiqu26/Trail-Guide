namespace TrailGuide.API.Models.DTOs;

// =============================================
// 打卡 DTOs
// =============================================

/// <summary>
/// 建立打卡請求
/// </summary>
public class CreateCheckinDto
{
    public int TrailId { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? Note { get; set; }
    public int? DurationMinutes { get; set; }
    public List<string>? ImageUrls { get; set; }  // 預留供未來擴充
}

/// <summary>
/// 打卡紀錄 DTO
/// </summary>
public class CheckinDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? UserAvatar { get; set; }
    public int TrailId { get; set; }
    public string TrailTitle { get; set; } = string.Empty;
    public string? TrailCoverImage { get; set; }
    public int? TrailDifficulty { get; set; }
    public DateTime CheckinTime { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public bool IsLocationVerified { get; set; }
    public decimal? DistanceFromTrail { get; set; }
    public string? Note { get; set; }
    public int? DurationMinutes { get; set; }
    public List<string> Images { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// 打卡統計 DTO
/// </summary>
public class CheckinStatsDto
{
    public int TotalCheckins { get; set; }
    public int UniqueTrails { get; set; }
    public int VerifiedCheckins { get; set; }
    public int TotalMinutes { get; set; }
    public int TotalPoints { get; set; }
    public int AchievementCount { get; set; }
    public Dictionary<int, int> DifficultyDistribution { get; set; } = new();  // difficulty -> count
    public DateTime? FirstCheckinDate { get; set; }
    public DateTime? LastCheckinDate { get; set; }
}

/// <summary>
/// 打卡建立結果 DTO
/// </summary>
public class CheckinResultDto
{
    public CheckinDto Checkin { get; set; } = null!;
    public List<AchievementDto> NewAchievements { get; set; } = new();
}

// =============================================
// 成就 DTOs
// =============================================

/// <summary>
/// 成就 DTO
/// </summary>
public class AchievementDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
    public string Category { get; set; } = string.Empty;
    public int Points { get; set; }
    public bool IsHidden { get; set; }
    public int SortOrder { get; set; }
}

/// <summary>
/// 用戶成就進度 DTO
/// </summary>
public class UserAchievementProgressDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
    public string Category { get; set; } = string.Empty;
    public int Points { get; set; }
    public bool IsHidden { get; set; }
    public int SortOrder { get; set; }
    public bool IsUnlocked { get; set; }
    public DateTime? UnlockedAt { get; set; }
    public int? Progress { get; set; }      // 目前進度
    public int? Target { get; set; }        // 目標值
}

/// <summary>
/// 我的成就總覽 DTO
/// </summary>
public class MyAchievementsDto
{
    public int TotalPoints { get; set; }
    public int UnlockedCount { get; set; }
    public int TotalCount { get; set; }
    public List<UserAchievementProgressDto> Achievements { get; set; } = new();
}

/// <summary>
/// 成就類別統計 DTO
/// </summary>
public class AchievementCategoryStatsDto
{
    public string Category { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public int UnlockedCount { get; set; }
    public int TotalCount { get; set; }
    public int TotalPoints { get; set; }
    public int EarnedPoints { get; set; }
}
