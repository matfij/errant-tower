using System.Collections.Frozen;
using ErrantTowerServer.Domains.Skills.Data;

namespace ErrantTowerServer.Domains.Skills;

public static class SkillRegistry
{
    public static readonly FrozenDictionary<SkillGuid, Skill> Skills = new Dictionary<SkillGuid, Skill>
    {
        [SkillGuid.Scratch] = Skills1.Scratch,
        [SkillGuid.Bite] = Skills1.Bite,
        [SkillGuid.TailWhip] = Skills1.TailWhip,

        [SkillGuid.Slash] = Skills2.Slash,
        [SkillGuid.Pierce] = Skills2.Pierce,
        [SkillGuid.Bash] = Skills2.Bash,
    }.ToFrozenDictionary();
}

public enum SkillGuid
{
    Scratch = 101,
    Bite = 102,
    TailWhip = 103,

    Slash = 200,
    Pierce = 201,
    Bash = 202,
}
