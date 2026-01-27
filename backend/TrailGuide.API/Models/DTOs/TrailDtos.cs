namespace TrailGuide.API.Models.DTOs;

public class TrailListDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? CoverImage { get; set; }
    public int? Difficulty { get; set; }
    public decimal? Evaluation { get; set; }
    public int? Distance { get; set; }
    public int? CostTime { get; set; }
    public string? LocationName { get; set; }
    public List<string> Chips { get; set; } = new();
    public bool IsFavorite { get; set; }
}

public class TrailDetailDto
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
    public string? Class { get; set; }
    public int? CostTime { get; set; }
    public string? RoadStatus { get; set; }
    public string? Intro { get; set; }
    public string? TrailStatus { get; set; }
    public string? LocationName { get; set; }
    public string? CountyName { get; set; }
    public string? ClassificationName { get; set; }
    public List<string> Images { get; set; } = new();
    public List<string> Chips { get; set; } = new();
    public List<TrailHeadDto> TrailHeads { get; set; } = new();
    public List<AttractionDto> Attractions { get; set; } = new();
    public int CommentCount { get; set; }
    public int FavoriteCount { get; set; }
    public bool IsFavorite { get; set; }
}

public class TrailHeadDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? BannerImage { get; set; }
    public string? Description { get; set; }
}

public class AttractionDto
{
    public int Id { get; set; }
    public string? Category { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Link { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
}

public class TrailSearchDto
{
    public string? Keyword { get; set; }
    public int? ClassificationId { get; set; }
    public int? CountyId { get; set; }
    public int? MinDifficulty { get; set; }
    public int? MaxDifficulty { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public int? RadiusKm { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class NearbyTrailDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? CoverImage { get; set; }
    public int? Difficulty { get; set; }
    public decimal? Evaluation { get; set; }
    public double DistanceKm { get; set; }
}

public class CountyDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class ClassificationDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

// Comment DTOs
public class CommentListDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? UserAvatar { get; set; }
    public int? Star { get; set; }
    public int? Difficulty { get; set; }
    public int? Beauty { get; set; }
    public string? Content { get; set; }
    public DateTime? Date { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<string> Images { get; set; } = new();
    public int LikeCount { get; set; }
    public bool IsLiked { get; set; }
}

public class CreateCommentDto
{
    public int? Star { get; set; }
    public int? Difficulty { get; set; }
    public int? Beauty { get; set; }
    public string? Content { get; set; }
    public DateTime? Date { get; set; }
}

public class CommentStatsDto
{
    public int TotalCount { get; set; }
    public decimal AverageStar { get; set; }
    public decimal AverageDifficulty { get; set; }
    public decimal AverageBeauty { get; set; }
}
