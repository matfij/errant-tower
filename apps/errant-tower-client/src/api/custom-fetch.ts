const BASE_URL = 'https://localhost:7135';

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
        method: config.method,
        body: config.data ? JSON.stringify(config.data) : undefined,
        headers: {
            'Content-Type': 'application/json',
            ...config.headers,
        },
        credentials: 'include',
        signal: config.signal,
        ...options,
    });

    if (!response.ok) {
        let error;
        try {
            error = await response.json();
        } catch {
            error = { message: response.statusText };
        }
        throw error;
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
};
