import { HttpError } from "../../common/http/errors.ts";
import { dungeonItems } from "./data/dungeon-items.ts";
import { ItemGuid, type Item } from "./item-definition.ts";

export const items = {
    [ItemGuid.WoodenSword]: dungeonItems.woodenSword,
    [ItemGuid.WoodenPike]: dungeonItems.woodenPike,
    [ItemGuid.WoodenHammer]: dungeonItems.woodenHammer,
    [ItemGuid.WoodenBow]: dungeonItems.woodenBow,
    [ItemGuid.WoodenStaff]: dungeonItems.woodenStaff,
    [ItemGuid.LeatherBandana]: dungeonItems.leatherBandana,
    [ItemGuid.LeatherArmor]: dungeonItems.leatherArmor,
    [ItemGuid.LeatherBoots]: dungeonItems.leatherBoots,
    [ItemGuid.CopperRing]: dungeonItems.copperRing,
    [ItemGuid.CopperBar]: dungeonItems.copperBar,
    [ItemGuid.LeadBar]: dungeonItems.leadBar,
    [ItemGuid.Emerald]: dungeonItems.emerald,
    [ItemGuid.ShinyEmerald]: dungeonItems.shinyEmerald,
    [ItemGuid.SmallClaw]: dungeonItems.smallClaw,
    [ItemGuid.ShinyClaw]: dungeonItems.shinyClaw,
    [ItemGuid.WornHide]: dungeonItems.wornHide,
    [ItemGuid.ShinyHide]: dungeonItems.shinyHide,
} satisfies Record<ItemGuid, Item>;

export const getItem = (guid: string): Item => {
    if (!isItemGuid(guid)) {
        throw new HttpError("errors.itemNotDefined");
    }
    return items[guid];
};

const isItemGuid = (guid: string): guid is ItemGuid => Object.hasOwn(items, guid);
