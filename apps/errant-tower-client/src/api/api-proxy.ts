import type { ApiError } from './api-error';
import type {
    StartSignInRequest,
    CompleteSignInRequest,
    StartSignUpRequest,
    CompleteSignUpRequest,
} from './definitions';
import {
    useStartSignIn,
    useCompleteSignIn,
    useStartSignUp,
    useCompleteSignUp,
    useGetCurrentUser,
} from './generated';

/*
 * User endpoints
 */
export const useUserStartSignIn = () => {
    const mutation = useStartSignIn<ApiError[]>();
    return {
        ...mutation,
        errors: mutation.error,
        isLoading: mutation.isPending,
        call: (data: StartSignInRequest) => mutation.mutate({ data }),
    };
};

export const useUserCompleteSignIn = () => {
    const mutation = useCompleteSignIn<ApiError[]>();
    return {
        ...mutation,
        errors: mutation.error,
        isLoading: mutation.isPending,
        call: (data: CompleteSignInRequest) => mutation.mutate({ data }),
    };
};

export const useUserStartSignUp = () => {
    const mutation = useStartSignUp<ApiError[]>();
    return {
        ...mutation,
        errors: mutation.error,
        isLoading: mutation.isPending,
        call: (data: StartSignUpRequest) => mutation.mutate({ data }),
    };
};

export const useUserCompleteSignUp = () => {
    const mutation = useCompleteSignUp<ApiError[]>();
    return {
        ...mutation,
        errors: mutation.error,
        isLoading: mutation.isPending,
        call: (data: CompleteSignUpRequest) => mutation.mutate({ data }),
    };
};

export const useUserGetCurrentUser = () => {
    const query = useGetCurrentUser<ApiError[]>({ query: { enabled: false } });
    return {
        ...query,
        errors: query.error,
        isLoading: query.isPending,
        call: () => query.refetch(),
    };
};
