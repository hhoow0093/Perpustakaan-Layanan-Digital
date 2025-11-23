-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2025 at 12:56 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `perpustakaan-digital`
--

-- --------------------------------------------------------

--
-- Table structure for table `buku`
--

CREATE TABLE `buku` (
  `NIB` varchar(7) NOT NULL,
  `Judul` varchar(50) DEFAULT NULL,
  `Genre` enum('Novel','Komik','Jurnal','Lainnya') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buku`
--

INSERT INTO `buku` (`NIB`, `Judul`, `Genre`) VALUES
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

-- --------------------------------------------------------

--
-- Table structure for table `dosen`
--

CREATE TABLE `dosen` (
  `NID` varchar(7) NOT NULL,
  `Nama_depan` varchar(50) DEFAULT NULL,
  `Nama_belakang` varchar(50) DEFAULT NULL,
  `Jenis_kelamin` enum('M','F') DEFAULT NULL,
  `Prodi` varchar(50) DEFAULT NULL,
  `UserID` varchar(7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dosen`
--

INSERT INTO `dosen` (`NID`, `Nama_depan`, `Nama_belakang`, `Jenis_kelamin`, `Prodi`, `UserID`) VALUES
('DSN0001', 'Adi', 'Santoso', 'M', 'Informatika', NULL),
('DSN0002', 'Budi', 'Saputra', 'M', 'Sistem Informasi', NULL),
('DSN0003', 'Citra', 'Pratiwi', 'F', 'Teknik Elektro', NULL),
('DSN0004', 'Dian', 'Gunawan', 'M', 'Informatika', NULL),
('DSN0005', 'Erika', 'Putri', 'F', 'Manajemen', NULL),
('DSN0006', 'Farhan', 'Hadi', 'M', 'Informatika', NULL),
('DSN0007', 'Gita', 'Maharani', 'F', 'Akuntansi', NULL),
('DSN0008', 'Hendra', 'Wijaya', 'M', 'Sistem Informasi', NULL),
('DSN0009', 'Indah', 'Sari', 'F', 'Informatika', NULL),
('DSN0010', 'Joko', 'Pranoto', 'M', 'Teknik Elektro', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mahasiswa`
--

CREATE TABLE `mahasiswa` (
  `NIM` varchar(7) NOT NULL,
  `Nama_depan` varchar(50) DEFAULT NULL,
  `Nama_belakang` varchar(50) DEFAULT NULL,
  `UserID` varchar(7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mahasiswa`
--

INSERT INTO `mahasiswa` (`NIM`, `Nama_depan`, `Nama_belakang`, `UserID`) VALUES
('MHS0001', 'Andi', 'Setiawan', 'USR0002'),
('MHS0002', 'Bintang', 'Rahman', NULL),
('MHS0003', 'Cindy', 'Lestari', NULL),
('MHS0004', 'Dewi', 'Amelia', NULL),
('MHS0005', 'Eka', 'Wijaya', NULL),
('MHS0006', 'Fajar', 'Susanto', NULL),
('MHS0007', 'Galih', 'Saputra', NULL),
('MHS0008', 'Hana', 'Salsabila', NULL),
('MHS0009', 'Indra', 'Firmansyah', NULL),
('MHS0010', 'Jihan', 'Nabila', NULL),
('MHS0011', 'Howard', 'Test', 'USR0001');

-- --------------------------------------------------------

--
-- Table structure for table `peminjaman_buku`
--

CREATE TABLE `peminjaman_buku` (
  `pinjam_BUKU_ID` varchar(7) NOT NULL,
  `tanggal_peminjaman` date NOT NULL,
  `tanggal_checkout` date DEFAULT NULL,
  `tanggal_deadline_checkout` date DEFAULT NULL,
  `Nomor_Induk_Buku` varchar(7) DEFAULT NULL,
  `UserID_Peminjam_Buku` varchar(7) DEFAULT NULL,
  `DENDA` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `peminjaman_buku`
--

INSERT INTO `peminjaman_buku` (`pinjam_BUKU_ID`, `tanggal_peminjaman`, `tanggal_checkout`, `tanggal_deadline_checkout`, `Nomor_Induk_Buku`, `UserID_Peminjam_Buku`, `DENDA`) VALUES
('PMB0001', '2025-11-23', NULL, '2025-11-30', 'BKU0001', 'USR0001', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `peminjaman_ruangan`
--

CREATE TABLE `peminjaman_ruangan` (
  `pinjam_ruangan_ID` varchar(7) NOT NULL,
  `tanggal_peminjaman` date NOT NULL,
  `jam_masuk` datetime NOT NULL,
  `jam_keluar` datetime NOT NULL,
  `Nomor_Induk_Ruangan` varchar(7) DEFAULT NULL,
  `UserID_Peminjam_Ruangan` varchar(7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `peminjaman_ruangan`
--

INSERT INTO `peminjaman_ruangan` (`pinjam_ruangan_ID`, `tanggal_peminjaman`, `jam_masuk`, `jam_keluar`, `Nomor_Induk_Ruangan`, `UserID_Peminjam_Ruangan`) VALUES
('PMR0001', '2025-11-23', '2025-11-23 10:00:00', '2025-11-23 12:00:00', 'RNG0001', 'USR0001'),
('PMR0002', '2025-11-23', '2025-11-23 22:09:00', '2025-11-23 12:09:00', 'RNG0001', 'USR0002');

-- --------------------------------------------------------

--
-- Table structure for table `ruangan`
--

CREATE TABLE `ruangan` (
  `NIR` varchar(7) NOT NULL,
  `Nama_ruangan` varchar(50) DEFAULT NULL,
  `Batas_Jumlah` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ruangan`
--

INSERT INTO `ruangan` (`NIR`, `Nama_ruangan`, `Batas_Jumlah`) VALUES
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

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `NIS` varchar(7) NOT NULL,
  `Nama_depan` varchar(50) DEFAULT NULL,
  `Nama_belakang` varchar(50) DEFAULT NULL,
  `UserID` varchar(7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`NIS`, `Nama_depan`, `Nama_belakang`, `UserID`) VALUES
('STF0001', 'Ayu', 'Wulandari', 'USR0003'),
('STF0002', 'Bagus', 'Prakoso', NULL),
('STF0003', 'Chandra', 'Putra', NULL),
('STF0004', 'Dodi', 'Firmansyah', NULL),
('STF0005', 'Evi', 'Lestari', NULL),
('STF0006', 'Fina', 'Kusuma', NULL),
('STF0007', 'Gilang', 'Aditya', NULL),
('STF0008', 'Hilma', 'Karina', NULL),
('STF0009', 'Irfan', 'Yusuf', NULL),
('STF0010', 'Joni', 'Santoso', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_akun`
--

CREATE TABLE `user_akun` (
  `UserID` varchar(7) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_akun`
--

INSERT INTO `user_akun` (`UserID`, `email`, `password`, `role`) VALUES
('USR0001', 'howard@student.umn.ac.id', '$2b$10$UVUp3JIO7yiLTUeIWXKB2e7CihtqCEnZEGLNlFO3iXKHpDQ9DspKK', 'user'),
('USR0002', 'andi@student.umn.ac.id', '$2b$10$23wjeutzLg17vylojh31mejhF9aF2CSwL1Fh3kLBY4zjNKT47o02a', 'user'),
('USR0003', 'ayu@admin.com', '$2b$10$MjWtsl3YbbXQSTcs8BhzvuMrUMWK8MzUDNb2e3NsrBRtgVWDzAxeC', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `buku`
--
ALTER TABLE `buku`
  ADD PRIMARY KEY (`NIB`);

--
-- Indexes for table `dosen`
--
ALTER TABLE `dosen`
  ADD PRIMARY KEY (`NID`),
  ADD UNIQUE KEY `UserID` (`UserID`);

--
-- Indexes for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD PRIMARY KEY (`NIM`),
  ADD UNIQUE KEY `UserID` (`UserID`);

--
-- Indexes for table `peminjaman_buku`
--
ALTER TABLE `peminjaman_buku`
  ADD PRIMARY KEY (`pinjam_BUKU_ID`),
  ADD UNIQUE KEY `Nomor_Induk_Buku` (`Nomor_Induk_Buku`,`tanggal_peminjaman`,`tanggal_checkout`),
  ADD KEY `UserID_Peminjam_Buku` (`UserID_Peminjam_Buku`);

--
-- Indexes for table `peminjaman_ruangan`
--
ALTER TABLE `peminjaman_ruangan`
  ADD PRIMARY KEY (`pinjam_ruangan_ID`),
  ADD UNIQUE KEY `Nomor_Induk_Ruangan` (`Nomor_Induk_Ruangan`,`tanggal_peminjaman`,`jam_masuk`,`jam_keluar`),
  ADD KEY `UserID_Peminjam_Ruangan` (`UserID_Peminjam_Ruangan`);

--
-- Indexes for table `ruangan`
--
ALTER TABLE `ruangan`
  ADD PRIMARY KEY (`NIR`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`NIS`),
  ADD UNIQUE KEY `UserID` (`UserID`);

--
-- Indexes for table `user_akun`
--
ALTER TABLE `user_akun`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dosen`
--
ALTER TABLE `dosen`
  ADD CONSTRAINT `dosen_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user_akun` (`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD CONSTRAINT `mahasiswa_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user_akun` (`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `peminjaman_buku`
--
ALTER TABLE `peminjaman_buku`
  ADD CONSTRAINT `peminjaman_buku_ibfk_1` FOREIGN KEY (`Nomor_Induk_Buku`) REFERENCES `buku` (`NIB`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `peminjaman_buku_ibfk_2` FOREIGN KEY (`UserID_Peminjam_Buku`) REFERENCES `user_akun` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `peminjaman_ruangan`
--
ALTER TABLE `peminjaman_ruangan`
  ADD CONSTRAINT `peminjaman_ruangan_ibfk_1` FOREIGN KEY (`Nomor_Induk_Ruangan`) REFERENCES `ruangan` (`NIR`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `peminjaman_ruangan_ibfk_2` FOREIGN KEY (`UserID_Peminjam_Ruangan`) REFERENCES `user_akun` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user_akun` (`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
