import { db } from "../config/db.js";

const formatBookID = (num) => {
    const paddedNum = String(num).padStart(4, '0');
    return `NIB${paddedNum}`;
};

const formatRoomID = (num) => {
    const paddedNum = String(num).padStart(4, '0');
    return `NIR${paddedNum}`;
};

export const adminService = {
    async getDashboardStatistics() {
        try {
            // Get total book loans
            const [bookLoansResult] = await db.query(
                "SELECT COUNT(*) as total FROM PEMINJAMAN_BUKU"
            );
            const totalBookLoans = bookLoansResult[0].total;

            // Get total room bookings
            const [roomBookingsResult] = await db.query(
                "SELECT COUNT(*) as total FROM PEMINJAMAN_RUANGAN"
            );
            const totalRoomBookings = roomBookingsResult[0].total;

            return {
                totalBookLoans,
                totalRoomBookings
            };
        } catch (err) {
            throw err;
        }
    },

    async getRecentBookLoans(limit = 50) {
        try {
            const [rows] = await db.query(`
                SELECT 
                    pb.pinjam_BUKU_ID,
                    pb.tanggal_peminjaman,
                    pb.tanggal_checkout,
                    pb.tanggal_deadline_checkout,
                    pb.DENDA,
                    b.NIB as book_id,
                    b.Judul as book_title,
                    b.Genre as book_genre,
                    u.UserID as user_id,
                    u.email as user_email,
                    u.role as user_role,
                    COALESCE(m.Nama_depan, d.Nama_depan, s.Nama_depan) as nama_depan,
                    COALESCE(m.Nama_belakang, d.Nama_belakang, s.Nama_belakang) as nama_belakang,
                    COALESCE(m.NIM, d.NID, s.NIS) as nomor_induk,
                    CASE 
                        WHEN pb.tanggal_checkout IS NOT NULL THEN 'Dikembalikan'
                        WHEN pb.tanggal_deadline_checkout < CURDATE() THEN 'Terlambat'
                        ELSE 'Dipinjam'
                    END as status
                FROM PEMINJAMAN_BUKU pb
                JOIN BUKU b ON pb.Nomor_Induk_Buku = b.NIB
                JOIN user_akun u ON pb.UserID_Peminjam_Buku = u.UserID
                LEFT JOIN MAHASISWA m ON u.UserID = m.UserID
                LEFT JOIN DOSEN d ON u.UserID = d.UserID
                LEFT JOIN STAFF s ON u.UserID = s.UserID
                ORDER BY pb.tanggal_peminjaman DESC
                LIMIT ?
            `, [limit]);

            return rows;
        } catch (err) {
            throw err;
        }
    },

    async getRecentRoomBookings(limit = 50) {
        try {
            const [rows] = await db.query(`
                SELECT 
                    pr.pinjam_ruangan_ID,
                    pr.tanggal_peminjaman,
                    pr.jam_masuk,
                    pr.jam_keluar,
                    r.NIR as room_id,
                    r.Nama_ruangan as room_name,
                    r.Batas_Jumlah as room_capacity,
                    u.UserID as user_id,
                    u.email as user_email,
                    u.role as user_role,
                    COALESCE(m.Nama_depan, d.Nama_depan, s.Nama_depan) as nama_depan,
                    COALESCE(m.Nama_belakang, d.Nama_belakang, s.Nama_belakang) as nama_belakang,
                    COALESCE(m.NIM, d.NID, s.NIS) as nomor_induk
                FROM PEMINJAMAN_RUANGAN pr
                JOIN RUANGAN r ON pr.Nomor_Induk_Ruangan = r.NIR
                JOIN user_akun u ON pr.UserID_Peminjam_Ruangan = u.UserID
                LEFT JOIN MAHASISWA m ON u.UserID = m.UserID
                LEFT JOIN DOSEN d ON u.UserID = d.UserID
                LEFT JOIN STAFF s ON u.UserID = s.UserID
                ORDER BY pr.tanggal_peminjaman DESC, pr.jam_masuk DESC
                LIMIT ?
            `, [limit]);

            return rows;
        } catch (err) {
            throw err;
        }
    },

    async getAllBooks() {
        try {
            const [rows] = await db.query("SELECT * FROM BUKU ORDER BY NIB");
            return rows;
        } catch (err) {
            throw err;
        }
    },

    async getAllRooms() {
        try {
            const [rows] = await db.query("SELECT * FROM RUANGAN ORDER BY NIR");
            return rows;
        } catch (err) {
            throw err;
        }
    },

    async createBook(judul, genre) {
        try {
            // Get the highest book ID
            const [rows] = await db.query(
                "SELECT NIB FROM BUKU ORDER BY CAST(SUBSTR(NIB, 4) AS SIGNED) DESC LIMIT 1"
            );

            let newBookID;
            if (rows.length === 0) {
                newBookID = formatBookID(1);
            } else {
                const highestIDString = rows[0].NIB;
                const numericPart = highestIDString.substring(3);
                const highestNumber = parseInt(numericPart, 10);
                newBookID = formatBookID(highestNumber + 1);
            }

            // Insert new book
            await db.query(
                "INSERT INTO BUKU (NIB, Judul, Genre) VALUES (?, ?, ?)",
                [newBookID, judul, genre]
            );

            return { message: "Buku berhasil ditambahkan", bookId: newBookID };
        } catch (err) {
            throw err;
        }
    },

    async createRoom(namaRuangan, batasJumlah) {
        try {
            // Get the highest room ID
            const [rows] = await db.query(
                "SELECT NIR FROM RUANGAN ORDER BY CAST(SUBSTR(NIR, 4) AS SIGNED) DESC LIMIT 1"
            );

            let newRoomID;
            if (rows.length === 0) {
                newRoomID = formatRoomID(1);
            } else {
                const highestIDString = rows[0].NIR;
                const numericPart = highestIDString.substring(3);
                const highestNumber = parseInt(numericPart, 10);
                newRoomID = formatRoomID(highestNumber + 1);
            }

            // Insert new room
            await db.query(
                "INSERT INTO RUANGAN (NIR, Nama_ruangan, Batas_Jumlah) VALUES (?, ?, ?)",
                [newRoomID, namaRuangan, batasJumlah]
            );

            return { message: "Ruangan berhasil ditambahkan", roomId: newRoomID };
        } catch (err) {
            throw err;
        }
    },

    async getOverdueLoans() {
        try {
            const [rows] = await db.query(`
                SELECT 
                    pb.pinjam_BUKU_ID,
                    pb.tanggal_peminjaman,
                    pb.tanggal_deadline_checkout,
                    pb.DENDA,
                    b.Judul as book_title,
                    u.email as user_email,
                    DATEDIFF(CURDATE(), pb.tanggal_deadline_checkout) as days_overdue
                FROM PEMINJAMAN_BUKU pb
                JOIN BUKU b ON pb.Nomor_Induk_Buku = b.NIB
                JOIN user_akun u ON pb.UserID_Peminjam_Buku = u.UserID
                WHERE pb.tanggal_deadline_checkout < CURDATE() 
                AND pb.tanggal_checkout IS NULL
                ORDER BY pb.tanggal_deadline_checkout ASC
            `);

            return rows;
        } catch (err) {
            throw err;
        }
    }
};
