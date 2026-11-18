import { AsyncLocalStorage } from "node:async_hooks";

import { type ClientSession, type MongoClient } from "mongodb";

import { config } from "../config.ts";

export class TransactionService {
    private static client: MongoClient | null = null;

    private static readonly active = new AsyncLocalStorage<ClientSession>();

    static bind(client: MongoClient): void {
        this.client = client;
    }

    static currentSession(): ClientSession | undefined {
        return this.active.getStore();
    }

    static async run<T>(work: () => Promise<T>): Promise<T> {
        if (!config.useTransactions) {
            return work();
        }
        const current = this.active.getStore();
        if (current !== undefined) {
            return work();
        }
        const client = this.client;
        if (client === null) {
            throw new Error("Mongo client is not bound");
        }
        return client.withSession((session) => session.withTransaction(() => this.active.run(session, work)));
    }
}

export const transactional = <This, Args extends unknown[], Result>(
    method: (this: This, ...args: Args) => Promise<Result>,
    _context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Result>>,
): ((this: This, ...args: Args) => Promise<Result>) => {
    return function (this: This, ...args: Args): Promise<Result> {
        return TransactionService.run(() => method.call(this, ...args));
    };
};
