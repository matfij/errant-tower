import {
    FloorDomain,
    FloorGuid,
    FloorTileType,
    type BattleStatistics,
    type DomainFloors,
    type FloorTeaser,
    type FloorTile,
    type GetExpeditionResponse,
} from "@errant/shared";

import { HttpError } from "../../common/http/errors.ts";
import { UtilsService } from "../../common/utils-service.ts";
import { readFloorTiles } from "../floors/data/floor-tiles.ts";
import type { Floor } from "../floors/floor-definition.ts";
import { getAllFloors, getFloor } from "../floors/floor-registry.ts";
import type { ExpeditionEntity, FloorTileInfo } from "./expedition-entity.ts";
import type { ExpeditionRepository } from "./expedition-repository.ts";

export class ExpeditionService {
    private readonly initialStamina = 3;
    private readonly baseInitiative = 100;
    private readonly baseAdrenaline = 0;

    private readonly expeditionRepository: ExpeditionRepository;

    constructor(expeditionRepository: ExpeditionRepository) {
        this.expeditionRepository = expeditionRepository;
    }

    async createInitial(userId: string, username: string): Promise<void> {
        const expedition: ExpeditionEntity = {
            id: UtilsService.newId(),
            userId,
            username,
            unlockedFloor: FloorGuid.Floor1,
            unlockedDomain: FloorDomain.Dungeon,
            stamina: this.initialStamina,
            isInExpedition: false,
            currentFloor: FloorGuid.Floor1,
            initiative: 0,
            maxInitiative: 0,
            adrenaline: this.baseAdrenaline,
            battleId: null,
            gainedSilver: 0,
            gainedItems: [],
            statistics: null,
            x: 0,
            y: 0,
            floorTiles: [],
        };
        await this.expeditionRepository.create(expedition);
    }

    async getFloors(userId: string): Promise<DomainFloors[]> {
        const expedition = await this.readExpedition(userId);
        const groups: DomainFloors[] = [];

        for (const floor of getAllFloors()) {
            const teaser: FloorTeaser = {
                guid: floor.guid,
                isUnlocked: this.readRank(expedition.unlockedFloor) >= this.readRank(floor.guid),
            };
            const existing = groups.find((group) => group.domain === floor.domain) ?? null;
            if (existing === null) {
                groups.push({
                    domain: floor.domain,
                    isUnlocked: this.readRank(expedition.unlockedDomain) >= this.readRank(floor.domain),
                    floors: [teaser],
                });
            } else {
                existing.floors.push(teaser);
            }
        }

        groups.sort((left, right) => this.readRank(left.domain) - this.readRank(right.domain));
        return groups;
    }

    async startExpedition(
        userId: string,
        floorGuid: FloorGuid,
        battleStatistics: BattleStatistics,
    ): Promise<void> {
        const expedition = await this.readExpedition(userId);
        if (expedition.stamina < 1) {
            throw new HttpError("errors.notEnoughStamina");
        }
        if (expedition.isInExpedition) {
            throw new HttpError("errors.expeditionInProgress");
        }

        const floor = getFloor(floorGuid);
        if (this.readRank(expedition.unlockedFloor) < this.readRank(floor.guid)) {
            throw new HttpError("errors.floorLocked");
        }

        expedition.currentFloor = floor.guid;
        expedition.isInExpedition = true;
        expedition.maxInitiative = this.baseInitiative;
        expedition.initiative = this.baseInitiative;
        expedition.adrenaline = this.baseAdrenaline;
        expedition.battleId = null;
        expedition.gainedSilver = 0;
        expedition.gainedItems = [];
        expedition.stamina -= 1;
        expedition.x = floor.startX;
        expedition.y = floor.startY;
        expedition.statistics = battleStatistics;
        expedition.floorTiles = this.mapFloorTiles(floor, readFloorTiles(floor.tilesUrl));

        await this.expeditionRepository.update(expedition);
    }

    async getExpedition(userId: string): Promise<GetExpeditionResponse> {
        const expedition = await this.readExpedition(userId);
        if (!expedition.isInExpedition || expedition.statistics === null) {
            throw new HttpError("errors.expeditionNotStarted");
        }

        const floor = getFloor(expedition.currentFloor);
        return {
            floorGuid: expedition.currentFloor,
            floorImageUrl: floor.imageUrl,
            battleId: expedition.battleId,
            maxInitiative: expedition.maxInitiative,
            initiative: expedition.initiative,
            statistics: expedition.statistics,
            x: expedition.x,
            y: expedition.y,
            floorTiles: expedition.floorTiles.map((tile) => ({
                x: tile.x,
                y: tile.y,
                type: tile.type,
            })),
        };
    }

    private async readExpedition(userId: string): Promise<ExpeditionEntity> {
        const expedition = await this.expeditionRepository.readByUserId(userId);
        if (expedition === null) {
            throw new HttpError("errors.expeditionNotFound");
        }
        return expedition;
    }

    private readRank(value: string): number {
        return Number(value.match(/\d+$/)?.[0]);
    }

    private mapFloorTiles(floor: Floor, tiles: FloorTile[]): FloorTileInfo[] {
        return tiles.map((tile) => this.mapFloorTile(floor, tile));
    }

    private mapFloorTile(floor: Floor, tile: FloorTile): FloorTileInfo {
        switch (tile.type) {
            case FloorTileType.Route:
            case FloorTileType.Wall:
            case FloorTileType.Start:
            case FloorTileType.Finish:
                return {
                    x: tile.x,
                    y: tile.y,
                    type: tile.type,
                    enemyGuid: null,
                    itemGuid: null,
                    silver: null,
                };
            case FloorTileType.Battle:
                if (UtilsService.checkChance(floor.specialEnemyChance)) {
                    return {
                        x: tile.x,
                        y: tile.y,
                        type: tile.type,
                        enemyGuid: UtilsService.pickWeighted(floor.specialEnemies),
                        itemGuid: null,
                        silver: null,
                    };
                }
                return {
                    x: tile.x,
                    y: tile.y,
                    type: FloorTileType.Route,
                    enemyGuid: null,
                    itemGuid: null,
                    silver: null,
                };
            case FloorTileType.Treasure:
                if (UtilsService.checkChance(floor.treasureChance)) {
                    return {
                        x: tile.x,
                        y: tile.y,
                        type: tile.type,
                        enemyGuid: null,
                        itemGuid: UtilsService.pickWeighted(floor.treasureItemGuids),
                        silver: UtilsService.randomInt(floor.treasureSilverMin, floor.treasureSilverMax),
                    };
                }
                return {
                    x: tile.x,
                    y: tile.y,
                    type: FloorTileType.Route,
                    enemyGuid: null,
                    itemGuid: null,
                    silver: null,
                };
            case FloorTileType.NPC:
                throw new HttpError("errors.npcFeatureUnsupported");
        }
    }
}
