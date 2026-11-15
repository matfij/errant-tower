import type { Collection } from "mongodb";

import { HttpError } from "../../common/http/errors.ts";
import { MongoRepository, type DocumentOf } from "../../db/mongo-repository.ts";
import type { BattleEntity } from "./battle-entity.ts";

export class BattleRepository extends MongoRepository<BattleEntity> {
    constructor(collection: Collection<DocumentOf<BattleEntity>>) {
        super(collection, () => new HttpError("errors.battleNotFound"));
    }
}
