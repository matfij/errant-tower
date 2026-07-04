using ErrantTowerServer.Domains.Progress;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Orchestrator;

public interface IExpeditionService
{
    public Task<GetFloorsResponse> GetFloors(string userId);
    public Task StartExpedition(string userId, StartExpeditionRequest request);
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
}
