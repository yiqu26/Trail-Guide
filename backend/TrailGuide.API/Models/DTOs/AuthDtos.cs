using System.ComponentModel.DataAnnotations;

namespace TrailGuide.API.Models.DTOs;

public class RegisterDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

    public string? Name { get; set; }
}

public class LoginDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class SocialLoginDto
{
    public string? Name { get; set; }

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? GoogleId { get; set; }
    public string? FacebookId { get; set; }
    public string? AppleId { get; set; }
    public string? Avatar { get; set; }
    public string? Token { get; set; }
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public int UserId { get; set; }
    public long ExpireTime { get; set; }
}

public class RefreshTokenDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}

public class ForgotPasswordDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
}

public class ResetPasswordDto
{
    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;
}

public class VerifyCodeDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string VerificationCode { get; set; } = string.Empty;
}

public class UpdateProfileDto
{
    public string? Name { get; set; }
    public bool? Gender { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime? Birth { get; set; }
    public string? Avatar { get; set; }
}
