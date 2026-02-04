using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrailGuide.API.Data;
using TrailGuide.API.Models.Domain;
using TrailGuide.API.Models.DTOs;
using TrailGuide.API.Services;

namespace TrailGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CheckinsController : ControllerBase
{
    private readonly TrailGuideDbContext _context;
    private readonly IAchievementService _achievementService;

    // GPS 驗證範圍 (公尺)
    private const double GPS_VERIFICATION_RADIUS = 1000;

    public CheckinsController(TrailGuideDbContext context, IAchievementService achievementService)
    {
        _context = context;
        _achievementService = achievementService;
    }

    /// <summary>
    /// 建立打卡
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CheckinResultDto>> CreateCheckin([FromBody] CreateCheckinDto dto)
    {
        var userId = GetCurrentUserId();

        // 檢查步道是否存在
        var trail = await _context.Trails.FindAsync(dto.TrailId);
        if (trail == null)
        {
            return NotFound(new { error = "Trail not found" });
        }

        // GPS 驗證
        var (isVerified, distance) = VerifyLocation(dto.Latitude, dto.Longitude, trail.Latitude, trail.Longitude);

        var checkin = new Checkin
        {
            UserId = userId,
            TrailId = dto.TrailId,
            CheckinTime = DateTime.UtcNow,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            IsLocationVerified = isVerified,
            DistanceFromTrail = distance,
            Note = dto.Note,
            DurationMinutes = dto.DurationMinutes
        };

        _context.Checkins.Add(checkin);
        await _context.SaveChangesAsync();

        // 儲存圖片
        if (dto.ImageUrls != null && dto.ImageUrls.Count > 0)
        {
            var images = dto.ImageUrls.Select((url, index) => new CheckinImage
            {
                CheckinId = checkin.Id,
                ImageUrl = url,
                SortOrder = index
            }).ToList();

            _context.CheckinImages.AddRange(images);
            await _context.SaveChangesAsync();
        }

        // 檢查並解鎖成就
        var newAchievements = await _achievementService.CheckAndUnlockAchievements(userId, checkin);

        // 取得用戶資訊
        var user = await _context.Users.FindAsync(userId);

        var checkinDto = new CheckinDto
        {
            Id = checkin.Id,
            UserId = userId,
            UserName = user?.Name ?? "",
            UserAvatar = user?.Avatar,
            TrailId = trail.Id,
            TrailTitle = trail.Title,
            TrailCoverImage = trail.CoverImage,
            TrailDifficulty = trail.Difficulty,
            CheckinTime = checkin.CheckinTime,
            Latitude = checkin.Latitude,
            Longitude = checkin.Longitude,
            IsLocationVerified = checkin.IsLocationVerified,
            DistanceFromTrail = checkin.DistanceFromTrail,
            Note = checkin.Note,
            DurationMinutes = checkin.DurationMinutes,
            Images = dto.ImageUrls ?? new List<string>(),
            CreatedAt = checkin.CreatedAt
        };

        return Ok(new CheckinResultDto
        {
            Checkin = checkinDto,
            NewAchievements = newAchievements
        });
    }

