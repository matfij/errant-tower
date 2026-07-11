using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Floor;
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
    IStatisticsService statisticsService,
    IExpeditionSessionManager expeditionSessionManager
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
        var session = await expeditionSessionManager.Create(userId);
        var progress = session.Progress;

        var floor = FloorRegistry.GetFloor(progress.CurrentFloor);
        var tiles = progress.FloorTiles.Select<FloorTileInfo, FloorTile>(tile => new()
        {
            X = tile.X,
            Y = tile.Y,
            Type = tile.Type,
        }).ToArray();

        return new GetExpeditionResponse
        {
            FloorGuid = progress.CurrentFloor,
            FloorImageUrl = floor.ImageUrl,
            Initiative = progress.Initiative,
            FloorTiles = tiles,
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

    public async Task<MoveResponse> Move(string userId, MoveRequest request)
    {
        var session = await expeditionSessionManager.Create(userId);
        var progress = session.Progress;
        var newX = progress.X;
        var newY = progress.Y;

        switch (request.Direction)
        {
            case MoveDirection.Up: newY -= MOVE_SPEED; break;
            case MoveDirection.Down: newY += MOVE_SPEED; break;
            case MoveDirection.Left: newX -= MOVE_SPEED; break;
            case MoveDirection.Right: newX += MOVE_SPEED; break;
            default: throw new ApiException("errors.invalidMoveDirection");
        }

        progress.X = newX;
        progress.Y = newY;

        return new MoveResponse
        {
            X = newX,
            Y = newY
        };
    }
}
