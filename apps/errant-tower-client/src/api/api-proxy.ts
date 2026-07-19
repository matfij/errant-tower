import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import type { ApiError } from './api-error';

const mutationCache = new WeakMap<() => unknown, () => unknown>();

type WrappedMutation<TData, TArguments> = {
    data?: TData;
    isLoading: boolean;
    isSuccess: boolean;
    errors?: ApiError[];
    call: (args: TArguments, options?: { onSuccess?: (data: TData) => void }) => void;
};

type WrappedMutationVoid<TData> = {
    data?: TData;
    isLoading: boolean;
    isSuccess: boolean;
    errors?: ApiError[];
    call: (args?: void, options?: { onSuccess?: (data: TData) => void }) => void;
};

export function wrapMutation<TData>(
    mutationHook: () => UseMutationResult<TData, ApiError[], void>,
): () => WrappedMutationVoid<TData>;

export function wrapMutation<TData, TArguments>(
    mutationHook: () => UseMutationResult<TData, ApiError[], { data: TArguments }>,
): () => WrappedMutation<TData, TArguments>;

export function wrapMutation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationHook: () => UseMutationResult<unknown, ApiError[], any>,
): () => WrappedMutationVoid<unknown> {
    if (mutationCache.has(mutationHook)) {
        return mutationCache.get(mutationHook) as () => WrappedMutationVoid<unknown>;
    }

    const wrappedMutation = () => {
        const mutation = mutationHook();

        return {
            data: mutation.data,
            isLoading: mutation.isPending,
            isSuccess: mutation.isSuccess,
            errors: mutation.error || undefined,
            call: (args?: unknown, options?: { onSuccess?: (data: unknown) => void }) => {
                const mutateOptions = options?.onSuccess ? { onSuccess: options.onSuccess } : undefined;

                if (args === undefined) {
                    mutation.mutate(undefined, mutateOptions);
                } else {
                    mutation.mutate({ data: args }, mutateOptions);
                }
            },
        };
    };

    mutationCache.set(mutationHook, wrappedMutation);

    return wrappedMutation;
}

const queryCache = new WeakMap<() => unknown, () => unknown>();

type WrappedQuery<TData> = {
    data?: TData;
    isLoading: boolean;
    isSuccess: boolean;
    errors?: ApiError[];
};

export function wrapQuery<TData>(
    queryHook: () => UseQueryResult<TData, ApiError[]>,
): () => WrappedQuery<TData> {
    if (queryCache.has(queryHook)) {
        return queryCache.get(queryHook) as () => WrappedQuery<TData>;
    }

    const wrappedQuery = () => {
        const query = queryHook();
        return {
            data: query.data,
            isLoading: query.isPending,
            isSuccess: query.isSuccess,
            errors: query.error || undefined,
        };
    };

    queryCache.set(queryHook, wrappedQuery);

    return wrappedQuery;
}
