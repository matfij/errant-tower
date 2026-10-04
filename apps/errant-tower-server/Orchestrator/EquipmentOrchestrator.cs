using ErrantTowerServer.Domains.Equipments;
using ErrantTowerServer.Domains.Statistics;

namespace ErrantTowerServer.Orchestrator;

public interface IEquipmentOrchestrator
{
    public Task<GetEquipmentResponse> GetEquipment(string userId);
    public Task<EquipItemResponse> EquipItem(string userId, EquipItemRequest request);
    public Task<UnequipItemResponse> UnequipItem(string userId, UnequipItemRequest request);
}

public class EquipmentOrchestrator(
    IEquipmentService equipmentService,
    IStatisticsService statisticsService
    ) : IEquipmentOrchestrator
{
    public async Task<GetEquipmentResponse> GetEquipment(string userId)
    {
        var equipment = await equipmentService.GetUserEquipment(userId);
        return new GetEquipmentResponse
        {
            Headgear = equipment.Headgear,
            Armor = equipment.Armor,
            Charm = equipment.Charm,
            Footwear = equipment.Footwear,
            RightHand = equipment.RightHand,
            LeftHand = equipment.LeftHand,
        };
    }

    public async Task<EquipItemResponse> EquipItem(string userId, EquipItemRequest request)
    {
        var attributes = await statisticsService.GetUserAttributes(userId);
        var equipment = await equipmentService.EquipItem(userId, request, attributes);
        return new EquipItemResponse
        {
            Headgear = equipment.Headgear,
            Armor = equipment.Armor,
            Charm = equipment.Charm,
            Footwear = equipment.Footwear,
            RightHand = equipment.RightHand,
            LeftHand = equipment.LeftHand,
        };
    }

    public async Task<UnequipItemResponse> UnequipItem(string userId, UnequipItemRequest request)
    {
        var equipment = await equipmentService.UnequipItem(userId, request.ItemSlot);
        return new UnequipItemResponse
        {
            Headgear = equipment.Headgear,
            Armor = equipment.Armor,
            Charm = equipment.Charm,
            Footwear = equipment.Footwear,
            RightHand = equipment.RightHand,
            LeftHand = equipment.LeftHand,
        };
    }
}
