using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrailGuide.API.Data;
using TrailGuide.API.Models.Domain;
using TrailGuide.API.Models.DTOs;

namespace TrailGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly TrailGuideDbContext _context;

    public FavoritesController(TrailGuideDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<TrailListDto>>> GetMyFavorites()
    {
        var userId = GetCurrentUserId();

        var favorites = await _context.Favorites
            .Where(f => f.UserId == userId)
            .Include(f => f.Trail)
                .ThenInclude(t => t.Location)
            .Include(f => f.Trail)
                .ThenInclude(t => t.ChipTrails)
                    .ThenInclude(ct => ct.Chip)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new TrailListDto
            {
                Id = f.Trail.Id,
                Title = f.Trail.Title,
                CoverImage = f.Trail.CoverImage,
                Difficulty = f.Trail.Difficulty,
                Evaluation = f.Trail.Evaluation,
                Distance = f.Trail.Distance,
                CostTime = f.Trail.CostTime,
                LocationName = f.Trail.Location != null ? f.Trail.Location.Name : null,
                Chips = f.Trail.ChipTrails.Select(ct => ct.Chip.Name).ToList(),
                IsFavorite = true
            })
            .ToListAsync();

        return Ok(favorites);
    }

    [HttpPost("{trailId}")]
    public async Task<IActionResult> AddFavorite(int trailId)
    {
        var userId = GetCurrentUserId();

        // 檢查步道是否存在
        var trailExists = await _context.Trails.AnyAsync(t => t.Id == trailId);
        if (!trailExists)
        {
            return NotFound(new { error = "Trail not found" });
        }

        // 檢查是否已收藏
        var exists = await _context.Favorites
            .AnyAsync(f => f.UserId == userId && f.TrailId == trailId);

        if (exists)
        {
            return BadRequest(new { error = "Already in favorites" });
        }

        var favorite = new Favorite
        {
            UserId = userId,
            TrailId = trailId
        };

        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();

        return Ok(new { status = "added to favorites" });
    }

    [HttpDelete("{trailId}")]
    public async Task<IActionResult> RemoveFavorite(int trailId)
    {
        var userId = GetCurrentUserId();

        var favorite = await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.TrailId == trailId);

        if (favorite == null)
        {
            return NotFound(new { error = "Favorite not found" });
        }

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();

        return Ok(new { status = "removed from favorites" });
    }

    private int GetCurrentUserId()
    {
        return int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
    }
}
