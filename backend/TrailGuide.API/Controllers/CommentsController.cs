using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrailGuide.API.Data;
using TrailGuide.API.Models.Domain;
using TrailGuide.API.Models.DTOs;

namespace TrailGuide.API.Controllers;

[ApiController]
[Route("api/trails/{trailId}/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly TrailGuideDbContext _context;

    public CommentsController(TrailGuideDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<CommentListDto>>> GetComments(
        int trailId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var userId = GetCurrentUserId();

        var comments = await _context.Comments
            .Include(c => c.User)
            .Include(c => c.Images)
            .Include(c => c.Likes)
            .Where(c => c.TrailId == trailId)
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CommentListDto
            {
                Id = c.Id,
                UserId = c.UserId,
                UserName = c.User.Name ?? "匿名用戶",
                UserAvatar = c.User.Avatar,
                Star = c.Star,
                Difficulty = c.Difficulty,
                Beauty = c.Beauty,
                Content = c.Content,
                Date = c.Date,
                CreatedAt = c.CreatedAt,
                Images = c.Images.OrderBy(i => i.SortOrder).Select(i => i.ImageUrl).ToList(),
                LikeCount = c.Likes.Count,
                IsLiked = userId.HasValue && c.Likes.Any(l => l.UserId == userId)
            })
            .ToListAsync();

        return Ok(comments);
    }

    [HttpGet("stats")]
    public async Task<ActionResult<CommentStatsDto>> GetCommentStats(int trailId)
    {
        var comments = await _context.Comments
            .Where(c => c.TrailId == trailId)
            .ToListAsync();

        if (!comments.Any())
        {
            return Ok(new CommentStatsDto
            {
                TotalCount = 0,
                AverageStar = 0,
                AverageDifficulty = 0,
                AverageBeauty = 0
            });
        }

        var stats = new CommentStatsDto
        {
            TotalCount = comments.Count,
            AverageStar = comments.Where(c => c.Star.HasValue).Any()
                ? Math.Round((decimal)comments.Where(c => c.Star.HasValue).Average(c => c.Star!.Value), 1)
                : 0,
            AverageDifficulty = comments.Where(c => c.Difficulty.HasValue).Any()
                ? Math.Round((decimal)comments.Where(c => c.Difficulty.HasValue).Average(c => c.Difficulty!.Value), 1)
                : 0,
            AverageBeauty = comments.Where(c => c.Beauty.HasValue).Any()
                ? Math.Round((decimal)comments.Where(c => c.Beauty.HasValue).Average(c => c.Beauty!.Value), 1)
                : 0
        };

        return Ok(stats);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CommentListDto>> CreateComment(int trailId, [FromBody] CreateCommentDto dto)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(new { error = "User not authenticated" });
        }

        // Check if trail exists
        var trailExists = await _context.Trails.AnyAsync(t => t.Id == trailId);
        if (!trailExists)
        {
            return NotFound(new { error = "Trail not found" });
        }

        // Check if user already commented
        var existingComment = await _context.Comments
            .FirstOrDefaultAsync(c => c.TrailId == trailId && c.UserId == userId);

        if (existingComment != null)
        {
            return BadRequest(new { error = "You have already commented on this trail" });
        }

        var user = await _context.Users.FindAsync(userId);

        var comment = new Comment
        {
            UserId = userId.Value,
            TrailId = trailId,
            Star = dto.Star,
            Difficulty = dto.Difficulty,
            Beauty = dto.Beauty,
            Content = dto.Content,
            Date = dto.Date ?? DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        // Add images if provided
        var imageUrls = new List<string>();
        if (dto.ImageUrls != null && dto.ImageUrls.Count > 0)
        {
            for (int i = 0; i < dto.ImageUrls.Count; i++)
            {
                var image = new CommentImage
                {
                    CommentId = comment.Id,
                    ImageUrl = dto.ImageUrls[i],
                    SortOrder = i
                };
                _context.CommentImages.Add(image);
                imageUrls.Add(dto.ImageUrls[i]);
            }
            await _context.SaveChangesAsync();
        }

        // Update trail evaluation (average star rating)
        await UpdateTrailEvaluation(trailId);

        var result = new CommentListDto
        {
            Id = comment.Id,
            UserId = comment.UserId,
            UserName = user?.Name ?? "匿名用戶",
            UserAvatar = user?.Avatar,
            Star = comment.Star,
            Difficulty = comment.Difficulty,
            Beauty = comment.Beauty,
            Content = comment.Content,
            Date = comment.Date,
            CreatedAt = comment.CreatedAt,
            Images = imageUrls,
            LikeCount = 0,
            IsLiked = false
        };

        return CreatedAtAction(nameof(GetComments), new { trailId }, result);
    }

    [HttpPut("{commentId}")]
    [Authorize]
    public async Task<ActionResult<CommentListDto>> UpdateComment(int trailId, int commentId, [FromBody] CreateCommentDto dto)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(new { error = "User not authenticated" });
        }

        var comment = await _context.Comments
            .Include(c => c.User)
            .Include(c => c.Images)
            .Include(c => c.Likes)
            .FirstOrDefaultAsync(c => c.Id == commentId && c.TrailId == trailId);

        if (comment == null)
        {
            return NotFound(new { error = "Comment not found" });
        }

        if (comment.UserId != userId)
        {
            return Forbid();
        }

        // Update fields
        comment.Star = dto.Star;
        comment.Difficulty = dto.Difficulty;
        comment.Beauty = dto.Beauty;
        comment.Content = dto.Content;
        comment.Date = dto.Date ?? comment.Date;
        comment.UpdatedAt = DateTime.UtcNow;

        // Update images if provided
        if (dto.ImageUrls != null)
        {
            // Remove old images
            var oldImages = await _context.CommentImages.Where(i => i.CommentId == commentId).ToListAsync();
            _context.CommentImages.RemoveRange(oldImages);

            // Add new images
            for (int i = 0; i < dto.ImageUrls.Count; i++)
            {
                _context.CommentImages.Add(new CommentImage
                {
                    CommentId = comment.Id,
                    ImageUrl = dto.ImageUrls[i],
                    SortOrder = i
                });
            }
        }

        await _context.SaveChangesAsync();

        // Update trail evaluation
        await UpdateTrailEvaluation(trailId);

        var result = new CommentListDto
        {
            Id = comment.Id,
            UserId = comment.UserId,
            UserName = comment.User?.Name ?? "匿名用戶",
            UserAvatar = comment.User?.Avatar,
            Star = comment.Star,
            Difficulty = comment.Difficulty,
            Beauty = comment.Beauty,
            Content = comment.Content,
            Date = comment.Date,
            CreatedAt = comment.CreatedAt,
            Images = dto.ImageUrls ?? comment.Images.OrderBy(i => i.SortOrder).Select(i => i.ImageUrl).ToList(),
            LikeCount = comment.Likes.Count,
            IsLiked = comment.Likes.Any(l => l.UserId == userId)
        };

        return Ok(result);
    }

    [HttpDelete("{commentId}")]
    [Authorize]
    public async Task<ActionResult> DeleteComment(int trailId, int commentId)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(new { error = "User not authenticated" });
        }

        var comment = await _context.Comments
            .FirstOrDefaultAsync(c => c.Id == commentId && c.TrailId == trailId);

        if (comment == null)
        {
            return NotFound(new { error = "Comment not found" });
        }

        if (comment.UserId != userId)
        {
            return Forbid();
        }

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();

        // Update trail evaluation
        await UpdateTrailEvaluation(trailId);

        return NoContent();
    }

    [HttpPost("{commentId}/like")]
    [Authorize]
    public async Task<ActionResult> LikeComment(int trailId, int commentId)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
        {
            return Unauthorized(new { error = "User not authenticated" });
        }

        var comment = await _context.Comments
            .FirstOrDefaultAsync(c => c.Id == commentId && c.TrailId == trailId);

        if (comment == null)
        {
            return NotFound(new { error = "Comment not found" });
        }

        var existingLike = await _context.UserLikeComments
            .FirstOrDefaultAsync(l => l.CommentId == commentId && l.UserId == userId);

        if (existingLike != null)
        {
            // Unlike
            _context.UserLikeComments.Remove(existingLike);
        }
        else
        {
            // Like
            _context.UserLikeComments.Add(new UserLikeComment
            {
                UserId = userId.Value,
                CommentId = commentId,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();

        var likeCount = await _context.UserLikeComments.CountAsync(l => l.CommentId == commentId);

        return Ok(new { likeCount, isLiked = existingLike == null });
    }

    private async Task UpdateTrailEvaluation(int trailId)
    {
        var avgStar = await _context.Comments
            .Where(c => c.TrailId == trailId && c.Star.HasValue)
            .AverageAsync(c => (decimal?)c.Star);

        var trail = await _context.Trails.FindAsync(trailId);
        if (trail != null)
        {
            trail.Evaluation = avgStar.HasValue ? Math.Round(avgStar.Value, 1) : null;
            await _context.SaveChangesAsync();
        }
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
