namespace ErrantTowerServer.Domains.Skills;

public readonly record struct Skill
{
    public const int MinLevel = 1;
    public const int MaxLevel = 10;

    public Skill() { }

    public void Validate()
    {
        (string Name, int Length)[] attributes =
            [
                (nameof(PhysicalAttackFactor), PhysicalAttackFactor.Length),
                (nameof(MagicalAttackFactor), MagicalAttackFactor.Length),
                (nameof(PhysicalDefenseFactor), PhysicalDefenseFactor.Length),
                (nameof(MagicalDefenseFactor), MagicalDefenseFactor.Length),
                (nameof(HitCount), HitCount.Length),
                (nameof(EnergyCost), EnergyCost.Length),
                (nameof(ManaCost), ManaCost.Length),
                (nameof(Effects), Effects.Length),
                (nameof(Properties), Properties.Length),
            ];
        foreach (var attribute in attributes)
        {
            if (attribute.Length != MinLevel && attribute.Length != MaxLevel)
            {
                throw new InvalidOperationException($"Skill {Name} > {attribute.Name} has {attribute.Length}");
            }
        }
    }

    public required SkillGuid Guid { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public string ImageUrl { get; init; } = "blank.png";
    public SkillPath Path { get; init; } = SkillPath.None;
    public int Tier { get; init; } = 1;
    public required SkillType[] Types { get; init; }
    public double[] PhysicalAttackFactor { get; init; } = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    public double[] MagicalAttackFactor { get; init; } = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    public double[] PhysicalDefenseFactor { get; init; } = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    public double[] MagicalDefenseFactor { get; init; } = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    public bool IsPassive { get; init; } = false;
    public bool TargetSelf { get; init; } = false;
    public int[] HitCount { get; init; } = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    public int[] EnergyCost { get; init; } = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    public int[] ManaCost { get; init; } = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    public SkillEffect[][] Effects { get; init; } = [[], [], [], [], [], [], [], [], [], []];  // For active skills - e.g. bleeding
    public SkillProperty[][] Properties { get; init; } = [[], [], [], [], [], [], [], [], [], []];  // For passive skills - e.g. +10% physical attack
    public SkillRequirement[] Requirements { get; init; } = [];
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

public enum SkillPath
{
    None = 0,
    Blade = 1,
    Tenacity = 2,
    Hammer = 3,
    Bellicosity = 4,
    Lance = 5,
    Vivacity = 6,
    Bow = 7,
    Perspicacity = 8,
    Staff = 9,
    Sagacity = 10,
}

public readonly record struct SkillEffect
{
    public required SkillEffectType Type { get; init; }
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
    public required SkillPropertyType Type { get; init; }
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
    PhysicalDeflect = 19,
    MagicalDeflect = 20,
}

public readonly record struct SkillRequirement
{
    public required SkillPath Path { get; init; }
    public required int Points { get; init; }
}
