using ErrantTowerServer.Domains.Skills;
using MongoDB.Bson.Serialization.Attributes;

namespace ErrantTowerServer.Domains.Statistics;

public class StatisticsEntity
{
    [BsonId]
    public required string Id { get; set; }
    public required string UserId { get; set; }

    public int AttributePoints { get; set; } = 10;
    public int SkillPoints { get; set; } = 10;

    public int Strength { get; set; } = 10;
    public int Dexterity { get; set; } = 10;
    public int Constitution { get; set; } = 10;
    public int Spirit { get; set; } = 10;

    public required BattleStatistics Statistics { get; set; }
    public LearnedSkill[] LearnedSkills { get; set; } = [];
}

public record LearnedSkill
{
    public required SkillGuid Guid { get; init; }
    public required int Level { get; set; }
}
