import type { Item, ItemGuid } from "./items.ts";

export enum ItemSlot {
    Headgear = "Headgear",
    Armor = "Armor",
    Footwear = "Footwear",
    Charm = "Charm",
    RightHand = "RightHand",
    LeftHand = "LeftHand",
}

export type GetEquipmentResponse = {
    headgear: Item | null;
    armor: Item | null;
    footwear: Item | null;
    charm: Item | null;
    rightHand: Item | null;
    leftHand: Item | null;
};

export type GetBagResponse = {
    items: BagItemData[];
};

export type BagItemData = {
    item: Item;
    quantity: number;
};

export type EquipItemRequest = {
    guid: ItemGuid;
    slot: ItemSlot;
};

export type EquipItemResponse = GetEquipmentResponse;

export type UnequipItemRequest = {
    slot: ItemSlot;
};

export type UnequipItemResponse = GetEquipmentResponse;
