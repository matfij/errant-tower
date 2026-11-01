export type UserRecord = {
    id: string;
    email: string;
    username: string;
    actionCodeHash: string | null;
    actionCodeExpiresAt: number | null;
    actionCodeAttempts: number | null;
    isConfirmed: boolean;
    sessionId: string | null;
};

export class DuplicateUserField extends Error {
    readonly field: "email" | "username";

    constructor(field: "email" | "username") {
        super(field);
        this.field = field;
    }
}

export type UserStore = {
    findById(id: string): Promise<UserRecord | null>;
    findByEmail(email: string): Promise<UserRecord | null>;
    findByUsername(username: string): Promise<UserRecord | null>;
    insert(user: UserRecord): Promise<void>;
    replace(user: UserRecord): Promise<void>;
    delete(id: string): Promise<void>;
    insertInitial(userId: string, username: string): Promise<void>;
};
