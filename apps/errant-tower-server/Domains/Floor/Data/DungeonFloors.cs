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
        TreasureSilverMin = 10,
        TreasureSilverMax = 20,
        StartX = 60,
        StartY = 460,
        TreasureChance = 0.45,
        SpecialEnemyChance = 0.45,
        Enemies =
        [
            new FloorEnemy { Guid = EnemyGuid.Ratter, Chance = 0.2 },
            new FloorEnemy { Guid = EnemyGuid.Chembr, Chance = 0.2 },
            new FloorEnemy { Guid = EnemyGuid.Kerramid, Chance = 0.1 },
        ],
        SpecialEnemies =
        [
            new FloorEnemy { Guid = EnemyGuid.Scrapper, Chance = 0.5 },
        ],
        TreasureItemGuids =
        [
            new FloorTreasure { Guid = ItemGuid.CopperBar, Chance = 0.5 },
            new FloorTreasure { Guid = ItemGuid.LeadBar, Chance = 0.5 },
        ],
        Tiles = []
    };

    public static readonly Floor floor2 = new()
    {
        Guid = FloorGuid.Floor2,
        Domain = FloorDomain.Dungeon,
        ImageUrl = "floor-2.png",
        TilesUrl = "FloorTiles2.csv",
        TreasureSilverMin = 12,
        TreasureSilverMax = 22,
        StartX = 0,
        StartY = 0,
        TreasureChance = 0.5,
        SpecialEnemyChance = 0.5,
        Enemies =
        [
            new FloorEnemy { Guid = EnemyGuid.Pigon, Chance = 0.2 },
            new FloorEnemy { Guid = EnemyGuid.Chembr, Chance = 0.2 },
            new FloorEnemy { Guid = EnemyGuid.Kerramid, Chance = 0.1 },
            new FloorEnemy { Guid = EnemyGuid.Boarus, Chance = 0.1 },
        ],
        SpecialEnemies =
        [
            new FloorEnemy { Guid = EnemyGuid.Scrapper, Chance = 0.5 },
            new FloorEnemy { Guid = EnemyGuid.Glowpede, Chance = 0.5 },
        ],
        TreasureItemGuids =
        [
            new FloorTreasure { Guid = ItemGuid.CopperBar, Chance = 0.5 },
            new FloorTreasure { Guid = ItemGuid.LeadBar, Chance = 0.1 },
            new FloorTreasure { Guid = ItemGuid.Emerald, Chance = 0.25 },
        ],
        Tiles = []
    };

    public static readonly Floor floor3 = new()
    {
        Guid = FloorGuid.Floor3,
        Domain = FloorDomain.Dungeon,
        ImageUrl = "floor-3.png",
        TilesUrl = "FloorTiles3.csv",
        StartX = 0,
        StartY = 0,
        TreasureSilverMin = 14,
        TreasureSilverMax = 25,
        TreasureChance = 0.55,
        SpecialEnemyChance = 0.55,
        Enemies =
        [
            new FloorEnemy { Guid = EnemyGuid.Pigon, Chance = 0.2 },
            new FloorEnemy { Guid = EnemyGuid.Wisker, Chance = 0.1 },
            new FloorEnemy { Guid = EnemyGuid.Regewur, Chance = 0.1 },
            new FloorEnemy { Guid = EnemyGuid.Boarus, Chance = 0.1 },
        ],
        SpecialEnemies =
        [
            new FloorEnemy { Guid = EnemyGuid.Glowpede, Chance = 0.5 },
            new FloorEnemy { Guid = EnemyGuid.Morus, Chance = 0.5 },
        ],
        TreasureItemGuids =
        [
            new FloorTreasure { Guid = ItemGuid.LeadBar, Chance = 0.1 },
            new FloorTreasure { Guid = ItemGuid.Emerald, Chance = 0.25 },
            new FloorTreasure { Guid = ItemGuid.ShinyEmerald, Chance = 0.05 },
        ],
        Tiles = []
    };
}
