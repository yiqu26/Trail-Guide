using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrailGuide.API.Data;
using TrailGuide.API.Models.DTOs;
using TrailGuide.API.Services;

namespace TrailGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AchievementsController : ControllerBase
{
    private readonly TrailGuideDbContext _context;
    private readonly IAchievementService _achievementService;

    public AchievementsController(TrailGuideDbContext context, IAchievementService achievementService)
    {
        _context = context;
        _achievementService = achievementService;
    }

    /// <summary>
    /// 所有成就列表 (公開，不含隱藏成就)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<AchievementDto>>> GetAllAchievements()
    {
        var achievements = await _context.Achievements
            .Where(a => !a.IsHidden)
            .OrderBy(a => a.SortOrder)
            .Select(a => new AchievementDto
            {
                Id = a.Id,
                Code = a.Code,
                Name = a.Name,
                Description = a.Description,
                IconUrl = a.IconUrl,
                Category = a.Category,
                Points = a.Points,
                IsHidden = a.IsHidden,
                SortOrder = a.SortOrder
            })
            .ToListAsync();

        return Ok(achievements);
    }

    /// <summary>
    /// 我的成就狀態與進度
    /// </summary>
    [HttpGet("my")]
    [Authorize]
    public async Task<ActionResult<MyAchievementsDto>> GetMyAchievements()
    {
        var userId = GetCurrentUserId();
        var result = await _achievementService.GetUserAchievements(userId);
        return Ok(result);
    }

    /// <summary>
    /// 成就類別統計
    /// </summary>
    [HttpGet("categories")]
    [Authorize]
    public async Task<ActionResult<List<AchievementCategoryStatsDto>>> GetCategoryStats()
    {
        var userId = GetCurrentUserId();

        var userUnlockedIds = await _context.UserAchievements
            .Where(ua => ua.UserId == userId)
            .Select(ua => ua.AchievementId)
            .ToListAsync();

        var achievements = await _context.Achievements
            .Where(a => !a.IsHidden || userUnlockedIds.Contains(a.Id))
            .ToListAsync();

        var categoryNames = new Dictionary<string, string>
        {
            { "milestone", "里程碑成就" },
            { "difficulty", "難度挑戰" },
            { "region", "地區探索" },
            { "hidden", "隱藏成就" }
        };

        var stats = achievements
            .GroupBy(a => a.Category)
            .Select(g => new AchievementCategoryStatsDto
            {
                Category = g.Key,
                CategoryName = categoryNames.GetValueOrDefault(g.Key, g.Key),
                TotalCount = g.Count(),
                UnlockedCount = g.Count(a => userUnlockedIds.Contains(a.Id)),
                TotalPoints = g.Sum(a => a.Points),
                EarnedPoints = g.Where(a => userUnlockedIds.Contains(a.Id)).Sum(a => a.Points)
            })
            .OrderBy(s => s.Category switch
            {
                "milestone" => 1,
                "difficulty" => 2,
                "region" => 3,
                "hidden" => 4,
                _ => 5
            })
            .ToList();

        return Ok(stats);
    }

    /// <summary>
    /// 單一成就詳情
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<AchievementDto>> GetAchievement(int id)
    {
        var achievement = await _context.Achievements.FindAsync(id);

        if (achievement == null)
        {
            return NotFound(new { error = "Achievement not found" });
        }

        // 隱藏成就需要登入且已解鎖才能查看
        if (achievement.IsHidden)
        {
            var userId = GetCurrentUserIdOrNull();
            if (userId == null)
            {
                return NotFound(new { error = "Achievement not found" });
            }

            var isUnlocked = await _context.UserAchievements
                .AnyAsync(ua => ua.UserId == userId && ua.AchievementId == id);

            if (!isUnlocked)
            {
                return NotFound(new { error = "Achievement not found" });
            }
        }

        return Ok(new AchievementDto
        {
            Id = achievement.Id,
            Code = achievement.Code,
            Name = achievement.Name,
            Description = achievement.Description,
            IconUrl = achievement.IconUrl,
            Category = achievement.Category,
            Points = achievement.Points,
            IsHidden = achievement.IsHidden,
            SortOrder = achievement.SortOrder
        });
    }

    // =============================================
    // Private Methods
    // =============================================

    private int GetCurrentUserId()
    {
        return int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
    }

    private int? GetCurrentUserIdOrNull()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (claim != null && int.TryParse(claim.Value, out var userId))
        {
            return userId;
        }
        return null;
    }
}
