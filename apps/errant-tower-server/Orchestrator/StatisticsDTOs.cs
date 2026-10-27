using System.ComponentModel.DataAnnotations;
using ErrantTowerServer.Domains.Skills;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Orchestrator;

public record GetAttributesResponse
{
    public required int Strength { get; init; }
    public required int Dexterity { get; init; }
    public required int Constitution { get; init; }
    public required int Spirit { get; init; }
    public required int AttributePoints { get; init; }
}

public record GetBattleStatisticsResponse : BattleStatistics;

public record ExtendAttributeResponse : GetAttributesResponse;

public record ExtendAttributeRequest
{
    public required UserAttribute attribute { get; init; }
}

public record GetSkillTreeResponse : SkillTree { }
public record LearnSkillResponse : SkillTree { }
public record ResetSkillsResponse : SkillTree { }

public record LearnSkillRequest
{
    [Required]
    public required SkillGuid SkillGuid { get; init; }
}
