import type { Item, ItemGuid, ItemRarity, ItemRequirements, ItemType } from "@errant/shared";

import { defineBattleStatistics, type BattleStatisticsDraft } from "../statistics/statistics-utils.ts";

type ItemDraft = {
    guid: ItemGuid;
    name: string;
    description?: string;
    imageUrl: string;
    type: ItemType;
    rarity: ItemRarity;
    price: number;
    isStackable?: boolean;
    statistics?: BattleStatisticsDraft;
    requirements?: ItemRequirements;
};

export const defineItem = (draft: ItemDraft): Item => {
    return {
        guid: draft.guid,
        name: draft.name,
        description: draft.description,
        imageUrl: draft.imageUrl,
        type: draft.type,
        rarity: draft.rarity,
        price: draft.price,
        isStackable: draft.isStackable ?? false,
        statistics: draft.statistics === undefined ? undefined : defineBattleStatistics(draft.statistics),
        requirements: draft.requirements,
    };
};
