-- =========================
-- TABLE: USER_AKUN
-- =========================
CREATE TABLE USER_AKUN (
    UserID VARCHAR(7) PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL
);

-- =========================
-- TABLE: DOSEN
-- =========================
CREATE TABLE DOSEN (
    NID VARCHAR(7) PRIMARY KEY,
    Nama_depan VARCHAR(50),
    Nama_belakang VARCHAR(50),
    Jenis_kelamin ENUM('M', 'F'),
    Prodi VARCHAR(50),
    UserID VARCHAR(7),
    UNIQUE(UserID),
    FOREIGN KEY (UserID) REFERENCES USER_AKUN(UserID)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- =========================
-- TABLE: MAHASISWA
-- =========================
CREATE TABLE MAHASISWA (
    NIM VARCHAR(7) PRIMARY KEY,
    Nama_depan VARCHAR(50),
    Nama_belakang VARCHAR(50),
    UserID VARCHAR(7),
    UNIQUE(UserID),
    FOREIGN KEY (UserID) REFERENCES USER_AKUN(UserID)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- =========================
-- TABLE: STAFF
-- =========================
CREATE TABLE STAFF (
    NIS VARCHAR(7) PRIMARY KEY,
    Nama_depan VARCHAR(50),
    Nama_belakang VARCHAR(50),
    UserID VARCHAR(7),
    UNIQUE(UserID),
    FOREIGN KEY (UserID) REFERENCES USER_AKUN(UserID)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- =========================
-- TABLE: RUANGAN
-- =========================
CREATE TABLE RUANGAN (
    NIR VARCHAR(7) PRIMARY KEY,
    Nama_ruangan VARCHAR(50),
    Batas_Jumlah INT
);

-- =========================
-- TABLE: BUKU
-- =========================
CREATE TABLE BUKU (
    NIB VARCHAR(7) PRIMARY KEY,
    Judul VARCHAR(50),
    Genre ENUM('Novel', 'Komik', 'Jurnal', 'Lainnya')
);

-- =========================
-- TABLE: PEMINJAMAN_BUKU
-- =========================
CREATE TABLE PEMINJAMAN_BUKU (
    pinjam_BUKU_ID VARCHAR(7) PRIMARY KEY,
    tanggal_peminjaman DATE NOT NULL,
    tanggal_checkout DATE,
    tanggal_deadline_checkout DATE,
    Nomor_Induk_Buku VARCHAR(7),
    UserID_Peminjam_Buku VARCHAR(7),
    DENDA DECIMAL(10,2),

    FOREIGN KEY (Nomor_Induk_Buku) REFERENCES BUKU(NIB)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (UserID_Peminjam_Buku) REFERENCES USER_AKUN(UserID)
        ON DELETE CASCADE ON UPDATE CASCADE,

    UNIQUE (Nomor_Induk_Buku, tanggal_peminjaman, tanggal_checkout)
);

-- =========================
-- TABLE: PEMINJAMAN_RUANGAN
-- =========================
CREATE TABLE PEMINJAMAN_RUANGAN (
    pinjam_ruangan_ID VARCHAR(7) PRIMARY KEY,
    tanggal_peminjaman DATE NOT NULL,
    jam_masuk DATETIME NOT NULL,
    jam_keluar DATETIME NOT NULL,
    Nomor_Induk_Ruangan VARCHAR(7),
    UserID_Peminjam_Ruangan VARCHAR(7),

    FOREIGN KEY (Nomor_Induk_Ruangan) REFERENCES RUANGAN(NIR)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (UserID_Peminjam_Ruangan) REFERENCES USER_AKUN(UserID)
        ON DELETE CASCADE ON UPDATE CASCADE,

    UNIQUE (Nomor_Induk_Ruangan, tanggal_peminjaman, jam_masuk, jam_keluar)
);
