using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrailGuide.API.Data;

namespace TrailGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MyCommentsController : ControllerBase
{
    private readonly TrailGuideDbContext _context;

    public MyCommentsController(TrailGuideDbContext context)
    {
        _context = context;
    }

    // GET: api/mycomments
    [HttpGet]
    public async Task<ActionResult<List<MyCommentDto>>> GetMyComments()
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var comments = await _context.Comments
            .Include(c => c.Trail)
                .ThenInclude(t => t.Location)
                    .ThenInclude(l => l!.County)
            .Include(c => c.Images)
            .Include(c => c.Likes)
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new MyCommentDto
            {
                Id = c.Id,
                TrailId = c.TrailId,
                TrailTitle = c.Trail.Title,
                TrailCoverImage = c.Trail.CoverImage,
                TrailLocation = c.Trail.Location != null
                    ? $"{c.Trail.Location.County!.Name} {c.Trail.Location.Name}"
                    : null,
                Star = c.Star,
                Difficulty = c.Difficulty,
                Beauty = c.Beauty,
                Content = c.Content,
                Date = c.Date,
                CreatedAt = c.CreatedAt,
                Images = c.Images.OrderBy(i => i.SortOrder).Select(i => i.ImageUrl).ToList(),
                LikeCount = c.Likes.Count
            })
            .ToListAsync();

        return Ok(comments);
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

// DTO
public class MyCommentDto
{
    public int Id { get; set; }
    public int TrailId { get; set; }
    public string TrailTitle { get; set; } = string.Empty;
    public string? TrailCoverImage { get; set; }
    public string? TrailLocation { get; set; }
    public int? Star { get; set; }
    public int? Difficulty { get; set; }
    public int? Beauty { get; set; }
    public string? Content { get; set; }
    public DateTime? Date { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<string> Images { get; set; } = new();
    public int LikeCount { get; set; }
}
