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
    }
}