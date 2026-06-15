namespace ErrantTowerServer.Domains.Skills.Data;

public static class TenacitySkills
{
    public static readonly Skill GreatVigor = new()
    {
        Guid = SkillGuid.GreatVigor,
        Name = "Great Vigor",
        ImageUrl = "great-vigor.png",
        Types = [SkillType.Buff],
        IsPassive = true,
        Properties =
        [
            [new () { Type = SkillPropertyType.HealthPoints, Value = 0.01 }],
            [new () { Type = SkillPropertyType.HealthPoints, Value = 0.02 }],
            [new () { Type = SkillPropertyType.HealthPoints, Value = 0.03 }],
            [new () { Type = SkillPropertyType.HealthPoints, Value = 0.04 }],
            [new () { Type = SkillPropertyType.HealthPoints, Value = 0.05 }],
            [new () { Type = SkillPropertyType.HealthPoints, Value = 0.06 }],
            [new () { Type = SkillPropertyType.HealthPoints, Value = 0.07 }],
            [new () { Type = SkillPropertyType.HealthPoints, Value = 0.08 }],
            [new () { Type = SkillPropertyType.HealthPoints, Value = 0.09 }],
            [new () { Type = SkillPropertyType.HealthPoints, Value = 0.10 }],
        ]
    };

    public static readonly Skill Armorer = new()
    {
        Guid = SkillGuid.Armorer,
        Name = "Armorer",
        ImageUrl = "armorer.png",
        Types = [SkillType.Buff],
        IsPassive = true,
        Properties =
        [
            [new () { Type = SkillPropertyType.PhysicalDefense, Value = 0.01 }],
            [new () { Type = SkillPropertyType.PhysicalDefense, Value = 0.02 }],
            [new () { Type = SkillPropertyType.PhysicalDefense, Value = 0.03 }],
            [new () { Type = SkillPropertyType.PhysicalDefense, Value = 0.04 }],
            [new () { Type = SkillPropertyType.PhysicalDefense, Value = 0.05 }],
            [new () { Type = SkillPropertyType.PhysicalDefense, Value = 0.06 }],
            [new () { Type = SkillPropertyType.PhysicalDefense, Value = 0.07 }],
            [new () { Type = SkillPropertyType.PhysicalDefense, Value = 0.08 }],
            [new () { Type = SkillPropertyType.PhysicalDefense, Value = 0.09 }],
            [new () { Type = SkillPropertyType.PhysicalDefense, Value = 0.10 }],
        ]
    };

    public static readonly Skill SmashingPower = new()
    {
        Guid = SkillGuid.SmashingPower,
        Name = "Smashing Power",
        ImageUrl = "smashing-power.png",
        Types = [SkillType.Buff],
        IsPassive = true,
        Properties =
        [
            [new () { Type = SkillPropertyType.PhysicalCriticalPower, Value = 0.01 }],
            [new () { Type = SkillPropertyType.PhysicalCriticalPower, Value = 0.03 }],
            [new () { Type = SkillPropertyType.PhysicalCriticalPower, Value = 0.04 }],
            [new () { Type = SkillPropertyType.PhysicalCriticalPower, Value = 0.06 }],
            [new () { Type = SkillPropertyType.PhysicalCriticalPower, Value = 0.07 }],
            [new () { Type = SkillPropertyType.PhysicalCriticalPower, Value = 0.09 }],
            [new () { Type = SkillPropertyType.PhysicalCriticalPower, Value = 0.10 }],
            [new () { Type = SkillPropertyType.PhysicalCriticalPower, Value = 0.12 }],
            [new () { Type = SkillPropertyType.PhysicalCriticalPower, Value = 0.13 }],
            [new () { Type = SkillPropertyType.PhysicalCriticalPower, Value = 0.14 }],
        ]
    };

    public static readonly Skill Thornmail = new()
    {
        Guid = SkillGuid.Thornmail,
        Name = "Thornmail",
        ImageUrl = "thornmail.png",
        Types = [SkillType.Buff],
        IsPassive = true,
        Properties =
        [
            [new () { Type = SkillPropertyType.PhysicalDeflect, Value = 0.01 }],
            [new () { Type = SkillPropertyType.MagicalDeflect, Value = 0.02 }],
            [new () { Type = SkillPropertyType.MagicalDeflect, Value = 0.03 }],
            [new () { Type = SkillPropertyType.MagicalDeflect, Value = 0.04 }],
            [new () { Type = SkillPropertyType.MagicalDeflect, Value = 0.05 }],
            [new () { Type = SkillPropertyType.MagicalDeflect, Value = 0.06 }],
            [new () { Type = SkillPropertyType.PhysicalDeflect, Value = 0.07 }],
            [new () { Type = SkillPropertyType.PhysicalDeflect, Value = 0.08 }],
            [new () { Type = SkillPropertyType.PhysicalDeflect, Value = 0.09 }],
            [new () { Type = SkillPropertyType.PhysicalDeflect, Value = 0.10 }],
        ]
    };
}
