import type { BattleCharacter, BattleSkill } from "@errant/shared";

export type BattleEntity = {
    id: string;
    userId: string;
    isFinished: boolean;
    turnNumber: number;
    user: BattleCharacter;
    enemy: BattleCharacter;
    skills: BattleSkill[];
    logs: string[];
};
