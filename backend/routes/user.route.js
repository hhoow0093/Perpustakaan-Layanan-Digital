import express from "express";
import { UserController } from "../controllers/user.controller.js";

const routerUser = express.Router();

routerUser.get("/", UserController.getUsers);

export default routerUser;