import type { ItemGuid } from "@errant/shared";

export type EquipmentEntity = {
    id: string;
    userId: string;
    silver: number;
    bag: BagItem[];
    headgear: ItemGuid | null;
    armor: ItemGuid | null;
    footwear: ItemGuid | null;
    charm: ItemGuid | null;
    rightHand: ItemGuid | null;
    leftHand: ItemGuid | null;
};

export type BagItem = {
    itemGuid: ItemGuid;
    quantity: number;
};
