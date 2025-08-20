import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = "http://127.0.0.1:8000/api";

const handleResponse = async (response) => {
    const json = await response.json();
    return { response, json };
};

const Api = {

    baseUrl: "http://127.0.0.1:8000",

    get: async (endpoint) => {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        return handleResponse(response);
    },

    post: async (endpoint, data) => {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    postMultipart: async (endpoint, formData) => {
        const token = await AsyncStorage.getItem('token');

        // console.log('Uploading to:', `${API_BASE_URL}/${endpoint}`);
        // console.log('Token exists:', !!token);

        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),

                // 'Authorization': `Bearer ${token}`,
                // 'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });
        return handleResponse(response);
    },

    put: async (endpoint, data) => {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    delete: async (endpoint) => {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        return handleResponse(response);
    }
};

export default Api;
