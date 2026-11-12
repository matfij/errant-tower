import type { EnemyRace, ItemGuid, SkillGuid } from "@errant/shared";

import { defineBattleStatistics, type BattleStatisticsDraft } from "../statistics/statistics-utils.ts";
import type { Enemy, EnemyGuid } from "./enemy-definition.ts";

type EnemyDraft = {
    guid: EnemyGuid;
    name: string;
    imageUrl: string;
    race: EnemyRace;
    title?: string;
    statistics: BattleStatisticsDraft;
    skills: SkillGuid[];
    loots?: {
        guid: ItemGuid;
        chance: number;
    }[];
};

export const defineEnemy = (draft: EnemyDraft): Enemy => {
    return {
        guid: draft.guid,
        name: draft.name,
        imageUrl: draft.imageUrl,
        race: draft.race,
        title: draft.title ?? null,
        statistics: defineBattleStatistics(draft.statistics),
        skills: draft.skills,
        loots: draft.loots ?? [],
    };
};
