// src/utils/axiosInstance.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:5000/api/v1', // Your Flask Backend
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        // Return just the data part of the response to keep frontend code clean
        return response.data;
    },
    (error) => {
        // Global error handling (you could trigger a toast notification here)
        console.error('API Error:', error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

export default api;