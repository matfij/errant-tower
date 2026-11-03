using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ErrantTowerServer.Domains.Users;

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

    // Set by the TypeScript server. Kept on the entity so a C# replace does not drop it or fail to read the user.
    public string? SessionId { get; set; }
}
