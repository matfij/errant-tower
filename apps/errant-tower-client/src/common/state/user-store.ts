import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../definitions';

interface UserStore {
    user?: User;
    signIn: (user: User) => void;
    signOut: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            signIn: (user: User) => set({ user }),
            signOut: () => set({ user: undefined }),
        }),
        {
            name: 'errant-tower-user-store',
        },
    ),
);
