
# Perpustakaan Sekolah

![Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![React](https://img.shields.io/badge/react-18.0.0-blue)
![MySQL](https://img.shields.io/badge/database-MySQL-orange)

Aplikasi web untuk mendigitalisasi proses administrasi perpustakaan sekolah. Sistem ini dirancang untuk mempermudah pengelolaan koleksi buku, peminjaman, data karyawan, serta pencatatan aktivitas pengunjung secara efisien dan terstruktur.

---

## Teknologi Utama

### Frontend

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB&style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0F172A?logo=tailwindcss&logoColor=06B6D4&style=for-the-badge)
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white&style=for-the-badge)
![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white&style=for-the-badge)
![Lucide](https://img.shields.io/badge/Lucide-000000?logo=lucide&logoColor=white&style=for-the-badge)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white&style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white&style=for-the-badge)
![mysql2](https://img.shields.io/badge/mysql2-00618A?style=for-the-badge)
![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge)


### Development Tools
- **Vite** – Alat build cepat dengan pengalaman pengembangan modern.
- **React Developer Tools** – Debugging komponen secara visual.

---

## Fitur Aplikasi

### 1. Manajemen Buku
- Penambahan, pengubahan, dan penghapusan data buku.
- Informasi lengkap (judul, pengarang, penerbit, tahun terbit, stok, lokasi).
- Menampilkan daftar buku secara terstruktur.

### 2. Manajemen Peminjaman
- Pencatatan peminjaman buku oleh pengunjung.
- Validasi stok sebelum proses peminjaman.
- Pembaruan status peminjaman.
- Perhitungan denda keterlambatan otomatis.

### 3. Manajemen Karyawan
- CRUD data karyawan perpustakaan.
- Pemilihan jabatan melalui dropdown.
- Validasi panjang karakter nomor telepon.

### 4. Aktivitas Pengunjung
- Pencatatan kedatangan pengunjung.
- Pembaruan status (“Masih di Perpus” / “Sudah Pulang”).
- Riwayat aktivitas yang dapat dilacak.

### 5. Antarmuka Pengguna
- Desain responsif berbasis TailwindCSS.
- Navigasi mudah melalui React Router.
- Ikon konsisten dengan Lucide React.


## Struktur Direktori

```bash
perpustakaan-sekolah/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── input.css
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/
│   ├── routes/
│   │   ├── buku.js
│   │   ├── peminjaman.js
│   │   ├── karyawan.js
│   │   └── aktivitas.js
│   ├── config/
│   │   └── db.js
│   ├── app.js
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore


## Instalasi dan Konfigurasi

### Prasyarat
- Node.js versi terbaru (≥ 18)
- npm atau yarn
- MySQL Server aktif di sistem Anda

---

## 1. Clone Repositori

```bash
git clone https://github.com/username-anda/perpustakaan-sekolah.git
cd perpustakaan-sekolah
````

---

## 2. Instalasi Dependensi

### Frontend

```bash
cd frontend
npm install
# atau
yarn install
```

### Backend

```bash
cd ../backend
npm install
# atau
yarn install
```

---

## 3. Konfigurasi Database

### Buat Database

```sql
CREATE DATABASE perpustakaan_sekolah;
```

### Buat Tabel

```sql
-- Tabel Buku
CREATE TABLE buku (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(200) NOT NULL,
    pengarang VARCHAR(100),
    penerbit VARCHAR(100),
    tahun_terbit INT,
    jumlah_stok INT NOT NULL DEFAULT 0,
    lokasi_rak VARCHAR(50)
);

-- Tabel Karyawan
CREATE TABLE karyawan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    jabatan VARCHAR(50),
    no_telepon VARCHAR(15),
    tgl_masuk DATE
);

-- Tabel Aktivitas Pengunjung
CREATE TABLE aktivitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_pengunjung VARCHAR(100) NOT NULL,
    keperluan VARCHAR(50) NOT NULL,
    catatan TEXT,
    waktu_masuk TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    waktu_pulang TIMESTAMP NULL,
    status ENUM('Masih di Perpus', 'Sudah Pulang') DEFAULT 'Masih di Perpus'
);

-- Tabel Peminjaman
CREATE TABLE peminjaman (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_peminjam VARCHAR(100) NOT NULL,
    buku_id INT NOT NULL,
    tgl_pinjam DATE NOT NULL,
    tgl_kembali DATE NOT NULL,
    status ENUM('dipinjam', 'dikembalikan') DEFAULT 'dipinjam',
    denda DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (buku_id) REFERENCES buku(id) ON DELETE CASCADE
);
```

---

## 4. Konfigurasi Environment Variable

### Backend (`backend/.env`)

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=perpustakaan_sekolah
```

### Frontend (Opsional)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 5. Menjalankan Aplikasi

### Backend

```bash
node app.js
# atau
npm run dev
```

Akses: **[http://localhost:5000](http://localhost:5000)**

### Frontend

```bash
npm run dev
# atau
yarn dev
```

Akses: **[http://localhost:5173](http://localhost:5173)**

---

## Kontribusi

Kontribusi sangat terbuka untuk pengembangan proyek ini.
Silakan ajukan *Issue* untuk pelaporan bug atau usulan fitur baru, serta *Pull Request* untuk kontribusi kode.

---

## Lisensi

Proyek ini menggunakan lisensi **MIT**.
Informasi lengkap tersedia di:
[https://choosealicense.com/licenses/mit/](https://choosealicense.com/licenses/mit/)

```

---


Tinggal beri tahu ya!
```
