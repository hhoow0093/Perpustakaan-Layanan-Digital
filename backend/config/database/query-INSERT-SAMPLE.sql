INSERT INTO USER_AKUN (UserID, email, password, role) VALUES
('USR0001', 'admin1@campus.com', 'pass123', 'admin'),
('USR0002', 'dosen1@campus.com', 'pass123', 'user'),
('USR0003', 'dosen2@campus.com', 'pass123', 'user'),
('USR0004', 'dosen3@campus.com', 'pass123', 'user'),
('USR0005', 'mhs1@campus.com', 'pass123', 'user'),
('USR0006', 'mhs2@campus.com', 'pass123', 'user'),
('USR0007', 'mhs3@campus.com', 'pass123', 'user'),
('USR0008', 'staff1@campus.com', 'pass123', 'admin'),
('USR0009', 'staff2@campus.com', 'pass123', 'admin'),
('USR0010', 'staff3@campus.com', 'pass123', 'admin');


INSERT INTO DOSEN (NID, Nama_depan, Nama_belakang, Jenis_kelamin, Prodi, UserID) VALUES
('DSN0001', 'Adi', 'Santoso', 'M', 'Informatika', 'USR0002'),
('DSN0002', 'Budi', 'Saputra', 'M', 'Sistem Informasi', 'USR0003'),
('DSN0003', 'Citra', 'Pratiwi', 'F', 'Teknik Elektro', 'USR0004'),
('DSN0004', 'Dian', 'Gunawan', 'M', 'Informatika', NULL),
('DSN0005', 'Erika', 'Putri', 'F', 'Manajemen', NULL),
('DSN0006', 'Farhan', 'Hadi', 'M', 'Informatika', NULL),
('DSN0007', 'Gita', 'Maharani', 'F', 'Akuntansi', NULL),
('DSN0008', 'Hendra', 'Wijaya', 'M', 'Sistem Informasi', NULL),
('DSN0009', 'Indah', 'Sari', 'F', 'Informatika', NULL),
('DSN0010', 'Joko', 'Pranoto', 'M', 'Teknik Elektro', NULL);


INSERT INTO MAHASISWA (NIM, Nama_depan, Nama_belakang, UserID) VALUES
('MHS0001', 'Andi', 'Setiawan', 'USR0005'),
('MHS0002', 'Bintang', 'Rahman', 'USR0006'),
('MHS0003', 'Cindy', 'Lestari', 'USR0007'),
('MHS0004', 'Dewi', 'Amelia', NULL),
('MHS0005', 'Eka', 'Wijaya', NULL),
('MHS0006', 'Fajar', 'Susanto', NULL),
('MHS0007', 'Galih', 'Saputra', NULL),
('MHS0008', 'Hana', 'Salsabila', NULL),
('MHS0009', 'Indra', 'Firmansyah', NULL),
('MHS0010', 'Jihan', 'Nabila', NULL);

INSERT INTO STAFF (NIS, Nama_depan, Nama_belakang, UserID) VALUES
('STF0001', 'Ayu', 'Wulandari', 'USR0008'),
('STF0002', 'Bagus', 'Prakoso', 'USR0009'),
('STF0003', 'Chandra', 'Putra', 'USR0010'),
('STF0004', 'Dodi', 'Firmansyah', NULL),
('STF0005', 'Evi', 'Lestari', NULL),
('STF0006', 'Fina', 'Kusuma', NULL),
('STF0007', 'Gilang', 'Aditya', NULL),
('STF0008', 'Hilma', 'Karina', NULL),
('STF0009', 'Irfan', 'Yusuf', NULL),
('STF0010', 'Joni', 'Santoso', NULL);

INSERT INTO RUANGAN (NIR, Nama_ruangan, Batas_Jumlah) VALUES
('RNG0001', 'Ruang Lab 1', 40),
('RNG0002', 'Ruang Lab 2', 35),
('RNG0003', 'Ruang Rapat', 20),
('RNG0004', 'Auditorium', 200),
('RNG0005', 'Ruang Kelas A', 50),
('RNG0006', 'Ruang Kelas B', 50),
('RNG0007', 'Ruang Kelas C', 40),
('RNG0008', 'Ruang Bahasa', 30),
('RNG0009', 'Ruang Multimedia', 25),
('RNG0010', 'Ruang Perpustakaan', 80);

