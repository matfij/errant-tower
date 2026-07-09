import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { appConfig } from '../../common/config';

export enum MoveDirection {
    Up = 1,
    Down = 2,
    Left = 3,
    Right = 4,
}

export interface MoveRequest {
    direction: MoveDirection;
}

export interface MoveResponse {
    x: number;
    y: number;
}

export class ExpeditionHub {
    private static connection = new HubConnectionBuilder()
        .withUrl(`${appConfig.baseUrl}/hubs/expedition`, { withCredentials: true })
        .withAutomaticReconnect()
        .build();

    static async connect() {
        if (this.connection.state === HubConnectionState.Disconnected) {
            await this.connection.start();
        }
    }

    static async move(direction: MoveDirection) {
        if (this.connection.state === HubConnectionState.Connected) {
            await this.connection.invoke('Move', { direction });
        }
    }

    static onPlayerMoved(handler: (event: MoveResponse) => void) {
        this.connection.on('moved', handler);
    }

    static offPlayerMoved(handler: (event: MoveResponse) => void) {
        this.connection.off('moved', handler);
    }

    static async disconnect() {
        if (this.connection.state !== HubConnectionState.Disconnected) {
            await this.connection.stop();
        }
    }
}
