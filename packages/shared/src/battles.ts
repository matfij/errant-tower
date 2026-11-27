import type { EnemyRace } from "./enemies.ts";
import type { BattleSkill, SkillEffectType, SkillGuid } from "./skills.ts";
import type { BattleStatistics } from "./statistics.ts";

export type GetBattleResponse = {
    id: string;
    isFinished: boolean;
    turnNumber: number;
    user: BattleCharacter;
    enemy: BattleCharacter;
    logs: BattleLog[];
};

export type BattleCharacter = {
    name: string;
    imageUrl: string;
    title: string | null;
    race: EnemyRace;
    statistics: BattleStatistics;
    initiative: number;
    statuses: BattleStatus[];
    skills: BattleSkill[];
};

export type BattleStatus = {
    type: SkillEffectType;
    value: number;
    duration: number;
};

export type BattleLog = {
    log: string;
    isUser: boolean;
};

export type BattleActRequest = {
    skillGuid?: SkillGuid;
    wait?: boolean;
    escape?: boolean;
};
