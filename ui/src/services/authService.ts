import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Configure axios defaults
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; // Enable credentials
axios.defaults.timeout = 5000; // 5 seconds timeout

// Add request interceptor for logging and token handling
axios.interceptors.request.use(
    (config) => {
        // Skip token for login request
        if (config.url === '/api/login') {
            console.log('Login request, skipping token');
            return config;
        }

        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Request with token:', {
                url: config.url,
                headers: config.headers
            });
        } else {
            console.warn('No token available for request:', config.url);
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for logging
axios.interceptors.response.use(
    (response) => {
        console.log('Response:', {
            status: response.status,
            headers: response.headers,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('Response error:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
            message: error.message
        });
        return Promise.reject(error);
    }
);

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
        
        const response = await axios.post('/api/login', {
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

        localStorage.setItem('token', token);
        console.log('Token stored in localStorage');
        return token;
    } catch (error) {
        console.error('Login error details:', error);
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                headers: error.response?.headers,
                message: error.message
            });
            throw new Error(error.response?.data?.error || error.message || 'Login failed');
        }
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    console.log('Token removed from localStorage');
    window.location.href = '/login';
};

export const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No token found in localStorage');
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

// Handle 401 responses
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log('Response error:', error);
        if (error.response?.status === 401) {
            console.log('Unauthorized access, redirecting to login');
            // Clear token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
); 