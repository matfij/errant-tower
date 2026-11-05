import { ItemGuid, ItemRarity, ItemType } from "../item-definition.ts";
import { defineItem } from "../item-utils.ts";

export const dungeonItems = {
    /*
     * Weapons
     */
    woodenSword: defineItem({
        guid: ItemGuid.WoodenSword,
        name: "Wooden Sword",
        imageUrl: "blades/wooden-sword.png",
        type: ItemType.Sword,
        rarity: ItemRarity.Ordinary,
        price: 10,
        statistics: {
            physicalAttack: 7,
            speed: 0.1,
        },
        requirements: {
            strength: 8,
            dexterity: 4,
        },
    }),
    woodenPike: defineItem({
        guid: ItemGuid.WoodenPike,
        name: "Wooden Pike",
        imageUrl: "lances/wooden-pike.png",
        type: ItemType.Lance,
        rarity: ItemRarity.Ordinary,
        price: 10,
        statistics: {
            physicalAttack: 6,
            punctureChance: 0.1,
        },
        requirements: {
            strength: 6,
            dexterity: 6,
        },
    }),
    woodenBow: defineItem({
        guid: ItemGuid.WoodenBow,
        name: "Wooden Bow",
        imageUrl: "bows/wooden-bow.png",
        type: ItemType.Bow,
        rarity: ItemRarity.Ordinary,
        price: 10,
        statistics: {
            physicalAttack: 5,
            punctureChance: 0.1,
            speed: 0.2,
        },
        requirements: {
            strength: 4,
            dexterity: 8,
        },
    }),
    woodenHammer: defineItem({
        guid: ItemGuid.WoodenHammer,
        name: "Wooden Hammer",
        imageUrl: "hammers/wooden-hammer.png",
        type: ItemType.Hammer,
        rarity: ItemRarity.Ordinary,
        price: 10,
        statistics: {
            physicalAttack: 10,
            energyPoints: 20,
        },
        requirements: {
            strength: 10,
        },
    }),
    woodenStaff: defineItem({
        guid: ItemGuid.WoodenStaff,
        name: "Wooden Staff",
        imageUrl: "staves/wooden-staff.png",
        type: ItemType.Staff,
        rarity: ItemRarity.Ordinary,
        price: 10,
        statistics: {
            magicalAttack: 5,
            manaPoints: 20,
        },
        requirements: {
            spirit: 10,
        },
    }),
    /*
     * Armors
     */
    leatherBandana: defineItem({
        guid: ItemGuid.LeatherBandana,
        name: "Leather Bandana",
        imageUrl: "helmets/leather-bandana.png",
        type: ItemType.Helmet,
        rarity: ItemRarity.Ordinary,
        price: 10,
        statistics: {
            healthPoints: 10,
            physicalDefense: 2,
            magicalDefense: 1,
        },
        requirements: {
            strength: 1,
        },
    }),
    leatherArmor: defineItem({
        guid: ItemGuid.LeatherArmor,
        name: "Leather Armor",
        imageUrl: "armors/leather-armor.png",
        type: ItemType.Armor,
        rarity: ItemRarity.Ordinary,
        price: 10,
        statistics: {
            healthPoints: 30,
            physicalDefense: 5,
            magicalDefense: 2,
        },
        requirements: {
            strength: 2,
        },
    }),
    leatherBoots: defineItem({
        guid: ItemGuid.LeatherBoots,
        name: "Leather Boots",
        imageUrl: "boots/leather-boots.png",
        type: ItemType.Boots,
        rarity: ItemRarity.Ordinary,
        price: 10,
        statistics: {
            healthPoints: 5,
            physicalDefense: 3,
            magicalDefense: 1,
            speed: 0.1,
        },
        requirements: {
            strength: 1,
        },
    }),
    /*
     * Charms
     */
    copperRing: defineItem({
        guid: ItemGuid.CopperRing,
        name: "Copper Ring",
        imageUrl: "charms/copper-ring.png",
        type: ItemType.Charm,
        rarity: ItemRarity.Ordinary,
        price: 10,
        statistics: {
            healthRegen: 5,
        },
    }),
    /*
     * Loots
     */
    copperBar: defineItem({
        guid: ItemGuid.CopperBar,
        name: "Copper Bar",
        imageUrl: "materials/copper-bar.png",
        type: ItemType.Material,
        rarity: ItemRarity.Ordinary,
        price: 5,
        isStackable: true,
    }),
    leadBar: defineItem({
        guid: ItemGuid.LeadBar,
        name: "Lead Bar",
        imageUrl: "materials/lead-bar.png",
        type: ItemType.Material,
        rarity: ItemRarity.Enhanced,
        price: 10,
        isStackable: true,
    }),
    emerald: defineItem({
        guid: ItemGuid.Emerald,
        name: "Emerald",
        imageUrl: "materials/emerald.png",
        type: ItemType.Material,
        rarity: ItemRarity.Enhanced,
        price: 10,
        isStackable: true,
    }),
    shinyEmerald: defineItem({
        guid: ItemGuid.ShinyEmerald,
        name: "Shiny Emerald",
        imageUrl: "materials/shiny-emerald.png",
        type: ItemType.Material,
        rarity: ItemRarity.Arcade,
        price: 25,
        isStackable: true,
    }),
    smallClaw: defineItem({
        guid: ItemGuid.SmallClaw,
        name: "Small Claw",
        imageUrl: "materials/small-claw.png",
        type: ItemType.Material,
        rarity: ItemRarity.Ordinary,
        price: 5,
        isStackable: true,
    }),
    shinyClaw: defineItem({
        guid: ItemGuid.ShinyClaw,
        name: "Shiny Claw",
        imageUrl: "materials/shiny-claw.png",
        type: ItemType.Material,
        rarity: ItemRarity.Enhanced,
        price: 10,
        isStackable: true,
    }),
    wornHide: defineItem({
        guid: ItemGuid.WornHide,
        name: "Worn Hide",
        imageUrl: "materials/worn-hide.png",
        type: ItemType.Material,
        rarity: ItemRarity.Ordinary,
        price: 5,
        isStackable: true,
    }),
    shinyHide: defineItem({
        guid: ItemGuid.ShinyHide,
        name: "Shiny Hide",
        imageUrl: "materials/shiny-hide.png",
        type: ItemType.Material,
        rarity: ItemRarity.Enhanced,
        price: 10,
        isStackable: true,
    }),
};
