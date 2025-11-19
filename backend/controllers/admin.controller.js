import { adminService } from "../services/admin.services.js";
import { success, error } from "../utils/response.js";

export const AdminController = {
    async getDashboardStats(req, res) {
        try {
            const stats = await adminService.getDashboardStatistics();
            return success(res, stats);
        } catch (err) {
            return error(res, err.message, err.status || 500);
        }
    },

    async getRecentBookLoans(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const loans = await adminService.getRecentBookLoans(limit);
            return success(res, loans);
        } catch (err) {
            return error(res, err.message, err.status || 500);
        }
    },

    async getRecentRoomBookings(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const bookings = await adminService.getRecentRoomBookings(limit);
            return success(res, bookings);
        } catch (err) {
            return error(res, err.message, err.status || 500);
        }
    },

    async getAllBooks(req, res) {
        try {
            const books = await adminService.getAllBooks();
            return success(res, books);
        } catch (err) {
            return error(res, err.message, err.status || 500);
        }
    },

    async getAllRooms(req, res) {
        try {
            const rooms = await adminService.getAllRooms();
            return success(res, rooms);
        } catch (err) {
            return error(res, err.message, err.status || 500);
        }
    },

    async addBook(req, res) {
        try {
            const { judul, genre } = req.body;
            const result = await adminService.createBook(judul, genre);
            return success(res, result);
        } catch (err) {
            return error(res, err.message, err.status || 500);
        }
    },

    async addRoom(req, res) {
        try {
            const { nama_ruangan, batas_jumlah } = req.body;
            const result = await adminService.createRoom(nama_ruangan, batas_jumlah);
            return success(res, result);
        } catch (err) {
            return error(res, err.message, err.status || 500);
        }
    },

    async getOverdueLoans(req, res) {
        try {
            const overdueLoans = await adminService.getOverdueLoans();
            return success(res, overdueLoans);
        } catch (err) {
            return error(res, err.message, err.status || 500);
        }
    }
};
