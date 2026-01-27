namespace TrailGuide.API.Models.Domain;

public class Favorite
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int TrailId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Trail Trail { get; set; } = null!;
}

public class Comment
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int TrailId { get; set; }
    public DateTime? Date { get; set; }
    public int? Star { get; set; }
    public int? Difficulty { get; set; }
    public int? Beauty { get; set; }
    public int? Duration { get; set; }
    public string? Content { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Trail Trail { get; set; } = null!;
    public ICollection<CommentImage> Images { get; set; } = new List<CommentImage>();
    public ICollection<UserLikeComment> Likes { get; set; } = new List<UserLikeComment>();
}

public class CommentImage
{
    public int Id { get; set; }
    public int CommentId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Comment Comment { get; set; } = null!;
}

public class UserLikeComment
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CommentId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Comment Comment { get; set; } = null!;
}
