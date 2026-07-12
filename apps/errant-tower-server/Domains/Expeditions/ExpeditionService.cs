using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Equipments;
using ErrantTowerServer.Domains.Floors;
using ErrantTowerServer.Domains.Progresses;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Domains.Expeditions;

public interface IExpeditionService
{
    public Task<MoveResult> Move(string userId, MoveDirection direction);
}

public class ExpeditionService(
    IExpeditionSessionManager expeditionSessionManager,
    IProgressService progressService,
    IEquipmentService equipmentService,
    IStatisticsService statisticsService) : IExpeditionService
{
    private const int MOVE_SPEED = 10;

    public async Task<MoveResult> Move(string userId, MoveDirection direction)
    {
        var session = await expeditionSessionManager.Create(userId);
        var progress = session.Progress;
        var newX = progress.X;
        var newY = progress.Y;

        if (progress.Initiative <= 0)
        {
            return await Finish(false, false, progress);
        }

        switch (direction)
        {
            case MoveDirection.Up: newY -= MOVE_SPEED; break;
            case MoveDirection.Down: newY += MOVE_SPEED; break;
            case MoveDirection.Left: newX -= MOVE_SPEED; break;
            case MoveDirection.Right: newX += MOVE_SPEED; break;
            default: throw new ApiException("errors.invalidMoveDirection");
        }

        var newTile = progress.FloorTiles.FirstOrDefault(tile => tile.X == newX && tile.Y == newY);

        if (newTile is null)
        {
            return new MoveResult
            {
                X = progress.X,
                Y = progress.Y
            };
        }

        switch (newTile.Type)
        {
            case FloorTileType.Wall:
                return new MoveResult
                {
                    X = progress.X,
                    Y = progress.Y
                };
            case FloorTileType.Route:
                progress.X = newX;
                progress.Y = newY;
                progress.Initiative--;
                // check random battle
                break;
            case FloorTileType.Battle:
                progress.X = newX;
                progress.Y = newY;
                progress.Initiative--;
                // start planned battle
                break;
            case FloorTileType.Treasure:
                progress.X = newX;
                progress.Y = newY;
                progress.Initiative--;
                // award treasure
                break;
            case FloorTileType.Start:
                return await Finish(true, false, progress);
            case FloorTileType.Finish:
                return await Finish(true, true, progress);
        }

        return new MoveResult
        {
            X = newX,
            Y = newY
        };
    }

    private async Task<MoveResult> Finish(bool isSuccess, bool hasFinished, ProgressEntity progress)
    {
        var gainedSilver = (int)(isSuccess
            ? progress.GainedSilver
            : Math.Floor(Utils.RandRange(0.5, 0.75) * progress.GainedSilver));

        var gainedItems = isSuccess
            ? progress.GainedItems
            : [.. progress.GainedItems.Where(_ => Utils.CheckChance(0.6))];

        var gainedAttributePoints = (int)(isSuccess
            ? Math.Floor(Utils.RandRange(0.5, 0.7) * progress.Adrenaline)
            : Math.Floor(Utils.RandRange(0.3, 0.4) * progress.Adrenaline));

        var gainedSkillPoints = (int)(isSuccess
            ? Math.Floor(Utils.RandRange(0.3, 0.5) * progress.Adrenaline)
            : Math.Floor(Utils.RandRange(0.2, 0.3) * progress.Adrenaline));

        var gainedItemsMeta = gainedItems.Select(item => new BagItem()
        {
            Quantity = item.Quantity,
            ItemGuid = item.Item.Guid
        }).ToList();

        await Task.WhenAll(
            progressService.FinishExpedition(progress.UserId, hasFinished),
            equipmentService.AwardItems(progress.UserId, gainedSilver, gainedItemsMeta),
            statisticsService.AwardPoints(progress.UserId, gainedAttributePoints, gainedSkillPoints)
        );

        expeditionSessionManager.Remove(progress.UserId);

        return new MoveResult()
        {
            X = 0,
            Y = 0,
            Summary = new ExpeditionSummary()
            {
                IsSuccess = isSuccess,
                HasFinished = hasFinished,
                GainedSilver = gainedSilver,
                GainedItems = gainedItems,
                GainedAttributePoints = gainedAttributePoints,
                GainedSkillPoints = gainedSkillPoints
            }
        };
    }
}
