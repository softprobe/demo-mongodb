export const LOCAL_API_URL = 'http://localhost:8080'; 
export const PROD_API_URL = import.meta.env.VITE_PROD_API_URL || 'http://114.215.188.138:8088';
export const API_URL = import.meta.env.PROD ? PROD_API_URL : LOCAL_API_URL;
export const LOGIN_TOKEN = 'login-token';