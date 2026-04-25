using System.ComponentModel.DataAnnotations;

namespace ErrantTowerServer.Domains.User;

public record StartSignUpRequest
{
    [Required]
    [EmailAddress]
    public required string Email { get; init; }

    [Required]
    [MinLength(4)]
    [MaxLength(16)]
    public required string Username { get; init; }
}

public record CompleteSignUpRequest
{
    [Required]
    [EmailAddress]
    public required string Email { get; init; }

    [Required]
    [MinLength(6)]
    [MaxLength(6)]
    public required string ActionCode { get; init; }
}

public record CompleteSignUpResponse
{
    public required string UserId { get; init; }
    public required string Username { get; init; }
}

public record StartSignInRequest
{
    [Required]
    [EmailAddress]
    public required string Email { get; init; }
}

public record CompleteSignInRequest
{
    [Required]
    [EmailAddress]
    public required string Email { get; init; }

    [Required]
    [MinLength(6)]
    [MaxLength(6)]
    public required string ActionCode { get; init; }
}

public record CompleteSignInResponse
{
    public required string UserId { get; init; }
    public required string Username { get; init; }
}
