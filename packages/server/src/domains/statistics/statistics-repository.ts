import { Int32, Long, type Collection } from "mongodb";

import { HttpError } from "../../common/http/errors.ts";
import { readNumber, toInt32 } from "../../db/db-utils.ts";
import type { SkillGuid } from "../skills/skill-definition.ts";
import type { StatisticsEntity } from "./statistics-entity.ts";

export type StatisticsDocument = {
    _id: string;
    UserId: string;
    AttributePoints: Int32 | number;
    SkillPoints: Int32 | number;
    Strength: Int32 | number;
    Dexterity: Int32 | number;
    Constitution: Int32 | number;
    Spirit: Int32 | number;
    LearnedSkills?: LearnedSkillDocument[];
};

export type LearnedSkillDocument = {
    Guid: SkillGuid;
    Level: Int32 | number;
};

export type StatisticsRepository = {
    create(statistics: StatisticsEntity): Promise<void>;
    readByUserId(userId: string): Promise<StatisticsEntity | null>;
    update(statistics: StatisticsEntity): Promise<void>;
};

export class MongoStatisticsRepository implements StatisticsRepository {
    private readonly statisticsCollection: Collection<StatisticsDocument>;

    constructor(statisticsCollection: Collection<StatisticsDocument>) {
        this.statisticsCollection = statisticsCollection;
    }

    async create(statistics: StatisticsEntity): Promise<void> {
        await this.statisticsCollection.insertOne(MongoStatisticsRepository.toStatisticsDocument(statistics));
    }

    async readByUserId(userId: string): Promise<StatisticsEntity | null> {
        const document = await this.statisticsCollection.findOne({ UserId: userId });
        return document === null ? null : MongoStatisticsRepository.toStatisticsEntity(document);
    }

    async update(statistics: StatisticsEntity): Promise<void> {
        const result = await this.statisticsCollection.replaceOne(
            { _id: statistics.id },
            MongoStatisticsRepository.toStatisticsDocument(statistics),
        );
        if (result.matchedCount === 0) {
            throw new HttpError("errors.statisticsNotFound");
        }
    }

    private static toStatisticsDocument(statistics: StatisticsEntity): StatisticsDocument {
        return {
            _id: statistics.id,
            UserId: statistics.userId,
            AttributePoints: toInt32(statistics.attributePoints),
            SkillPoints: toInt32(statistics.skillPoints),
            Strength: toInt32(statistics.strength),
            Dexterity: toInt32(statistics.dexterity),
            Constitution: toInt32(statistics.constitution),
            Spirit: toInt32(statistics.spirit),
            LearnedSkills: statistics.learnedSkills.map((skill) => ({
                Guid: skill.guid,
                Level: toInt32(skill.level),
            })),
        };
    }

    private static toStatisticsEntity(document: StatisticsDocument): StatisticsEntity {
        return {
            id: document._id,
            userId: document.UserId,
            attributePoints: MongoStatisticsRepository.readRequired(document.AttributePoints),
            skillPoints: MongoStatisticsRepository.readRequired(document.SkillPoints),
            strength: MongoStatisticsRepository.readRequired(document.Strength),
            dexterity: MongoStatisticsRepository.readRequired(document.Dexterity),
            constitution: MongoStatisticsRepository.readRequired(document.Constitution),
            spirit: MongoStatisticsRepository.readRequired(document.Spirit),
            learnedSkills: (document.LearnedSkills ?? []).map((skill) => ({
                guid: skill.Guid,
                level: MongoStatisticsRepository.readRequired(skill.Level),
            })),
        };
    }

    private static readRequired(value: number | Long | Int32 | null | undefined): number {
        if (value === undefined) {
            throw new HttpError("errors.statisticsNotFound");
        }
        const number = readNumber(value);
        if (number === null) {
            throw new HttpError("errors.statisticsNotFound");
        }
        return number;
    }
}
