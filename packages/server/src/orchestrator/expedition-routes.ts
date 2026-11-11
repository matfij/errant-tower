import {
    FloorGuid,
    type BattleStatistics,
    type DomainFloors,
    type FloorTeaser,
    type FloorTile,
    type GetExpeditionResponse,
    type GetFloorsResponse,
} from "@errant/shared";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { RequestBodyService } from "../common/http/body.ts";
import { AuthSessionService } from "./auth-session-service.ts";
import { ExpeditionOrchestrator } from "./expedition-orchestrator.ts";

export class ExpeditionRoutes {
    private readonly expeditionOrchestrator: ExpeditionOrchestrator;
    private readonly authSessionService: AuthSessionService;

    constructor(expeditionOrchestrator: ExpeditionOrchestrator, authSessionService: AuthSessionService) {
        this.expeditionOrchestrator = expeditionOrchestrator;
        this.authSessionService = authSessionService;
    }

    register(app: FastifyInstance): void {
        app.get("/expeditions/get-floors", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            const domains = await this.expeditionOrchestrator.getFloors(user.id);
            return toFloorsResponse(domains);
        });

        app.post("/expeditions/start-expedition", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            const body = RequestBodyService.parse(ExpeditionRoutes.startExpeditionBody, request.body);
            await this.expeditionOrchestrator.startExpedition(user.id, body.floorGuid);
            return reply.status(200).send();
        });

        app.get("/expeditions/get-expedition", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            const expedition = await this.expeditionOrchestrator.getExpedition(user.id);
            return toExpeditionResponse(expedition);
        });
    }

    private static readonly startExpeditionBody = z.object({
        floorGuid: z.nativeEnum(FloorGuid),
    });
}

const toFloorsResponse = (domains: DomainFloors[]): GetFloorsResponse => {
    return {
        domainFloors: domains.map(toDomainFloorsResponse),
    };
};

const toDomainFloorsResponse = (domain: DomainFloors): DomainFloors => {
    return {
        isUnlocked: domain.isUnlocked,
        domain: domain.domain,
        floors: domain.floors.map(toFloorTeaserResponse),
    };
};

const toFloorTeaserResponse = (floor: FloorTeaser): FloorTeaser => {
    return {
        isUnlocked: floor.isUnlocked,
        guid: floor.guid,
    };
};

const toExpeditionResponse = (expedition: GetExpeditionResponse): GetExpeditionResponse => {
    return {
        floorGuid: expedition.floorGuid,
        floorImageUrl: expedition.floorImageUrl,
        battleId: expedition.battleId,
        maxInitiative: expedition.maxInitiative,
        initiative: expedition.initiative,
        statistics: toBattleStatisticsResponse(expedition.statistics),
        x: expedition.x,
        y: expedition.y,
        floorTiles: expedition.floorTiles.map(toFloorTileResponse),
    };
};

const toBattleStatisticsResponse = (statistics: BattleStatistics): BattleStatistics => {
    return {
        speed: statistics.speed,
        maxHealthPoints: statistics.maxHealthPoints,
        healthPoints: statistics.healthPoints,
        maxManaPoints: statistics.maxManaPoints,
        manaPoints: statistics.manaPoints,
        maxEnergyPoints: statistics.maxEnergyPoints,
        energyPoints: statistics.energyPoints,
        physicalAttack: statistics.physicalAttack,
        magicalAttack: statistics.magicalAttack,
        physicalDefense: statistics.physicalDefense,
        magicalDefense: statistics.magicalDefense,
        physicalAbsorption: statistics.physicalAbsorption,
        magicalAbsorption: statistics.magicalAbsorption,
        criticalChance: statistics.criticalChance,
        physicalCriticalPower: statistics.physicalCriticalPower,
        magicalCriticalPower: statistics.magicalCriticalPower,
        punctureChance: statistics.punctureChance,
        dodgeChance: statistics.dodgeChance,
        parryChance: statistics.parryChance,
        blockChance: statistics.blockChance,
        blockPower: statistics.blockPower,
        counterChance: statistics.counterChance,
        healthRegen: statistics.healthRegen,
        manaRegen: statistics.manaRegen,
        energyRegen: statistics.energyRegen,
    };
};

const toFloorTileResponse = (tile: FloorTile): FloorTile => {
    return {
        x: tile.x,
        y: tile.y,
        type: tile.type,
    };
};
