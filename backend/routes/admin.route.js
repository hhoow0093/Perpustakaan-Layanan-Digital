import express from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { verifyToken, verifyRole } from "../middleware/auth.js";

const routerAdmin = express.Router();

// All admin routes require authentication and admin role
routerAdmin.use(verifyToken);
routerAdmin.use(verifyRole(["admin"]));

// Dashboard statistics
routerAdmin.get("/dashboard/stats", AdminController.getDashboardStats);

// Recent activities
routerAdmin.get("/dashboard/recent-loans", AdminController.getRecentBookLoans);
routerAdmin.get("/dashboard/recent-bookings", AdminController.getRecentRoomBookings);

// Books management
routerAdmin.get("/books", AdminController.getAllBooks);
routerAdmin.post("/books", AdminController.addBook);

// Rooms management
routerAdmin.get("/rooms", AdminController.getAllRooms);
routerAdmin.post("/rooms", AdminController.addRoom);

// Overdue loans
routerAdmin.get("/overdue-loans", AdminController.getOverdueLoans);

export default routerAdmin;
