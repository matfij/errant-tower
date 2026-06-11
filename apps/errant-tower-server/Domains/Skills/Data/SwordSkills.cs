namespace ErrantTowerServer.Domains.Skills.Data;

public static class SwordSkills
{
    public static readonly Skill Slash = new()
    {
        Guid = SkillGuid.Slash,
        Name = "Slash",
        ImageUrl = "slash.png",
        PhysicalAttackFactor = [1.1, 1.11, 1.12, 1.13, 1.14, 1.15, 1.16, 1.17, 1.18, 1.2],
        PhysicalDefenseFactor = [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
        Types = [SkillType.Slash],
        EnergyCost = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };

    public static readonly Skill TwinEdge = new()
    {
        Guid = SkillGuid.TwinEdge,
        Name = "Twin Edge",
        ImageUrl = "twin-edge.png",
        HitCount = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        PhysicalAttackFactor = [1, 1.02, 1.04, 1.06, 1.08, 1.1, 1.12, 1.14, 1.16, 1.18],
        PhysicalDefenseFactor = [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
        Types = [SkillType.Slash],
        Effects =
        [
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.2, Chance = 1, Duration = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.2, Chance = 1, Duration = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.2, Chance = 1, Duration = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.2, Chance = 1, Duration = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.2, Chance = 1, Duration = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.2, Chance = 1, Duration = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.2, Chance = 1, Duration = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.2, Chance = 1, Duration = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.2, Chance = 1, Duration = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.15, Chance = 1, Duration = 1 }],
        ],
        EnergyCost = [7, 7, 7, 8, 8, 8, 8, 9, 9, 8],
    };

    public static readonly Skill SwiftStrike = new()
    {
        Guid = SkillGuid.SwiftStrike,
        Name = "Swift Strike",
        ImageUrl = "swift-strike.png",
        PhysicalAttackFactor = [1.1, 1.12, 1.14, 1.16, 1.18, 1.2, 1.22, 1.24, 1.26, 1.28],
        PhysicalDefenseFactor = [0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95],
        Types = [SkillType.Slash],
        Effects =
        [
            [new () { Type = SkillEffectType.Initiative, Value = 1.10, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.Initiative, Value = 1.12, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.Initiative, Value = 1.14, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.Initiative, Value = 1.16, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.Initiative, Value = 1.18, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.Initiative, Value = 1.20, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.Initiative, Value = 1.22, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.Initiative, Value = 1.24, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.Initiative, Value = 1.26, Chance = 1, Duration = 2 }],
        ],
        EnergyCost = [6, 6, 6, 6, 6, 7, 7, 7, 7, 5],
    };

