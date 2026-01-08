import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8000', // La URL de tu FastAPI
    headers: {
        'Content-Type': 'application/json',
    },
});