using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Progress;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Orchestrator;

public interface IExpeditionService
{
    public Task<GetFloorsResponse> GetFloors(string userId);
    public Task StartExpedition(string userId, StartExpeditionRequest request);
    public Task<GetExpeditionResponse> GetExpedition(string userId);
    public Task<MoveResponse> Move(string userId, MoveRequest request);
}

public class ExpeditionService(
    IProgressService progressService,
    IStatisticsService statisticsService
    ) : IExpeditionService
{
    private const int MOVE_SPEED = 10;

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

    public async Task<MoveResponse> Move(string userId, MoveRequest request)
    {
        var expedition = await progressService.GetExpedition(userId);
        var newX = expedition.X;
        var newY = expedition.Y;

        switch (request.Direction)
        {
            case MoveDirection.Up: newY += MOVE_SPEED; break;
            case MoveDirection.Down: newY -= MOVE_SPEED; break;
            case MoveDirection.Left: newX += MOVE_SPEED; break;
            case MoveDirection.Right: newX -= MOVE_SPEED; break;
            default: throw new ApiException("errors.invalidMoveDirection");
        }

        return new MoveResponse
        {
            X = newX,
            Y = newY
        };
    }
}
