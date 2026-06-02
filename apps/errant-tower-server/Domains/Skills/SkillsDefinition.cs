namespace ErrantTowerServer.Domains.Skills;

public readonly record struct Skill
{
    public Skill() { }

    public required SkillGuid Guid { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required SkillType[] Types { get; init; }
    public double PhysicalAttackFactor { get; init; } = 0;
    public double MagicalAttackFactor { get; init; } = 0;
    public double PhysicalDefenseFactor { get; init; } = 0;
    public double MagicalDefenseFactor { get; init; } = 0;
    public bool IsPassive { get; init; } = false;
    public bool TargetsSelf { get; init; } = false;
    public int EnergyCost { get; init; } = 0;
    public int ManaCost { get; init; } = 0;
    public int RequiredSkillPoints { get; init; } = 0;
    public SkillGuid[] RequiredSkills { get; init; } = [];
}

public enum SkillType
{
    None = 0,
    Slash = 1,
    Pierce = 2,
    Blunt = 3,
    Fire = 4,
    Water = 5,
    Earth = 6,
    Wind = 7,
    Electric = 8,
    Light = 9,
    Dark = 10,
    Heal = 11,
    Buff = 12,
}
