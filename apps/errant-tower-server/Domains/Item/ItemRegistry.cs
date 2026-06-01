using System.Collections.Frozen;
using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Item.Data;

namespace ErrantTowerServer.Domains.Item;

public static class ItemRegistry
{
    private static FrozenDictionary<ItemGuid, Item> _items = new Dictionary<ItemGuid, Item>
    {
        [ItemGuid.WoodenSword] = Items1.WoodenSword,
        [ItemGuid.WoodenPike] = Items1.WoodenPike,
        [ItemGuid.WoodenHammer] = Items1.WoodenHammer,
        [ItemGuid.WoodenBow] = Items1.WoodenBow,
        [ItemGuid.WoodenStaff] = Items1.WoodenStaff,
        [ItemGuid.LeatherBandana] = Items1.LeatherBandana,
        [ItemGuid.LeatherArmor] = Items1.LeatherArmor,
        [ItemGuid.LeatherBoots] = Items1.LeatherBoots,
        [ItemGuid.CopperRing] = Items1.CopperRing,
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
    WoodenSword = 101,
    WoodenPike = 102,
    WoodenHammer = 103,
    WoodenBow = 104,
    WoodenStaff = 105,

    LeatherBandana = 201,
    LeatherArmor = 202,
    LeatherBoots = 203,
    CopperRing = 204,
}
