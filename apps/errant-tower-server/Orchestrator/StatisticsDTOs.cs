using System.ComponentModel.DataAnnotations;
using ErrantTowerServer.Domains.Skills;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Orchestrator;

public record GetSkillTreeResponse : SkillTree { }
public record LearnSkillResponse : SkillTree { }
public record ResetSkillsResponse : SkillTree { }

public record LearnSkillRequest
{
    [Required]
    public required SkillGuid SkillGuid { get; init; }
}
