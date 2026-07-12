using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Enemies;
using ErrantTowerServer.Domains.Floors;
using ErrantTowerServer.Domains.Items;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Domains.Progresses;

public interface IProgressService
{
    public Task CreateInitial(string userId);
    public Task<DomainFloors[]> GetFloors(string userId);
    public Task StartExpedition(string userId, FloorGuid floorGuid, BattleStatistics battleStatistics);
    public Task<Expedition> GetExpedition(string userId);
    public Task FinishExpedition(string userId, bool hasFinished);
}

public class ProgressService(
    IProgressRepository progressRepository,
    IHostEnvironment hostEnvironment
    ) : IProgressService
{
    private const int BASE_INITIATIVE = 100;
    private const int BASE_ADRENALINE = 0;

    public async Task CreateInitial(string userId)
    {
        var newProgress = new ProgressEntity
        {
            Id = Utils.GenerateGuid(),
            UserId = userId,
        };
        await progressRepository.CreateOne(newProgress);
    }

    public async Task<DomainFloors[]> GetFloors(string userId)
    {
        var progress = await progressRepository.FindOneByUserId(userId)
            ?? throw new ApiException("errors.progressNotFound");

        var domainFloorsMap = new Dictionary<FloorDomain, (List<FloorTeaser> Floors, bool IsUnlocked)>();
        var floors = FloorRegistry.GetAllFloors();

        foreach (var floor in floors)
        {
            var teaser = new FloorTeaser
            {
                Guid = floor.Guid,
                IsUnlocked = progress.UnlockedFloor >= floor.Guid
            };
            if (domainFloorsMap.TryGetValue(floor.Domain, out var existing))
            {
                existing.Floors.Add(teaser);
            }
            else
            {
                domainFloorsMap[floor.Domain] = (
                    new List<FloorTeaser> { teaser },
                    (int)progress.UnlockedDomain >= (int)floor.Domain
                );
            }
        }

        return domainFloorsMap
            .Select(kvp => new DomainFloors
            {
                Domain = kvp.Key,
                IsUnlocked = kvp.Value.IsUnlocked,
                Floors = [.. kvp.Value.Floors],
            })
            .OrderBy(x => x.Domain)
            .ToArray();
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
        if ((int)progress.UnlockedFloor < (int)floor.Guid)
        {
            throw new ApiException("errors.floorLocked");
        }

        progress.CurrentFloor = floor.Guid;
        progress.IsInExpedition = true;
        progress.Initiative = BASE_INITIATIVE;
        progress.Adrenaline = BASE_ADRENALINE;
        progress.BattleId = null;
        progress.GainedSilver = 0;
        progress.GainedItems = [];
        progress.Stamina -= 1;
        progress.X = floor.StartX;
        progress.Y = floor.StartY;

        progress.MaxHealth = battleStatistics.HealthPoints;
        progress.Health = battleStatistics.HealthPoints;
        progress.MaxMana = battleStatistics.ManaPoints;
        progress.Mana = battleStatistics.ManaPoints;
        progress.MaxEnergy = battleStatistics.EnergyPoints;
        progress.Energy = battleStatistics.EnergyPoints;

        var tiles = LoadTilesFromCsv(floor.TilesUrl);

        progress.FloorTiles = MapFloorTiles(floor, tiles);

        _ = await progressRepository.UpdateOne(progress);
    }

    public async Task<Expedition> GetExpedition(string userId)
    {
        var progress = await progressRepository.FindOneByUserId(userId)
            ?? throw new ApiException("errors.progressNotFound");

        if (!progress.IsInExpedition)
        {
            throw new ApiException("errors.expeditionNotStarted");
        }

        var floor = FloorRegistry.GetFloor(progress.CurrentFloor);

        var tiles = progress.FloorTiles.Select<FloorTileInfo, FloorTile>(tile => new()
        {
            X = tile.X,
            Y = tile.Y,
            Type = tile.Type,
            // Filter out specific encounter/treasure data
        }).ToArray();

        return new Expedition
        {
            FloorGuid = progress.CurrentFloor,
            FloorImageUrl = floor.ImageUrl,
            Initiative = progress.Initiative,
            MaxHealth = progress.MaxHealth,
            Health = progress.Health,
            MaxMana = progress.MaxMana,
            Mana = progress.Mana,
            MaxEnergy = progress.MaxEnergy,
            Energy = progress.Energy,
            X = progress.X,
            Y = progress.Y,
            FloorTiles = tiles,
        };
    }

    public async Task FinishExpedition(string userId, bool hasFinished)
    {
        var progress = await progressRepository.FindOneByUserId(userId)
            ?? throw new ApiException("errors.progressNotFound");

        if (!progress.IsInExpedition)
        {
            throw new ApiException("errors.expeditionNotStarted");
        }

        progress.IsInExpedition = false;

        if (hasFinished)
        {
            progress.UnlockedFloor++;
            progress.UnlockedDomain = FloorRegistry.GetFloor(progress.CurrentFloor).Domain;
        }

        _ = await progressRepository.UpdateOne(progress);
    }

    private FloorTile[] LoadTilesFromCsv(string tilesUrl)
    {
        var tilesDirectory = Path.Combine(
            hostEnvironment.ContentRootPath,
            "Domains",
            "Floors",
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

    private FloorTileInfo[] MapFloorTiles(Floor floor, FloorTile[] tiles)
    {
        return [.. tiles.Select<FloorTile, FloorTileInfo>(tile =>
        {
            switch (tile.Type)
            {
                case FloorTileType.Route:
                case FloorTileType.Wall:
                case FloorTileType.Start:
                case FloorTileType.Finish:
                    return new()
                    {
                        X = tile.X,
                        Y = tile.Y,
                        Type = tile.Type
                    };
                case FloorTileType.Battle:
                    if (Utils.CheckChance(floor.SpecialEnemyChance))
                    {
                        var enemyGuid
                            = Utils.GetWeightedRandomItem<FloorEnemy, EnemyGuid>(floor.SpecialEnemies);
                        return new()
                        {
                            X = tile.X,
                            Y = tile.Y,
                            Type = tile.Type,
                            EnemyGuid = enemyGuid
                        };
                    }
                    else
                    {
                        return new()
                        {
                            X = tile.X,
                            Y = tile.Y,
                            Type = FloorTileType.Route
                        };
                    }
                case FloorTileType.Treasure:
                    if (Utils.CheckChance(floor.TreasureChance))
                    {
                        var itemGuid
                            = Utils.GetWeightedRandomItem<FloorTreasure, ItemGuid>(floor.TreasureItemGuids);
                        var silver = Utils.RandRange(floor.TreasureSilverMin, floor.TreasureSilverMax);
                        return new()
                        {
                            X = tile.X,
                            Y = tile.Y,
                            Type = tile.Type,
                            ItemGuid = itemGuid,
                            Silver = silver
                        };
                    }
                    else
                    {
                        return new()
                        {
                            X = tile.X,
                            Y = tile.Y,
                            Type = FloorTileType.Route
                        };
                    }
                case FloorTileType.NPC:
                    throw new ApiException("errors.npcFeatureUnsupported");
                default:
                    throw new ApiException("errors.tilesInvalid");
            }
        })];
    }
}
