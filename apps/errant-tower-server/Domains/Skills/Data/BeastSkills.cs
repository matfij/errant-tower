namespace ErrantTowerServer.Domains.Skills.Data;

public static class BeastSkills
{
    public static readonly Skill Scratch = new()
    {
        Guid = SkillGuid.Scratch,
        Name = "Scratch",
        ImageUrl = "scratch.png",
        PhysicalAttackFactor = [1.1],
        PhysicalDefenseFactor = [0.8],
        Types = [SkillType.Slash],
    };

    public static readonly Skill Bite = new()
    {
        Guid = SkillGuid.Bite,
        Name = "Bite",
        ImageUrl = "bite.png",
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
        ImageUrl = "tail-whip.png",
        PhysicalAttackFactor = [0.8],
        PhysicalDefenseFactor = [1.2],
        Types = [SkillType.Blunt],
        Effects =
        [
            [new () { Type = SkillEffectType.Stun, Chance = 0.1, Duration = 1 }]
        ]
    };
}
