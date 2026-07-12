using ErrantTowerServer.Domains.Progresses;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Orchestrator;

public interface IProgressOrchestrator
{
    public Task<GetFloorsResponse> GetFloors(string userId);
    public Task StartExpedition(string userId, StartExpeditionRequest request);
    public Task<GetExpeditionResponse> GetExpedition(string userId);
}

public class ProgressOrchestrator(
    IProgressService progressService,
    IStatisticsService statisticsService
    ) : IProgressOrchestrator
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
        var progress = await progressService.GetExpedition(userId);

        return new GetExpeditionResponse
        {
            FloorGuid = progress.FloorGuid,
            FloorImageUrl = progress.FloorImageUrl,
            Initiative = progress.Initiative,
            FloorTiles = progress.FloorTiles,
            MaxHealth = progress.MaxHealth,
            Health = progress.Health,
            MaxMana = progress.MaxMana,
            Mana = progress.Mana,
            MaxEnergy = progress.MaxEnergy,
            Energy = progress.Energy,
            X = progress.X,
            Y = progress.Y,
        };
    }
}
