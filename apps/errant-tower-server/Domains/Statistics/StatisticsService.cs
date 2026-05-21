using ErrantTowerServer.Common;

namespace ErrantTowerServer.Domains.Statistics;

public interface IStatisticsService 
{
    public Task CreateInitial(string userId);
}

public class StatisticsService(IStatisticsRepository statisticsRepository) : IStatisticsService
{
    public async Task CreateInitial(string userId)
    {
        var newStatistics = new StatisticsEntity
        {
            Id = Utils.GenerateGuid(),
            UserId = userId,
            Initiative = 0,
            HealthPoints = 100,
            ManaPoints = 50,
            EnergyPoints = 50,
            PhysicalAttack = 10,
            MagicalAttack = 5,
            PhysicalDefense = 5,
            MagicalDefense = 3,
            PhysicalAbsorption = 0,
            MagicalAbsorption = 0,
            CriticalChance = 5,
            PhysicalCriticalPower = 150,
            MagicalCriticalPower = 150,
            PunctureChance = 0,
            DodgeChance = 0,
            ParryChance = 0,
            BlockChance = 0,
            BlockPower = 0,
            CounterChance = 0,
            HealthRegen = 0,
            ManaRegen = 0,
            EnergyRegen = 0
        };
        await statisticsRepository.CreateOne(newStatistics);
    }
}
