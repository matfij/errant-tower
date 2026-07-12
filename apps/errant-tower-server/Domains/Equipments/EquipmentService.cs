using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Items;

namespace ErrantTowerServer.Domains.Equipments;

public interface IEquipmentService
{
    public Task CreateInitial(string userId);
    public Task AwardItems(string userId, int silver, IList<BagItem> newItems);
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
        var equipment = await equipmentRepository.FindByUserId(userId)
            ?? throw new ApiException("errors.equipmentNotFound");

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
}
