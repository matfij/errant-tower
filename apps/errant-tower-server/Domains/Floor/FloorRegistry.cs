namespace ErrantTowerServer.Domains.Floor;

public class FloorRegistry
{
    private static readonly IReadOnlyDictionary<FloorGuid, Floor> floors = new Dictionary<FloorGuid, Floor>
    {
        { FloorGuid.Floor1, Data.Floor1.floor },
    };

    public static Floor GetFloor(FloorGuid guid)
    {
        if (!floors.TryGetValue(guid, out var floor))
        {
            throw new ArgumentException($"Floor with guid {guid} not found.");
        }
        return floor;
    }
}

public enum FloorGuid
{
    Floor1 = 100,
    Floor2 = 101,
    Floor3 = 102,
}
