import type { Item, ItemGuid, ItemRarity, ItemType } from "@errant/shared";

import { defineBattleStatistics, type BattleStatisticsDraft } from "../statistics/statistics-utils.ts";

type ItemRequirementsDraft = {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    spirit?: number;
};

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
    requirements?: ItemRequirementsDraft;
};

export const defineItem = (draft: ItemDraft): Item => {
    return {
        guid: draft.guid,
        name: draft.name,
        description: draft.description ?? null,
        imageUrl: draft.imageUrl,
        type: draft.type,
        rarity: draft.rarity,
        price: draft.price,
        isStackable: draft.isStackable ?? false,
        statistics: draft.statistics === undefined ? null : defineBattleStatistics(draft.statistics),
        requirements:
            draft.requirements === undefined
                ? null
                : {
                      strength: draft.requirements.strength ?? null,
                      dexterity: draft.requirements.dexterity ?? null,
                      constitution: draft.requirements.constitution ?? null,
                      spirit: draft.requirements.spirit ?? null,
                  },
    };
};
