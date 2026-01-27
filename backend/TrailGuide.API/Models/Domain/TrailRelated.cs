namespace TrailGuide.API.Models.Domain;

public class TrailImage
{
    public int Id { get; set; }
    public int TrailId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Trail Trail { get; set; } = null!;
}

public class TrailHead
{
    public int Id { get; set; }
    public int TrailId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? BannerImage { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Trail Trail { get; set; } = null!;
}

public class ChipTrail
{
    public int Id { get; set; }
    public int ChipId { get; set; }
    public int TrailId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Chip Chip { get; set; } = null!;
    public Trail Trail { get; set; } = null!;
}

public class Announcement
{
    public int Id { get; set; }
    public int? TrailId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public DateTime? Date { get; set; }
    public string? Source { get; set; }
    public string? Link { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Trail? Trail { get; set; }
}

public class Attraction
{
    public int Id { get; set; }
    public int TrailId { get; set; }
    public string? Category { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Link { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Trail Trail { get; set; } = null!;
}
