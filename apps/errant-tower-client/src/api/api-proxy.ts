import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import type { ApiError } from './api-error';

const mutationCache = new WeakMap<() => unknown, () => unknown>();

type WrappedMutation<TData, TArguments> = {
    data?: TData;
    isLoading: boolean;
    isSuccess: boolean;
    errors?: ApiError[];
    call: (args: TArguments) => void;
};

export function wrapMutation<TData, TArguments>(
    mutationHook: () => UseMutationResult<TData, ApiError[], { data: TArguments }>,
): () => WrappedMutation<TData, TArguments> {
    if (mutationCache.has(mutationHook)) {
        return mutationCache.get(mutationHook) as () => WrappedMutation<TData, TArguments>;
    }

    const wrappedMutation = () => {
        const mutation = mutationHook();
        return {
            data: mutation.data,
            isLoading: mutation.isPending,
            isSuccess: mutation.isSuccess,
            errors: mutation.error || undefined,
            call: (args: TArguments) => mutation.mutate({ data: args }),
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
