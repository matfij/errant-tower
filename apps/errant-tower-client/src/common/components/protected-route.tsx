import { Navigate, Outlet } from 'react-router';
import { useUserStore } from '../state/user-store';

interface ProtectedRouteProps {
    redirectTo: string;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
    const isAuthenticated = useUserStore((state) => Boolean(state.user));

    return isAuthenticated ? <Outlet /> : <Navigate to={props.redirectTo} replace />;
};
