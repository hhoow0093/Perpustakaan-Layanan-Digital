import express from "express";
import { UserController } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.js";
const routerUser = express.Router();

routerUser.get("/", UserController.getUsers);
routerUser.post("/register", UserController.CreateNewUser);
routerUser.post("/login", UserController.HandleLoginUser);

// Protected routes - require authentication
routerUser.get("/books", UserController.getBooksWithAvailability);
routerUser.get("/rooms", UserController.getRooms);
routerUser.get("/room-availability", UserController.checkRoomAvailability);
routerUser.post("/borrow-book", verifyToken, UserController.borrowBook);
routerUser.post("/book-room", verifyToken, UserController.bookRoom);
routerUser.get("/book-history", verifyToken, UserController.getBookHistory);
routerUser.get("/room-history", verifyToken, UserController.getRoomHistory);
routerUser.get("/current-stats", verifyToken, UserController.getCurrentStats);

export default routerUser;