using System.Collections.Frozen;
using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Item.Data;

namespace ErrantTowerServer.Domains.Item;

public static class ItemRegistry
{
    private static readonly FrozenDictionary<ItemGuid, Item> _items = new Dictionary<ItemGuid, Item>
    {
        [ItemGuid.WoodenSword] = DungeonItems.WoodenSword,
        [ItemGuid.WoodenPike] = DungeonItems.WoodenPike,
        [ItemGuid.WoodenHammer] = DungeonItems.WoodenHammer,
        [ItemGuid.WoodenBow] = DungeonItems.WoodenBow,
        [ItemGuid.WoodenStaff] = DungeonItems.WoodenStaff,
        [ItemGuid.LeatherBandana] = DungeonItems.LeatherBandana,
        [ItemGuid.LeatherArmor] = DungeonItems.LeatherArmor,
        [ItemGuid.LeatherBoots] = DungeonItems.LeatherBoots,
        [ItemGuid.CopperRing] = DungeonItems.CopperRing,
        [ItemGuid.CopperBar] = DungeonItems.CopperBar,
        [ItemGuid.LeadBar] = DungeonItems.LeadBar,
        [ItemGuid.Emerald] = DungeonItems.Emerald,
        [ItemGuid.ShinyEmerald] = DungeonItems.ShinyEmerald,
        [ItemGuid.SmallClaw] = DungeonItems.SmallClaw,
        [ItemGuid.ShinyClaw] = DungeonItems.ShinyClaw,
        [ItemGuid.WornHide] = DungeonItems.WornHide,
        [ItemGuid.ShinyHide] = DungeonItems.ShinyHide,
    }.ToFrozenDictionary();

    public static Item GetItem(ItemGuid guid)
    {
        if (!_items.TryGetValue(guid, out var item))
        {
            throw new ApiException("errors.itemNotDefined");
        }
        return item;
    }
}

public enum ItemGuid
{
    // Dungeon Items
    WoodenSword = 101,
    WoodenPike = 102,
    WoodenHammer = 103,
    WoodenBow = 104,
    WoodenStaff = 105,
    LeatherBandana = 106,
    LeatherArmor = 107,
    LeatherBoots = 108,
    CopperRing = 109,
    CopperBar = 110,
    LeadBar = 111,
    Emerald = 112,
    ShinyEmerald = 113,
    SmallClaw = 114,
    ShinyClaw = 115,
    WornHide = 116,
    ShinyHide = 117,
}
