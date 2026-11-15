import type { Collection } from "mongodb";

import { HttpError } from "../../common/http/errors.ts";
import { MongoRepository, type DocumentOf } from "../../db/mongo-repository.ts";
import type { EquipmentEntity } from "./equipment-entity.ts";

export class EquipmentRepository extends MongoRepository<EquipmentEntity> {
    constructor(collection: Collection<DocumentOf<EquipmentEntity>>) {
        super(collection, () => new HttpError("errors.equipmentNotFound"));
    }
}
