using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Domains.Item.Data;

public class DungeonItems
{
    public static readonly Item WoodenSword = new()
    {
        Guid = ItemGuid.WoodenSword,
        Name = "Wooden Sword",
        ImageUrl = "blades/wooden-sword.png",
        Type = ItemType.Sword,
        Rarity = ItemRarity.Ordinary,
        Price = 10,
        Statistics = new BattleStatistics
        {
            PhysicalAttack = 7,
            Speed = 1,
        },
        Requirements = new ItemRequirements
        {
            Strength = 8,
            Dexterity = 4,
        },
    };

    public static readonly Item WoodenPike = new()
    {
        Guid = ItemGuid.WoodenPike,
        Name = "Wooden Pike",
        ImageUrl = "lances/wooden-pike.png",
        Type = ItemType.Lance,
        Rarity = ItemRarity.Ordinary,
        Price = 10,
        Statistics = new BattleStatistics
        {
            PhysicalAttack = 6,
            PunctureChance = 0.1,
        },
        Requirements = new ItemRequirements
        {
            Strength = 6,
            Dexterity = 6,
        },
    };

    public static readonly Item WoodenBow = new()
    {
        Guid = ItemGuid.WoodenBow,
        Name = "Wooden Bow",
        ImageUrl = "bows/wooden-bow.png",
        Type = ItemType.Bow,
        Rarity = ItemRarity.Ordinary,
        Price = 10,
        Statistics = new BattleStatistics
        {
            PhysicalAttack = 5,
            PunctureChance = 0.1,
            Speed = 1,
        },
        Requirements = new ItemRequirements
        {
            Strength = 4,
            Dexterity = 8,
        },
    };

    public static readonly Item WoodenHammer = new()
    {
        Guid = ItemGuid.WoodenHammer,
        Name = "Wooden Hammer",
        ImageUrl = "hammers/wooden-hammer.png",
        Type = ItemType.Hammer,
        Rarity = ItemRarity.Ordinary,
        Price = 10,
        Statistics = new BattleStatistics
        {
            PhysicalAttack = 10,
            EnergyPoints = 20,
        },
        Requirements = new ItemRequirements
        {
            Strength = 10,
        },
    };

    public static readonly Item WoodenStaff = new()
    {
        Guid = ItemGuid.WoodenStaff,
        Name = "Wooden Staff",
        ImageUrl = "staves/wooden-staff.png",
        Rarity = ItemRarity.Ordinary,
        Price = 10,
        Type = ItemType.Staff,
        Statistics = new BattleStatistics
        {
            MagicalAttack = 5,
            ManaPoints = 20,
        },
        Requirements = new ItemRequirements
        {
            Spirit = 10,
        },
    };

    public static readonly Item LeatherBandana = new()
    {
        Guid = ItemGuid.LeatherBandana,
        Name = "Leather Bandana",
        ImageUrl = "helmets/leather-bandana.png",
        Type = ItemType.Helmet,
        Rarity = ItemRarity.Ordinary,
        Price = 10,
        Statistics = new BattleStatistics
        {
            HealthPoints = 10,
            PhysicalDefense = 2,
            MagicalDefense = 1,
        },
        Requirements = new ItemRequirements
        {
            Strength = 1,
        },
    };

    public static readonly Item LeatherArmor = new()
    {
        Guid = ItemGuid.LeatherArmor,
        Name = "Leather Armor",
        ImageUrl = "armors/leather-armor.png",
        Type = ItemType.Armor,
        Rarity = ItemRarity.Ordinary,
        Price = 10,
        Statistics = new BattleStatistics
        {
            HealthPoints = 30,
            PhysicalDefense = 5,
            MagicalDefense = 2,
        },
        Requirements = new ItemRequirements
        {
            Strength = 2,
        },
    };

    public static readonly Item LeatherBoots = new()
    {
        Guid = ItemGuid.LeatherBoots,
        Name = "Leather Boots",
        ImageUrl = "boots/leather-boots.png",
        Type = ItemType.Boots,
        Rarity = ItemRarity.Ordinary,
        Price = 10,
        Statistics = new BattleStatistics
        {
            HealthPoints = 5,
            PhysicalDefense = 3,
            MagicalDefense = 1,
            Speed = 1,
        },
        Requirements = new ItemRequirements
        {
            Strength = 1,
        },
    };

    public static readonly Item CopperRing = new()
    {
        Guid = ItemGuid.CopperRing,
        Name = "Copper Ring",
        ImageUrl = "charms/copper-ring.png",
        Type = ItemType.Charm,
        Rarity = ItemRarity.Ordinary,
        Price = 10,
        Statistics = new BattleStatistics
        {
            HealthRegen = 5,
        },
    };

    public static readonly Item CopperBar = new()
    {
        Guid = ItemGuid.CopperBar,
        Name = "Copper Bar",
        ImageUrl = "materials/copper-bar.png",
        Type = ItemType.Material,
        Rarity = ItemRarity.Ordinary,
        Price = 5,
        Stackable = true,
    };

    public static readonly Item LeadBar = new()
    {
        Guid = ItemGuid.LeadBar,
        Name = "Lead Bar",
        ImageUrl = "materials/lead-bar.png",
        Type = ItemType.Material,
        Rarity = ItemRarity.Enhanced,
        Price = 10,
        Stackable = true,
    };

    public static readonly Item Emerald = new()
    {
        Guid = ItemGuid.Emerald,
        Name = "Emerald",
        ImageUrl = "materials/emerald.png",
        Type = ItemType.Material,
        Rarity = ItemRarity.Enhanced,
        Price = 10,
        Stackable = true,
    };

    public static readonly Item ShinyEmerald = new()
    {
        Guid = ItemGuid.ShinyEmerald,
        Name = "Shiny Emerald",
        ImageUrl = "materials/shiny-emerald.png",
        Type = ItemType.Material,
        Rarity = ItemRarity.Arcade,
        Price = 25,
        Stackable = true,
    };

    public static readonly Item SmallClaw = new()
    {
        Guid = ItemGuid.SmallClaw,
        Name = "Small Claw",
        ImageUrl = "materials/small-claw.png",
        Type = ItemType.Material,
        Rarity = ItemRarity.Ordinary,
        Price = 5,
        Stackable = true,
    };

    public static readonly Item ShinyClaw = new()
    {
        Guid = ItemGuid.ShinyClaw,
        Name = "Shiny Claw",
        ImageUrl = "materials/shiny-claw.png",
        Type = ItemType.Material,
        Rarity = ItemRarity.Enhanced,
        Price = 10,
        Stackable = true,
    };

    public static readonly Item WornHide = new()
    {
        Guid = ItemGuid.WornHide,
        Name = "Worn Hide",
        ImageUrl = "materials/worn-hide.png",
        Type = ItemType.Material,
        Rarity = ItemRarity.Ordinary,
        Price = 5,
        Stackable = true,
    };

    public static readonly Item ShinyHide = new()
    {
        Guid = ItemGuid.ShinyHide,
        Name = "Shiny Hide",
        ImageUrl = "materials/shiny-hide.png",
        Type = ItemType.Material,
        Rarity = ItemRarity.Enhanced,
        Price = 10,
        Stackable = true,
    };
}
