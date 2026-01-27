using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrailGuide.API.Data;
using TrailGuide.API.Models.DTOs;

namespace TrailGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrailsController : ControllerBase
{
    private readonly TrailGuideDbContext _context;

    public TrailsController(TrailGuideDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<TrailListDto>>> GetTrails([FromQuery] TrailSearchDto search)
    {
        var userId = GetCurrentUserId();

        var query = _context.Trails
            .Include(t => t.Location).ThenInclude(l => l!.County)
            .Include(t => t.ChipTrails).ThenInclude(ct => ct.Chip)
            .AsQueryable();

        // 關鍵字搜尋
        if (!string.IsNullOrEmpty(search.Keyword))
        {
            query = query.Where(t => t.Title.Contains(search.Keyword) ||
                                      (t.Intro != null && t.Intro.Contains(search.Keyword)));
        }

        // 分類篩選
        if (search.ClassificationId.HasValue)
        {
            query = query.Where(t => t.ClassificationId == search.ClassificationId);
        }

        // 縣市篩選
        if (search.CountyId.HasValue)
        {
            query = query.Where(t => t.Location != null && t.Location.CountyId == search.CountyId);
        }

        // 難度篩選
        if (search.MinDifficulty.HasValue)
        {
            query = query.Where(t => t.Difficulty >= search.MinDifficulty);
        }
        if (search.MaxDifficulty.HasValue)
        {
            query = query.Where(t => t.Difficulty <= search.MaxDifficulty);
        }

        var trails = await query
            .OrderByDescending(t => t.Evaluation)
            .Skip((search.Page - 1) * search.PageSize)
            .Take(search.PageSize)
            .Select(t => new TrailListDto
            {
                Id = t.Id,
                Title = t.Title,
                CoverImage = t.CoverImage,
                Difficulty = t.Difficulty,
                Evaluation = t.Evaluation,
                Distance = t.Distance,
                CostTime = t.CostTime,
                LocationName = t.Location != null ? t.Location.Name : null,
                Chips = t.ChipTrails.Select(ct => ct.Chip.Name).ToList(),
                IsFavorite = userId.HasValue && t.Favorites.Any(f => f.UserId == userId)
            })
            .ToListAsync();

        return Ok(trails);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TrailDetailDto>> GetTrail(int id)
    {
        var userId = GetCurrentUserId();

        var trail = await _context.Trails
            .Include(t => t.Location).ThenInclude(l => l!.County)
            .Include(t => t.Classification)
            .Include(t => t.Images)
            .Include(t => t.ChipTrails).ThenInclude(ct => ct.Chip)
            .Include(t => t.TrailHeads)
            .Include(t => t.Attractions)
            .Include(t => t.Comments)
            .Include(t => t.Favorites)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (trail == null)
        {
            return NotFound(new { error = "Trail not found" });
        }

        var dto = new TrailDetailDto
        {
            Id = trail.Id,
            Title = trail.Title,
            Latitude = trail.Latitude,
            Longitude = trail.Longitude,
            Distance = trail.Distance,
            CoverImage = trail.CoverImage,
            Difficulty = trail.Difficulty,
            Evaluation = trail.Evaluation,
            Altitude = trail.Altitude,
            Class = trail.Class,
            CostTime = trail.CostTime,
            RoadStatus = trail.RoadStatus,
            Intro = trail.Intro,
            TrailStatus = trail.TrailStatus,
            LocationName = trail.Location?.Name,
            CountyName = trail.Location?.County?.Name,
            ClassificationName = trail.Classification?.Name,
            Images = trail.Images.OrderBy(i => i.SortOrder).Select(i => i.ImageUrl).ToList(),
            Chips = trail.ChipTrails.Select(ct => ct.Chip.Name).ToList(),
            TrailHeads = trail.TrailHeads.Select(th => new TrailHeadDto
            {
                Id = th.Id,
                Name = th.Name,
                Latitude = th.Latitude,
                Longitude = th.Longitude,
                BannerImage = th.BannerImage,
                Description = th.Description
            }).ToList(),
            Attractions = trail.Attractions.Select(a => new AttractionDto
            {
                Id = a.Id,
                Category = a.Category,
                Title = a.Title,
                Link = a.Link,
                Latitude = a.Latitude,
                Longitude = a.Longitude
            }).ToList(),
            CommentCount = trail.Comments.Count,
            FavoriteCount = trail.Favorites.Count,
            IsFavorite = userId.HasValue && trail.Favorites.Any(f => f.UserId == userId)
        };

        return Ok(dto);
    }

    [HttpGet("nearby")]
    public async Task<ActionResult<List<NearbyTrailDto>>> GetNearbyTrails(
        [FromQuery] decimal latitude,
        [FromQuery] decimal longitude,
        [FromQuery] int radiusKm = 50,
        [FromQuery] int limit = 10)
    {
        // 使用 Haversine 公式計算距離 (簡化版，在 SQL Server 中計算)
        var trails = await _context.Trails
            .Where(t => t.Latitude != null && t.Longitude != null)
            .Select(t => new
            {
                Trail = t,
                // 簡易距離計算 (度轉公里，約略值)
                Distance = Math.Sqrt(
                    Math.Pow((double)(t.Latitude!.Value - latitude) * 110.574, 2) +
                    Math.Pow((double)(t.Longitude!.Value - longitude) * 111.320 * Math.Cos((double)latitude * Math.PI / 180), 2)
                )
            })
            .Where(x => x.Distance <= radiusKm)
            .OrderBy(x => x.Distance)
            .Take(limit)
            .Select(x => new NearbyTrailDto
            {
                Id = x.Trail.Id,
                Title = x.Trail.Title,
                CoverImage = x.Trail.CoverImage,
                Difficulty = x.Trail.Difficulty,
                Evaluation = x.Trail.Evaluation,
                DistanceKm = Math.Round(x.Distance, 1)
            })
            .ToListAsync();

        return Ok(trails);
    }

    [HttpGet("counties")]
    public async Task<ActionResult<List<CountyDto>>> GetCounties()
    {
        var counties = await _context.Counties
            .OrderBy(c => c.Name)
            .Select(c => new CountyDto
            {
                Id = c.Id,
                Name = c.Name
            })
            .ToListAsync();

        return Ok(counties);
    }

    [HttpGet("classifications")]
    public async Task<ActionResult<List<ClassificationDto>>> GetClassifications()
    {
        var classifications = await _context.Classifications
            .OrderBy(c => c.Name)
            .Select(c => new ClassificationDto
            {
                Id = c.Id,
                Name = c.Name
            })
            .ToListAsync();

        return Ok(classifications);
    }

    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId))
        {
            return userId;
        }
        return null;
    }
}
