using System.Collections.Frozen;
using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Skills.Data;

namespace ErrantTowerServer.Domains.Skills;

public static class SkillRegistry
{
    private static readonly FrozenDictionary<SkillGuid, Skill> _skills = new Dictionary<SkillGuid, Skill>
    {
        [SkillGuid.Scratch] = Skills1.Scratch,
        [SkillGuid.Bite] = Skills1.Bite,
        [SkillGuid.TailWhip] = Skills1.TailWhip,

        [SkillGuid.Slash] = Skills2.Slash,
        [SkillGuid.Pierce] = Skills2.Pierce,
        [SkillGuid.Bash] = Skills2.Bash,
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
    Scratch = 101,
    Bite = 102,
    TailWhip = 103,

    Punch = 200,
    Slash = 201,
    Pierce = 202,
    Bash = 203,
}
