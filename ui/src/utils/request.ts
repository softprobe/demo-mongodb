import { getToken } from '@/services/authService';
import axios from 'axios';

export const API_URL = 'http://localhost:8080';

const request = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Configure axios defaults
request.defaults.baseURL = API_URL;
request.defaults.headers.common['Content-Type'] = 'application/json';
request.defaults.withCredentials = true; // Enable credentials
request.defaults.timeout = 5000; // 5 seconds timeout

// Add request interceptor for logging and token handling
request.interceptors.request.use(
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
request.interceptors.response.use(
    (response) => {
        console.log('Response:', {
            status: response.status,
            headers: response.headers,
            data: response.data
        });
        return response;
    },
    (error) => {
        // Handle 401 responses
        if (error.response?.status === 401) {
            console.log('Unauthorized access, redirecting to login');
            // Clear token and redirect to login
            localStorage.removeItem('token');
            // window.location.href = '/login';
        } else {
            console.error('Response error:', {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers,
                message: error.message
            });
        }

        return Promise.reject(error);
    }
);

export default request;