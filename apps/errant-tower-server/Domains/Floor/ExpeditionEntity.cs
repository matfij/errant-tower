using MongoDB.Bson.Serialization.Attributes;

namespace ErrantTowerServer.Domains.Floor;

public class ExpeditionEntity
{
    [BsonId]
    public required string Id { get; set; }
    public required string UserId { get; set; }

    public required FloorGuid FloorGuid { get; set; }
}
