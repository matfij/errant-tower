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
    [Required]
    public required string UserId { get; init; }

    [Required]
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
    [Required]
    public required string UserId { get; init; }

    [Required]
    public required string Username { get; init; }
}

public record GetCurrentUserResponse
{
    [Required]
    public required string Id { get; init; }

    [Required]
    public required string Username { get; init; }

    [Required]
    public required string Email { get; init; }

}
