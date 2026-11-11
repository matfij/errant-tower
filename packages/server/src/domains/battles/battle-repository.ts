import type { BattleCharacter, BattleSkill } from "@errant/shared";
import { Int32, type Collection } from "mongodb";

import { HttpError } from "../../common/http/errors.ts";
import { toInt32 } from "../../db/db-utils.ts";
import type { BattleEntity } from "./battle-entity.ts";

export type BattleDocument = {
    _id: string;
    UserId: string;
    IsFinished: boolean;
    TurnNumber: Int32 | number;
    User: BattleCharacter;
    Enemy: BattleCharacter;
    Skills: BattleSkill[];
    Logs: string[];
};

export type BattleRepository = {
    create(battle: BattleEntity): Promise<void>;
    readByUserId(userId: string): Promise<BattleEntity | null>;
    update(battle: BattleEntity): Promise<void>;
};

export class MongoBattleRepository implements BattleRepository {
    private readonly battleCollection: Collection<BattleDocument>;

    constructor(battleCollection: Collection<BattleDocument>) {
        this.battleCollection = battleCollection;
    }

    async create(battle: BattleEntity): Promise<void> {
        await this.battleCollection.insertOne(MongoBattleRepository.toBattleDocument(battle));
    }

    async readByUserId(userId: string): Promise<BattleEntity | null> {
        const document = await this.battleCollection.findOne({ UserId: userId });
        return MongoBattleRepository.toBattleEntity(document);
    }

    async update(battle: BattleEntity): Promise<void> {
        const result = await this.battleCollection.replaceOne(
            { _id: battle.id },
            MongoBattleRepository.toBattleDocument(battle),
        );
        if (result.matchedCount === 0) {
            throw new HttpError("errors.battleNotFound");
        }
    }

    private static toBattleDocument(battle: BattleEntity): BattleDocument {
        return {
            _id: battle.id,
            UserId: battle.userId,
            IsFinished: battle.isFinished,
            TurnNumber: toInt32(battle.turnNumber),
            User: battle.user,
            Enemy: battle.enemy,
            Skills: battle.skills,
            Logs: battle.logs,
        };
    }

    private static toBattleEntity(document: BattleDocument | null): BattleEntity | null {
        if (document === null) {
            return null;
        }
        return {
            id: document._id,
            userId: document.UserId,
            isFinished: document.IsFinished,
            turnNumber: document.TurnNumber.valueOf(),
            user: document.User,
            enemy: document.Enemy,
            skills: document.Skills,
            logs: document.Logs,
        };
    }
}
