using System.Collections.Frozen;
using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Floor.Data;

namespace ErrantTowerServer.Domains.Floor;

public static class FloorRegistry
{
    private static readonly FrozenDictionary<FloorGuid, Floor> _floors = new Dictionary<FloorGuid, Floor>
    {
        { FloorGuid.Floor1, DungeonFloors.floor1 },
        { FloorGuid.Floor2, DungeonFloors.floor2 },
        { FloorGuid.Floor3, DungeonFloors.floor3 },
    }.ToFrozenDictionary();

    public static Floor GetFloor(FloorGuid guid)
    {
        if (!_floors.TryGetValue(guid, out var floor))
        {
            throw new ApiException("errors.floorNotDefined");
        }
        return floor;
    }

    public static int GetFloorCount() => _floors.Count;
}

public enum FloorGuid
{
    // Dungeon
    Floor1 = 0,
    Floor2 = 1,
    Floor3 = 2,

    // Forest
    Floor4 = 3,
    Floor5 = 4,
    Floor6 = 5,

    // Desert

    // Iceland
}
