import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './common/components/protected-route';
import { HomePage } from './pages/home/home-page';
import { AuthPage } from './pages/auth/auth-page';
import { SignInPage } from './pages/auth/sign-in-page';
import { SignUpPage } from './pages/auth/sign-up-page';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
});

export const AppComponent = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AuthPage />} />
                    <Route path="/sign-in" element={<SignInPage />} />
                    <Route path="/sign-up" element={<SignUpPage />} />
                    <Route element={<ProtectedRoute redirectTo="/" />}>
                        <Route path="/home" element={<HomePage />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
};
