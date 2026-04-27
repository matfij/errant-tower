import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { LoginPage } from './pages/login/login-page';
import { ProtectedRoute } from './common/components/protected-route';
import { HomePage } from './pages/home/home-page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
export const AppComponent = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route element={<ProtectedRoute redirectTo="/" />}>
                        <Route path="/home" element={<HomePage />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
};
