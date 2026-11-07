import type {
    EquipItemRequest,
    EquipItemResponse,
    GetBagResponse,
    GetEquipmentResponse,
    UnequipItemRequest,
    UnequipItemResponse,
} from "@errant/shared";

import { getJson, postJson } from "./api-utils";

export const getEquipmentRequest = (): Promise<GetEquipmentResponse> => {
    return getJson("/equipment/get-equipment");
};

export const getBagRequest = (): Promise<GetBagResponse> => {
    return getJson("/equipment/get-bag");
};

export const equipItemRequest = (body: EquipItemRequest): Promise<EquipItemResponse> => {
    return postJson("/equipment/equip-item", body);
};

export const unequipItemRequest = (body: UnequipItemRequest): Promise<UnequipItemResponse> => {
    return postJson("/equipment/unequip-item", body);
};
