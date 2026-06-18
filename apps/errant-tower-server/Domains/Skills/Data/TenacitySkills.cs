namespace ErrantTowerServer.Domains.Skills.Data;

public static class TenacitySkills
{
    public static readonly Skill GreatVigor = new()
    {
        Guid = SkillGuid.GreatVigor,
        Name = "Great Vigor",
        ImageUrl = "tenacity/great-vigor.png",
        Path = SkillPath.Tenacity,
        Tier = 0,
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
        ],
    };

    public static readonly Skill Armorer = new()
    {
        Guid = SkillGuid.Armorer,
        Name = "Armorer",
        ImageUrl = "tenacity/armorer.png",
        Path = SkillPath.Tenacity,
        Tier = 1,
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
        ],
        Requirements = [new() { Path = SkillPath.Tenacity, Points = 3 }],
    };

    public static readonly Skill Energizer = new()
    {
        Guid = SkillGuid.Energizer,
        Name = "Energizer",
        ImageUrl = "tenacity/energizer.png",
        Path = SkillPath.Tenacity,
        Tier = 2,
        Types = [SkillType.Buff],
        IsPassive = true,
        Properties =
        [
            [new () { Type = SkillPropertyType.EnergyPoints, Value = 0.02 }],
            [new () { Type = SkillPropertyType.EnergyPoints, Value = 0.04 }],
            [new () { Type = SkillPropertyType.EnergyPoints, Value = 0.06 }],
            [new () { Type = SkillPropertyType.EnergyPoints, Value = 0.08 }],
            [new () { Type = SkillPropertyType.EnergyPoints, Value = 0.10 }],
            [new () { Type = SkillPropertyType.EnergyPoints, Value = 0.12 }],
            [new () { Type = SkillPropertyType.EnergyPoints, Value = 0.14 }],
            [new () { Type = SkillPropertyType.EnergyPoints, Value = 0.16 }],
            [new () { Type = SkillPropertyType.EnergyPoints, Value = 0.18 }],
            [new () { Type = SkillPropertyType.EnergyPoints, Value = 0.20 }],
        ],
        Requirements = [new() { Path = SkillPath.Tenacity, Points = 3 }],
    };

    public static readonly Skill Deflect = new()
    {
        Guid = SkillGuid.Deflect,
        Name = "Deflect",
        ImageUrl = "tenacity/deflect.png",
        Path = SkillPath.Tenacity,
        Tier = 2,
        Types = [SkillType.Buff],
        IsPassive = true,
        Properties =
        [
            [new () { Type = SkillPropertyType.BlockChance, Value = 0.01 }],
            [new () { Type = SkillPropertyType.BlockChance, Value = 0.02 }],
            [new () { Type = SkillPropertyType.BlockChance, Value = 0.03 }],
            [new () { Type = SkillPropertyType.BlockChance, Value = 0.04 }],
            [new () { Type = SkillPropertyType.BlockChance, Value = 0.05 }],
            [new () { Type = SkillPropertyType.BlockChance, Value = 0.06 }],
            [new () { Type = SkillPropertyType.BlockChance, Value = 0.07 }],
            [new () { Type = SkillPropertyType.BlockChance, Value = 0.08 }],
            [new () { Type = SkillPropertyType.BlockChance, Value = 0.09 }],
            [new () { Type = SkillPropertyType.BlockChance, Value = 0.10 }],
        ],
        Requirements = [new() { Path = SkillPath.Tenacity, Points = 12 }],
    };

    public static readonly Skill HeartsResolve = new()
    {
        Guid = SkillGuid.HeartsResolve,
        Name = "Heart's Resolve",
        ImageUrl = "tenacity/hearts-resolve.png",
        Path = SkillPath.Tenacity,
        Tier = 2,
        Types = [SkillType.Buff],
        IsPassive = true,
        Properties =
        [
            [new () { Type = SkillPropertyType.HealthRegen, Value = 0.01 }],
            [new () { Type = SkillPropertyType.HealthRegen, Value = 0.02 }],
            [new () { Type = SkillPropertyType.HealthRegen, Value = 0.03 }],
            [new () { Type = SkillPropertyType.HealthRegen, Value = 0.04 }],
            [new () { Type = SkillPropertyType.HealthRegen, Value = 0.05 }],
            [new () { Type = SkillPropertyType.HealthRegen, Value = 0.06 }],
            [new () { Type = SkillPropertyType.HealthRegen, Value = 0.07 }],
            [new () { Type = SkillPropertyType.HealthRegen, Value = 0.08 }],
            [new () { Type = SkillPropertyType.HealthRegen, Value = 0.09 }],
            [new () { Type = SkillPropertyType.HealthRegen, Value = 0.10 }],
        ],
        Requirements = [new() { Path = SkillPath.Tenacity, Points = 12 }],
    };
}
