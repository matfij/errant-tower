import type { BattleStatistics, ItemGuid, SkillGuid } from "@errant/shared";

export enum EnemyGuid {
    // Dungeon
    Ratter = "Ratter",
    Chembr = "Chembr",
    Kerramid = "Kerramid",
    Glowpede = "Glowpede",
    Scrapper = "Scrapper",
    Boarus = "Boarus",
    Pigon = "Pigon",
    Morus = "Morus",
    Wisker = "Wisker",
    Regewur = "Regewur",
}

export type Enemy = {
    guid: EnemyGuid;
    name: string;
    imageUrl: string;
    race: EnemyRace;
    title: string | null;
    statistics: BattleStatistics;
    skills: SkillGuid[];
    loots: EnemyLoot[];
};

export enum EnemyRace {
    Vermin = "Vermin",
    Feline = "Feline",
    Beast = "Beast",
    Reptile = "Reptile",
    Human = "Human",
    Undead = "Undead",
    Insect = "Insect",
    Avian = "Avian",
    Mechanical = "Mechanical",
    Spirit = "Spirit",
    Dragon = "Dragon",
}

export type EnemyLoot = {
    guid: ItemGuid;
    chance: number;
};
