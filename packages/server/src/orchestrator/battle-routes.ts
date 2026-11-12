import type {
    BattleCharacter,
    BattleSkill,
    BattleSkillEffect,
    BattleSkillProperty,
    BattleStatistics,
    BattleStatus,
    GetBattleResponse,
} from "@errant/shared";
import type { FastifyInstance } from "fastify";

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
    }
}

const toBattleResponse = (battle: BattleEntity): GetBattleResponse => {
    return {
        id: battle.id,
        isFinished: battle.isFinished,
        turnNumber: battle.turnNumber,
        user: toBattleCharacterResponse(battle.user),
        enemy: toBattleCharacterResponse(battle.enemy),
        skills: battle.skills.map(toBattleSkillResponse),
        logs: battle.logs,
    };
};

const toBattleCharacterResponse = (character: BattleCharacter): BattleCharacter => {
    return {
        name: character.name,
        imageUrl: character.imageUrl,
        title: character.title,
        race: character.race,
        statistics: toBattleStatisticsResponse(character.statistics),
        statuses: character.statuses.map(toBattleStatusResponse),
    };
};

const toBattleStatusResponse = (status: BattleStatus): BattleStatus => {
    return {
        type: status.type,
        value: status.value,
        duration: status.duration,
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

const toBattleSkillResponse = (skill: BattleSkill): BattleSkill => {
    return {
        guid: skill.guid,
        name: skill.name,
        description: skill.description,
        imageUrl: skill.imageUrl,
        path: skill.path,
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
        targetEffects: skill.targetEffects.map(toBattleSkillEffectResponse),
        selfEffects: skill.selfEffects.map(toBattleSkillEffectResponse),
        targetProperties: skill.targetProperties.map(toBattleSkillPropertyResponse),
        selfProperties: skill.selfProperties.map(toBattleSkillPropertyResponse),
        requirements: skill.requirements.map((requirement) => ({
            path: requirement.path,
            points: requirement.points,
        })),
    };
};

const toBattleSkillEffectResponse = (effect: BattleSkillEffect): BattleSkillEffect => {
    return {
        type: effect.type,
        value: effect.value,
        chance: effect.chance,
        duration: effect.duration,
    };
};

const toBattleSkillPropertyResponse = (property: BattleSkillProperty): BattleSkillProperty => {
    return {
        effect: property.effect,
        type: property.type,
        value: property.value,
        duration: property.duration,
    };
};
