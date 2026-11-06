import { StatisticsService } from "../domains/statistics/statistics-service.ts";
import type { UserEntity } from "../domains/users/user-entity.ts";
import { UserService } from "../domains/users/user-service.ts";

export class AuthOrchestrator {
    private readonly userService: UserService;
    private readonly statisticsService: StatisticsService;

    constructor(userService: UserService, statisticsService: StatisticsService) {
        this.userService = userService;
        this.statisticsService = statisticsService;
    }

    async startSignUp(email: string, username: string): Promise<void> {
        await this.userService.startSignUp(email, username);
    }

    async completeSignUp(email: string, actionCode: string): Promise<UserEntity> {
        const user = await this.userService.completeSignUp(email, actionCode);
        // await this.progressService.createInitial(user.id, user.username);
        await this.statisticsService.createInitial(user.id);
        // await this.equipmentService.createInitial(user.id);
        return user;
    }

    async startSignIn(email: string): Promise<void> {
        await this.userService.startSignIn(email);
    }

    async completeSignIn(email: string, actionCode: string): Promise<UserEntity> {
        return this.userService.completeSignIn(email, actionCode);
    }
}
