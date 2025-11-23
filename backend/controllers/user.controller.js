import { response } from "express";
import { userService } from "../services/user.services.js";
import { success, error } from "../utils/response.js";

export const UserController = {
    async getUsers(req, res) { 
        try {
            const users = await userService.getAllUsers();
            return success(res, users);

        } catch (err) { 
            return error(res, err.message)
        }
    },
    async CreateNewUser(req, res) { 
        try {
            const { role, nomorInduk, email, password } = req.body;
            const response = await userService.createNewUser(role, nomorInduk, email, password);
            return success(res, response.message);
        } catch (err) { 
            error(res, err.message, err.status);
        }
    },
    async HandleLoginUser(req, res) { 
        try {
            const { email, password } = req.body;
            const response = await userService.HandleLoginService(email, password);
            return success(res, { message: response.message, user: response.user, token: response.token });
         }
        catch (err) { 
            error(res, err.message, err.status);
        }
    },

    async getBooksWithAvailability(req, res) {
        try {
            const books = await userService.getAllBooksWithAvailability();
            return success(res, books);
        } catch (err) {
            return error(res, err.message, err.status || 500);
        }
    },

    async getRooms(req, res) {
        try {
            const rooms = await userService.getAllRooms();
            return success(res, rooms);
        } catch (err) {
            return error(res, err.message, err.status || 500);
        }
    },

    async checkRoomAvailability(req, res) {
        try {
            const { roomId, date, startTime, endTime } = req.query;
            const isAvailable = await userService.checkRoomAvailability(roomId, date, startTime, endTime);
            return success(res, { available: isAvailable });
        } catch (err) {
            return error(res, err.message, err.status || 500);
        }
    },

    async borrowBook(req, res) {
        try {
            const { bookId } = req.body;
            const userId = req.user.userId; // from JWT token
            const result = await userService.borrowBook(userId, bookId);
            return success(res, result);
        } catch (err) {
            return error(res, err.message, err.status || 500);
        }
    },

    async bookRoom(req, res) {
        try {
            const { roomId, date, startTime, endTime } = req.body;
            const userId = req.user.userId; // from JWT token
            const result = await userService.bookRoom(userId, roomId, date, startTime, endTime);
            return success(res, result);
        } catch (err) {
            return error(res, err.message, err.status || 500);
        }
    },

    async getBookHistory(req, res) {
        try {
            const userId = req.user.userId; // from JWT token
            const history = await userService.getUserBookHistory(userId);
            return success(res, history);
        } catch (err) {
            return error(res, err.message, err.status || 500);
        }
    },

    async getRoomHistory(req, res) {
        try {
            const userId = req.user.userId; // from JWT token
            const history = await userService.getUserRoomHistory(userId);
            return success(res, history);
        } catch (err) {
            return error(res, err.message, err.status || 500);
        }
    },

    async getCurrentStats(req, res) {
        try {
            const userId = req.user.userId; // from JWT token
            const booksCount = await userService.getUserCurrentBooksCount(userId);
            const roomsCount = await userService.getUserCurrentRoomsCount(userId);
            return success(res, { booksCount, roomsCount });
        } catch (err) {
            return error(res, err.message, err.status || 500);
        }
    }
}