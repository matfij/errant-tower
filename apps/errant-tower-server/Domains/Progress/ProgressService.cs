using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Floor;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Domains.Progress;

public interface IProgressService
{
    public Task CreateInitial(string userId);
    public Task<FloorTeaser[]> GetFloors(string userId);
    public Task StartExpedition(string userId, FloorGuid floorGuid, BattleStatistics battleStatistics);
}

public class ProgressService(
    IProgressRepository progressRepository,
    IHostEnvironment hostEnvironment
    ) : IProgressService
{
    private const int BASE_INITIATIVE = 100;

    public async Task CreateInitial(string userId)
    {
        var newProgress = new ProgressEntity
        {
            Id = Utils.GenerateGuid(),
            UserId = userId,
        };
        await progressRepository.CreateOne(newProgress);
    }

    public async Task<FloorTeaser[]> GetFloors(string userId)
    {
        var progress = await progressRepository.FindOneByUserId(userId)
            ?? throw new ApiException("errors.progressNotFound");
        var floors = new List<FloorTeaser>();
        var maxFloors = Math.Min(FloorRegistry.GetFloorCount(), progress.CompletedFloors + 3);
        for (int level = 0; level < maxFloors; level++)
        {
            var nextFloor = FloorRegistry.GetFloor((FloorGuid)level);
            floors.Add(new()
            {
                FloorGuid = nextFloor.Guid,
                FloorDomain = nextFloor.Domain,
                IsUnlocked = progress.CompletedFloors >= (int)nextFloor.Guid
            });
        }
        return [.. floors];
    }

    public async Task StartExpedition(
        string userId,
        FloorGuid floorGuid,
        BattleStatistics battleStatistics)
    {
        var progress = await progressRepository.FindOneByUserId(userId)
            ?? throw new ApiException("errors.progressNotFound");
        if (progress.Stamina < 1)
        {
            throw new ApiException("errors.notEnoughStamina");
        }
        if (progress.IsInExpedition)
        {
            throw new ApiException("errors.expeditionInProgress");
        }

        var floor = FloorRegistry.GetFloor(floorGuid);
        if (progress.CompletedFloors < (int)floor.Guid)
        {
            throw new ApiException("errors.floorLocked");
        }

        progress.CurrentFloor = floor.Guid;
        progress.IsInExpedition = true;
        progress.Initiative = BASE_INITIATIVE;
        progress.Stamina -= 1;
        progress.X = floor.StartX;
        progress.Y = floor.StartY;

        progress.MaxHealth = battleStatistics.HealthPoints;
        progress.Health = battleStatistics.HealthPoints;
        progress.MaxMana = battleStatistics.ManaPoints;
        progress.Mana = battleStatistics.ManaPoints;
        progress.MaxEnergy = battleStatistics.EnergyPoints;
        progress.Energy = battleStatistics.EnergyPoints;

        progress.FloorTiles = LoadTilesFromCsv(floor.TilesUrl);

        await progressRepository.UpdateOne(progress);
    }

    private FloorTile[] LoadTilesFromCsv(string tilesUrl)
    {
        var tilesDirectory = Path.Combine(
            hostEnvironment.ContentRootPath,
            "Domains",
            "Floor",
            "Data",
            "Tiles"
        );
        var tilesPath = Path.Combine(tilesDirectory, tilesUrl);

        if (!File.Exists(tilesPath))
        {
            throw new ApiException("errors.tilesNotFound");
        }

        var lines = File.ReadAllLines(tilesPath);
        var tiles = new List<FloorTile>();

        for (int i = 1; i < lines.Length; i++)
        {
            var parts = lines[i].Split(',');
            if (parts.Length != 3)
            {
                throw new ApiException("errors.tilesInvalid");
            }

            if (int.TryParse(parts[0], out var x)
                && int.TryParse(parts[1], out var y)
                && Enum.TryParse<FloorTileType>(parts[2], out var type))
            {
                tiles.Add(new FloorTile { X = x, Y = y, Type = type });
            }
            else
            {
                throw new ApiException("errors.tilesInvalid");
            }
        }

        return tiles.ToArray();
    }
}
