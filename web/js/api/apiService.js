// API Configuration
const API_BASE_URL = 'http://localhost:3000';

// API Request Helper
export async function apiRequest(endpoint, options = {}) {
    // Comment out token check for development
    // const token = localStorage.getItem('token');
    // if (!token) {
    //     throw new Error('No authentication token');
    // }

    const defaultOptions = {
        headers: {
            // 'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...defaultOptions,
            ...options
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
} 