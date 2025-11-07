import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const formatUserID = (num) => {
    const paddedNum = String(num).padStart(4, '0'); 
    return `USR${paddedNum}`;
};

export const userService = {
    async getAllUsers() { 
        const [rows] = await db.query("SELECT UserID, email FROM user_akun");
        return rows
    },

    async CreateNewIDUser() {
        const [rows] = await db.query("SELECT UserID FROM user_akun ORDER BY CAST(SUBSTR(UserID, 4) AS SIGNED) DESC LIMIT 1");
        let HighUserID;
        if (rows.length === 0) {
            HighUserID = formatUserID(1);
        } else {
            const highestIDString = rows[0].UserID; 
            const numericPart = highestIDString.substring(3); 
            const highestNumber = parseInt(numericPart, 10);
            HighUserID = formatUserID(highestNumber + 1);
        }
        return{ HighUserID: HighUserID };
    },

    async HandleLoginService(email, password) { 
        const [existing] = await db.query("SELECT * FROM user_akun WHERE email = ?", [email]);
        
        if (existing.length === 0) { 
            const err = new Error("Masukkan email yang benar!");
            err.status = 400;
            throw err;
        }
        const user = existing[0];
        const HashPass = user.password;

        const match = await bcrypt.compare(password, HashPass);
        if (match) {
            const token = jwt.sign(
                { userId: user.UserID, role: user.role }, // payload
                process.env.JWT_SECRET, // your secret
                { expiresIn: "1h" } // token valid for 1 hour
            );
            return { message: "selamat datang!", user: user, token: token }
            
        } else { 
            const err = new Error("password salah")
            err.status = 400;
            throw err;
        }
    },

    async createNewUser(role, nomorInduk, email, password) { 
        const saltRounds = 10;
        let id;
        let insertAdminOrUser;
        if (nomorInduk.includes("DSN") && role.toLowerCase() === "dosen") {
            id = "NID";
            insertAdminOrUser = "user";
        } else if (nomorInduk.includes("MHS")&& role.toLowerCase() === "mahasiswa") {
            id = "NIM";
            insertAdminOrUser = "user";
        } else if (nomorInduk.includes("STF") && role.toLowerCase() === "staff") {
            id = "NIS";
            insertAdminOrUser = "admin";
        } else { 
            const err = new Error("masukkan nomor induk yang tepat");
            err.status = 400;
            throw err;
        }

        if (!["dosen", "mahasiswa", "staff"].includes(role.toLowerCase())) {
            const err = new Error("Invalid role provided.");
            err.status = 400;
            throw err;
        }

        const [rows] = await db.query(`SELECT * FROM ${role} WHERE ${id} = ?`, [nomorInduk]);
        if (rows.length === 0) {
            const err = new Error(`tabel dan field tidak sesuai`);
            err.status = 400;
            throw err;
        }

        // cek jika entitity sudah ada akun atau belum, kalau udah ada, tidak boleh ada akun lagi
        const user = rows[0];
        if (user.UserID !== null) {
                const err = new Error("User tidak boleh memiliki lebih dari 1 akun");
                err.status = 400; 
                throw err;
        }


        const [existing] = await db.query("SELECT * FROM user_akun WHERE email = ?", [email]);
        if (existing.length > 0) {
            const err = new Error("Email sudah teregistrasi");
            err.status = 400;
            throw err;
        }


        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        const hashedPassword = hash; 
        const newID = await this.CreateNewIDUser();
        
        const NewestID = newID.HighUserID;

        await db.query(
            "INSERT INTO user_akun (UserID, email, password, role) VALUES (?, ?, ?, ?)",
            [NewestID, email, hashedPassword, insertAdminOrUser]
        );
        await db.query(
            `UPDATE ${role} SET UserID = ? WHERE ${id} = ?`, 
            [NewestID, nomorInduk]
        );
        return { message: "telah berhasil membuat user baru" };
    },
}