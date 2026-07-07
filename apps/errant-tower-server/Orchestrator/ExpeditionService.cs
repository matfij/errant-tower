using ErrantTowerServer.Domains.Progress;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Orchestrator;

public interface IExpeditionService
{
    public Task<GetFloorsResponse> GetFloors(string userId);
    public Task StartExpedition(string userId, StartExpeditionRequest request);
    public Task<GetExpeditionResponse> GetExpedition(string userId);
}

public class ExpeditionService(
    IProgressService progressService,
    IStatisticsService statisticsService
    ) : IExpeditionService
{
    public async Task<GetFloorsResponse> GetFloors(string userId)
    {
        var domainFloors = await progressService.GetFloors(userId);
        return new GetFloorsResponse
        {
            DomainFloors = domainFloors
        };
    }

    public async Task StartExpedition(string userId, StartExpeditionRequest request)
    {
        var battleStatistics = await statisticsService.GetUserBattleStatistics(userId);
        await progressService.StartExpedition(userId, request.FloorGuid, battleStatistics);
    }

    public async Task<GetExpeditionResponse> GetExpedition(string userId)
    {
        var expedition = await progressService.GetExpedition(userId);
        return new GetExpeditionResponse
        {

            FloorGuid = expedition.FloorGuid,
            FloorImageUrl = expedition.FloorImageUrl,
            Initiative = expedition.Initiative,
            FloorTiles = expedition.FloorTiles,
            MaxHealth = expedition.MaxHealth,
            Health = expedition.Health,
            MaxMana = expedition.MaxMana,
            Mana = expedition.Mana,
            MaxEnergy = expedition.MaxEnergy,
            Energy = expedition.Energy,
            X = expedition.X,
            Y = expedition.Y,
        };
    }
}
