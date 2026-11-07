import {
    SkillPropertyEffect,
    SkillPropertyType,
    UserAttribute,
    type BattleStatistics,
    type Item,
    type SkillProperty,
} from "@errant/shared";

import { HttpError } from "../../common/http/errors.ts";
import { UtilsService } from "../../common/utils-service.ts";
import { getSkill } from "../skills/skill-registry.ts";
import type { LearnedSkill, StatisticsEntity } from "./statistics-entity.ts";
import type { StatisticsRepository } from "./statistics-repository.ts";
import { defineBattleStatistics } from "./statistics-utils.ts";

export class StatisticsService {
    private readonly statisticPrecision = 3;
    private readonly initialAttribute = 10;
    private readonly initialPoints = 10;

    private readonly statisticsRepository: StatisticsRepository;

    constructor(statisticsRepository: StatisticsRepository) {
        this.statisticsRepository = statisticsRepository;
    }

    async createInitial(userId: string): Promise<void> {
        const statistics: StatisticsEntity = {
            id: UtilsService.newId(),
            userId,
            attributePoints: this.initialPoints,
            skillPoints: this.initialPoints,
            strength: this.initialAttribute,
            dexterity: this.initialAttribute,
            constitution: this.initialAttribute,
            spirit: this.initialAttribute,
            learnedSkills: [],
        };
        await this.statisticsRepository.create(statistics);
    }

    async getStatistics(userId: string): Promise<StatisticsEntity> {
        const statistics = await this.statisticsRepository.readByUserId(userId);
        if (statistics === null) {
            throw new HttpError("errors.statisticsNotFound");
        }
        return statistics;
    }

    async extendAttribute(userId: string, attribute: UserAttribute): Promise<StatisticsEntity> {
        const statistics = await this.getStatistics(userId);
        if (statistics.attributePoints < 1) {
            throw new HttpError("errors.notEnoughAttributePoints");
        }

        switch (attribute) {
            case UserAttribute.Strength:
                statistics.strength += 1;
                break;
            case UserAttribute.Dexterity:
                statistics.dexterity += 1;
                break;
            case UserAttribute.Constitution:
                statistics.constitution += 1;
                break;
            case UserAttribute.Spirit:
                statistics.spirit += 1;
                break;
        }
        statistics.attributePoints -= 1;
        await this.statisticsRepository.update(statistics);
        return statistics;
    }

