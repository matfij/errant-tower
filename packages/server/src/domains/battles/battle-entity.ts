import type { BattleCharacter } from "@errant/shared";

import { BattleLog } from "../../../../shared/src/battles";

export type BattleEntity = {
    id: string;
    userId: string;
    isFinished: boolean;
    turnNumber: number;
    user: BattleCharacter;
    enemy: BattleCharacter;
    enemySkillIndex: number;
    logs: BattleLog[];
};
