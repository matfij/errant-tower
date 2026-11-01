import { Double, Int32, Long } from "mongodb";

import type { UserRecord } from "./user-store.ts";

export type StoredDocument = {
    _id: string;
    [key: string]: unknown;
};

const ITEM_WOODEN_SWORD = 101;
const ITEM_WOODEN_BOW = 104;
const ITEM_WOODEN_STAFF = 105;
const ITEM_LEATHER_ARMOR = 107;
const ITEM_LEATHER_BOOTS = 108;

const FLOOR_1 = 0;
const DOMAIN_DUNGEON = 1;

const integer = (value: number) => new Int32(value);

export function userDocument(user: UserRecord): StoredDocument {
    const document: StoredDocument = {
        _id: user.id,
        Email: user.email,
        Username: user.username,
        ActionCodeHash: user.actionCodeHash,
        ActionCodeExpiresAt:
            user.actionCodeExpiresAt === null ? null : Long.fromNumber(user.actionCodeExpiresAt),
        ActionCodeAttempts: user.actionCodeAttempts === null ? null : integer(user.actionCodeAttempts),
        IsConfirmed: user.isConfirmed,
    };

    if (user.sessionId !== null) {
        document.SessionId = user.sessionId;
    }

    return document;
}

export function userFromDocument(document: StoredDocument): UserRecord {
    return {
        id: String(document._id),
        email: String(document.Email),
        username: String(document.Username),
        actionCodeHash: absent(document.ActionCodeHash) ? null : String(document.ActionCodeHash),
        actionCodeExpiresAt: readLong(document.ActionCodeExpiresAt),
        actionCodeAttempts: absent(document.ActionCodeAttempts) ? null : Number(document.ActionCodeAttempts),
        isConfirmed: document.IsConfirmed === true,
        sessionId: absent(document.SessionId) ? null : String(document.SessionId),
    };
}

export type CharacterIds = {
    progressId: string;
    statisticsId: string;
    equipmentId: string;
};

export function initialCharacterDocuments(userId: string, username: string, ids: CharacterIds) {
    const progress: StoredDocument = {
        _id: ids.progressId,
        UserId: userId,
        Username: username,
        UnlockedFloor: integer(FLOOR_1),
        UnlockedDomain: integer(DOMAIN_DUNGEON),
        Stamina: integer(3),
        IsInExpedition: false,
        CurrentFloor: integer(0),
        Initiative: integer(0),
        MaxInitiative: integer(0),
        Adrenaline: integer(0),
        BattleId: null,
        GainedSilver: integer(0),
        GainedItems: [],
        MaxHealth: new Double(0),
        Health: new Double(0),
        MaxMana: new Double(0),
        Mana: new Double(0),
        MaxEnergy: new Double(0),
        Energy: new Double(0),
        X: integer(0),
        Y: integer(0),
        FloorTiles: [],
    };

    const statistics: StoredDocument = {
        _id: ids.statisticsId,
        UserId: userId,
        AttributePoints: integer(10),
        SkillPoints: integer(10),
        Strength: integer(10),
        Dexterity: integer(10),
        Constitution: integer(10),
        Spirit: integer(10),
        LearnedSkills: [],
    };

    const equipment: StoredDocument = {
        _id: ids.equipmentId,
        UserId: userId,
        Silver: integer(0),
        Bag: [
            bagItem(ITEM_WOODEN_SWORD),
            bagItem(ITEM_LEATHER_ARMOR),
            bagItem(ITEM_LEATHER_ARMOR),
            bagItem(ITEM_LEATHER_BOOTS),
            bagItem(ITEM_WOODEN_BOW),
            bagItem(ITEM_WOODEN_STAFF),
        ],
        Headgear: null,
        Armor: null,
        Footwear: null,
        Charm: null,
        RightHand: null,
        LeftHand: null,
    };

    return { progress, statistics, equipment };
}

function bagItem(itemGuid: number): { ItemGuid: Int32; Quantity: Int32 } {
    return {
        ItemGuid: integer(itemGuid),
        Quantity: integer(1),
    };
}

function absent(value: unknown): value is null | undefined {
    return value === null || value === undefined;
}

function readLong(value: unknown): number | null {
    if (absent(value)) {
        return null;
    }
    if (typeof value === "number") {
        return value;
    }
    if (typeof value === "bigint") {
        return Number(value);
    }
    if (value instanceof Long) {
        return value.toNumber();
    }
    if (typeof value === "object" && "toNumber" in value && typeof value.toNumber === "function") {
        return Number(value.toNumber());
    }
    return null;
}
