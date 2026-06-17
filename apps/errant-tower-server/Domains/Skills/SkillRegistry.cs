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

        // Blade skills
        [SkillGuid.Slash] = BladeSkills.Slash,
        [SkillGuid.SwiftStrike] = BladeSkills.SwiftStrike,
        [SkillGuid.TwinEdge] = BladeSkills.TwinEdge,
        [SkillGuid.CrusherBlow] = BladeSkills.CrusherBlow,
        [SkillGuid.FlashStrike] = BladeSkills.FlashStrike,
        [SkillGuid.TriEdge] = BladeSkills.TriEdge,
        [SkillGuid.BloodthirstyBlade] = BladeSkills.BloodthirstyBlade,

        // Tenacity skills
        [SkillGuid.GreatVigor] = TenacitySkills.GreatVigor,
        [SkillGuid.Armorer] = TenacitySkills.Armorer,
        [SkillGuid.Energizer] = TenacitySkills.Energizer,
        [SkillGuid.Deflect] = TenacitySkills.Deflect,
        [SkillGuid.HeartsResolve] = TenacitySkills.HeartsResolve,

    }.ToFrozenDictionary();

    public static void ValidateAll()
    {
        foreach (var skill in _skills.Values)
        {
            skill.Validate();
        }
    }

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

    // Blade skills
    Slash = 1001,
    SwiftStrike = 1002,
    TwinEdge = 1003,
    CrusherBlow = 1004,
    FlashStrike = 1005,
    TriEdge = 1006,
    BloodthirstyBlade = 1007,

    // Tenacity skills
    GreatVigor = 1101,
    Armorer = 1102,
    Energizer = 1103,
    Deflect = 1104,
    HeartsResolve = 1105,
}
