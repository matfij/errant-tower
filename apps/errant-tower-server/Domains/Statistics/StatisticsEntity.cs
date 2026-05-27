using MongoDB.Bson.Serialization.Attributes;

namespace ErrantTowerServer.Domains.Statistics;

public class StatisticsEntity : BattleStatistics
{
    [BsonId]
    public required string Id { get; set; }
    public required string UserId { get; set; }

    public int AttributePoints { get; set; } = 10;

    public int Strength { get; set; } = 10;
    public int Dexterity { get; set; } = 10;
    public int Constitution { get; set; } = 10;
    public int Spirit { get; set; } = 10;
}
