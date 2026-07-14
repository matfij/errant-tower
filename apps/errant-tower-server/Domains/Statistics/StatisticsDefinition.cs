using ErrantTowerServer.Domains.Skills;

namespace ErrantTowerServer.Domains.Statistics;

public record struct BattleStatistics
{
    public BattleStatistics() { }

    public double Speed { get; init; } = 0;
    public double HealthPoints { get; init; } = 0;
    public double ManaPoints { get; init; } = 0;
    public double EnergyPoints { get; init; } = 0;
    public double PhysicalAttack { get; init; } = 0;
    public double MagicalAttack { get; init; } = 0;
    public double PhysicalDefense { get; init; } = 0;
    public double MagicalDefense { get; init; } = 0;
    public double PhysicalAbsorption { get; init; } = 0;
    public double MagicalAbsorption { get; init; } = 0;
    public double CriticalChance { get; init; } = 0;
    public double PhysicalCriticalPower { get; init; } = 0;
    public double MagicalCriticalPower { get; init; } = 0;
    public double PunctureChance { get; init; } = 0;
    public double DodgeChance { get; init; } = 0;
    public double ParryChance { get; init; } = 0;
    public double BlockChance { get; init; } = 0;
    public double BlockPower { get; init; } = 0;
    public double CounterChance { get; init; } = 0;
    public double HealthRegen { get; init; } = 0;
    public double ManaRegen { get; init; } = 0;
    public double EnergyRegen { get; init; } = 0;
}


public record SkillTree
{
    public required List<UserSkill> Blade { get; init; }
    public required List<UserSkill> Tenacity { get; init; }
    public required List<UserSkill> Hammer { get; init; }
    public required List<UserSkill> Bellicosity { get; init; }
    public required List<UserSkill> Lance { get; init; }
    public required List<UserSkill> Vivacity { get; init; }
    public required List<UserSkill> Bow { get; init; }
    public required List<UserSkill> Perspicacity { get; init; }
    public required List<UserSkill> Staff { get; init; }
    public required List<UserSkill> Sagacity { get; init; }
}

public record UserSkill : Skill
{
    public required int Level { get; init; } = 0;
}

public static class SkillExtensions
{
    public static UserSkill ToUserSkill(this Skill skill, int level)
    {
        return new UserSkill
        {
            Guid = skill.Guid,
            Name = skill.Name,
            Description = skill.Description,
            ImageUrl = skill.ImageUrl,
            Path = skill.Path,
            Tier = skill.Tier,
            Types = skill.Types,
            PhysicalAttackFactor = skill.PhysicalAttackFactor,
            MagicalAttackFactor = skill.MagicalAttackFactor,
            PhysicalDefenseFactor = skill.PhysicalDefenseFactor,
            MagicalDefenseFactor = skill.MagicalDefenseFactor,
            IsPassive = skill.IsPassive,
            TargetSelf = skill.TargetSelf,
            HitCount = skill.HitCount,
            EnergyCost = skill.EnergyCost,
            ManaCost = skill.ManaCost,
            Effects = skill.Effects,
            Properties = skill.Properties,
            Requirements = skill.Requirements,
            Level = level
        };
    }
}
