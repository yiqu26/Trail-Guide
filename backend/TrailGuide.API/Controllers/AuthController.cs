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
public class AuthController : ControllerBase
{
    private readonly TrailGuideDbContext _context;
    private readonly IJwtService _jwtService;

    public AuthController(TrailGuideDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        {
            return BadRequest(new { error = "Email already registered" });
        }

        var user = new User
        {
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Name = dto.Name
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return GenerateAuthResponse(user);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            return Unauthorized(new { error = "wrong email or password!" });
        }

        return GenerateAuthResponse(user);
    }

    [HttpPost("social")]
    public async Task<ActionResult<AuthResponseDto>> SocialLogin([FromBody] SocialLoginDto dto)
    {
        User? user = null;

        // 找尋已存在的用戶
        if (!string.IsNullOrEmpty(dto.GoogleId))
            user = await _context.Users.FirstOrDefaultAsync(u => u.GoogleId == dto.GoogleId);
        else if (!string.IsNullOrEmpty(dto.FacebookId))
            user = await _context.Users.FirstOrDefaultAsync(u => u.FacebookId == dto.FacebookId);
        else if (!string.IsNullOrEmpty(dto.AppleId))
            user = await _context.Users.FirstOrDefaultAsync(u => u.AppleId == dto.AppleId);

        // 用 Email 找
        user ??= await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
        {
            // 建立新用戶
            user = new User
            {
                Email = dto.Email,
                Name = dto.Name,
                Avatar = dto.Avatar,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Token ?? Guid.NewGuid().ToString()),
                GoogleId = dto.GoogleId,
                FacebookId = dto.FacebookId,
                AppleId = dto.AppleId,
                EmailVerifiedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        else
        {
            // 更新第三方 ID
            if (!string.IsNullOrEmpty(dto.GoogleId)) user.GoogleId = dto.GoogleId;
            if (!string.IsNullOrEmpty(dto.FacebookId)) user.FacebookId = dto.FacebookId;
            if (!string.IsNullOrEmpty(dto.AppleId)) user.AppleId = dto.AppleId;
            if (!string.IsNullOrEmpty(dto.Avatar)) user.Avatar = dto.Avatar;

            await _context.SaveChangesAsync();
        }

        return GenerateAuthResponse(user);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponseDto>> RefreshToken([FromBody] RefreshTokenDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u =>
            u.RefreshToken == dto.RefreshToken &&
            u.RefreshTokenExpiry > DateTime.UtcNow);

        if (user == null)
        {
            return Unauthorized(new { error = "Invalid or expired refresh token" });
        }

        return GenerateAuthResponse(user);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
        var user = await _context.Users.FindAsync(userId);

        if (user != null)
        {
            user.RefreshToken = null;
            user.RefreshTokenExpiry = null;
            await _context.SaveChangesAsync();
        }

        return Ok(new { status = "logged out" });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult> GetCurrentUser()
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
        var user = await _context.Users
            .Include(u => u.County)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound(new { error = "User not found" });
        }

        // 取得用戶統計資料
        var favoritesCount = await _context.Favorites.CountAsync(f => f.UserId == userId);
        var commentsCount = await _context.Comments.CountAsync(c => c.UserId == userId);

        return Ok(new
        {
            user.Id,
            user.Email,
            user.Name,
            user.Avatar,
            user.Gender,
            user.PhoneNumber,
            user.Birth,
            CountyName = user.County?.Name,
            Stats = new
            {
                FavoritesCount = favoritesCount,
                CommentsCount = commentsCount
            }
        });
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<ActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
        {
            return NotFound(new { error = "User not found" });
        }

        // 更新允許修改的欄位
        if (!string.IsNullOrEmpty(dto.Name))
            user.Name = dto.Name;
        if (dto.Gender.HasValue)
            user.Gender = dto.Gender.Value;
        if (!string.IsNullOrEmpty(dto.PhoneNumber))
            user.PhoneNumber = dto.PhoneNumber;
        if (dto.Birth.HasValue)
            user.Birth = dto.Birth.Value;
        if (!string.IsNullOrEmpty(dto.Avatar))
            user.Avatar = dto.Avatar;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Profile updated successfully" });
    }

    private AuthResponseDto GenerateAuthResponse(User user)
    {
        var token = _jwtService.GenerateToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        _context.SaveChanges();

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            UserId = user.Id,
            ExpireTime = 3600000 // 1 hour in ms
        };
    }
}
