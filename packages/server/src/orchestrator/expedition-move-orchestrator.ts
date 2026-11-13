import { FloorTileType, MoveDirection, type ExpeditionSummary, type MoveResult } from "@errant/shared";

import { HttpError } from "../common/http/errors.ts";
import { UtilsService } from "../common/utils-service.ts";
import type { BattleService } from "../domains/battles/battle-service.ts";
import { getEnemy } from "../domains/enemies/enemy-registry.ts";
import type { EquipmentService } from "../domains/equipment/equipment-service.ts";
import type { ExpeditionEntity } from "../domains/expedition/expedition-entity.ts";
import type { ExpeditionService } from "../domains/expedition/expedition-service.ts";
import type { ExpeditionSessionManager } from "../domains/expedition/expedition-session.ts";
import { getFloor } from "../domains/floors/floor-registry.ts";
import type { SkillsService } from "../domains/statistics/skills-service.ts";
import type { StatisticsService } from "../domains/statistics/statistics-service.ts";

export class ExpeditionMoveOrchestrator {
    private readonly moveSpeed = 10;
    private readonly failedItemChance = 0.6;

    private readonly expeditionSessionManager: ExpeditionSessionManager;
    private readonly expeditionService: ExpeditionService;
    private readonly equipmentService: EquipmentService;
    private readonly statisticsService: StatisticsService;
    private readonly skillsService: SkillsService;
    private readonly battleService: BattleService;

    constructor(
        expeditionSessionManager: ExpeditionSessionManager,
        expeditionService: ExpeditionService,
        equipmentService: EquipmentService,
        statisticsService: StatisticsService,
        skillsService: SkillsService,
        battleService: BattleService,
    ) {
        this.expeditionSessionManager = expeditionSessionManager;
        this.expeditionService = expeditionService;
        this.equipmentService = equipmentService;
        this.statisticsService = statisticsService;
        this.skillsService = skillsService;
        this.battleService = battleService;
    }

    async move(userId: string, direction: MoveDirection): Promise<MoveResult> {
        const expedition = await this.expeditionSessionManager.create(userId);
        let newX = expedition.x;
        let newY = expedition.y;

        if (expedition.battleId !== null) {
            return this.holdPosition(expedition);
        }
        if (expedition.initiative <= 0) {
            return this.finish(false, false, expedition);
        }

        switch (direction) {
            case MoveDirection.Up:
                newY -= this.moveSpeed;
                break;
            case MoveDirection.Down:
                newY += this.moveSpeed;
                break;
            case MoveDirection.Left:
                newX -= this.moveSpeed;
                break;
            case MoveDirection.Right:
                newX += this.moveSpeed;
                break;
            default:
                throw new HttpError("errors.invalidMoveDirection");
        }

        const newTile = expedition.floorTiles.find((tile) => tile.x === newX && tile.y === newY) ?? null;
        if (newTile === null) {
            return this.holdPosition(expedition);
        }

        switch (newTile.type) {
            case FloorTileType.Wall:
                return this.holdPosition(expedition);
            case FloorTileType.Route: {
                expedition.x = newX;
                expedition.y = newY;
                expedition.initiative -= 1;
                const battleId = await this.checkBattle(expedition);
                if (battleId !== null) {
                    expedition.battleId = battleId;
                }
                break;
            }
            case FloorTileType.Battle:
            case FloorTileType.Treasure:
                expedition.x = newX;
                expedition.y = newY;
                expedition.initiative -= 1;
                break;
            case FloorTileType.Start:
                return this.finish(true, false, expedition);
            case FloorTileType.Finish:
                return this.finish(true, true, expedition);
            case FloorTileType.NPC:
                break;
        }

        return {
            x: newX,
            y: newY,
            initiative: expedition.initiative,
            battleId: expedition.battleId,
            summary: null,
        };
    }

    private holdPosition(expedition: ExpeditionEntity): MoveResult {
        return {
            x: expedition.x,
            y: expedition.y,
            initiative: expedition.initiative,
            battleId: expedition.battleId,
            summary: null,
        };
    }

    private async finish(
        isSuccess: boolean,
        hasFinished: boolean,
        expedition: ExpeditionEntity,
    ): Promise<MoveResult> {
        const gainedSilver = isSuccess
            ? expedition.gainedSilver
            : Math.floor(UtilsService.randomFloat(0.5, 0.75) * expedition.gainedSilver);
        const gainedItems = isSuccess
            ? expedition.gainedItems
            : expedition.gainedItems.filter(() => UtilsService.checkChance(this.failedItemChance));
        const gainedAttributePoints = Math.floor(
            UtilsService.randomFloat(isSuccess ? 0.5 : 0.3, isSuccess ? 0.7 : 0.4) * expedition.adrenaline,
        );
        const gainedSkillPoints = Math.floor(
            UtilsService.randomFloat(isSuccess ? 0.3 : 0.2, isSuccess ? 0.5 : 0.3) * expedition.adrenaline,
        );
        const summary: ExpeditionSummary = {
            isSuccess,
            hasFinished,
            gainedSilver,
            gainedItems: gainedItems.map((item) => ({
                itemGuid: item.itemGuid,
                quantity: item.quantity,
            })),
            gainedAttributePoints,
            gainedSkillPoints,
        };

        await Promise.all([
            this.expeditionService.finishExpedition(expedition.userId, hasFinished),
            this.equipmentService.awardItems(expedition.userId, gainedSilver, gainedItems),
            this.statisticsService.awardPoints(expedition.userId, gainedAttributePoints, gainedSkillPoints),
        ]);
        this.expeditionSessionManager.remove(expedition.userId);

        return {
            x: 0,
            y: 0,
            initiative: 0,
            battleId: null,
            summary,
        };
    }

    private async checkBattle(expedition: ExpeditionEntity): Promise<string | null> {
        const floor = getFloor(expedition.currentFloor);
        if (!UtilsService.checkChance(floor.battleChance)) {
            return null;
        }
        const equipment = await this.equipmentService.getEquipmentList(expedition.userId);
        const statistics = await this.statisticsService.getUserBattleStatistics(expedition.userId, equipment);
        const skills = await this.skillsService.getActiveSkills(expedition.userId);
        const enemy = getEnemy(UtilsService.pickWeighted(floor.enemies));
        const battle = await this.battleService.start(
            expedition.userId,
            expedition.username,
            statistics,
            skills,
            enemy,
        );
        return battle.id;
    }
}
