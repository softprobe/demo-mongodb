import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export interface LoginCredentials {
    username: string;
    password: string;
}

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const { exp } = JSON.parse(jsonPayload);
        return Date.now() >= exp * 1000;
    } catch (e) {
        console.error('Token validation error:', e);
        return true;
    }
};

export const login = async (credentials: LoginCredentials) => {
    try {
        console.log('Attempting login with credentials:', credentials);
        const response = await axios.post('/login', credentials);
        console.log('Login response:', response.data);
        const { token } = response.data;
        if (!token) {
            throw new Error('No token received from server');
        }
        localStorage.setItem('token', token);
        return token;
    } catch (error) {
        console.error('Login error:', error);
        if (axios.isAxiosError(error)) {
            console.error('Response data:', error.response?.data);
            console.error('Response status:', error.response?.status);
            throw new Error(error.response?.data?.error || 'Login failed');
        }
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    // Clear any cached data
    window.location.href = '/login';
};

export const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    if (isTokenExpired(token)) {
        console.log('Token expired');
        logout();
        return null;
    }
    return token;
};

export const isAuthenticated = () => {
    const token = getToken();
    if (!token) {
        return false;
    }
    return true;
};

// Add token to all requests
axios.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle 401 responses
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log('Unauthorized access, redirecting to login');
            logout();
        }
        return Promise.reject(error);
    }
); 