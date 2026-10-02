using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Items;
using ErrantTowerServer.Domains.Skills;

namespace ErrantTowerServer.Domains.Statistics;

public interface IStatisticsService
{
    public Task CreateInitial(string userId);
    public Task<BattleStatistics> GetUserBattleStatistics(string userId, IList<Item> equipment);
    public Task AwardPoints(string userId, int attributePoints, int skillPoints);
}

public class StatisticsService(IStatisticsRepository statisticsRepository) : IStatisticsService
{
    public async Task CreateInitial(string userId)
    {
        var newStatistics = new StatisticsEntity
        {
            Id = Utils.GenerateGuid(),
            UserId = userId,
        };
        await statisticsRepository.CreateOne(newStatistics);
    }

    public async Task<BattleStatistics> GetUserBattleStatistics(string userId, IList<Item> equipment)
    {
        var statistics = await GetStatistics(userId);

        var equipmentStatistics = new BattleStatistics();
        foreach (var item in equipment)
        {
            if (item.Statistics is null)
            {
                continue;
            }
            var stats = item.Statistics.Value;
            equipmentStatistics.Speed += stats.Speed;
            equipmentStatistics.MaxHealthPoints += stats.MaxHealthPoints;
            equipmentStatistics.HealthPoints += stats.HealthPoints;
            equipmentStatistics.MaxManaPoints += stats.MaxManaPoints;
            equipmentStatistics.ManaPoints += stats.ManaPoints;
            equipmentStatistics.MaxEnergyPoints += stats.MaxEnergyPoints;
            equipmentStatistics.EnergyPoints += stats.EnergyPoints;
            equipmentStatistics.PhysicalAttack += stats.PhysicalAttack;
            equipmentStatistics.MagicalAttack += stats.MagicalAttack;
            equipmentStatistics.PhysicalDefense += stats.PhysicalDefense;
            equipmentStatistics.MagicalDefense += stats.MagicalDefense;
            equipmentStatistics.PhysicalAbsorption += stats.PhysicalAbsorption;
            equipmentStatistics.MagicalAbsorption += stats.MagicalAbsorption;
            equipmentStatistics.CriticalChance += stats.CriticalChance;
            equipmentStatistics.PhysicalCriticalPower += stats.PhysicalCriticalPower;
            equipmentStatistics.MagicalCriticalPower += stats.MagicalCriticalPower;
            equipmentStatistics.PunctureChance += stats.PunctureChance;
            equipmentStatistics.DodgeChance += stats.DodgeChance;
            equipmentStatistics.ParryChance += stats.ParryChance;
            equipmentStatistics.BlockChance += stats.BlockChance;
            equipmentStatistics.BlockPower += stats.BlockPower;
            equipmentStatistics.CounterChance += stats.CounterChance;
            equipmentStatistics.HealthRegen += stats.HealthRegen;
            equipmentStatistics.ManaRegen += stats.ManaRegen;
            equipmentStatistics.EnergyRegen += stats.EnergyRegen;
        }

        var statisticsWithEquipment = new BattleStatistics
        {
            Speed = Round(
                0.05 * statistics.Dexterity
                + equipmentStatistics.Speed),

            MaxHealthPoints = Round(
                1.5 * statistics.Strength
                + 0.5 * statistics.Constitution
                + equipmentStatistics.MaxHealthPoints),

            HealthPoints = Round(
                1.5 * statistics.Strength
                + 0.5 * statistics.Constitution
                + equipmentStatistics.HealthPoints),

            MaxManaPoints = Round(
                0.5 * statistics.Spirit
                + 0.1 * statistics.Constitution
                + equipmentStatistics.MaxManaPoints),

            ManaPoints = Round(
                0.5 * statistics.Spirit
                + 0.1 * statistics.Constitution
                + equipmentStatistics.ManaPoints),

            MaxEnergyPoints = Round(
                0.2 * statistics.Strength
                + 0.2 * statistics.Dexterity
                + 0.1 * statistics.Constitution
                + equipmentStatistics.MaxEnergyPoints),

            EnergyPoints = Round(
                0.2 * statistics.Strength
                + 0.2 * statistics.Dexterity
                + 0.1 * statistics.Constitution
                + equipmentStatistics.EnergyPoints),

            PhysicalAttack = Round(
                0.3 * statistics.Strength
                + 0.1 * statistics.Dexterity
                + equipmentStatistics.PhysicalAttack),

            MagicalAttack = Round(
                0.3 * statistics.Spirit
                + 0.1 * statistics.Constitution
                + equipmentStatistics.MagicalAttack),

            PhysicalDefense = Round(
                0.1 * statistics.Strength
                + 0.05 * statistics.Dexterity
                + equipmentStatistics.PhysicalDefense),

            MagicalDefense = Round(
                0.1 * statistics.Spirit
                + 0.05 * statistics.Constitution
                + equipmentStatistics.MagicalDefense),

            PhysicalAbsorption = Round(
                equipmentStatistics.PhysicalAbsorption),

            MagicalAbsorption = Round(
                equipmentStatistics.MagicalAbsorption),

            CriticalChance = Round(
                equipmentStatistics.CriticalChance),

            PhysicalCriticalPower = Round(
                1.25 + equipmentStatistics.PhysicalCriticalPower),

            MagicalCriticalPower = Round(
                1.25 + equipmentStatistics.MagicalCriticalPower),

            PunctureChance = Round(
                equipmentStatistics.PunctureChance),

            DodgeChance = Round(
                0.5 * statistics.Dexterity / (statistics.Strength + statistics.Constitution + statistics.Spirit)
                + equipmentStatistics.DodgeChance),

            ParryChance = Round(
                equipmentStatistics.ParryChance),

            BlockChance = Round(
                equipmentStatistics.BlockChance),

            BlockPower = Round(
                equipmentStatistics.BlockPower),

            CounterChance = Round(
                equipmentStatistics.CounterChance),

            HealthRegen = Round(
                equipmentStatistics.HealthRegen),

            ManaRegen = Round(
                equipmentStatistics.ManaRegen),

            EnergyRegen = Round(
                equipmentStatistics.EnergyRegen)
        };

        foreach (var property in GetPassiveSkillProperties(statistics.LearnedSkills))
        {
            ApplySkillProperty(statisticsWithEquipment, property);
        }

        return statisticsWithEquipment;
    }

