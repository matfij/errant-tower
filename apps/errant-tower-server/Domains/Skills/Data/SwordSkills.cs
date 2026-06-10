namespace ErrantTowerServer.Domains.Skills.Data;

public static class SwordSkills
{
    public static readonly Skill Slash = new()
    {
        Guid = SkillGuid.Slash,
        Name = "Slash",
        PhysicalAttackFactor = 1.25,
        PhysicalDefenseFactor = 0.9,
        Types = [SkillType.Slash],
        EnergyCost = 0,
    };

    public static readonly Skill TwinEdge = new()
    {
        Guid = SkillGuid.TwinEdge,
        Name = "Twin Edge",
        HitCount = 2,
        PhysicalAttackFactor = 1.1,
        PhysicalDefenseFactor = 0.9,
        Types = [SkillType.Slash],
        EnergyCost = 10,
        Effects =
        [
            new () { Type = SkillEffectType.PhysicalDefense, Value = -0.2, Chance = 1, Duration = 1 }
        ]
    };
}
