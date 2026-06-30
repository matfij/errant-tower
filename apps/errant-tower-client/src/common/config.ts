export const appConfig = {
    baseUrl: import.meta.env.VITE_API_URL,
} as const;

export const routes = {
    root: '/',
    signIn: '/sign-in',
    signUp: '/sign-up',
    character: '/character',
    skills: '/skills',
    crafting: '/crafting',
    explore: '/explore',
} as const;
