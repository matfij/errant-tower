using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ErrantTowerServer.Domains.User;

public class UserEntity
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public required string Id { get; set; }
    public required string Email { get; set; }
    public required string Username { get; set; }
    public string? ActionCodeHash { get; set; }
    public long? ActionCodeExpiresAt { get; set; }
    public int? ActionCodeAttempts { get; set; }
    public bool IsConfirmed { get; set; } = false;
}
