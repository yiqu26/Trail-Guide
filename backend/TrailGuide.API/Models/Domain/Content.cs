namespace TrailGuide.API.Models.Domain;

public class Collection
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? SubTitle { get; set; }
    public string? IconImage { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CollectionTrail> CollectionTrails { get; set; } = new List<CollectionTrail>();
}

public class CollectionTrail
{
    public int Id { get; set; }
    public int CollectionId { get; set; }
    public int TrailId { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Collection Collection { get; set; } = null!;
    public Trail Trail { get; set; } = null!;
}

public class Article
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? CoverImage { get; set; }
    public int? TrailId { get; set; }
    public int? AuthorId { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Trail? Trail { get; set; }
    public User? Author { get; set; }
}

public class Banner
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? Link { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