    public static readonly Skill CrusherBlow = new()
    {
        Guid = SkillGuid.CrusherBlow,
        Name = "Crusher Blow",
        ImageUrl = "crusher-blow.png",
        PhysicalAttackFactor = [1.2, 1.22, 1.24, 1.26, 1.28, 1.3, 1.32, 1.34, 1.36, 1.38],
        PhysicalDefenseFactor = [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
        Types = [SkillType.Slash],
        Effects =
        [
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.1, Chance = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.1, Chance = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.1, Chance = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.1, Chance = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.1, Chance = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.1, Chance = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.1, Chance = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.1, Chance = 1 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.08, Chance = 1 }],
        ],
        EnergyCost = [12, 12, 12, 12, 13, 13, 13, 13, 14, 13],
    };

    public static readonly Skill FlashStrike = new()
    {
        Guid = SkillGuid.FlashStrike,
        Name = "Flash Strike",
        ImageUrl = "flash-strike.png",
        PhysicalAttackFactor = [1.25, 1.28, 1.31, 1.34, 1.37, 1.40, 1.43, 1.46, 1.49, 1.52],
        PhysicalDefenseFactor = [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
        Types = [SkillType.Slash],
        Effects =
        [
            [new () { Type = SkillEffectType.Initiative, Value = 1.20, Chance = 1, Duration = 2 }, new () { Type = SkillEffectType.Paralyze, Chance = 0.2, Duration = 1}],
            [new () { Type = SkillEffectType.Initiative, Value = 1.22, Chance = 1, Duration = 2 }, new () { Type = SkillEffectType.Paralyze, Chance = 0.2, Duration = 1}],
            [new () { Type = SkillEffectType.Initiative, Value = 1.24, Chance = 1, Duration = 2 }, new () { Type = SkillEffectType.Paralyze, Chance = 0.2, Duration = 1}],
            [new () { Type = SkillEffectType.Initiative, Value = 1.26, Chance = 1, Duration = 2 }, new () { Type = SkillEffectType.Paralyze, Chance = 0.2, Duration = 1}],
            [new () { Type = SkillEffectType.Initiative, Value = 1.28, Chance = 1, Duration = 2 }, new () { Type = SkillEffectType.Paralyze, Chance = 0.2, Duration = 1}],
            [new () { Type = SkillEffectType.Initiative, Value = 1.30, Chance = 1, Duration = 2 }, new () { Type = SkillEffectType.Paralyze, Chance = 0.2, Duration = 1}],
            [new () { Type = SkillEffectType.Initiative, Value = 1.32, Chance = 1, Duration = 2 }, new () { Type = SkillEffectType.Paralyze, Chance = 0.2, Duration = 1}],
            [new () { Type = SkillEffectType.Initiative, Value = 1.34, Chance = 1, Duration = 2 }, new () { Type = SkillEffectType.Paralyze, Chance = 0.2, Duration = 1}],
            [new () { Type = SkillEffectType.Initiative, Value = 1.36, Chance = 1, Duration = 2 }, new () { Type = SkillEffectType.Paralyze, Chance = 0.2, Duration = 1}],
        ],
        EnergyCost = [20, 20, 20, 22, 22, 22, 22, 24, 24, 21],
    };

    public static readonly Skill TriEdge = new()
    {
        Guid = SkillGuid.TriEdge,
        Name = "Tri Edge",
        ImageUrl = "tri-edge.png",
        HitCount = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        PhysicalAttackFactor = [1.0, 1.01, 1.02, 1.03, 1.04, 1.05, 1.06, 1.07, 1.08, 1.1],
        PhysicalDefenseFactor = [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
        Types = [SkillType.Slash],
        Effects =
        [
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.15, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.15, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.15, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.15, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.15, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.12, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.12, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.12, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.12, Chance = 1, Duration = 2 }],
            [new () { Type = SkillEffectType.PhysicalDefense, Value = -0.10, Chance = 1, Duration = 2 }],
        ],
        EnergyCost = [25, 25, 25, 27, 27, 27, 29, 29, 29, 26],
    };

    public static readonly Skill BloodthirstyBlade = new()
    {
        Guid = SkillGuid.BloodthirstyBlade,
        Name = "Bloodthirsty Blade",
        ImageUrl = "bloodthirsty-blade.png",
        PhysicalAttackFactor = [1.1, 1.13, 1.16, 1.19, 1.22, 1.25, 1.28, 1.31, 1.34, 1.37],
        PhysicalDefenseFactor = [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
        Types = [SkillType.Slash],
        Effects =
        [
            [new () { Type = SkillEffectType.Bleeding, Value = 0.20, Chance = 0.4, Duration = 3 }],
            [new () { Type = SkillEffectType.Bleeding, Value = 0.21, Chance = 0.4, Duration = 3 }],
            [new () { Type = SkillEffectType.Bleeding, Value = 0.22, Chance = 0.4, Duration = 3 }],
            [new () { Type = SkillEffectType.Bleeding, Value = 0.23, Chance = 0.4, Duration = 3 }],
            [new () { Type = SkillEffectType.Bleeding, Value = 0.24, Chance = 0.4, Duration = 3 }],
            [new () { Type = SkillEffectType.Bleeding, Value = 0.25, Chance = 0.4, Duration = 3 }],
            [new () { Type = SkillEffectType.Bleeding, Value = 0.26, Chance = 0.4, Duration = 3 }],
            [new () { Type = SkillEffectType.Bleeding, Value = 0.27, Chance = 0.4, Duration = 3 }],
            [new () { Type = SkillEffectType.Bleeding, Value = 0.28, Chance = 0.4, Duration = 3 }],
            [new () { Type = SkillEffectType.Bleeding, Value = 0.29, Chance = 0.4, Duration = 3 }],
            [new () { Type = SkillEffectType.Bleeding, Value = 0.30, Chance = 0.4, Duration = 3 }],
        ],
        EnergyCost = [30, 30, 30, 33, 33, 33, 36, 36, 36, 31],
    };
}