    /// <summary>
    /// 我的打卡紀錄
    /// </summary>
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<CheckinDto>>> GetMyCheckins(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var userId = GetCurrentUserId();

        var checkins = await _context.Checkins
            .Where(c => c.UserId == userId)
            .Include(c => c.User)
            .Include(c => c.Trail)
            .Include(c => c.Images)
            .OrderByDescending(c => c.CheckinTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CheckinDto
            {
                Id = c.Id,
                UserId = c.UserId,
                UserName = c.User != null ? c.User.Name ?? "" : "",
                UserAvatar = c.User != null ? c.User.Avatar : null,
                TrailId = c.TrailId,
                TrailTitle = c.Trail != null ? c.Trail.Title : "",
                TrailCoverImage = c.Trail != null ? c.Trail.CoverImage : null,
                TrailDifficulty = c.Trail != null ? c.Trail.Difficulty : null,
                CheckinTime = c.CheckinTime,
                Latitude = c.Latitude,
                Longitude = c.Longitude,
                IsLocationVerified = c.IsLocationVerified,
                DistanceFromTrail = c.DistanceFromTrail,
                Note = c.Note,
                DurationMinutes = c.DurationMinutes,
                Images = c.Images.OrderBy(i => i.SortOrder).Select(i => i.ImageUrl).ToList(),
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return Ok(checkins);
    }

    /// <summary>
    /// 我的打卡統計
    /// </summary>
    [HttpGet("stats")]
    [Authorize]
    public async Task<ActionResult<CheckinStatsDto>> GetMyStats()
    {
        var userId = GetCurrentUserId();
        var stats = await _achievementService.GetUserCheckinStats(userId);
        return Ok(stats);
    }

    /// <summary>
    /// 刪除打卡
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteCheckin(int id)
    {
        var userId = GetCurrentUserId();

        var checkin = await _context.Checkins
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (checkin == null)
        {
            return NotFound(new { error = "Checkin not found" });
        }

        _context.Checkins.Remove(checkin);
        await _context.SaveChangesAsync();

        return Ok(new { status = "deleted" });
    }

    /// <summary>
    /// 步道打卡紀錄 (公開)
    /// </summary>
    [HttpGet("~/api/trails/{trailId}/checkins")]
    public async Task<ActionResult<List<CheckinDto>>> GetTrailCheckins(
        int trailId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var checkins = await _context.Checkins
            .Where(c => c.TrailId == trailId)
            .Include(c => c.User)
            .Include(c => c.Trail)
            .Include(c => c.Images)
            .OrderByDescending(c => c.CheckinTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CheckinDto
            {
                Id = c.Id,
                UserId = c.UserId,
                UserName = c.User != null ? c.User.Name ?? "" : "",
                UserAvatar = c.User != null ? c.User.Avatar : null,
                TrailId = c.TrailId,
                TrailTitle = c.Trail != null ? c.Trail.Title : "",
                TrailCoverImage = c.Trail != null ? c.Trail.CoverImage : null,
                TrailDifficulty = c.Trail != null ? c.Trail.Difficulty : null,
                CheckinTime = c.CheckinTime,
                Latitude = c.Latitude,
                Longitude = c.Longitude,
                IsLocationVerified = c.IsLocationVerified,
                DistanceFromTrail = c.DistanceFromTrail,
                Note = c.Note,
                DurationMinutes = c.DurationMinutes,
                Images = c.Images.OrderBy(i => i.SortOrder).Select(i => i.ImageUrl).ToList(),
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return Ok(checkins);
    }

    /// <summary>
    /// 步道打卡統計
    /// </summary>
    [HttpGet("~/api/trails/{trailId}/checkins/stats")]
    public async Task<ActionResult<object>> GetTrailCheckinStats(int trailId)
    {
        var checkins = await _context.Checkins
            .Where(c => c.TrailId == trailId)
            .ToListAsync();

        return Ok(new
        {
            TotalCheckins = checkins.Count,
            UniqueUsers = checkins.Select(c => c.UserId).Distinct().Count(),
            VerifiedCheckins = checkins.Count(c => c.IsLocationVerified),
            AverageDuration = checkins.Where(c => c.DurationMinutes.HasValue).Average(c => c.DurationMinutes) ?? 0
        });
    }

    // =============================================
    // Private Methods
    // =============================================

    private int GetCurrentUserId()
    {
        return int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
    }

    /// <summary>
    /// GPS 位置驗證 (Haversine formula)
    /// </summary>
    private (bool isVerified, decimal? distance) VerifyLocation(
        decimal? userLat, decimal? userLng,
        decimal? trailLat, decimal? trailLng)
    {
        if (!userLat.HasValue || !userLng.HasValue || !trailLat.HasValue || !trailLng.HasValue)
        {
            return (false, null);
        }

        var distance = CalculateDistance(
            (double)userLat.Value, (double)userLng.Value,
            (double)trailLat.Value, (double)trailLng.Value);

        var isVerified = distance <= GPS_VERIFICATION_RADIUS;

        return (isVerified, (decimal)distance);
    }

    /// <summary>
    /// Haversine 公式計算兩點間距離 (公尺)
    /// </summary>
    private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371000; // 地球半徑 (公尺)

        var lat1Rad = lat1 * Math.PI / 180;
        var lat2Rad = lat2 * Math.PI / 180;
        var deltaLat = (lat2 - lat1) * Math.PI / 180;
        var deltaLon = (lon2 - lon1) * Math.PI / 180;

        var a = Math.Sin(deltaLat / 2) * Math.Sin(deltaLat / 2) +
                Math.Cos(lat1Rad) * Math.Cos(lat2Rad) *
                Math.Sin(deltaLon / 2) * Math.Sin(deltaLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

        return R * c;
    }
}
