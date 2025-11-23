import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

export const AdminService = {
    async getDashboardStats() {
        try {
            const response = await axios.get(`${API_URL}/dashboard/stats`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async getRecentBookLoans(limit = 10) {
        try {
            const response = await axios.get(`${API_URL}/dashboard/recent-loans?limit=${limit}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async getRecentRoomBookings(limit = 10) {
        try {
            const response = await axios.get(`${API_URL}/dashboard/recent-bookings?limit=${limit}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async getAllBooks() {
        try {
            const response = await axios.get(`${API_URL}/books`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async getAllRooms() {
        try {
            const response = await axios.get(`${API_URL}/rooms`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async addBook(bookData) {
        try {
            const response = await axios.post(`${API_URL}/books`, bookData, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async addRoom(roomData) {
        try {
            const response = await axios.post(`${API_URL}/rooms`, roomData, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async getOverdueLoans() {
        try {
            const response = await axios.get(`${API_URL}/overdue-loans`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};
