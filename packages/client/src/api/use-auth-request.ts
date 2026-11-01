import { useState } from "react";

import type { ApiError } from "./api-error";

export function useAuthRequest<TArguments, TResult>(request: (args: TArguments) => Promise<TResult>) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [data, setData] = useState<TResult>();
    const [errors, setErrors] = useState<ApiError[]>();

    const call = (args: TArguments) => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);
        setErrors(undefined);
        void request(args)
            .then((result) => {
                setData(result);
                setIsSuccess(true);
            })
            .catch((error: unknown) => {
                setIsSuccess(false);
                setErrors(Array.isArray(error) ? (error as ApiError[]) : [{ key: "errors.unknown" }]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return { isLoading, isSuccess, data, errors, call };
}
