using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Domains.Item;

public readonly record struct Item
{
    public Item() { }

    public required ItemGuid Guid { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required string ImageUrl { get; init; }

    public required ItemType Type { get; init; }
    public required ItemRarity Rarity { get; init; }
    public required int Price { get; init; }
    public bool Stackable { get; init; } = false;
    public BattleStatistics? Statistics { get; init; }
    public ItemRequirements? Requirements { get; init; }
}

public enum ItemType
{
    Helmet = 1,
    Armor = 2,
    Boots = 3,
    Charm = 4,

    Sword = 11,
    Lance = 12,
    Shield = 13,
    Dagger = 14,
    Staff = 15,
    Bow = 16,
    Hammer = 17,

    Ingredient = 21,
    Consumable = 22,
}

public enum ItemRarity
{
    Ordinary = 1,
    Enhanced = 2,
    Arcade = 3,
    Heroic = 4,
    Artifact = 5,
    Divine = 6,
}

public readonly record struct ItemRequirements
{
    public int? Strength { get; init; }
    public int? Dexterity { get; init; }
    public int? Constitution { get; init; }
    public int? Spirit { get; init; }
}
