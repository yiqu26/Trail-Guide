namespace TrailGuide.API.Models.Domain;

/// <summary>
/// 打卡紀錄
/// </summary>
public class Checkin
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int TrailId { get; set; }
    public DateTime CheckinTime { get; set; } = DateTime.UtcNow;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public bool IsLocationVerified { get; set; } = false;
    public decimal? DistanceFromTrail { get; set; }
    public string? Note { get; set; }
    public int? DurationMinutes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User? User { get; set; }
    public Trail? Trail { get; set; }
    public ICollection<CheckinImage> Images { get; set; } = new List<CheckinImage>();
    public ICollection<UserAchievement> UnlockedAchievements { get; set; } = new List<UserAchievement>();
}

/// <summary>
/// 打卡照片
/// </summary>
public class CheckinImage
{
    public int Id { get; set; }
    public int CheckinId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Checkin? Checkin { get; set; }
}

/// <summary>
/// 成就定義
/// </summary>
public class Achievement
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? IconUrl { get; set; }
    public string Category { get; set; } = string.Empty;  // milestone, difficulty, region, hidden
    public string ConditionType { get; set; } = string.Empty;  // checkin_count, unique_trails, verified_checkins, difficulty_level, region
    public string ConditionValue { get; set; } = "{}";  // JSON format
    public int SortOrder { get; set; } = 0;
    public int Points { get; set; } = 10;
    public bool IsHidden { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
}

/// <summary>
/// 用戶已解鎖成就
/// </summary>
public class UserAchievement
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int AchievementId { get; set; }
    public DateTime UnlockedAt { get; set; } = DateTime.UtcNow;
    public int? CheckinId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User? User { get; set; }
    public Achievement? Achievement { get; set; }
    public Checkin? Checkin { get; set; }
}
