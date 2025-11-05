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
}