import { type ClientSession, type Collection, type Filter, type OptionalUnlessRequiredId, type UpdateFilter } from "mongodb";

import { TransactionService } from "./transaction-service.ts";

export type Entity = {
    id: string;
};

export type DocumentOf<T extends Entity> = Omit<T, "id"> & { _id: string };

export class MongoRepository<T extends Entity> {
    private readonly missing: () => Error;

    protected readonly collection: Collection<DocumentOf<T>>;

    constructor(collection: Collection<DocumentOf<T>>, missing: () => Error) {
        this.collection = collection;
        this.missing = missing;
    }

    async create(entity: T): Promise<void> {
        await this.collection.insertOne(
            this.toDocument(entity) as OptionalUnlessRequiredId<DocumentOf<T>>,
            this.sessionOptions(),
        );
    }

    async readBy<K extends keyof T>(field: K, value: T[K]): Promise<T | null> {
        if (field === "id") {
            return this.findOne(this.byId(value as string));
        }
        return this.findOne({ [field]: value } as Filter<DocumentOf<T>>);
    }

    async update(id: string, patch: Partial<Omit<T, "id">>): Promise<T> {
        const document =
            Object.keys(patch).length === 0
                ? await this.collection.findOne(this.byId(id), this.sessionOptions())
                : await this.collection.findOneAndUpdate(
                      this.byId(id),
                      { $set: patch } as UpdateFilter<DocumentOf<T>>,
                      { returnDocument: "after", ...this.sessionOptions() },
                  );
        if (document === null) {
            throw this.missing();
        }
        return this.toEntity(document as DocumentOf<T>);
    }

    async replace(entity: T): Promise<void> {
        const result = await this.collection.replaceOne(
            this.byId(entity.id),
            this.toDocument(entity) as OptionalUnlessRequiredId<DocumentOf<T>>,
            this.sessionOptions(),
        );
        if (result.matchedCount === 0) {
            throw this.missing();
        }
    }

    async delete(id: string): Promise<void> {
        const result = await this.collection.deleteOne(this.byId(id), this.sessionOptions());
        if (result.deletedCount === 0) {
            throw this.missing();
        }
    }

    protected sessionOptions(): { session?: ClientSession } {
        const session = TransactionService.currentSession();
        if (session === undefined) {
            return {};
        }
        return { session };
    }

    private async findOne(filter: Filter<DocumentOf<T>>): Promise<T | null> {
        const document = await this.collection.findOne(filter, this.sessionOptions());
        if (document === null) {
            return null;
        }
        return this.toEntity(document as DocumentOf<T>);
    }

    private byId(id: string): Filter<DocumentOf<T>> {
        return { _id: id } as Filter<DocumentOf<T>>;
    }

    private toDocument<T extends Entity>(entity: T): DocumentOf<T> {
        const { id, ...fields } = entity;
        return { _id: id, ...fields };
    }

    private toEntity<T extends Entity>(document: DocumentOf<T>): T {
        const { _id, ...fields } = document;
        return { id: _id, ...fields } as unknown as T;
    }
}
