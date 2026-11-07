import { UserAttribute, type GetAttributesResponse } from "@errant/shared";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { RequestBodyService } from "../common/http/body.ts";
import type { StatisticsEntity } from "../domains/statistics/statistics-entity.ts";
import { AuthSessionService } from "./auth-session-service.ts";
import { StatisticsOrchestrator } from "./statistics-orchestrator.ts";

export class StatisticsRoutes {
    private readonly statisticsOrchestrator: StatisticsOrchestrator;
    private readonly authSessionService: AuthSessionService;

    constructor(statisticsOrchestrator: StatisticsOrchestrator, authSessionService: AuthSessionService) {
        this.statisticsOrchestrator = statisticsOrchestrator;
        this.authSessionService = authSessionService;
    }

    register(app: FastifyInstance): void {
        app.get("/statistics/get-attributes", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            const statistics = await this.statisticsOrchestrator.getAttributes(user.id);
            return toAttributesResponse(statistics);
        });

        app.post("/statistics/extend-attribute", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            const body = RequestBodyService.parse(StatisticsRoutes.extendAttributeBody, request.body);
            const statistics = await this.statisticsOrchestrator.extendAttribute(user.id, body.attribute);
            return toAttributesResponse(statistics);
        });
    }

    private static readonly extendAttributeBody = z.object({
        attribute: z.nativeEnum(UserAttribute),
    });
}

const toAttributesResponse = (statistics: StatisticsEntity): GetAttributesResponse => {
    return {
        strength: statistics.strength,
        dexterity: statistics.dexterity,
        constitution: statistics.constitution,
        spirit: statistics.spirit,
        attributePoints: statistics.attributePoints,
    };
};
