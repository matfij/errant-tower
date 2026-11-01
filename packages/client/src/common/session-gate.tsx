import { useQuery } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";

import { fetchSession, sessionQueryKey } from "../api/auth-api";
import { useUserStore } from "./state/user-store";

export const SessionGate = (props: { children: ReactNode }) => {
    const signIn = useUserStore((state) => state.actions.signIn);
    const signOut = useUserStore((state) => state.actions.signOut);
    const [hydrated, setHydrated] = useState(useUserStore.persist.hasHydrated());
    const [ready, setReady] = useState(false);
    const session = useQuery({
        queryKey: sessionQueryKey,
        queryFn: fetchSession,
        retry: false,
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    useEffect(() => {
        setHydrated(useUserStore.persist.hasHydrated());
        return useUserStore.persist.onFinishHydration(() => {
            setHydrated(true);
        });
    }, []);

    useLayoutEffect(() => {
        if (!hydrated || session.isPending) {
            return;
        }

        if (session.isSuccess) {
            if (session.data) {
                signIn({ username: session.data.username });
            } else {
                signOut();
            }
        }
        setReady(true);
    }, [
        hydrated,
        session.isPending,
        session.isSuccess,
        session.data,
        session.dataUpdatedAt,
        signIn,
        signOut,
    ]);

    if (!ready) {
        return null;
    }

    return props.children;
};
