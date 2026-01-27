namespace TrailGuide.API.Models.DTOs;

public class HomeDataDto
{
    public List<BannerDto> Banners { get; set; } = new();
    public List<CollectionDto> Collections { get; set; } = new();
    public List<TrailListDto> PopularTrails { get; set; } = new();
    public List<AnnouncementDto> Announcements { get; set; } = new();
}

public class BannerDto
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? Link { get; set; }
}

public class CollectionDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? SubTitle { get; set; }
    public string? IconImage { get; set; }
    public int TrailCount { get; set; }
}

public class CollectionDetailDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? SubTitle { get; set; }
    public string? IconImage { get; set; }
    public List<TrailListDto> Trails { get; set; } = new();
}

public class AnnouncementDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public DateTime? Date { get; set; }
    public string? Source { get; set; }
    public string? Link { get; set; }
}
