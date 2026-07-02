using ErrantTowerServer.Domains.Enemy;
using ErrantTowerServer.Domains.Item;

namespace ErrantTowerServer.Domains.Floor.Data;

public static class DungeonFloors
{
    public static readonly Floor floor1 = new()
    {
        Guid = FloorGuid.Floor1,
        Domain = FloorDomain.Dungeon,
        ImageUrl = "floor-1.png",
        TilesUrl = "FloorTiles1.csv",
        Enemies =
        [
            new FloorEnemy { EnemyGuid = EnemyGuid.Ratter, EncounterChance = 0.2 },
            new FloorEnemy { EnemyGuid = EnemyGuid.Chembr, EncounterChance = 0.2 },
            new FloorEnemy { EnemyGuid = EnemyGuid.Kerramid, EncounterChance = 0.1 },
        ],
        SpecialEnemies =
        [
            new FloorEnemy { EnemyGuid = EnemyGuid.Scrapper, EncounterChance = 0.5 },
        ],
        TreasureItemGuids =
        [
            new FloorTreasure { ItemGuid = ItemGuid.CopperBar, EncounterChance = 0.5 },
            new FloorTreasure { ItemGuid = ItemGuid.LeadBar, EncounterChance = 0.5 },
        ],
        StartX = 0,
        StartY = 0,
        Tiles = []
    };

    public static readonly Floor floor2 = new()
    {
        Guid = FloorGuid.Floor2,
        Domain = FloorDomain.Dungeon,
        ImageUrl = "floor-2.png",
        TilesUrl = "FloorTiles2.csv",
        Enemies =
        [
            new FloorEnemy { EnemyGuid = EnemyGuid.Pigon, EncounterChance = 0.2 },
            new FloorEnemy { EnemyGuid = EnemyGuid.Chembr, EncounterChance = 0.2 },
            new FloorEnemy { EnemyGuid = EnemyGuid.Kerramid, EncounterChance = 0.1 },
            new FloorEnemy { EnemyGuid = EnemyGuid.Boarus, EncounterChance = 0.1 },
        ],
        SpecialEnemies =
        [
            new FloorEnemy { EnemyGuid = EnemyGuid.Scrapper, EncounterChance = 0.5 },
            new FloorEnemy { EnemyGuid = EnemyGuid.Glowpede, EncounterChance = 0.5 },
        ],
        TreasureItemGuids =
        [
            new FloorTreasure { ItemGuid = ItemGuid.CopperBar, EncounterChance = 0.5 },
            new FloorTreasure { ItemGuid = ItemGuid.LeadBar, EncounterChance = 0.1 },
            new FloorTreasure { ItemGuid = ItemGuid.Emerald, EncounterChance = 0.25 },
        ],
        StartX = 0,
        StartY = 0,
        Tiles = []
    };

    public static readonly Floor floor3 = new()
    {
        Guid = FloorGuid.Floor3,
        Domain = FloorDomain.Dungeon,
        ImageUrl = "floor-3.png",
        TilesUrl = "FloorTiles3.csv",
        Enemies =
        [
            new FloorEnemy { EnemyGuid = EnemyGuid.Pigon, EncounterChance = 0.2 },
            new FloorEnemy { EnemyGuid = EnemyGuid.Wisker, EncounterChance = 0.1 },
            new FloorEnemy { EnemyGuid = EnemyGuid.Regewur, EncounterChance = 0.1 },
            new FloorEnemy { EnemyGuid = EnemyGuid.Boarus, EncounterChance = 0.1 },
        ],
        SpecialEnemies =
        [
            new FloorEnemy { EnemyGuid = EnemyGuid.Glowpede, EncounterChance = 0.5 },
            new FloorEnemy { EnemyGuid = EnemyGuid.Morus, EncounterChance = 0.5 },
        ],
        TreasureItemGuids =
        [
            new FloorTreasure { ItemGuid = ItemGuid.LeadBar, EncounterChance = 0.1 },
            new FloorTreasure { ItemGuid = ItemGuid.Emerald, EncounterChance = 0.25 },
            new FloorTreasure { ItemGuid = ItemGuid.ShinyEmerald, EncounterChance = 0.05 },
        ],
        StartX = 0,
        StartY = 0,
        Tiles = []
    };
}
