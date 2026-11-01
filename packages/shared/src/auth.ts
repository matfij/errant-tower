export type ApiErrorItem = {
    key: string;
    field?: string;
};

export type ApiErrorResponse = {
    errors: ApiErrorItem[];
};

export type StartSignUpRequest = {
    email: string;
    username: string;
};

export type CompleteSignUpRequest = {
    email: string;
    actionCode: string;
};

export type StartSignInRequest = {
    email: string;
};

export type CompleteSignInRequest = {
    email: string;
    actionCode: string;
};

export type AuthUserResponse = {
    userId: string;
    username: string;
};
