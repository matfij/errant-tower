import { BattleActRequest } from "../../../shared/src/battles.ts";
import type { BattleEntity } from "../domains/battles/battle-entity.ts";
import { BattleService } from "../domains/battles/battle-service.ts";

export class BattleOrchestrator {
    private readonly battleService: BattleService;

    constructor(battleService: BattleService) {
        this.battleService = battleService;
    }

    async getBattle(userId: string): Promise<BattleEntity> {
        return this.battleService.get(userId);
    }

    async act(userId: string, request: BattleActRequest) {
        return this.battleService.act(userId, request.skillGuid, request.wait, request.escape);
    }
}
