using ErrantTowerServer.Domains.Equipments;

namespace ErrantTowerServer.Orchestrator;

public record GetEquipmentResponse : BattleEquipment { }

public record EquipItemRequest : ItemToEquip { }

public record EquipItemResponse : BattleEquipment { }

public record UnequipItemRequest
{
    public ItemSlot ItemSlot { get; init; }
}

public record UnequipItemResponse : BattleEquipment { }
