import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { Double, Int32, Long } from "mongodb";

import { initialCharacterDocuments, userDocument, userFromDocument } from "./documents.ts";
import type { UserRecord } from "./user-store.ts";

const user: UserRecord = {
    id: "user-1",
    email: "ada@example.com",
    username: "ada",
    actionCodeHash: "hash",
    actionCodeExpiresAt: 1_700_000_000_000,
    actionCodeAttempts: 1,
    isConfirmed: false,
    sessionId: null,
};

describe("user documents", () => {
    it("stores PascalCase fields and a millisecond timestamp as Int64", () => {
        const document = userDocument(user);

        assert.equal(document._id, "user-1");
        assert.equal(document.Email, "ada@example.com");
        assert.equal(document.Username, "ada");
        assert.equal(document.ActionCodeHash, "hash");
        assert.ok(document.ActionCodeExpiresAt instanceof Long);
        assert.equal((document.ActionCodeExpiresAt as Long).toNumber(), 1_700_000_000_000);
        assert.ok(document.ActionCodeAttempts instanceof Int32);
        assert.equal(document.IsConfirmed, false);
        assert.equal("SessionId" in document, false);
        assert.deepEqual(userFromDocument(document), user);
    });

    it("keeps the session id when one is set", () => {
        const document = userDocument({ ...user, sessionId: "session-1", isConfirmed: true });
        assert.equal(document.SessionId, "session-1");
    });
});

describe("initial character documents", () => {
    it("matches the C# sign-up inserts", () => {
        const documents = initialCharacterDocuments("user-1", "ada", {
            progressId: "progress-1",
            statisticsId: "statistics-1",
            equipmentId: "equipment-1",
        });

        assert.equal(documents.progress._id, "progress-1");
        assert.equal(documents.progress.UserId, "user-1");
        assert.equal(documents.progress.Username, "ada");
        assert.equal((documents.progress.UnlockedFloor as Int32).valueOf(), 0);
        assert.equal((documents.progress.UnlockedDomain as Int32).valueOf(), 1);
        assert.equal((documents.progress.Stamina as Int32).valueOf(), 3);
        assert.equal(documents.progress.IsInExpedition, false);
        assert.ok(documents.progress.MaxHealth instanceof Double);
        assert.deepEqual(documents.progress.FloorTiles, []);
        assert.deepEqual(documents.progress.GainedItems, []);

        assert.equal((documents.statistics.AttributePoints as Int32).valueOf(), 10);
        assert.equal((documents.statistics.Strength as Int32).valueOf(), 10);
        assert.deepEqual(documents.statistics.LearnedSkills, []);

        const bag = documents.equipment.Bag as { ItemGuid: Int32; Quantity: Int32 }[];
        assert.deepEqual(
            bag.map((item) => item.ItemGuid.valueOf()),
            [101, 107, 107, 108, 104, 105],
        );
        assert.equal(documents.equipment.Headgear, null);
        assert.equal((documents.equipment.Silver as Int32).valueOf(), 0);
    });
});
