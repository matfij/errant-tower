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
    const mutation = useStartSignIn();
    return {
        ...mutation,
        call: (data: StartSignInRequest) => mutation.mutate({ data }),
    };
};

export const useUserCompleteSignIn = () => {
    const mutation = useCompleteSignIn();
    return {
        ...mutation,
        call: (data: CompleteSignInRequest) => mutation.mutate({ data }),
    };
};

export const useUserStartSignUp = () => {
    const mutation = useStartSignUp();
    return {
        ...mutation,
        call: (data: StartSignUpRequest) => mutation.mutate({ data }),
    };
};

export const useUserCompleteSignUp = () => {
    const mutation = useCompleteSignUp();
    return {
        ...mutation,
        call: (data: CompleteSignUpRequest) => mutation.mutate({ data }),
    };
};

export const useUserGetCurrentUser = () => {
    const mutation = useGetCurrentUser({ query: { enabled: false } });
    return {
        ...mutation,
        call: () => mutation.refetch(),
    };
};
