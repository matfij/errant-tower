using ErrantTowerServer.Common;
using ErrantTowerServer.Domains.Item;

namespace ErrantTowerServer.Domains.Equipment;

public interface IEquipmentService
{
    public Task CreateInitial(string userId);
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
                    X = 0,
                    Y = 0,
                },
                new BagItem()
                {
                    ItemGuid = ItemGuid.LeatherArmor,
                    Quantity = 1,
                    X = 0,
                    Y = 1,
                },
            ]
        };
        await equipmentRepository.CreateOne(newEquipment);
    }
}
