using ErrantTowerServer.Common;
using ErrantTowerServer.Common.Events;

namespace ErrantTowerServer.Domains.Statistics;

public interface IStatisticsService { }
public class StatisticsService(IStatisticsRepository statisticsRepository)
    : IStatisticsService, IEventHandler<UserCreatedEvent>
{
    public async Task HandleAsync(UserCreatedEvent userCreatedEvent)
    {
        var newStatistics = new StatisticsEntity
        {
            Id = Utils.GenerateGuid(),
            UserId = userCreatedEvent.UserId,
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
        await statisticsRepository.CreateAsync(newStatistics);
    }
}
