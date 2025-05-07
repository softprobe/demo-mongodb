import axios from 'axios';
import { API_URL, LOGIN_TOKEN } from './config';

const request = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor to add token
request.interceptors.request.use(
    (config) => {
        const token = document.cookie.split('; ').find(row => row.startsWith(`${LOGIN_TOKEN}=`))?.split('=')[1];
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
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
            localStorage.removeItem(LOGIN_TOKEN);
            window.location.href = '/login';
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