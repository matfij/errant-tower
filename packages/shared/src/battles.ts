import type { EnemyRace } from "./enemies.ts";
import type { BattleSkill, SkillEffectType } from "./skills.ts";
import type { BattleStatistics } from "./statistics.ts";

export type GetBattleResponse = {
    id: string;
    isFinished: boolean;
    turnNumber: number;
    user: BattleCharacter;
    enemy: BattleCharacter;
    skills: BattleSkill[];
    logs: string[];
};

export type BattleCharacter = {
    name: string;
    imageUrl: string;
    title: string | null;
    race: EnemyRace;
    statistics: BattleStatistics;
    statuses: BattleStatus[];
};

export type BattleStatus = {
    type: SkillEffectType;
    value: number;
    duration: number;
};