    async getUserBattleStatistics(userId: string, equipment: Item[]): Promise<BattleStatistics> {
        const statistics = await this.getStatistics(userId);

        const equipmentStatistics = defineBattleStatistics({});
        for (const item of equipment) {
            this.addEquipmentStatistics(equipmentStatistics, item);
        }

        const battleStatistics: BattleStatistics = {
            speed: UtilsService.round(
                0.05 * statistics.dexterity + equipmentStatistics.speed,
                this.statisticPrecision,
            ),
            maxHealthPoints: 0,
            healthPoints: UtilsService.round(
                1.5 * statistics.strength + 0.5 * statistics.constitution + equipmentStatistics.healthPoints,
                this.statisticPrecision,
            ),
            maxManaPoints: 0,
            manaPoints: UtilsService.round(
                0.5 * statistics.spirit + 0.1 * statistics.constitution + equipmentStatistics.manaPoints,
                this.statisticPrecision,
            ),
            maxEnergyPoints: 0,
            energyPoints: UtilsService.round(
                0.2 * statistics.strength +
                    0.2 * statistics.dexterity +
                    0.1 * statistics.constitution +
                    equipmentStatistics.energyPoints,
                this.statisticPrecision,
            ),
            physicalAttack: UtilsService.round(
                0.3 * statistics.strength + 0.1 * statistics.dexterity + equipmentStatistics.physicalAttack,
                this.statisticPrecision,
            ),
            magicalAttack: UtilsService.round(
                0.3 * statistics.spirit + 0.1 * statistics.constitution + equipmentStatistics.magicalAttack,
                this.statisticPrecision,
            ),
            physicalDefense: UtilsService.round(
                0.1 * statistics.strength + 0.05 * statistics.dexterity + equipmentStatistics.physicalDefense,
                this.statisticPrecision,
            ),
            magicalDefense: UtilsService.round(
                0.1 * statistics.spirit + 0.05 * statistics.constitution + equipmentStatistics.magicalDefense,
                this.statisticPrecision,
            ),
            physicalAbsorption: UtilsService.round(
                equipmentStatistics.physicalAbsorption,
                this.statisticPrecision,
            ),
            magicalAbsorption: UtilsService.round(
                equipmentStatistics.magicalAbsorption,
                this.statisticPrecision,
            ),
            criticalChance: UtilsService.round(equipmentStatistics.criticalChance, this.statisticPrecision),
            physicalCriticalPower: UtilsService.round(
                1.25 + equipmentStatistics.physicalCriticalPower,
                this.statisticPrecision,
            ),
            magicalCriticalPower: UtilsService.round(
                1.25 + equipmentStatistics.magicalCriticalPower,
                this.statisticPrecision,
            ),
            punctureChance: UtilsService.round(equipmentStatistics.punctureChance, this.statisticPrecision),
            dodgeChance: UtilsService.round(
                (0.5 * statistics.dexterity) /
                    (statistics.strength + statistics.constitution + statistics.spirit) +
                    equipmentStatistics.dodgeChance,
                this.statisticPrecision,
            ),
            parryChance: UtilsService.round(equipmentStatistics.parryChance, this.statisticPrecision),
            blockChance: UtilsService.round(equipmentStatistics.blockChance, this.statisticPrecision),
            blockPower: UtilsService.round(equipmentStatistics.blockPower, this.statisticPrecision),
            counterChance: UtilsService.round(equipmentStatistics.counterChance, this.statisticPrecision),
            healthRegen: UtilsService.round(equipmentStatistics.healthRegen, this.statisticPrecision),
            manaRegen: UtilsService.round(equipmentStatistics.manaRegen, this.statisticPrecision),
            energyRegen: UtilsService.round(equipmentStatistics.energyRegen, this.statisticPrecision),
        };

        for (const property of this.getPassiveSkillProperties(statistics.learnedSkills)) {
            this.applyProperty(battleStatistics, property);
        }

        battleStatistics.maxHealthPoints = battleStatistics.healthPoints;
        battleStatistics.maxManaPoints = battleStatistics.manaPoints;
        battleStatistics.maxEnergyPoints = battleStatistics.energyPoints;

        return battleStatistics;
    }

    private addEquipmentStatistics(total: BattleStatistics, item: Item): void {
        if (item.statistics === null) {
            return;
        }
        const stats = item.statistics;
        total.speed += stats.speed;
        total.healthPoints += stats.healthPoints;
        total.manaPoints += stats.manaPoints;
        total.energyPoints += stats.energyPoints;
        total.physicalAttack += stats.physicalAttack;
        total.magicalAttack += stats.magicalAttack;
        total.physicalDefense += stats.physicalDefense;
        total.magicalDefense += stats.magicalDefense;
        total.physicalAbsorption += stats.physicalAbsorption;
        total.magicalAbsorption += stats.magicalAbsorption;
        total.criticalChance += stats.criticalChance;
        total.physicalCriticalPower += stats.physicalCriticalPower;
        total.magicalCriticalPower += stats.magicalCriticalPower;
        total.punctureChance += stats.punctureChance;
        total.dodgeChance += stats.dodgeChance;
        total.parryChance += stats.parryChance;
        total.blockChance += stats.blockChance;
        total.blockPower += stats.blockPower;
        total.counterChance += stats.counterChance;
        total.healthRegen += stats.healthRegen;
        total.manaRegen += stats.manaRegen;
        total.energyRegen += stats.energyRegen;
    }

