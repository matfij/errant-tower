import { SkillGuid, type BattleCharacter, type GetBattleResponse } from "@errant/shared";
import type { FastifyInstance } from "fastify";
import z from "zod";

import { RequestBodyService } from "../common/http/body.ts";
import type { BattleEntity } from "../domains/battles/battle-entity.ts";
import { AuthSessionService } from "./auth-session-service.ts";
import { BattleOrchestrator } from "./battle-orchestrator.ts";

export class BattleRoutes {
    private readonly battleOrchestrator: BattleOrchestrator;
    private readonly authSessionService: AuthSessionService;

    constructor(battleOrchestrator: BattleOrchestrator, authSessionService: AuthSessionService) {
        this.battleOrchestrator = battleOrchestrator;
        this.authSessionService = authSessionService;
    }

    register(app: FastifyInstance): void {
        app.get("/battles/get-battle", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            const battle = await this.battleOrchestrator.getBattle(user.id);
            return toBattleResponse(battle);
        });

        app.post("/battles/act", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            const body = RequestBodyService.parse(BattleRoutes.actBody, request.body);
            const battle = await this.battleOrchestrator.act(user.id, body);
            return toBattleResponse(battle);
        });
    }

    private static readonly actBody = z.object({
        skillGuid: z.nativeEnum(SkillGuid),
        wait: z.boolean().optional(),
        escape: z.boolean().optional(),
    });
}

const toBattleResponse = (battle: BattleEntity): GetBattleResponse => {
    return {
        id: battle.id,
        isFinished: battle.isFinished,
        turnNumber: battle.turnNumber,
        user: toBattleCharacterResponse(battle.user),
        enemy: toBattleCharacterResponse(battle.enemy),
        logs: battle.logs,
    };
};

const toBattleCharacterResponse = (character: BattleCharacter): BattleCharacter => {
    return {
        name: character.name,
        imageUrl: character.imageUrl,
        title: character.title,
        race: character.race,
        statistics: character.statistics,
        initiative: character.initiative,
        statuses: character.statuses,
        skills: character.skills,
    };
};
