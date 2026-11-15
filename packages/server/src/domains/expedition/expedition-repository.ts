import type { Collection } from "mongodb";

import { HttpError } from "../../common/http/errors.ts";
import { MongoRepository, type DocumentOf } from "../../db/mongo-repository.ts";
import type { ExpeditionEntity } from "./expedition-entity.ts";

export class ExpeditionRepository extends MongoRepository<ExpeditionEntity> {
    constructor(collection: Collection<DocumentOf<ExpeditionEntity>>) {
        super(collection, () => new HttpError("errors.expeditionNotFound"));
    }
}
