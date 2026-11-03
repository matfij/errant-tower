import { appConfig } from "../common/config";
import type { ApiError, ApiErrorResponse } from "../api/api-error";

interface FetchConfig {
    url: string;
    method: string;
    data?: unknown;
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
    signal?: AbortSignal;
}

export const customFetch = async <T>(config: FetchConfig, options?: RequestInit): Promise<T> => {
    try {
        const serializedParams = config.params
            ? new URLSearchParams(
                  Object.entries(config.params).reduce(
                      (acc, [key, value]) => {
                          if (value !== undefined && value !== null) {
                              acc[key] = String(value);
                          }
                          return acc;
                      },
                      {} as Record<string, string>,
                  ),
              ).toString()
            : "";

        const queryString = serializedParams ? `?${serializedParams}` : "";

        const method = config.method.toUpperCase();
        const isMutation = method !== "GET" && method !== "HEAD" && method !== "OPTIONS";

        const response = await fetch(appConfig.baseUrl + config.url + queryString, {
            ...options,
            method,
            body: config.data === undefined ? undefined : JSON.stringify(config.data),
            headers: {
                ...config.headers,
                ...(config.data !== undefined ? { "Content-Type": "application/json" } : {}),
                ...(isMutation ? { "X-Errant-Request": "1" } : {}),
            },
            credentials: "include",
            signal: config.signal,
        });

        if (!response.ok) {
            let errors: ApiError[];
            try {
                errors = ((await response.json()) as ApiErrorResponse).errors ?? [{ key: "errors.unknown" }];
            } catch {
                errors = [{ key: "errors.unknown" }];
            }
            throw errors;
        }

        const text = await response.text();

        if (!text) {
            return undefined as T;
        }

        return JSON.parse(text);
    } catch (error) {
        if (Array.isArray(error)) {
            throw error;
        }
        throw [{ key: "errors.unknown" }];
    }
};
