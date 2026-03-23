import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const analyzeFood = async (foods, timePeriod, model) => {
    const response = await axios.post(`${API_BASE}/analyze`, {
        foods,
        timePeriod,
        model
    }, { headers: getAuthHeader() });
    return response.data;
};

export const getHistory = async () => {
    const response = await axios.get(`${API_BASE}/analyses`, { headers: getAuthHeader() });
    return response.data;
};

export const getModels = async () => {
    const response = await axios.get(`${API_BASE}/config/models`);
    return response.data;
};

export const login = async (username, password) => {
    const response = await axios.post(`${API_BASE}/auth/login`, { username, password });
    return response.data;
};

export const register = async (username, password) => {
    const response = await axios.post(`${API_BASE}/auth/register`, { username, password });
    return response.data;
};
