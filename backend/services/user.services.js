import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const formatUserID = (num) => {
    const paddedNum = String(num).padStart(4, '0'); 
    return `USR${paddedNum}`;
};

export const userService = {
    async getAllUsers() { 
        const [rows] = await db.query("SELECT UserID, email, role FROM user_akun");
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
    try {
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
                { userId: user.UserID, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            return { message: "selamat datang!", user: user, token: token }
        } else { 
            const err = new Error("password salah")
            err.status = 400;
            throw err;
        }
    } catch (error) {
        throw error; // Re-throw to be caught by controller
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

        // Convert role to uppercase for table name
        const tableName = role.toUpperCase();
        const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE ${id} = ?`, [nomorInduk]);
        if (rows.length === 0) {
            const err = new Error(`Nomor induk ${nomorInduk} tidak ditemukan dalam sistem`);
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
            `UPDATE ${tableName} SET UserID = ? WHERE ${id} = ?`, 
            [NewestID, nomorInduk]
        );
        return { message: "telah berhasil membuat user baru" };
    },

    // Get all books with availability status
    async getAllBooksWithAvailability() {
        try {
            const [books] = await db.query(`
                SELECT 
                    b.NIB,
                    b.Judul,
                    b.Genre,
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 FROM PEMINJAMAN_BUKU pb 
                            WHERE pb.Nomor_Induk_Buku = b.NIB 
                            AND pb.tanggal_checkout IS NULL
                        ) THEN 'Unavailable'
                        ELSE 'Available'
                    END as status
                FROM BUKU b
                ORDER BY b.NIB
            `);
            return books;
        } catch (err) {
            throw err;
        }
    },

    // Get all rooms
    async getAllRooms() {
        try {
            const [rooms] = await db.query(`
                SELECT NIR, Nama_ruangan, Batas_Jumlah
                FROM RUANGAN
                ORDER BY NIR
            `);
            return rooms;
        } catch (err) {
            throw err;
        }
    },

    // Check room availability
    async checkRoomAvailability(roomId, date, startTime, endTime) {
        try {
            const [bookings] = await db.query(`
                SELECT * FROM PEMINJAMAN_RUANGAN
                WHERE Nomor_Induk_Ruangan = ?
                AND tanggal_peminjaman = ?
                AND (
                    (jam_masuk <= ? AND jam_keluar > ?) OR
                    (jam_masuk < ? AND jam_keluar >= ?) OR
                    (jam_masuk >= ? AND jam_keluar <= ?)
                )
            `, [roomId, date, startTime, startTime, endTime, endTime, startTime, endTime]);
            
            return bookings.length === 0; // true if available, false if occupied
        } catch (err) {
            throw err;
        }
    },

    // Borrow a book
    async borrowBook(userId, bookId) {
        try {
            // Check if book is available
            const [existing] = await db.query(`
                SELECT * FROM PEMINJAMAN_BUKU 
                WHERE Nomor_Induk_Buku = ? AND tanggal_checkout IS NULL
            `, [bookId]);

            if (existing.length > 0) {
                const err = new Error("Buku sedang dipinjam");
                err.status = 400;
                throw err;
            }

            // Generate new borrowing ID
            const [lastId] = await db.query(
                "SELECT pinjam_BUKU_ID FROM PEMINJAMAN_BUKU ORDER BY CAST(SUBSTR(pinjam_BUKU_ID, 4) AS SIGNED) DESC LIMIT 1"
            );
            
            let newId;
            if (lastId.length === 0) {
                newId = 'PMB0001';
            } else {
                const num = parseInt(lastId[0].pinjam_BUKU_ID.substring(3)) + 1;
                newId = `PMB${String(num).padStart(4, '0')}`;
            }

            const today = new Date().toISOString().split('T')[0];
            const deadline = new Date();
            deadline.setDate(deadline.getDate() + 7); // 7 days borrowing period
            const deadlineStr = deadline.toISOString().split('T')[0];

            await db.query(`
                INSERT INTO PEMINJAMAN_BUKU 
                (pinjam_BUKU_ID, tanggal_peminjaman, tanggal_checkout, tanggal_deadline_checkout, Nomor_Induk_Buku, UserID_Peminjam_Buku, DENDA)
                VALUES (?, ?, NULL, ?, ?, ?, 0.00)
            `, [newId, today, deadlineStr, bookId, userId]);

            return { message: "Berhasil meminjam buku", borrowingId: newId };
        } catch (err) {
            throw err;
        }
    },

    // Book a room
    async bookRoom(userId, roomId, date, startTime, endTime) {
        try {
            // Check availability
            const isAvailable = await this.checkRoomAvailability(roomId, date, startTime, endTime);
            
            if (!isAvailable) {
                const err = new Error("Ruangan tidak tersedia pada waktu tersebut");
                err.status = 400;
                throw err;
            }

            // Generate new booking ID
            const [lastId] = await db.query(
                "SELECT pinjam_ruangan_ID FROM PEMINJAMAN_RUANGAN ORDER BY CAST(SUBSTR(pinjam_ruangan_ID, 4) AS SIGNED) DESC LIMIT 1"
            );
            
            let newId;
            if (lastId.length === 0) {
                newId = 'PMR0001';
            } else {
                const num = parseInt(lastId[0].pinjam_ruangan_ID.substring(3)) + 1;
                newId = `PMR${String(num).padStart(4, '0')}`;
            }

            await db.query(`
                INSERT INTO PEMINJAMAN_RUANGAN 
                (pinjam_ruangan_ID, tanggal_peminjaman, jam_masuk, jam_keluar, Nomor_Induk_Ruangan, UserID_Peminjam_Ruangan)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [newId, date, startTime, endTime, roomId, userId]);

            return { message: "Berhasil memesan ruangan", bookingId: newId };
        } catch (err) {
            throw err;
        }
    },

    // Get user's book borrowing history
    async getUserBookHistory(userId) {
        try {
            // First, calculate and update fines for overdue books
            await this.calculateAndUpdateFines(userId);

            const [history] = await db.query(`
                SELECT 
                    pb.pinjam_BUKU_ID,
                    pb.tanggal_peminjaman,
                    pb.tanggal_checkout,
                    pb.tanggal_deadline_checkout,
                    pb.DENDA,
                    b.NIB,
                    b.Judul,
                    b.Genre,
                    CASE 
                        WHEN pb.tanggal_checkout IS NOT NULL THEN 'Dikembalikan'
                        WHEN pb.tanggal_deadline_checkout < CURDATE() THEN 'Terlambat'
                        ELSE 'Dipinjam'
                    END as status
                FROM PEMINJAMAN_BUKU pb
                JOIN BUKU b ON pb.Nomor_Induk_Buku = b.NIB
                WHERE pb.UserID_Peminjam_Buku = ?
                ORDER BY pb.tanggal_peminjaman DESC
            `, [userId]);
            return history;
        } catch (err) {
            throw err;
        }
    },

    // Calculate and update fines for overdue books
    async calculateAndUpdateFines(userId) {
        try {
            // Get all books that are still borrowed (tanggal_checkout IS NULL) and overdue
            const [overdueBooks] = await db.query(`
                SELECT 
                    pinjam_BUKU_ID,
                    tanggal_deadline_checkout,
                    DENDA
                FROM PEMINJAMAN_BUKU
                WHERE UserID_Peminjam_Buku = ?
                AND tanggal_checkout IS NULL
                AND tanggal_deadline_checkout < CURDATE()
            `, [userId]);

            // Update fine for each overdue book
            for (const book of overdueBooks) {
                const deadline = new Date(book.tanggal_deadline_checkout);
                const today = new Date();
                
                // Calculate days overdue
                const daysOverdue = Math.floor((today - deadline) / (1000 * 60 * 60 * 24));
                
                // Calculate fine: 5000 per day
                const newFine = daysOverdue * 5000;

                // Update the fine in database
                await db.query(`
                    UPDATE PEMINJAMAN_BUKU
                    SET DENDA = ?
                    WHERE pinjam_BUKU_ID = ?
                `, [newFine, book.pinjam_BUKU_ID]);
            }
        } catch (err) {
            throw err;
        }
    },

    // Get user's room booking history
    async getUserRoomHistory(userId) {
        try {
            const [history] = await db.query(`
                SELECT 
                    pr.pinjam_ruangan_ID,
                    pr.tanggal_peminjaman,
                    pr.jam_masuk,
                    pr.jam_keluar,
                    r.NIR,
                    r.Nama_ruangan,
                    r.Batas_Jumlah
                FROM PEMINJAMAN_RUANGAN pr
                JOIN RUANGAN r ON pr.Nomor_Induk_Ruangan = r.NIR
                WHERE pr.UserID_Peminjam_Ruangan = ?
                ORDER BY pr.tanggal_peminjaman DESC, pr.jam_masuk DESC
            `, [userId]);
            return history;
        } catch (err) {
            throw err;
        }
    },

    // Get user's current borrowed books count
    async getUserCurrentBooksCount(userId) {
        try {
            const [result] = await db.query(`
                SELECT COUNT(*) as count
                FROM PEMINJAMAN_BUKU
                WHERE UserID_Peminjam_Buku = ? AND tanggal_checkout IS NULL
            `, [userId]);
            return result[0].count;
        } catch (err) {
            throw err;
        }
    },

    // Get user's current room bookings count
    async getUserCurrentRoomsCount(userId) {
        try {
            const [result] = await db.query(`
                SELECT COUNT(*) as count
                FROM PEMINJAMAN_RUANGAN
                WHERE UserID_Peminjam_Ruangan = ? 
                AND tanggal_peminjaman >= CURDATE()
            `, [userId]);
            return result[0].count;
        } catch (err) {
            throw err;
        }
    },
}