    private getPassiveSkillProperties(learnedSkills: LearnedSkill[]): SkillProperty[] {
        const properties: SkillProperty[] = [];
        for (const learnedSkill of learnedSkills) {
            const skill = getSkill(learnedSkill.guid);
            if (!skill.isPassive) {
                continue;
            }
            properties.push(...skill.selfProperties[learnedSkill.level - 1]);
        }
        return properties;
    }

    private applyProperty(statistics: BattleStatistics, property: SkillProperty): void {
        switch (property.type) {
            case SkillPropertyType.Initiative:
                statistics.speed = this.applyPropertyValue(statistics.speed, property);
                break;
            case SkillPropertyType.PhysicalAttack:
                statistics.physicalAttack = this.applyPropertyValue(statistics.physicalAttack, property);
                break;
            case SkillPropertyType.MagicalAttack:
                statistics.magicalAttack = this.applyPropertyValue(statistics.magicalAttack, property);
                break;
            case SkillPropertyType.PhysicalDefense:
                statistics.physicalDefense = this.applyPropertyValue(statistics.physicalDefense, property);
                break;
            case SkillPropertyType.MagicalDefense:
                statistics.magicalDefense = this.applyPropertyValue(statistics.magicalDefense, property);
                break;
            case SkillPropertyType.HealthPoints:
                statistics.healthPoints = this.applyPropertyValue(statistics.healthPoints, property);
                break;
            case SkillPropertyType.ManaPoints:
                statistics.manaPoints = this.applyPropertyValue(statistics.manaPoints, property);
                break;
            case SkillPropertyType.EnergyPoints:
                statistics.energyPoints = this.applyPropertyValue(statistics.energyPoints, property);
                break;
            case SkillPropertyType.CriticalChance:
                statistics.criticalChance = this.applyPropertyValue(statistics.criticalChance, property);
                break;
            case SkillPropertyType.PhysicalCriticalPower:
                statistics.physicalCriticalPower = this.applyPropertyValue(
                    statistics.physicalCriticalPower,
                    property,
                );
                break;
            case SkillPropertyType.MagicalCriticalPower:
                statistics.magicalCriticalPower = this.applyPropertyValue(
                    statistics.magicalCriticalPower,
                    property,
                );
                break;
            case SkillPropertyType.PunctureChance:
                statistics.punctureChance = this.applyPropertyValue(statistics.punctureChance, property);
                break;
            case SkillPropertyType.DodgeChance:
                statistics.dodgeChance = this.applyPropertyValue(statistics.dodgeChance, property);
                break;
            case SkillPropertyType.ParryChance:
                statistics.parryChance = this.applyPropertyValue(statistics.parryChance, property);
                break;
            case SkillPropertyType.BlockChance:
                statistics.blockChance = this.applyPropertyValue(statistics.blockChance, property);
                break;
            case SkillPropertyType.BlockPower:
                statistics.blockPower = this.applyPropertyValue(statistics.blockPower, property);
                break;
            case SkillPropertyType.CounterChance:
                statistics.counterChance = this.applyPropertyValue(statistics.counterChance, property);
                break;
            case SkillPropertyType.HealthRegen:
                statistics.healthRegen = this.applyPropertyValue(statistics.healthRegen, property);
                break;
            case SkillPropertyType.ManaRegen:
                statistics.manaRegen = this.applyPropertyValue(statistics.manaRegen, property);
                break;
            case SkillPropertyType.PhysicalDeflect:
                statistics.physicalAbsorption = this.applyPropertyValue(
                    statistics.physicalAbsorption,
                    property,
                );
                break;
            case SkillPropertyType.MagicalDeflect:
                statistics.magicalAbsorption = this.applyPropertyValue(
                    statistics.magicalAbsorption,
                    property,
                );
                break;
            default:
                throw new HttpError("errors.dev.invalidSkillProperty");
        }
    }

    private applyPropertyValue(value: number, property: SkillProperty): number {
        switch (property.effect) {
            case SkillPropertyEffect.Additive:
                return value + property.value;
            case SkillPropertyEffect.Multiplicative:
                return value * property.value;
            default:
                throw new HttpError("errors.dev.invalidSkillProperty");
        }
    }
}
