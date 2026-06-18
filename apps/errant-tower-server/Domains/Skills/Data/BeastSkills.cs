namespace ErrantTowerServer.Domains.Skills.Data;

public static class BeastSkills
{
    public static readonly Skill Scratch = new()
    {
        Guid = SkillGuid.Scratch,
        Name = "Scratch",
        PhysicalAttackFactor = [1.1],
        PhysicalDefenseFactor = [0.8],
        Types = [SkillType.Slash],
    };

    public static readonly Skill Bite = new()
    {
        Guid = SkillGuid.Bite,
        Name = "Bite",
        PhysicalAttackFactor = [1.2],
        PhysicalDefenseFactor = [0.8],
        Types = [SkillType.Pierce],
        Effects =
        [
            [new () { Type = SkillEffectType.Bleeding, Value = 0.25, Chance = 0.25, Duration = 3 }]
        ],
    };

    public static readonly Skill TailWhip = new()
    {
        Guid = SkillGuid.TailWhip,
        Name = "Tail Whip",
        PhysicalAttackFactor = [0.8],
        PhysicalDefenseFactor = [1.2],
        Types = [SkillType.Blunt],
        Effects =
        [
            [new () { Type = SkillEffectType.Stun, Chance = 0.1, Duration = 1 }]
        ]
    };

    public static readonly Skill Tackle = new()
    {
        Guid = SkillGuid.Tackle,
        Name = "Tackle",
        PhysicalAttackFactor = [1.0],
        PhysicalDefenseFactor = [1.0],
        Types = [SkillType.Blunt],
        Effects =
        [
            [new () { Type = SkillEffectType.Stun, Chance = 0.2, Duration = 1 }]
        ]
    };

    public static readonly Skill Cut = new()
    {
        Guid = SkillGuid.Cut,
        Name = "Cut",
        PhysicalAttackFactor = [1.2],
        PhysicalDefenseFactor = [0.8],
        Types = [SkillType.Slash],
        Effects =
        [
            [new () { Type = SkillEffectType.Bleeding, Value = 0.3, Chance = 0.3, Duration = 3 }]
        ],
    };
}
