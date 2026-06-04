using ErrantTowerServer.Domains.Item;
using MongoDB.Bson.Serialization.Attributes;

namespace ErrantTowerServer.Domains.Equipment;

public class EquipmentEntity
{
    [BsonId]
    public required string Id { get; set; }
    public required string UserId { get; set; }

    public ItemGuid? Headgear { get; set; }
    public ItemGuid? Armor { get; set; }
    public ItemGuid? Footwear { get; set; }
    public ItemGuid? Charm { get; set; }
    public ItemGuid? RightHand { get; set; }
    public ItemGuid? LeftHand { get; set; }

    public BagItem[] Bag { get; set; } = [];
}

public record struct BagItem
{
    public BagItem() { }

    public required ItemGuid ItemGuid;
    public required int Quantity;
    public required int X;
    public required int Y;
}
