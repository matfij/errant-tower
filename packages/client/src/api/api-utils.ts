import { useState } from "react";

import { appConfig } from "../common/config";
import type { ApiError } from "./api-error";

export const useApiRequest = <TRequest extends (...args: never[]) => Promise<unknown>>(request: TRequest) => {
    type TResult = Awaited<ReturnType<TRequest>>;

    const [data, setData] = useState<TResult | null>(null);
    const [errors, setErrors] = useState<ApiError[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const call = async (...args: Parameters<TRequest>): Promise<TResult | null> => {
        if (isLoading) {
            return null;
        }
        setIsLoading(true);
        setErrors(null);
        try {
            const result = (await request(...args)) as TResult;
            setData(result);
            setIsSuccess(true);
            return result;
        } catch (error: unknown) {
            setIsSuccess(false);
            setErrors(parseApiErrors(error));
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { data, errors, isLoading, isSuccess, call };
};

export const postJson = async <T>(path: string, body: unknown): Promise<T> => {
    const response = await apiFetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Errant-Request": "1",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw await readErrors(response);
    }

    const text = await response.text();
    if (text === "") {
        return null as T;
    }
    return JSON.parse(text) as T;
};

export const getJson = async <T>(path: string): Promise<T> => {
    const response = await apiFetch(path, { method: "GET" });
    if (!response.ok) {
        throw await readErrors(response);
    }
    return (await response.json()) as T;
};

export const apiFetch = async (path: string, init: RequestInit): Promise<Response> => {
    try {
        return await fetch(`${appConfig.baseUrl}${path}`, {
            ...init,
            credentials: "include",
        });
    } catch {
        throw [{ key: "errors.unknown" }];
    }
};

export const readErrors = async (response: Response): Promise<ApiError[]> => {
    try {
        const body = (await response.json()) as { errors?: ApiError[] };
        if (body.errors && body.errors.length > 0) {
            return body.errors;
        }
    } catch {
        // The body was not the error shape.
    }
    return [{ key: "errors.unknown" }];
};

export const parseApiErrors = (error: unknown): ApiError[] => {
    return Array.isArray(error) ? (error as ApiError[]) : [{ key: "errors.unknown" }];
};