INSERT INTO BUKU (NIB, Judul, Genre) VALUES
('BKU0001', 'Pemrograman Dasar', 'Jurnal'),
('BKU0002', 'Dasar AI', 'Jurnal'),
('BKU0003', 'Matematika Diskrit', 'Jurnal'),
('BKU0004', 'One Piece Vol.1', 'Komik'),
('BKU0005', 'Naruto Vol.10', 'Komik'),
('BKU0006', 'Novel Laskar Pelangi', 'Novel'),
('BKU0007', 'Novel Bumi', 'Novel'),
('BKU0008', 'Database Handbook', 'Jurnal'),
('BKU0009', 'Teknologi Blockchain', 'Jurnal'),
('BKU0010', 'Ensiklopedia Umum', 'Lainnya');

INSERT INTO PEMINJAMAN_BUKU (
    pinjam_BUKU_ID, tanggal_peminjaman, tanggal_checkout, tanggal_deadline_checkout,
    Nomor_Induk_Buku, UserID_Peminjam_Buku, DENDA
) VALUES
('PMB0001', '2025-01-01', '2025-01-05', '2025-01-07', 'BKU0001', 'USR0005', 0.00),
('PMB0002', '2025-01-02', '2025-01-06', '2025-01-08', 'BKU0002', 'USR0006', 0.00),
('PMB0003', '2025-01-03', NULL, '2025-01-10', 'BKU0003', 'USR0007', 5000.00),
('PMB0004', '2025-01-04', '2025-01-06', '2025-01-11', 'BKU0004', 'USR0005', 0.00),
('PMB0005', '2025-01-05', NULL, '2025-01-12', 'BKU0005', 'USR0006', 0.00),
('PMB0006', '2025-01-06', '2025-01-07', '2025-01-13', 'BKU0006', 'USR0007', 0.00),
('PMB0007', '2025-01-07', NULL, '2025-01-14', 'BKU0007', 'USR0005', 2000.00),
('PMB0008', '2025-01-08', '2025-01-09', '2025-01-15', 'BKU0008', 'USR0006', 0.00),
('PMB0009', '2025-01-09', '2025-01-12', '2025-01-16', 'BKU0009', 'USR0007', 0.00),
('PMB0010', '2025-01-10', NULL, '2025-01-17', 'BKU0010', 'USR0005', 10000.00);

INSERT INTO PEMINJAMAN_RUANGAN (
    pinjam_ruangan_ID, tanggal_peminjaman, jam_masuk, jam_keluar,
    Nomor_Induk_Ruangan, UserID_Peminjam_Ruangan
) VALUES
('PMR0001', '2025-02-01', '2025-02-01 08:00:00', '2025-02-01 10:00:00', 'RNG0001', 'USR0005'),
('PMR0002', '2025-02-02', '2025-02-02 09:00:00', '2025-02-02 11:00:00', 'RNG0002', 'USR0006'),
('PMR0003', '2025-02-03', '2025-02-03 13:00:00', '2025-02-03 15:00:00', 'RNG0003', 'USR0007'),
('PMR0004', '2025-02-04', '2025-02-04 08:00:00', '2025-02-04 12:00:00', 'RNG0004', 'USR0005'),
('PMR0005', '2025-02-05', '2025-02-05 10:00:00', '2025-02-05 12:00:00', 'RNG0005', 'USR0006'),
('PMR0006', '2025-02-06', '2025-02-06 14:00:00', '2025-02-06 16:00:00', 'RNG0006', 'USR0007'),
('PMR0007', '2025-02-07', '2025-02-07 09:00:00', '2025-02-07 11:00:00', 'RNG0007', 'USR0005'),
('PMR0008', '2025-02-08', '2025-02-08 08:00:00', '2025-02-08 12:00:00', 'RNG0008', 'USR0006'),
('PMR0009', '2025-02-09', '2025-02-09 13:00:00', '2025-02-09 15:00:00', 'RNG0009', 'USR0007'),
('PMR0010', '2025-02-10', '2025-02-10 10:00:00', '2025-02-10 14:00:00', 'RNG0010', 'USR0005');