    public async Task AwardPoints(string userId, int attributePoints, int skillPoints)
    {
        var statistics = await GetStatistics(userId);

        statistics.AttributePoints += attributePoints;
        statistics.SkillPoints += skillPoints;

        _ = await statisticsRepository.UpdateOne(statistics);
    }

    private static IEnumerable<SkillProperty> GetPassiveSkillProperties(IEnumerable<LearnedSkill> learnedSkills)
    {
        foreach (var learnedSkill in learnedSkills)
        {
            var skill = SkillRegistry.GetSkill(learnedSkill.Guid);

            if (!skill.IsPassive)
            {
                continue;
            }

            foreach (var property in skill.SelfProperties[learnedSkill.Level - 1])
            {
                yield return property;
            }
        }
    }

    private static void ApplySkillProperty(BattleStatistics statistics, SkillProperty property)
    {
        switch (property.Type)
        {
            case SkillPropertyType.Initiative:
                statistics.Speed = ApplyProperty(
                    statistics.Speed,
                    property);
                break;

            case SkillPropertyType.PhysicalAttack:
                statistics.PhysicalAttack = ApplyProperty(
                    statistics.PhysicalAttack,
                    property);
                break;

            case SkillPropertyType.MagicalAttack:
                statistics.MagicalAttack = ApplyProperty(
                    statistics.MagicalAttack,
                    property);
                break;

            case SkillPropertyType.PhysicalDefense:
                statistics.PhysicalDefense = ApplyProperty(
                    statistics.PhysicalDefense,
                    property);
                break;

            case SkillPropertyType.MagicalDefense:
                statistics.MagicalDefense = ApplyProperty(
                    statistics.MagicalDefense,
                    property);
                break;

            case SkillPropertyType.HealthPoints:
                statistics.MaxHealthPoints = ApplyProperty(
                    statistics.MaxHealthPoints,
                    property);

                statistics.HealthPoints = ApplyProperty(
                    statistics.HealthPoints,
                    property);
                break;

            case SkillPropertyType.ManaPoints:
                statistics.MaxManaPoints = ApplyProperty(
                    statistics.MaxManaPoints,
                    property);

                statistics.ManaPoints = ApplyProperty(
                    statistics.ManaPoints,
                    property);
                break;

            case SkillPropertyType.EnergyPoints:
                statistics.MaxEnergyPoints = ApplyProperty(
                    statistics.MaxEnergyPoints,
                    property);

                statistics.EnergyPoints = ApplyProperty(
                    statistics.EnergyPoints,
                    property);
                break;

            case SkillPropertyType.CriticalChance:
                statistics.CriticalChance = ApplyProperty(
                    statistics.CriticalChance,
                    property);
                break;

            case SkillPropertyType.PhysicalCriticalPower:
                statistics.PhysicalCriticalPower = ApplyProperty(
                    statistics.PhysicalCriticalPower,
                    property);
                break;

            case SkillPropertyType.MagicalCriticalPower:
                statistics.MagicalCriticalPower = ApplyProperty(
                    statistics.MagicalCriticalPower,
                    property);
                break;

            case SkillPropertyType.PunctureChance:
                statistics.PunctureChance = ApplyProperty(
                    statistics.PunctureChance,
                    property);
                break;

            case SkillPropertyType.DodgeChance:
                statistics.DodgeChance = ApplyProperty(
                    statistics.DodgeChance,
                    property);
                break;

            case SkillPropertyType.ParryChance:
                statistics.ParryChance = ApplyProperty(
                    statistics.ParryChance,
                    property);
                break;

            case SkillPropertyType.BlockChance:
                statistics.BlockChance = ApplyProperty(
                    statistics.BlockChance,
                    property);
                break;

            case SkillPropertyType.BlockPower:
                statistics.BlockPower = ApplyProperty(
                    statistics.BlockPower,
                    property);
                break;

            case SkillPropertyType.CounterChance:
                statistics.CounterChance = ApplyProperty(
                    statistics.CounterChance,
                    property);
                break;

            case SkillPropertyType.HealthRegen:
                statistics.HealthRegen = ApplyProperty(
                    statistics.HealthRegen,
                    property);
                break;

            case SkillPropertyType.ManaRegen:
                statistics.ManaRegen = ApplyProperty(
                    statistics.ManaRegen,
                    property);
                break;

            case SkillPropertyType.PhysicalDeflect:
                statistics.PhysicalAbsorption = ApplyProperty(
                    statistics.PhysicalAbsorption,
                    property);
                break;

            case SkillPropertyType.MagicalDeflect:
                statistics.MagicalAbsorption = ApplyProperty(
                    statistics.MagicalAbsorption,
                    property);
                break;

            default:
                throw new ApiException("errors.dev.invalidSkillProperty", property.ToString());
        }
    }

    private static double ApplyProperty(double value, SkillProperty property)
    {
        return property.Effect switch
        {
            SkillPropertyEffect.Additive =>
                value + property.Value,

            SkillPropertyEffect.Multiplicative =>
                value * property.Value,

            _ =>
                throw new ApiException("errors.dev.invalidSkillProperty", property.ToString())
        };
    }

    private async Task<StatisticsEntity> GetStatistics(string userId)
    {
        return await statisticsRepository.FindOneByUserId(userId)
            ?? throw new ApiException("errors.statisticsNotFound");
    }

    private static double Round(double value) => Math.Round(value, MidpointRounding.AwayFromZero);
}
