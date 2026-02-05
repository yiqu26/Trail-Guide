using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrailGuide.API.Data;
using TrailGuide.API.Models.Domain;

namespace TrailGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VisitedTrailsController : ControllerBase
{
    private readonly TrailGuideDbContext _context;

    public VisitedTrailsController(TrailGuideDbContext context)
    {
        _context = context;
    }

    // GET: api/visitedtrails
    [HttpGet]
    public async Task<ActionResult<List<VisitedTrailDto>>> GetMyVisitedTrails()
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var visited = await _context.VisitedTrails
            .Include(v => v.Trail)
                .ThenInclude(t => t.Location)
                    .ThenInclude(l => l!.County)
            .Where(v => v.UserId == userId)
            .OrderByDescending(v => v.CreatedAt)
            .Select(v => new VisitedTrailDto
            {
                Id = v.Id,
                TrailId = v.TrailId,
                TrailTitle = v.Trail.Title,
                TrailCoverImage = v.Trail.CoverImage,
                TrailDifficulty = v.Trail.Difficulty,
                TrailLocation = v.Trail.Location != null
                    ? $"{v.Trail.Location.County!.Name} {v.Trail.Location.Name}"
                    : null,
                VisitedAt = v.VisitedAt,
                CreatedAt = v.CreatedAt
            })
            .ToListAsync();

        return Ok(visited);
    }

    // GET: api/visitedtrails/check/{trailId}
    [HttpGet("check/{trailId}")]
    public async Task<ActionResult<VisitedCheckDto>> CheckVisited(int trailId)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Ok(new VisitedCheckDto { IsVisited = false });
        }

        var visited = await _context.VisitedTrails
            .FirstOrDefaultAsync(v => v.UserId == userId && v.TrailId == trailId);

        return Ok(new VisitedCheckDto
        {
            IsVisited = visited != null,
            VisitedAt = visited?.VisitedAt
        });
    }

    // POST: api/visitedtrails/{trailId}
    [HttpPost("{trailId}")]
    public async Task<ActionResult> MarkAsVisited(int trailId, [FromBody] MarkVisitedDto? dto)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        // Check if trail exists
        var trailExists = await _context.Trails.AnyAsync(t => t.Id == trailId);
        if (!trailExists)
        {
            return NotFound(new { error = "Trail not found" });
        }

        // Check if already visited
        var existing = await _context.VisitedTrails
            .FirstOrDefaultAsync(v => v.UserId == userId && v.TrailId == trailId);

        if (existing != null)
        {
            // Update visited date if provided
            if (dto?.VisitedAt != null)
            {
                existing.VisitedAt = dto.VisitedAt;
                await _context.SaveChangesAsync();
            }
            return Ok(new { message = "Already marked as visited" });
        }

        var visited = new VisitedTrail
        {
            UserId = userId.Value,
            TrailId = trailId,
            VisitedAt = dto?.VisitedAt
        };

        _context.VisitedTrails.Add(visited);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Marked as visited" });
    }

    // DELETE: api/visitedtrails/{trailId}
    [HttpDelete("{trailId}")]
    public async Task<ActionResult> RemoveVisited(int trailId)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var visited = await _context.VisitedTrails
            .FirstOrDefaultAsync(v => v.UserId == userId && v.TrailId == trailId);

        if (visited == null)
        {
            return NotFound(new { error = "Not marked as visited" });
        }

        _context.VisitedTrails.Remove(visited);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/visitedtrails/stats
    [HttpGet("stats")]
    public async Task<ActionResult<VisitedStatsDto>> GetStats()
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var count = await _context.VisitedTrails.CountAsync(v => v.UserId == userId);

        return Ok(new VisitedStatsDto { TotalCount = count });
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

// DTOs
public class VisitedTrailDto
{
    public int Id { get; set; }
    public int TrailId { get; set; }
    public string TrailTitle { get; set; } = string.Empty;
    public string? TrailCoverImage { get; set; }
    public int? TrailDifficulty { get; set; }
    public string? TrailLocation { get; set; }
    public DateTime? VisitedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class VisitedCheckDto
{
    public bool IsVisited { get; set; }
    public DateTime? VisitedAt { get; set; }
}

public class MarkVisitedDto
{
    public DateTime? VisitedAt { get; set; }
}

public class VisitedStatsDto
{
    public int TotalCount { get; set; }
}
