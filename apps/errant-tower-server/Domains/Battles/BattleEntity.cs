using ErrantTowerServer.Domains.Skills;
using ErrantTowerServer.Domains.Statistics;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ErrantTowerServer.Domains.Battles;

public class BattleEntity
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    public required string Id { get; set; }
    public required string UserId { get; set; }

    public required bool IsFinished { get; set; }
    public required int TurnNumber { get; set; }
    public required BattleCharacter User { get; set; }
    public required BattleCharacter Enemy { get; set; }
}

public record BattleCharacter
{
    public required string Name { get; set; }
    public required BattleStatistics Statistics { get; set; }
    public required List<BattleStatus> Statuses { get; set; }
}

public record BattleStatus
{
    public required SkillEffectType Type { get; init; }
    public double Value { get; init; }
    public int Duration { get; init; }
}
