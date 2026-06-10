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
    public bool TargetSelf { get; init; } = false;
    public int HitCount { get; init; } = 1;
    public int EnergyCost { get; init; } = 0;
    public int ManaCost { get; init; } = 0;
    public SkillEffect[] Effects { get; init; } = [];  // For active skills - e.g. bleeding
    public SkillProperty[] Properties { get; init; } = [];  // For passive skills - e.g. +10% physical attack
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

public readonly record struct SkillEffect
{
    public SkillEffectType Type { get; init; }
    public double Value { get; init; }
    public double Chance { get; init; }
    public int Duration { get; init; }
}

public enum SkillEffectType
{
    Initiative = 0,
    PhysicalAttack = 1,
    MagicalAttack = 2,
    PhysicalDefense = 3,
    MagicalDefense = 4,
    HealthPoints = 5,
    ManaPoints = 6,
    EnergyPoints = 7,
    Stun = 100,
    Freeze = 101,
    Paralyze = 102,
    Bleeding = 103,
    Poison = 104,
    Barrier = 105,
}

public readonly record struct SkillProperty
{
    public SkillPropertyType Type { get; init; }
    public double Value { get; init; }
    public int Duration { get; init; }
}

public enum SkillPropertyType
{
    Initiative = 0,
    PhysicalAttack = 1,
    MagicalAttack = 2,
    PhysicalDefense = 3,
    MagicalDefense = 4,
    HealthPoints = 5,
    ManaPoints = 6,
    EnergyPoints = 7,
    CriticalChance = 8,
    PhysicalCriticalPower = 9,
    MagicalCriticalPower = 10,
    PunctureChance = 11,
    DodgeChance = 12,
    ParryChance = 13,
    BlockChance = 14,
    BlockPower = 15,
    CounterChance = 16,
    HealthRegen = 17,
    ManaRegen = 18,
}
