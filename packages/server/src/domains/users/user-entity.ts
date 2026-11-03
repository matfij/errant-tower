export type UserEntity = {
    id: string;
    email: string;
    username: string;
    actionCodeHash: string | null;
    actionCodeExpiresAt: number | null;
    actionCodeAttempts: number | null;
    isConfirmed: boolean;
    sessionId: string | null;
};
