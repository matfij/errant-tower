using System.ComponentModel.DataAnnotations;

namespace ErrantTowerServer.Domains.User;

public record CreateUserRequest
{
    [Required]
    [EmailAddress]
    public required string Email { get; init; }

    [Required]
    [MinLength(8)]
    public required string Password { get; init; }

    [Required]
    [MinLength(4)]
    [MaxLength(40)]
    public required string Username { get; init; }
}
