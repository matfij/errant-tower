import type { Collection } from "mongodb";

import { HttpError } from "../../common/http/errors.ts";
import { MongoRepository, type DocumentOf } from "../../db/mongo-repository.ts";
import type { StatisticsEntity } from "./statistics-entity.ts";

export class StatisticsRepository extends MongoRepository<StatisticsEntity> {
    constructor(collection: Collection<DocumentOf<StatisticsEntity>>) {
        super(collection, () => new HttpError("errors.statisticsNotFound"));
    }
}
