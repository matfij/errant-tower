import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "../definitions";

interface UserStore {
    user: User | null;
    actions: UserStoreActions;
}

interface UserStoreActions {
    signIn: (user: User) => void;
    signOut: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            actions: {
                signIn: (user: User) => set({ user }),
                signOut: () => set({ user: null }),
            },
        }),
        {
            name: "errant-tower-user-store",
            partialize: (state) => ({ user: state.user }),
            merge: (persistedState, currentState) => {
                const persisted = persistedState as Partial<UserStore>;
                return {
                    ...currentState,
                    ...persisted,
                    user: persisted.user ?? null,
                };
            },
        },
    ),
);
