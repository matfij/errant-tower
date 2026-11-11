import { SkillPath, type BattleSkill, type Skill, type SkillGuid } from "@errant/shared";

import { HttpError } from "../../common/http/errors.ts";
import { skillLevel } from "../skills/skill-definition.ts";
import { getAllSkills, getSkill } from "../skills/skill-registry.ts";
import type { SkillTree } from "./statistics-definition.ts";
import type { StatisticsEntity } from "./statistics-entity.ts";
import type { StatisticsRepository } from "./statistics-repository.ts";

export class SkillsService {
    private readonly pathField = {
        [SkillPath.Blade]: "blade",
        [SkillPath.Tenacity]: "tenacity",
        [SkillPath.Hammer]: "hammer",
        [SkillPath.Bellicosity]: "bellicosity",
        [SkillPath.Lance]: "lance",
        [SkillPath.Vivacity]: "vivacity",
        [SkillPath.Bow]: "bow",
        [SkillPath.Perspicacity]: "perspicacity",
        [SkillPath.Staff]: "staff",
        [SkillPath.Sagacity]: "sagacity",
    } as const;

    private readonly statisticsRepository: StatisticsRepository;

    constructor(statisticsRepository: StatisticsRepository) {
        this.statisticsRepository = statisticsRepository;
    }

    async getSkillTree(userId: string): Promise<SkillTree> {
        const statistics = await this.readStatistics(userId);
        const levelByGuid = new Map(statistics.learnedSkills.map((skill) => [skill.guid, skill.level]));
        const paths = this.emptyPaths();

        for (const skill of getAllSkills()) {
            if (skill.path === SkillPath.None) {
                continue;
            }
            paths[this.pathField[skill.path]].push({
                skill,
                level: levelByGuid.get(skill.guid) ?? 0,
            });
        }

        return {
            skillPoints: statistics.skillPoints,
            paths,
        };
    }

    async getActiveSkills(userId: string): Promise<BattleSkill[]> {
        const statistics = await this.readStatistics(userId);
        const skills: BattleSkill[] = [];
        for (const learnedSkill of statistics.learnedSkills) {
            const skill = getSkill(learnedSkill.guid);
            if (skill.isPassive) {
                continue;
            }
            skills.push(this.toBattleSkill(skill, learnedSkill.level));
        }
        return skills;
    }

    async learnSkill(userId: string, skillGuid: SkillGuid): Promise<SkillTree> {
        const statistics = await this.readStatistics(userId);
        const targetSkill = statistics.learnedSkills.find((skill) => skill.guid === skillGuid) ?? null;
        const targetSkillData = getSkill(skillGuid);

        if (statistics.skillPoints < 1) {
            throw new HttpError("errors.insufficientSkillPoints");
        }
        if (targetSkillData.path === SkillPath.None) {
            throw new HttpError("errors.cantLearnThisSkill");
        }
        if (targetSkill !== null) {
            if (targetSkill.level >= skillLevel.max) {
                throw new HttpError("errors.skillAlreadyLearned");
            }
            targetSkill.level += 1;
        } else {
            for (const requirement of targetSkillData.requirements) {
                if (this.pathPoints(statistics, requirement.path) < requirement.points) {
                    throw new HttpError("errors.skillRequirementsNotMet");
                }
            }
            statistics.learnedSkills.push({ guid: skillGuid, level: 1 });
        }

        statistics.skillPoints -= 1;
        await this.statisticsRepository.update(statistics);
        return this.getSkillTree(userId);
    }

    async resetSkills(userId: string): Promise<SkillTree> {
        const statistics = await this.readStatistics(userId);
        const restoredPoints = statistics.learnedSkills.reduce((total, skill) => total + skill.level, 0);
        statistics.learnedSkills = [];
        statistics.skillPoints += restoredPoints;
        await this.statisticsRepository.update(statistics);
        return this.getSkillTree(userId);
    }

    private toBattleSkill(skill: Skill, level: number): BattleSkill {
        const index = level - 1;
        return {
            guid: skill.guid,
            name: skill.name,
            description: skill.description,
            imageUrl: skill.imageUrl,
            path: skill.path,
            types: skill.types,
            physicalAttackFactor: skill.physicalAttackFactor[index],
            magicalAttackFactor: skill.magicalAttackFactor[index],
            physicalDefenseFactor: skill.physicalDefenseFactor[index],
            magicalDefenseFactor: skill.magicalDefenseFactor[index],
            isPassive: skill.isPassive,
            targetSelf: skill.targetSelf,
            hitCount: skill.hitCount[index],
            energyCost: skill.energyCost[index],
            manaCost: skill.manaCost[index],
            targetEffects: skill.targetEffects.map((effect) => ({
                type: effect.type,
                value: effect.values[index],
                chance: effect.chances[index],
                duration: effect.durations[index],
            })),
            selfEffects: skill.selfEffects.map((effect) => ({
                type: effect.type,
                value: effect.values[index],
                chance: effect.chances[index],
                duration: effect.durations[index],
            })),
            targetProperties: skill.targetProperties.map((property) => ({
                effect: property.effect,
                type: property.type,
                value: property.values[index],
                duration: property.duration,
            })),
            selfProperties: skill.selfProperties.map((property) => ({
                effect: property.effect,
                type: property.type,
                value: property.values[index],
                duration: property.duration,
            })),
            requirements: skill.requirements.map((requirement) => ({
                path: requirement.path,
                points: requirement.points,
            })),
        };
    }

    private emptyPaths(): SkillTree["paths"] {
        return {
            blade: [],
            tenacity: [],
            hammer: [],
            bellicosity: [],
            lance: [],
            vivacity: [],
            bow: [],
            perspicacity: [],
            staff: [],
            sagacity: [],
        };
    }

    private pathPoints(statistics: StatisticsEntity, path: SkillPath): number {
        const levelByGuid = new Map(statistics.learnedSkills.map((skill) => [skill.guid, skill.level]));
        return getAllSkills()
            .filter((skill) => skill.path === path)
            .reduce((total, skill) => total + (levelByGuid.get(skill.guid) ?? 0), 0);
    }

    private async readStatistics(userId: string): Promise<StatisticsEntity> {
        const statistics = await this.statisticsRepository.readByUserId(userId);
        if (statistics === null) {
            throw new HttpError("errors.statisticsNotFound");
        }
        return statistics;
    }
}
