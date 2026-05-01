import { appConfig } from '../common/config';
import type { ApiErrorResponse } from './api-error';

interface FetchConfig {
    url: string;
    method: string;
    data?: unknown;
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
    signal?: AbortSignal;
}

export const customFetch = async <T>(config: FetchConfig, options?: RequestInit): Promise<T> => {
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
        : '';
    const queryString = serializedParams ? `?${serializedParams}` : '';

    const response = await fetch(appConfig.baseUrl + config.url + queryString, {
        ...options,
        method: config.method,
        body: config.data === undefined ? undefined : JSON.stringify(config.data),
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
                errors: [{ key: 'errors.unknown' }],
            };
        }
        throw error;
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
};
