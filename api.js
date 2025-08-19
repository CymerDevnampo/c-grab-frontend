// api.js
const API_BASE_URL = "http://192.168.1.24:1000/api";

const handleResponse = async (response) => {
    const json = await response.json();
    return { response, json };
};

const Api = {
    get: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        return handleResponse(response);
    },

    post: async (endpoint, data) => {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    put: async (endpoint, data) => {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    delete: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            }
        });
        return handleResponse(response);
    }
};

export default Api;
