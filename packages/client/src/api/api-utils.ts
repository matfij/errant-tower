import { useState } from "react";

import { appConfig } from "../common/config";
import type { ApiError } from "./api-error";

export const useApiRequest = <TArguments, TResult>(request: (args: TArguments) => Promise<TResult>) => {
    const [data, setData] = useState<TResult>();
    const [errors, setErrors] = useState<ApiError[]>();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const call = (args: TArguments) => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        setErrors(undefined);
        void request(args)
            .then((result) => {
                setData(result);
                setIsSuccess(true);
            })
            .catch((error: unknown) => {
                setIsSuccess(false);
                setErrors(Array.isArray(error) ? (error as ApiError[]) : [{ key: "errors.unknown" }]);
            })
            .finally(() => {
                setIsLoading(false);
            });
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
        return undefined as T;
    }
    return JSON.parse(text) as T;
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
