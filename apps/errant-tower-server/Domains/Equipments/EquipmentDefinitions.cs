using ErrantTowerServer.Domains.Items;

namespace ErrantTowerServer.Domains.Equipments;

public record BattleEquipment
{
    public Item? Headgear { get; set; }
    public Item? Armor { get; set; }
    public Item? Footwear { get; set; }
    public Item? Charm { get; set; }
    public Item? RightHand { get; set; }
    public Item? LeftHand { get; set; }
}

public record ItemToEquip
{
    public ItemGuid ItemGuid { get; set; }
    public ItemSlot Slot { get; set; }
}

public enum ItemSlot
{
    Headgear = 1,
    Armor = 2,
    Footwear = 3,
    Charm = 4,
    RightHand = 5,
    LeftHand = 6,
}
