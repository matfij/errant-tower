import { HttpError } from "../../common/http/errors.ts";
import type { ExpeditionEntity } from "./expedition-entity.ts";
import type { ExpeditionRepository } from "./expedition-repository.ts";

export class ExpeditionSessionManager {
    private readonly sessions = new Map<string, ExpeditionEntity>();
    private readonly pending = new Map<string, Promise<ExpeditionEntity>>();

    private readonly expeditionRepository: ExpeditionRepository;

    constructor(expeditionRepository: ExpeditionRepository) {
        this.expeditionRepository = expeditionRepository;
    }

    async create(userId: string): Promise<ExpeditionEntity> {
        const existing = this.sessions.get(userId) ?? null;
        if (existing !== null) {
            return existing;
        }

        const pending = this.pending.get(userId) ?? null;
        if (pending !== null) {
            return pending;
        }

        const loading = this.load(userId);
        this.pending.set(userId, loading);
        try {
            return await loading;
        } finally {
            this.pending.delete(userId);
        }
    }

    async persist(userId: string): Promise<void> {
        const expedition = this.sessions.get(userId) ?? null;
        if (expedition === null) {
            return;
        }
        await this.expeditionRepository.update(expedition);
    }

    remove(userId: string): void {
        this.sessions.delete(userId);
    }

    private async load(userId: string): Promise<ExpeditionEntity> {
        const expedition = await this.expeditionRepository.readByUserId(userId);
        if (expedition === null || !expedition.isInExpedition) {
            throw new HttpError("errors.expeditionNotStarted");
        }

        const raced = this.sessions.get(userId) ?? null;
        if (raced !== null) {
            return raced;
        }
        this.sessions.set(userId, expedition);
        return expedition;
    }
}
