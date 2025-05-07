export const LOCAL_API_URL = 'http://localhost:8080'; 
export const PROD_API_URL = 'https://demo-springboot-mongodb.softprobe.ai';
export const API_URL = import.meta.env.PROD ? PROD_API_URL : LOCAL_API_URL;
export const LOGIN_TOKEN = 'login-token';