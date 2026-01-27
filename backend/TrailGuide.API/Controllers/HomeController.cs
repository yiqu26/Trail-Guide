using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TrailGuide.API.Data;
using TrailGuide.API.Models.DTOs;

namespace TrailGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HomeController : ControllerBase
{
    private readonly TrailGuideDbContext _context;

    public HomeController(TrailGuideDbContext context)
    {
        _context = context;
    }

    // 取得當前用戶 ID（未登入則為 null）
    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    [HttpGet]
    public async Task<ActionResult<HomeDataDto>> GetHomeData()
    {
        var userId = GetCurrentUserId();
        var banners = await _context.Banners
            .Where(b => b.IsActive)
            .OrderBy(b => b.SortOrder)
            .Select(b => new BannerDto
            {
                Id = b.Id,
                Title = b.Title,
                ImageUrl = b.ImageUrl,
                Link = b.Link
            })
            .ToListAsync();

        var collections = await _context.Collections
            .Include(c => c.CollectionTrails)
            .Select(c => new CollectionDto
            {
                Id = c.Id,
                Name = c.Name,
                SubTitle = c.SubTitle,
                IconImage = c.IconImage,
                TrailCount = c.CollectionTrails.Count
            })
            .ToListAsync();

        var popularTrails = await _context.Trails
            .Include(t => t.Location)
            .Include(t => t.ChipTrails).ThenInclude(ct => ct.Chip)
            .Include(t => t.Favorites)
            .OrderByDescending(t => t.Evaluation)
            .Take(10)
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

        var announcements = await _context.Announcements
            .OrderByDescending(a => a.Date)
            .Take(5)
            .Select(a => new AnnouncementDto
            {
                Id = a.Id,
                Title = a.Title,
                ImageUrl = a.ImageUrl,
                Date = a.Date,
                Source = a.Source,
                Link = a.Link
            })
            .ToListAsync();

        return Ok(new HomeDataDto
        {
            Banners = banners,
            Collections = collections,
            PopularTrails = popularTrails,
            Announcements = announcements
        });
    }

    [HttpGet("collections/{id}")]
    public async Task<ActionResult<CollectionDetailDto>> GetCollection(int id)
    {
        var userId = GetCurrentUserId();

        var collection = await _context.Collections
            .Include(c => c.CollectionTrails)
                .ThenInclude(ct => ct.Trail)
                    .ThenInclude(t => t.Location)
            .Include(c => c.CollectionTrails)
                .ThenInclude(ct => ct.Trail)
                    .ThenInclude(t => t.ChipTrails)
                        .ThenInclude(ct => ct.Chip)
            .Include(c => c.CollectionTrails)
                .ThenInclude(ct => ct.Trail)
                    .ThenInclude(t => t.Favorites)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (collection == null)
        {
            return NotFound(new { error = "Collection not found" });
        }

        var dto = new CollectionDetailDto
        {
            Id = collection.Id,
            Name = collection.Name,
            SubTitle = collection.SubTitle,
            IconImage = collection.IconImage,
            Trails = collection.CollectionTrails
                .OrderBy(ct => ct.SortOrder)
                .Select(ct => new TrailListDto
                {
                    Id = ct.Trail.Id,
                    Title = ct.Trail.Title,
                    CoverImage = ct.Trail.CoverImage,
                    Difficulty = ct.Trail.Difficulty,
                    Evaluation = ct.Trail.Evaluation,
                    Distance = ct.Trail.Distance,
                    CostTime = ct.Trail.CostTime,
                    LocationName = ct.Trail.Location?.Name,
                    Chips = ct.Trail.ChipTrails.Select(c => c.Chip.Name).ToList(),
                    IsFavorite = userId.HasValue && ct.Trail.Favorites.Any(f => f.UserId == userId)
                })
                .ToList()
        };

        return Ok(dto);
    }

    [HttpGet("announcements")]
    public async Task<ActionResult<List<AnnouncementDto>>> GetAnnouncements([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var announcements = await _context.Announcements
            .OrderByDescending(a => a.Date)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new AnnouncementDto
            {
                Id = a.Id,
                Title = a.Title,
                ImageUrl = a.ImageUrl,
                Date = a.Date,
                Source = a.Source,
                Link = a.Link
            })
            .ToListAsync();

        return Ok(announcements);
    }
}
