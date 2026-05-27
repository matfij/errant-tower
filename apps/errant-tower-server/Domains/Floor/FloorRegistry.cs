using ErrantTowerServer.Common;

namespace ErrantTowerServer.Domains.Floor;

public static class FloorRegistry
{
    private static readonly IReadOnlyDictionary<FloorGuid, Floor> floors = new Dictionary<FloorGuid, Floor>
    {
        { FloorGuid.Floor1, Data.Floor1.floor },
    };

    public static Floor GetFloor(FloorGuid guid)
    {
        if (!floors.TryGetValue(guid, out var floor))
        {
            throw new ApiException("errors.floorNotDefined");
        }
        return floor;
    }
}

public enum FloorGuid
{
    Floor1 = 100,
}
