namespace TrailGuide.API.Models.Domain;

public class Trail
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public int? Distance { get; set; }
    public string? CoverImage { get; set; }
    public int? Difficulty { get; set; }
    public decimal? Evaluation { get; set; }
    public int? Altitude { get; set; }

    // 擴充欄位
    public string? Class { get; set; }
    public int? CostTime { get; set; }
    public string? RoadStatus { get; set; }
    public string? Intro { get; set; }
    public string? TrailStatus { get; set; }

    // 關聯
    public int? LocationId { get; set; }
    public int? ClassificationId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Location? Location { get; set; }
    public Classification? Classification { get; set; }
    public ICollection<TrailImage> Images { get; set; } = new List<TrailImage>();
    public ICollection<TrailHead> TrailHeads { get; set; } = new List<TrailHead>();
    public ICollection<ChipTrail> ChipTrails { get; set; } = new List<ChipTrail>();
    public ICollection<CollectionTrail> CollectionTrails { get; set; } = new List<CollectionTrail>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Announcement> Announcements { get; set; } = new List<Announcement>();
    public ICollection<Attraction> Attractions { get; set; } = new List<Attraction>();
    public ICollection<Checkin> Checkins { get; set; } = new List<Checkin>();
}
