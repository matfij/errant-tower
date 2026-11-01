import { ItemType } from "../../api/generated/definitions";

export const handItemTypes: ItemType[] = [
    ItemType.Sword,
    ItemType.Lance,
    ItemType.Shield,
    ItemType.Dagger,
    ItemType.Staff,
    ItemType.Bow,
    ItemType.Hammer,
] as const;
