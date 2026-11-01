import type {
    ApiErrorItem,
    AuthUserResponse,
    CompleteSignInRequest,
    CompleteSignUpRequest,
    StartSignInRequest,
    StartSignUpRequest,
} from "@errant/shared";

import { appConfig } from "../common/config";
import type { ApiError } from "./api-error";

export const sessionQueryKey = ["auth-session"] as const;

async function readErrors(response: Response): Promise<ApiError[]> {
    try {
        const body = (await response.json()) as { errors?: ApiErrorItem[] };
        if (body.errors && body.errors.length > 0) {
            return body.errors;
        }
    } catch {
        // The body was not the error shape.
    }
    return [{ key: "errors.unknown" }];
}

async function postAuth<T>(path: string, body: unknown): Promise<T> {
    let response: Response;
    try {
        response = await fetch(`${appConfig.baseUrl}${path}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-Errant-Request": "1",
            },
            body: JSON.stringify(body),
        });
    } catch {
        throw [{ key: "errors.unknown" }] satisfies ApiError[];
    }

    if (!response.ok) {
        throw await readErrors(response);
    }

    const text = await response.text();
    if (text === "") {
        return undefined as T;
    }
    return JSON.parse(text) as T;
}

export function startSignUpRequest(body: StartSignUpRequest): Promise<void> {
    return postAuth("/auth/sign-up-start", body);
}

export function completeSignUpRequest(body: CompleteSignUpRequest): Promise<AuthUserResponse> {
    return postAuth("/auth/sign-up-complete", body);
}

export function startSignInRequest(body: StartSignInRequest): Promise<void> {
    return postAuth("/auth/sign-in-start", body);
}

export function completeSignInRequest(body: CompleteSignInRequest): Promise<AuthUserResponse> {
    return postAuth("/auth/sign-in-complete", body);
}

export async function signOutRequest(): Promise<void> {
    let response: Response;
    try {
        response = await fetch(`${appConfig.baseUrl}/auth/sign-out`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-Errant-Request": "1",
            },
            body: "{}",
        });
    } catch {
        throw [{ key: "errors.unknown" }] satisfies ApiError[];
    }

    if (response.ok || response.status === 401) {
        return;
    }
    throw await readErrors(response);
}

export async function fetchSession(): Promise<AuthUserResponse | null> {
    let response: Response;
    try {
        response = await fetch(`${appConfig.baseUrl}/auth/session`, {
            method: "GET",
            credentials: "include",
        });
    } catch {
        throw [{ key: "errors.unknown" }] satisfies ApiError[];
    }

    if (response.status === 401) {
        return null;
    }
    if (!response.ok) {
        throw await readErrors(response);
    }
    return (await response.json()) as AuthUserResponse;
}
