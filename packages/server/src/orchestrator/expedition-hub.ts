import {
    MoveDirection,
    type ExpeditionErrorMessage,
    type ExpeditionSummary,
    type MoveResult,
    type MovedMessage,
} from "@errant/shared";
import type { WebSocket } from "@fastify/websocket";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { HttpError } from "../common/http/errors.ts";
import { LogService } from "../common/log.ts";
import type { ExpeditionSessionManager } from "../domains/expedition/expedition-session.ts";
import { AuthSessionService } from "./auth-session-service.ts";
import type { ExpeditionMoveOrchestrator } from "./expedition-move-orchestrator.ts";

export class ExpeditionHub {
    private readonly expeditionMoveService: ExpeditionMoveOrchestrator;
    private readonly expeditionSessionManager: ExpeditionSessionManager;
    private readonly authSessionService: AuthSessionService;
    private readonly corsOrigins: string[];

    constructor(
        expeditionMoveService: ExpeditionMoveOrchestrator,
        expeditionSessionManager: ExpeditionSessionManager,
        authSessionService: AuthSessionService,
        corsOrigins: string[],
    ) {
        this.expeditionMoveService = expeditionMoveService;
        this.expeditionSessionManager = expeditionSessionManager;
        this.authSessionService = authSessionService;
        this.corsOrigins = corsOrigins;
    }

    register(app: FastifyInstance): void {
        app.get("/hubs/expedition", { websocket: true }, (socket, request) => {
            socket.on("error", (error: Error) => {
                LogService.error({ err: error }, "Expedition socket failed");
            });
            void this.open(socket, request);
        });
    }

    private async open(socket: WebSocket, request: FastifyRequest): Promise<void> {
        if (!this.isAllowedOrigin(request)) {
            socket.close();
            return;
        }

        try {
            const user = await this.authSessionService.authenticate(request);
            socket.on("message", (data: unknown) => {
                void this.onMessage(socket, request, data);
            });
            socket.on("close", () => {
                void this.onClose(user.id);
            });
        } catch (error: unknown) {
            if (!(error instanceof HttpError)) {
                LogService.error({ err: error }, "Expedition socket failed");
            }
            socket.close();
        }
    }

    private async onMessage(socket: WebSocket, request: FastifyRequest, data: unknown): Promise<void> {
        let userId: string;
        try {
            const user = await this.authSessionService.authenticate(request);
            userId = user.id;
        } catch (error: unknown) {
            if (!(error instanceof HttpError)) {
                LogService.error({ err: error }, "Expedition socket failed");
            }
            this.send(socket, { type: "error", key: "errors.unauthorized" });
            socket.close();
            return;
        }

        const command = readMoveCommand(data);
        if (!command.ok) {
            this.send(socket, { type: "error", key: command.key });
            return;
        }

        try {
            const result = await this.expeditionMoveService.move(userId, command.direction);
            this.send(socket, toMovedMessage(result));
        } catch (error: unknown) {
            LogService.error({ err: error, userId }, "Move failed");
            const key = error instanceof HttpError ? error.message : "errors.expeditionMoveFailed";
            this.send(socket, { type: "error", key });
        }
    }

    private async onClose(userId: string): Promise<void> {
        try {
            await this.expeditionSessionManager.persist(userId);
            this.expeditionSessionManager.remove(userId);
        } catch (error: unknown) {
            LogService.error({ err: error, userId }, "Expedition persist failed");
        }
    }

    private isAllowedOrigin(request: FastifyRequest): boolean {
        const origin = request.headers.origin;
        return typeof origin === "string" && this.corsOrigins.includes(origin);
    }

    private send(socket: WebSocket, message: MovedMessage | ExpeditionErrorMessage): void {
        if (socket.readyState !== socket.OPEN) {
            return;
        }
        socket.send(JSON.stringify(message));
    }
}

type MoveCommand = { ok: true; direction: MoveDirection } | { ok: false; key: string };

const readMoveCommand = (data: unknown): MoveCommand => {
    const text = readText(data);
    if (text === null) {
        return { ok: false, key: "errors.validation" };
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(text);
    } catch {
        return { ok: false, key: "errors.validation" };
    }
    if (parsed === null || typeof parsed !== "object") {
        return { ok: false, key: "errors.validation" };
    }

    const message = parsed as Record<string, unknown>;
    if (message.type !== "move") {
        return { ok: false, key: "errors.validation" };
    }
    if (!isMoveDirection(message.direction)) {
        return { ok: false, key: "errors.invalidMoveDirection" };
    }
    return { ok: true, direction: message.direction };
};

const isMoveDirection = (value: unknown): value is MoveDirection => {
    return (
        value === MoveDirection.Up ||
        value === MoveDirection.Down ||
        value === MoveDirection.Left ||
        value === MoveDirection.Right
    );
};

const readText = (data: unknown): string | null => {
    if (typeof data === "string") {
        return data;
    }
    if (Buffer.isBuffer(data)) {
        return data.toString("utf8");
    }
    if (data instanceof ArrayBuffer) {
        return Buffer.from(data).toString("utf8");
    }
    if (Array.isArray(data) && data.every((item) => Buffer.isBuffer(item))) {
        return Buffer.concat(data).toString("utf8");
    }
    return null;
};

const toMovedMessage = (result: MoveResult): MovedMessage => {
    return {
        type: "moved",
        x: result.x,
        y: result.y,
        initiative: result.initiative,
        battleId: result.battleId,
        summary: result.summary === null ? null : toSummary(result.summary),
    };
};

const toSummary = (summary: ExpeditionSummary): ExpeditionSummary => {
    return {
        isSuccess: summary.isSuccess,
        hasFinished: summary.hasFinished,
        gainedSilver: summary.gainedSilver,
        gainedItems: summary.gainedItems.map((item) => ({
            itemGuid: item.itemGuid,
            quantity: item.quantity,
        })),
        gainedAttributePoints: summary.gainedAttributePoints,
        gainedSkillPoints: summary.gainedSkillPoints,
    };
};
