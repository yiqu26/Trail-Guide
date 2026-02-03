namespace TrailGuide.API.Models.Domain;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? Avatar { get; set; }
    public bool? Gender { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime? Birth { get; set; }
    public int? CountyId { get; set; }
    public int? CountryCodeId { get; set; }

    // 第三方登入
    public string? GoogleId { get; set; }
    public string? FacebookId { get; set; }
    public string? AppleId { get; set; }

    // 驗證
    public DateTime? EmailVerifiedAt { get; set; }
    public string? VerificationCode { get; set; }
    public DateTime? VerificationCodeExpiry { get; set; }

    // Token
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public County? County { get; set; }
    public CountryCode? CountryCode { get; set; }
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Checkin> Checkins { get; set; } = new List<Checkin>();
    public ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
}
