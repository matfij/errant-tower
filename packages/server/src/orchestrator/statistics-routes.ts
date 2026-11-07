import {
    SkillGuid,
    UserAttribute,
    type BattleStatistics,
    type GetAttributesResponse,
    type GetBattleStatisticsResponse,
    type GetSkillTreeResponse,
    type SkillEffect,
    type SkillProperty,
    type UserSkill,
} from "@errant/shared";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { RequestBodyService } from "../common/http/body.ts";
import type { SkillTree, SkillTreeSkill } from "../domains/statistics/statistics-definition.ts";
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

        app.get("/statistics/get-battle-statistics", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            const statistics = await this.statisticsOrchestrator.getBattleStatistics(user.id);
            return toBattleStatisticsResponse(statistics);
        });

        app.post("/statistics/extend-attribute", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            const body = RequestBodyService.parse(StatisticsRoutes.extendAttributeBody, request.body);
            const statistics = await this.statisticsOrchestrator.extendAttribute(user.id, body.attribute);
            return toAttributesResponse(statistics);
        });

        app.get("/statistics/get-skill-tree", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            const skillTree = await this.statisticsOrchestrator.getSkillTree(user.id);
            return toSkillTreeResponse(skillTree);
        });

        app.post("/statistics/learn-skill", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            const body = RequestBodyService.parse(StatisticsRoutes.learnSkillBody, request.body);
            const skillTree = await this.statisticsOrchestrator.learnSkill(user.id, body.skillGuid);
            return toSkillTreeResponse(skillTree);
        });

        app.post("/statistics/reset-skills", async (request, reply) => {
            const user = await this.authSessionService.requireUser(request, reply);
            const skillTree = await this.statisticsOrchestrator.resetSkills(user.id);
            return toSkillTreeResponse(skillTree);
        });
    }

    private static readonly extendAttributeBody = z.object({
        attribute: z.nativeEnum(UserAttribute),
    });

    private static readonly learnSkillBody = z.object({
        skillGuid: z.nativeEnum(SkillGuid),
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

const toBattleStatisticsResponse = (statistics: BattleStatistics): GetBattleStatisticsResponse => {
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

const toSkillTreeResponse = (skillTree: SkillTree): GetSkillTreeResponse => {
    return {
        skillPoints: skillTree.skillPoints,
        paths: {
            blade: skillTree.paths.blade.map(toUserSkill),
            tenacity: skillTree.paths.tenacity.map(toUserSkill),
            hammer: skillTree.paths.hammer.map(toUserSkill),
            bellicosity: skillTree.paths.bellicosity.map(toUserSkill),
            lance: skillTree.paths.lance.map(toUserSkill),
            vivacity: skillTree.paths.vivacity.map(toUserSkill),
            bow: skillTree.paths.bow.map(toUserSkill),
            perspicacity: skillTree.paths.perspicacity.map(toUserSkill),
            staff: skillTree.paths.staff.map(toUserSkill),
            sagacity: skillTree.paths.sagacity.map(toUserSkill),
        },
    };
};

const toUserSkill = (entry: SkillTreeSkill): UserSkill => {
    const skill = entry.skill;
    return {
        guid: skill.guid,
        name: skill.name,
        description: skill.description,
        imageUrl: skill.imageUrl,
        path: skill.path,
        tier: skill.tier,
        types: skill.types,
        physicalAttackFactor: skill.physicalAttackFactor,
        magicalAttackFactor: skill.magicalAttackFactor,
        physicalDefenseFactor: skill.physicalDefenseFactor,
        magicalDefenseFactor: skill.magicalDefenseFactor,
        isPassive: skill.isPassive,
        targetSelf: skill.targetSelf,
        hitCount: skill.hitCount,
        energyCost: skill.energyCost,
        manaCost: skill.manaCost,
        targetEffects: skill.targetEffects.map((level) => level.map(toSkillEffect)),
        selfEffects: skill.selfEffects.map((level) => level.map(toSkillEffect)),
        targetProperties: skill.targetProperties.map((level) => level.map(toSkillProperty)),
        selfProperties: skill.selfProperties.map((level) => level.map(toSkillProperty)),
        requirements: skill.requirements.map((requirement) => ({
            path: requirement.path,
            points: requirement.points,
        })),
        level: entry.level,
    };
};

const toSkillEffect = (effect: SkillEffect): SkillEffect => {
    return {
        type: effect.type,
        value: effect.value,
        chance: effect.chance,
        duration: effect.duration,
    };
};

const toSkillProperty = (property: SkillProperty): SkillProperty => {
    return {
        effect: property.effect,
        type: property.type,
        value: property.value,
        duration: property.duration,
    };
};
