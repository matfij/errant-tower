import type { ApiErrorResponse } from './api-error';

const BASE_URL = import.meta.env.VITE_API_URL;

interface FetchConfig {
    url: string;
    method: string;
    data?: unknown;
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
    signal?: AbortSignal;
}

export const customFetch = async <T>(config: FetchConfig, options?: RequestInit): Promise<T> => {
    const queryString = config.params
        ? '?' +
          new URLSearchParams(
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
        : '';

    const response = await fetch(BASE_URL + config.url + queryString, {
        ...options,
        method: config.method,
        body: config.data ? JSON.stringify(config.data) : undefined,
        headers: {
            ...config.headers,
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        signal: config.signal,
    });

    if (!response.ok) {
        let error: ApiErrorResponse;
        try {
            error = await response.json();
        } catch {
            error = {
                errors: [{ key: 'errors.unknown', field: null }],
            };
        }
        throw error;
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
};
