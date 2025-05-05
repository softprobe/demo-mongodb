import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const auth = isAuthenticated();
                setIsAuth(auth);
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuth(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [location.pathname]); // Re-check auth when route changes

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
} 