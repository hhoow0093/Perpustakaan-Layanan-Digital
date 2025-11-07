import express from "express";
import { UserController } from "../controllers/user.controller.js";
const routerUser = express.Router();

routerUser.get("/", UserController.getUsers);
routerUser.post("/register", UserController.CreateNewUser)
routerUser.post("/login", UserController.HandleLoginUser)

export default routerUser;