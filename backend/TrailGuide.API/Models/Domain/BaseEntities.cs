namespace TrailGuide.API.Models.Domain;

public class County
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Location> Locations { get; set; } = new List<Location>();
    public ICollection<User> Users { get; set; } = new List<User>();
}

public class Location
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Zip { get; set; }
    public int? CountyId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public County? County { get; set; }
    public ICollection<Trail> Trails { get; set; } = new List<Trail>();
}

public class CountryCode
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class Classification
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Trail> Trails { get; set; } = new List<Trail>();
}

public class Chip
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ChipTrail> ChipTrails { get; set; } = new List<ChipTrail>();
}
