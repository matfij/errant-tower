using ErrantTowerServer.Domains.Equipments;

namespace ErrantTowerServer.Orchestrator;

public record GetEquipmentResponse : BattleEquipment { }

public record GetBagResponse
{
    public required IList<BagItemData> Items { get; init; } = [];
}

public record EquipItemRequest : ItemToEquip { }

public record EquipItemResponse : BattleEquipment { }

public record UnequipItemRequest
{
    public required ItemSlot ItemSlot { get; init; }
}

public record UnequipItemResponse : BattleEquipment { }
