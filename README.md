# Database Schema
```mermaid

erDiagram

    DOSEN {
        VARCHAR(7) NID "PK" 
        VARCHAR(50) Nama_depan
        VARCHAR(50) Nama_belakang
        ENUM Jenis_kelamin  "M or F"
        VARCHAR(50) Prodi
        VARCHAR(7) UserID FK
    }

    MAHASISWA {
        VARCHAR(7) NIM "PK"
        VARCHAR(50) Nama_depan 
        VARCHAR(50) Nama_belakang
        VARCHAR(7) UserID FK
    }

    STAFF{
        VARCHAR(7) NIS "PK"
        VARCHAR(50) Nama_depan
        VARCHAR(50) Nama_belakang
        VARCHAR(7) UserID FK
    }

    RUANGAN{
        VARCHAR(7) NIR "PK"
        VARCHAR(50) Nama_ruangan
        INT Batas_Jumlah
    }

    BUKU{
        VARCHAR(7) NIB "PK"
        VARCHAR(50) Judul
        ENUM Genre   
    }

    USER_AKUN{
        VARCHAR(7) UserID PK
        VARCHAR(50) email 
        VARCHAR(50) password
        ENUM role "user or admin"
    }

    PEMINJAMAN_BUKU{
        VARCHAR(7) pinjam_BUKU_ID "PK"
        DATE tanggal_peminjaman 
        DATE tanggal_checkout 
        DATE tanggal_deadline_checkout
        VARCHAR(7) Nomor_Induk_Buku FK 
        VARCHAR(7) UserID_Peminjam_Buku FK 
        DECIMAL DENDA
        %% UNIQUE(Nomor_Induk_Buku, tanggal_peminjaman, tanggal_checkout) 
    }

    PEMINJAMAN_RUANGAN{
        VARCHAR(7) pinjam_ruangan_ID "PK"
        DATE tanggal_peminjaman 
        TIMESTAMP jam_masuk 
        TIMESTAMP jam_keluar 
        VARCHAR(7) Nomor_Induk_Ruangan FK 
        VARCHAR(7) UserID_Peminjam_Ruangan FK
        %% UNIQUE(Nomor_Induk_Ruangan, tanggal_peminjaman, jam_masuk, jam_keluar) 
    }


    USER_AKUN ||--o{ PEMINJAMAN_BUKU : "memiliki"
    USER_AKUN ||--o{ PEMINJAMAN_RUANGAN : "memiliki"
    BUKU ||--o{ PEMINJAMAN_BUKU : "memiliki" 
    RUANGAN ||--o{ PEMINJAMAN_RUANGAN : "memiliki"
    STAFF }|--|| USER_AKUN : "memiliki" 
    MAHASISWA }|--|| USER_AKUN : "memiliki" 
    DOSEN }|--|| USER_AKUN : "memiliki" 

```

# 🚀 Run the Project Locally

Follow these steps to set up and run the **Perpustakaan Layanan Digital** project on your machine.

---

## ✅ 1. Clone the Repository

```bash
# Download the project
git clone https://github.com/hhoow0093/Perpustakaan-Layanan-Digital.git

# Navigate into the project folder
cd your-project
```

---

## 🛠️ 2. Backend Setup

### 📂 2.1 Navigate to Backend Folder & Install Dependencies

```bash
cd backend
npm install
```

### 🔐 2.2 Create `.env` File

Create a new file named `.env` inside the backend folder and insert:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=""
DB_NAME=perpustakaan-digital
PORT=5000
```

### ▶️ Start Backend Server

```bash
npm run dev
```

---

## 🧰 XAMPP / Database Setup

1. Open **phpMyAdmin**
2. Create a new database named: `perpustakaan-digital`
3. Import all **DDL & dummy data** located in:  
   `/backend/config/database/*`

---

## 🎨 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

✅ You're all set! Both backend & frontend should be running successfully.  
Happy coding! 🎯  
If you face any issues, feel free to open an issue or ask the team 🤝
