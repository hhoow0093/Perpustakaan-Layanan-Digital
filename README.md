// Library Management System Database Schema

Table USER_AKUN {
  UserID varchar(7) [pk]
  email varchar(50) [not null, unique]
  password varchar(50) [not null]
  role varchar(10) [not null, note: 'user or admin']
}

Table DOSEN {
  NID varchar(7) [pk]
  Nama_depan varchar(50) [not null]
  Nama_belakang varchar(50)
  Jenis_kelamin varchar(1) [not null, note: 'M or F']
  Prodi varchar(50)
  UserID varchar(7) [not null, unique, ref: - USER_AKUN.UserID]
}

Table MAHASISWA {
  NIM varchar(7) [pk]
  Nama_depan varchar(50) [not null]
  Nama_belakang varchar(50)
  UserID varchar(7) [not null, unique, ref: - USER_AKUN.UserID]
}

Table STAFF {
  NIS varchar(7) [pk]
  Nama_depan varchar(50) [not null]
  Nama_belakang varchar(50)
  UserID varchar(7) [not null, unique, ref: - USER_AKUN.UserID]
}

Table RUANGAN {
  NIR varchar(7) [pk]
  Nama_ruangan varchar(50) [not null]
  Batas_Jumlah int [not null]
}

Table BUKU {
  NIB varchar(7) [pk]
  Judul varchar(50) [not null]
  Genre varchar(20) [not null]
  Denda decimal(10,2)
}

Table PEMINJAMAN_BUKU {
  pinjam_BUKU_ID varchar(7) [pk]
  tanggal_peminjaman date [not null]
  tanggal_checkout date
  tanggal_deadline_pinjam date [not null]
  Nomor_Induk_Buku varchar(7) [not null, ref: > BUKU.NIB]
  UserID_Peminjam_Buku varchar(7) [not null, ref: > USER_AKUN.UserID]
}

Table PEMINJAMAN_RUANGAN {
  pinjam_ruangan_ID varchar(7) [pk]
  tanggal_peminjaman date [not null]
  jam_masuk timestamp [not null]
  jam_keluar timestamp [not null]
  Nomor_Induk_Ruangan varchar(7) [not null, ref: > RUANGAN.NIR]
  UserID_Peminjam_Ruangan varchar(7) [not null, ref: > USER_AKUN.UserID]
}
