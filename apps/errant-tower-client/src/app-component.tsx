import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { LoginPage } from './pages/login/login-page';
import { ProtectedRoute } from './common/components/protected-route';
import { HomePage } from './pages/home/home-page';

export const AppComponent = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route element={<ProtectedRoute redirectTo="/" />}>
                    <Route path="/home" element={<HomePage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
