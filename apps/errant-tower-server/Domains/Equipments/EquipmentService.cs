using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Items;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Domains.Equipments;

public interface IEquipmentService
{
    public Task CreateInitial(string userId);
    public Task AwardItems(string userId, int silver, IList<BagItem> newItems);
    public Task<BattleEquipment> GetEquipment(string userId);
    public Task<IList<Item>> GetEquipmentList(string userId);
    public Task<IList<BagItemData>> GetBag(string userId);
    public Task<BattleEquipment> EquipItem(string userId, ItemToEquip itemToEquip, UserAttributes userAttributes);
    public Task<BattleEquipment> UnequipItem(string userId, ItemSlot itemSlot);
}

public class EquipmentService(IEquipmentRepository equipmentRepository) : IEquipmentService
{
    public async Task CreateInitial(string userId)
    {
        var newEquipment = new EquipmentEntity
        {
            Id = Utils.GenerateGuid(),
            UserId = userId,
            Bag =
            [
                new BagItem()
                {
                    ItemGuid = ItemGuid.WoodenSword,
                    Quantity = 1,
                },
                new BagItem()
                {
                    ItemGuid = ItemGuid.LeatherArmor,
                    Quantity = 1,
                },
            ]
        };
        await equipmentRepository.CreateOne(newEquipment);
    }

    public async Task AwardItems(string userId, int silver, IList<BagItem> newItems)
    {
        var equipment = await GetUserEquipment(userId);

        equipment.Silver += silver;

        foreach (var newItem in newItems)
        {
            var existing = equipment.Bag.Find(item => item.ItemGuid == newItem.ItemGuid);
            if (existing is not null && ItemRegistry.GetItem(existing.ItemGuid).IsStackable)
            {
                existing.Quantity += newItem.Quantity;
            }
            else
            {
                equipment.Bag.Add(newItem);
            }
        }

        _ = await equipmentRepository.UpdateOne(equipment);
    }

    public async Task<BattleEquipment> GetEquipment(string userId)
    {
        var equipment = await GetUserEquipment(userId);
        return MapBattleEquipment(equipment);
    }

    public async Task<IList<Item>> GetEquipmentList(string userId)
    {
        var equipment = await GetEquipment(userId);

        return new[]
        {
            equipment.Headgear,
            equipment.Armor,
            equipment.Footwear,
            equipment.Charm,
            equipment.LeftHand,
            equipment.RightHand
        }
            .OfType<Item>()
            .ToList();
    }

    public async Task<IList<BagItemData>> GetBag(string userId)
    {
        var equipment = await GetUserEquipment(userId);
        return equipment.Bag
            .Select(item => new BagItemData
            {
                Item = ItemRegistry.GetItem(item.ItemGuid),
                Quantity = item.Quantity
            })
            .ToList();
    }

    public async Task<BattleEquipment> EquipItem(
        string userId,
        ItemToEquip itemToEquip,
        UserAttributes userAttributes)
    {
        var equipment = await GetUserEquipment(userId);

        if (equipment.Bag.FirstOrDefault(item => item.ItemGuid == itemToEquip.ItemGuid) is null)
        {
            throw new ApiException("errors.itemNotOwned");
        }

        var item = ItemRegistry.GetItem(itemToEquip.ItemGuid);

        if (item.Requirements is not null &&
            (item.Requirements.Value.Strength > userAttributes.Strength
            || item.Requirements.Value.Dexterity > userAttributes.Dexterity
            || item.Requirements.Value.Constitution > userAttributes.Constitution
            || item.Requirements.Value.Spirit > userAttributes.Spirit))
        {
            throw new ApiException("errors.insufficientAttributes");
        }

        ItemGuid? previouslyEquippedItem = itemToEquip.Slot switch
        {
            ItemSlot.Headgear => equipment.Headgear,
            ItemSlot.Armor => equipment.Armor,
            ItemSlot.Footwear => equipment.Footwear,
            ItemSlot.Charm => equipment.Charm,
            ItemSlot.RightHand => equipment.RightHand,
            ItemSlot.LeftHand => equipment.LeftHand,
            _ => throw new ApiException("error.dev.incorrectlyEquippedItem")
        };

        if (previouslyEquippedItem is not null)
        {
            equipment.Bag.Add(new() { ItemGuid = previouslyEquippedItem.Value, Quantity = 1 });
        }

        switch (itemToEquip.Slot)
        {
            case ItemSlot.Headgear:
                equipment.Headgear = item.Guid;
                break;
            case ItemSlot.Armor:
                equipment.Armor = item.Guid;
                break;
            case ItemSlot.Footwear:
                equipment.Footwear = item.Guid;
                break;
            case ItemSlot.Charm:
                equipment.Charm = item.Guid;
                break;
            case ItemSlot.RightHand:
                equipment.RightHand = item.Guid;
                break;
            case ItemSlot.LeftHand:
                equipment.LeftHand = item.Guid;
                break;
            default:
                throw new ApiException("error.dev.incorrectEquipmentSlot");
        }

        equipment.Bag.Remove(new() { ItemGuid = item.Guid, Quantity = 1 });

        equipment = await equipmentRepository.UpdateOne(equipment);

        return MapBattleEquipment(equipment);
    }

    public async Task<BattleEquipment> UnequipItem(string userId, ItemSlot itemSlot)
    {
        var equipment = await GetUserEquipment(userId);

        ItemGuid? unequippedItem = null;

        switch (itemSlot)
        {
            case ItemSlot.Headgear:
                unequippedItem = equipment.Headgear;
                equipment.Headgear = null;
                break;
            case ItemSlot.Armor:
                unequippedItem = equipment.Armor;
                equipment.Armor = null;
                break;
            case ItemSlot.Footwear:
                unequippedItem = equipment.Footwear;
                equipment.Footwear = null;
                break;
            case ItemSlot.Charm:
                unequippedItem = equipment.Charm;
                equipment.Charm = null;
                break;
            case ItemSlot.RightHand:
                unequippedItem = equipment.RightHand;
                equipment.RightHand = null;
                break;
            case ItemSlot.LeftHand:
                unequippedItem = equipment.LeftHand;
                equipment.LeftHand = null;
                break;
            default:
                throw new ApiException("errors.dev.unsupportedEquipmentSlot");
        }

        if (unequippedItem is not null)
        {
            equipment.Bag.Add(new()
            {
                ItemGuid = unequippedItem.Value,
                Quantity = 1
            });
            equipment = await equipmentRepository.UpdateOne(equipment);
        }

        return MapBattleEquipment(equipment);
    }


    private async Task<EquipmentEntity> GetUserEquipment(string userId)
    {
        return await equipmentRepository.FindByUserId(userId)
            ?? throw new ApiException("errors.equipmentNotFound");
    }

    private BattleEquipment MapBattleEquipment(EquipmentEntity equipment)
    {
        return new BattleEquipment
        {
            Headgear = equipment.Headgear is not null ? ItemRegistry.GetItem(equipment.Headgear.Value) : null,
            Armor = equipment.Armor is not null ? ItemRegistry.GetItem(equipment.Armor.Value) : null,
            Footwear = equipment.Footwear is not null ? ItemRegistry.GetItem(equipment.Footwear.Value) : null,
            Charm = equipment.Charm is not null ? ItemRegistry.GetItem(equipment.Charm.Value) : null,
            RightHand = equipment.RightHand is not null ? ItemRegistry.GetItem(equipment.RightHand.Value) : null,
            LeftHand = equipment.LeftHand is not null ? ItemRegistry.GetItem(equipment.LeftHand.Value) : null,
        };
    }
}
