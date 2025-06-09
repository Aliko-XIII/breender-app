import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { ApiResponse } from '../types';

interface AuthContextType {
    userId: string | null;
    accessToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ api: any; children: React.ReactNode }> = ({ api, children }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'refresh_token']);
    const [userId, setUserId] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(cookies.access_token || null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSetAccessToken = (token: string) => {
        setAccessToken(token);
        setCookie('access_token', token, { path: '/' });
    };

    const handleSetRefreshToken = (token: string) => {
        setCookie('refresh_token', token, { path: '/' });
    };

    const login = async (email: string, password: string) => {
        try {
            const response: ApiResponse = await api.loginUser(email, password);

            if (response.status === 200 || response.status === 201) {
                const { access_token, refresh_token } = response.data.data;

                if (!access_token || !refresh_token) {
                    alert('Login failed');
                    return;
                }

                handleSetAccessToken(access_token);
                handleSetRefreshToken(refresh_token);

                const decodedToken = JSON.parse(atob(access_token.split('.')[1]));
                setUserId(decodedToken.id);

                navigate('/user-profile');
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed');
        }
    };

    const logout = () => {
        setUserId(null);
        setAccessToken(null);
        removeCookie('access_token', { path: '/' });
        removeCookie('refresh_token', { path: '/' });
        navigate('/');
    };

    const register = async (email: string, password: string) => {
        const response: ApiResponse = await api.registerUser(email, password);

        if (response.status === 200 || response.status === 201) {
            navigate('/login');
        } else {
            throw new Error('Registration failed');
        }
    };

    useEffect(() => {
        const isAuthenticated = cookies.access_token && cookies.refresh_token;
        const isAuthRoute =
            location.pathname === '/login' ||
            location.pathname === '/signup' ||
            location.pathname === '/';

        if (!isAuthenticated && !isAuthRoute) {
            navigate('/login');
        }
    }, [cookies, location.pathname, navigate]);

    return (
        <AuthContext.Provider value={{ userId, accessToken, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
