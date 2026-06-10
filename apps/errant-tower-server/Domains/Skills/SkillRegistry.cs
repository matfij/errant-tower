using System.Collections.Frozen;
using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Skills.Data;

namespace ErrantTowerServer.Domains.Skills;

public static class SkillRegistry
{
    private static readonly FrozenDictionary<SkillGuid, Skill> _skills = new Dictionary<SkillGuid, Skill>
    {
        // Beast skills
        [SkillGuid.Scratch] = BeastSkills.Scratch,
        [SkillGuid.Bite] = BeastSkills.Bite,
        [SkillGuid.TailWhip] = BeastSkills.TailWhip,

        // Sword skills
        [SkillGuid.Slash] = SwordSkills.Slash,
        [SkillGuid.TwinEdge] = SwordSkills.TwinEdge,

        // Tenacity skills
        [SkillGuid.GreatVigor] = TenacitySkills.GreatVigor,
    }.ToFrozenDictionary();

    public static Skill GetSkill(SkillGuid guid)
    {
        if (!_skills.TryGetValue(guid, out var skill))
        {
            throw new ApiException("errors.skillNotDefined");
        }
        return skill;
    }
}

public enum SkillGuid
{
    // Beast skills
    Scratch = 101,
    Bite = 102,
    TailWhip = 103,

    // Sword skills
    Slash = 1001,
    TwinEdge = 1002,

    // Tenacity skills
    GreatVigor = 1101,
}
