import { Navigate, Outlet } from 'react-router';

interface ProtectedRouteProps {
    isAuthenticated: boolean;
    redirectTo: string;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
    return props.isAuthenticated ? <Outlet /> : <Navigate to={props.redirectTo} replace />;
};
