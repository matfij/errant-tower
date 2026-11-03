import type {
    AuthUserResponse,
    CompleteSignInRequest,
    CompleteSignUpRequest,
    StartSignInRequest,
    StartSignUpRequest,
} from "@errant/shared";

import { apiFetch, postJson, readErrors } from "./api-utils";

export const startSignUpRequest = (body: StartSignUpRequest): Promise<void> => {
    return postJson("/auth/sign-up-start", body);
};

export const completeSignUpRequest = (body: CompleteSignUpRequest): Promise<AuthUserResponse> => {
    return postJson("/auth/sign-up-complete", body);
};

export const startSignInRequest = (body: StartSignInRequest): Promise<void> => {
    return postJson("/auth/sign-in-start", body);
};

export const completeSignInRequest = (body: CompleteSignInRequest): Promise<AuthUserResponse> => {
    return postJson("/auth/sign-in-complete", body);
};

export const signOutRequest = async (): Promise<void> => {
    const response = await apiFetch("/auth/sign-out", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Errant-Request": "1",
        },
        body: "{}",
    });

    if (response.ok || response.status === 401) {
        return;
    }
    throw await readErrors(response);
};

export const fetchSession = async (): Promise<AuthUserResponse | null> => {
    const response = await apiFetch("/auth/session", { method: "GET" });

    if (response.status === 401) {
        return null;
    }
    if (!response.ok) {
        throw await readErrors(response);
    }
    return (await response.json()) as AuthUserResponse;
};
