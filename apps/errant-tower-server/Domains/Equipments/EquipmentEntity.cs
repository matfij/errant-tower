using ErrantTowerServer.Domains.Items;
using MongoDB.Bson.Serialization.Attributes;

namespace ErrantTowerServer.Domains.Equipments;

public class EquipmentEntity
{
    [BsonId]
    public required string Id { get; set; }
    public required string UserId { get; set; }

    public int Silver { get; set; } = 0;
    public List<BagItem> Bag { get; set; } = [];

    public ItemGuid? Headgear { get; set; }
    public ItemGuid? Armor { get; set; }
    public ItemGuid? Footwear { get; set; }
    public ItemGuid? Charm { get; set; }
    public ItemGuid? RightHand { get; set; }
    public ItemGuid? LeftHand { get; set; }
}

public record BagItem
{
    public BagItem() { }

    public required ItemGuid ItemGuid { get; init; }
    public required int Quantity { get; set; }
}
