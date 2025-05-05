import request, { API_URL } from '@/utils/request';

export interface LoginCredentials {
    username: string;
    password: string;
}

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
    return false;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const { exp } = JSON.parse(jsonPayload);
        // Add a 5-minute buffer to prevent edge cases
        return Date.now() >= (exp * 1000 - 5 * 60 * 1000);
    } catch (e) {
        console.error('Token validation error:', e);
        return true;
    }
};

export const login = async (credentials: LoginCredentials) => {
    try {
        console.log('Attempting login with credentials:', credentials);
        console.log('API URL:', API_URL);
        
        const response = await request.post('/api/login', {
            username: credentials.username,
            password: credentials.password
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            }
        });
        
        console.log('Login response:', {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data
        });

        if (response.status === 401) {
            throw new Error('Invalid credentials');
        }

        if (response.status !== 200) {
            throw new Error(response.data?.error || 'Login failed');
        }

        const { token } = response.data;
        if (!token) {
            throw new Error('No token received from server');
        }

        // Store token in cookie
        document.cookie = `login-token=${token}; path=/; max-age=180000; SameSite=Strict`;
        console.log('Token stored in cookie');
        return token;
    } catch (error) {
        console.error('Login error details:', error);
        throw error;
    }
};

export const logout = () => {
    // Remove token from cookie
    document.cookie = 'login-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    console.log('Token removed from cookie');
    window.location.href = '/login';
};

export const getToken = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('login-token='))?.split('=')[1];
    if (!token) {
        console.log('No token found in cookie');
        return null;
    }
    if (isTokenExpired(token)) {
        console.log('Token expired');
        logout();
        return null;
    }
    console.log('Token retrieved from localStorage');
    return token;
};

export const isAuthenticated = () => {
    const token = getToken();
    if (!token) {
        return false;
    }
    return true;
};
