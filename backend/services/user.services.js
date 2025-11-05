import { db } from "../config/db.js";

export const userService = {
    async getAllUsers() { 
        const [rows] = await db.query("SELECT UserID, email FROM user_akun");
        return rows
    },
}