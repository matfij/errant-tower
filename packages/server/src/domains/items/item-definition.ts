import type { BattleStatistics } from "../statistics/statistics-definition.ts";

export enum ItemGuid {
    // Dungeon
    WoodenSword = "WoodenSword",
    WoodenPike = "WoodenPike",
    WoodenHammer = "WoodenHammer",
    WoodenBow = "WoodenBow",
    WoodenStaff = "WoodenStaff",
    LeatherBandana = "LeatherBandana",
    LeatherArmor = "LeatherArmor",
    LeatherBoots = "LeatherBoots",
    CopperRing = "CopperRing",
    CopperBar = "CopperBar",
    LeadBar = "LeadBar",
    Emerald = "Emerald",
    ShinyEmerald = "ShinyEmerald",
    SmallClaw = "SmallClaw",
    ShinyClaw = "ShinyClaw",
    WornHide = "WornHide",
    ShinyHide = "ShinyHide",
}

export type Item = {
    guid: ItemGuid;
    name: string;
    description?: string;
    imageUrl: string;
    type: ItemType;
    rarity: ItemRarity;
    price: number;
    isStackable: boolean;
    statistics?: BattleStatistics;
    requirements?: ItemRequirements;
};

export type ItemRequirements = {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    spirit?: number;
};

export enum ItemType {
    Helmet = "Helmet",
    Armor = "Armor",
    Boots = "Boots",
    Charm = "Charm",
    Sword = "Sword",
    Lance = "Lance",
    Shield = "Shield",
    Dagger = "Dagger",
    Staff = "Staff",
    Bow = "Bow",
    Hammer = "Hammer",
    Material = "Material",
    Consumable = "Consumable",
}

export enum ItemRarity {
    Ordinary = "Ordinary",
    Enhanced = "Enhanced",
    Arcade = "Arcade",
    Heroic = "Heroic",
    Artifact = "Artifact",
    Divine = "Divine",
}
