import { useEffect, useRef, useState, type ReactNode } from "react";

import { fetchSession } from "../api/auth-api";
import { useUserStore } from "./state/user-store";

export const SessionGate = (props: { children: ReactNode }) => {
    const user = useUserStore((state) => state.user);
    const signIn = useUserStore((state) => state.actions.signIn);
    const signOut = useUserStore((state) => state.actions.signOut);
    const [hydrated, setHydrated] = useState(useUserStore.persist.hasHydrated());
    const [ready, setReady] = useState(false);
    const requestId = useRef(0);
    const appliedRequestId = useRef(0);

    useEffect(() => {
        setHydrated(useUserStore.persist.hasHydrated());
        return useUserStore.persist.onFinishHydration(() => {
            setHydrated(true);
        });
    }, []);

    useEffect(() => {
        if (appliedRequestId.current !== requestId.current) {
            requestId.current += 1;
        }
    }, [user]);

    useEffect(() => {
        if (!hydrated) {
            return;
        }

        const checkSession = () => {
            const id = ++requestId.current;
            const finish = (session: { username: string } | null) => {
                if (id !== requestId.current) {
                    return;
                }
                appliedRequestId.current = id;
                if (session) {
                    signIn({ username: session.username });
                } else {
                    signOut();
                }
                setReady(true);
            };

            void fetchSession()
                .then(finish)
                .catch(() => {
                    finish(null);
                });
        };

        checkSession();
        window.addEventListener("focus", checkSession);
        return () => {
            requestId.current += 1;
            window.removeEventListener("focus", checkSession);
        };
    }, [hydrated, signIn, signOut]);

    if (!ready) {
        return null;
    }

    return props.children;
};
