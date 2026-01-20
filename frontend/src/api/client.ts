import axios from 'axios';
import type { ApiResponse } from '../types';

// Backend adresi
const API_URL = 'http://127.0.0.1:8000/api/v1';

// DÜZELTME: Değişken adı 'apiClient' (camelCase) yapıldı
export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- API Fonksiyonları ---

export const getDashboardData = async (): Promise<ApiResponse> => {
    try {
        // Burada da apiClient kullanılıyor
        const response = await apiClient.get<ApiResponse>('/live');
        return response.data;
    } catch (error) {
        console.error('API Hatası (Live Data):', error);
        throw error;
    }
};

export const runSimulation = async (hours: number = 24) => {
    try {
        const response = await apiClient.post('/simulate', null, {
            params: { hours }
        });
        return response.data;
    } catch (error) {
        console.error('API Hatası (Simülasyon):', error);
        throw error;
    }
};

export const getRecommendation = async (zone: string) => {
    try {
        const response = await apiClient.post('/recommend', null, {
            params: { zone }
        });
        return response.data;
    } catch (error) {
        console.error('API Hatası (Öneri):', error);
        throw error;
    }
};