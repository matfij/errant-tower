using ErrantTowerServer.Domains.Skills;

namespace ErrantTowerServer.Domains.Statistics;

public record struct BattleStatistics
{
    public BattleStatistics() { }

    public double Speed { get; set; } = 0;
    public double HealthPoints { get; set; } = 0;
    public double ManaPoints { get; set; } = 0;
    public double EnergyPoints { get; set; } = 0;
    public double PhysicalAttack { get; set; } = 0;
    public double MagicalAttack { get; set; } = 0;
    public double PhysicalDefense { get; set; } = 0;
    public double MagicalDefense { get; set; } = 0;
    public double PhysicalAbsorption { get; set; } = 0;
    public double MagicalAbsorption { get; set; } = 0;
    public double CriticalChance { get; set; } = 0;
    public double PhysicalCriticalPower { get; set; } = 0;
    public double MagicalCriticalPower { get; set; } = 0;
    public double PunctureChance { get; set; } = 0;
    public double DodgeChance { get; set; } = 0;
    public double ParryChance { get; set; } = 0;
    public double BlockChance { get; set; } = 0;
    public double BlockPower { get; set; } = 0;
    public double CounterChance { get; set; } = 0;
    public double HealthRegen { get; set; } = 0;
    public double ManaRegen { get; set; } = 0;
    public double EnergyRegen { get; set; } = 0;
}


public record SkillTree
{
    public required List<UserSkill> Blade { get; set; }
    public required List<UserSkill> Tenacity { get; set; }
    public required List<UserSkill> Hammer { get; set; }
    public required List<UserSkill> Bellicosity { get; set; }
    public required List<UserSkill> Lance { get; set; }
    public required List<UserSkill> Vivacity { get; set; }
    public required List<UserSkill> Bow { get; set; }
    public required List<UserSkill> Perspicacity { get; set; }
    public required List<UserSkill> Staff { get; set; }
    public required List<UserSkill> Sagacity { get; set; }
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
