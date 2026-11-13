import { MoveDirection, type MovedMessage } from "@errant/shared";

import { appConfig } from "../../common/config";

type MovedHandler = (message: MovedMessage) => void;
type ReconnectHandler = () => void;

export class ExpeditionHub {
    private static socket: WebSocket | null = null;
    private static reconnectTimer: number | null = null;
    private static hasConnected = false;
    private static movedHandlers: MovedHandler[] = [];
    private static reconnectHandlers: ReconnectHandler[] = [];

    static connect(): void {
        ExpeditionHub.open();
    }

    static move(direction: MoveDirection): void {
        if (ExpeditionHub.socket === null || ExpeditionHub.socket.readyState !== WebSocket.OPEN) {
            return;
        }
        const message = { type: "move", direction };
        ExpeditionHub.socket.send(JSON.stringify(message));
    }

    static onUserMoved(handler: MovedHandler): void {
        ExpeditionHub.movedHandlers.push(handler);
    }

    static offUserMoved(handler: MovedHandler): void {
        ExpeditionHub.movedHandlers = ExpeditionHub.movedHandlers.filter((item) => item !== handler);
    }

    static onReconnect(handler: ReconnectHandler): void {
        ExpeditionHub.reconnectHandlers.push(handler);
    }

    static offReconnect(handler: ReconnectHandler): void {
        ExpeditionHub.reconnectHandlers = ExpeditionHub.reconnectHandlers.filter((item) => item !== handler);
    }

    private static open(): void {
        if (
            ExpeditionHub.socket !== null &&
            (ExpeditionHub.socket.readyState === WebSocket.OPEN ||
                ExpeditionHub.socket.readyState === WebSocket.CONNECTING)
        ) {
            return;
        }

        const socket = new WebSocket(ExpeditionHub.socketUrl());
        ExpeditionHub.socket = socket;
        socket.addEventListener("open", () => {
            if (ExpeditionHub.socket !== socket) {
                return;
            }
            if (ExpeditionHub.hasConnected) {
                for (const handler of ExpeditionHub.reconnectHandlers) {
                    handler();
                }
            }
            ExpeditionHub.hasConnected = true;
        });
        socket.addEventListener("message", (event) => {
            const message = ExpeditionHub.readMoved(event.data);
            if (message === null) {
                return;
            }
            for (const handler of ExpeditionHub.movedHandlers) {
                handler(message);
            }
        });
        socket.addEventListener("close", () => {
            if (ExpeditionHub.socket !== socket) {
                return;
            }
            ExpeditionHub.socket = null;
            ExpeditionHub.scheduleReconnect();
        });
    }

    private static scheduleReconnect(): void {
        if (ExpeditionHub.reconnectTimer !== null) {
            return;
        }
        ExpeditionHub.reconnectTimer = window.setTimeout(() => {
            ExpeditionHub.reconnectTimer = null;
            ExpeditionHub.open();
        }, 1000);
    }

    private static socketUrl(): string {
        const url = new URL("/hubs/expedition", appConfig.baseUrl);
        url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
        return url.toString();
    }

    private static readMoved(data: unknown): MovedMessage | null {
        if (typeof data !== "string") {
            return null;
        }

        let parsed: unknown;
        try {
            parsed = JSON.parse(data);
        } catch {
            return null;
        }
        if (parsed === null || typeof parsed !== "object") {
            return null;
        }

        const message = parsed as MovedMessage;
        if (message.type !== "moved") {
            return null;
        }
        return message;
    }
}
