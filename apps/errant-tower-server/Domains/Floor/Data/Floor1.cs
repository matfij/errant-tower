namespace ErrantTowerServer.Domains.Floor.Data;

public static class Floor1
{
    public static readonly Floor floor = new()
    {
        Guid = FloorGuid.Floor1,
        MapBackgroundUrl = "floor-1-map.png",
        BattleBackgroundUrl = "floor-1-battle.png",
        BattleEnemyGuids = ["dungeon-rat", "white-mouse"],
        TreasureItemGuids = ["bronze-shard"],
        NPCGuids = [],
        Tiles =
        [
            new FloorTile { X = 0, Y = 1, Type = FloorTileType.Start },
            new FloorTile { X = 0, Y = 0, Type = FloorTileType.Route },
            new FloorTile { X = 1, Y = 0, Type = FloorTileType.Wall },
            new FloorTile { X = 2, Y = 0, Type = FloorTileType.Battle },
            new FloorTile { X = 3, Y = 0, Type = FloorTileType.Treasure },
            new FloorTile { X = 4, Y = 0, Type = FloorTileType.NPC },
            new FloorTile { X = 5, Y = 0, Type = FloorTileType.Finish }
        ]
    };
}
