import { appConfig } from '../common/config';
import type { ApiError } from './api-error';

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
        let errors: ApiError[];
        try {
            errors = await response.json();
        } catch {
            errors = [{ key: 'errors.unknown' }];
        }
        throw errors;
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
};
