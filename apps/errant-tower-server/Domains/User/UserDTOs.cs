using System.ComponentModel.DataAnnotations;

namespace ErrantTowerServer.Domains.User;

public record CreateUserRequest(
    [Required][EmailAddress] string Email,
    [Required][MinLength(8)] string Password,
    [Required][MinLength(4)][MaxLength(40)] string Username);
