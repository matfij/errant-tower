import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import type { ApiError } from './api-error';

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
    return () => {
        const mutation = mutationHook();
        return {
            data: mutation.data,
            isLoading: mutation.isPending,
            isSuccess: mutation.isSuccess,
            errors: mutation.error || undefined,
            call: (args) => mutation.mutate({ data: args }),
        };
    };
}

type WrappedQuery<TData> = {
    data?: TData;
    isLoading: boolean;
    isSuccess: boolean;
    errors?: ApiError[];
};

export function wrapQuery<TData>(
    queryHook: () => UseQueryResult<TData, ApiError[]>,
): () => WrappedQuery<TData> {
    return () => {
        const query = queryHook();
        return {
            data: query.data,
            isLoading: query.isPending,
            isSuccess: query.isSuccess,
            errors: query.error || undefined,
        };
    };
}
