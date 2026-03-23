import axios from 'axios';

const API_BASE = '/api';

export const analyzeFood = async (foods, timePeriod, model) => {
    const response = await axios.post(`${API_BASE}/analyze`, {
        foods,
        timePeriod,
        model
    });
    return response.data;
};

export const getHistory = async () => {
    const response = await axios.get(`${API_BASE}/analyses`);
    return response.data;
};

export const getModels = async () => {
    const response = await axios.get(`${API_BASE}/config/models`);
    return response.data;
};
