import type { Collection } from "mongodb";

import { MongoRepository, type DocumentOf } from "../../db/mongo-repository.ts";
import type { UserEntity } from "./user-entity.ts";

export class UserRepository extends MongoRepository<UserEntity> {
    constructor(collection: Collection<DocumentOf<UserEntity>>) {
        super(collection, () => new Error("errors.userUpdateFailed"));
    }

    override async delete(id: string): Promise<void> {
        const result = await this.collection.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            throw new Error("errors.userDeleteFailed");
        }
    }
}
