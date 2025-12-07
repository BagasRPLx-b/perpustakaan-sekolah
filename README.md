Baik! Saya akan **menyusun ulang `README.md` Anda** agar setiap langkah instalasi (dari 1 hingga akhir) **disajikan dalam blok kode terpisah dan jelas**, sehingga tidak memusingkan dan mudah diikuti.

Berikut adalah versi `README.md` yang telah diperbaiki, siap salin-tempel:

```markdown
# Perpustakaan Sekolah

Aplikasi web berbasis web untuk mengelola perpustakaan sekolah secara digital. Aplikasi ini memungkinkan pustakawan mengelola koleksi buku, mencatat peminjaman, mengelola data karyawan, dan melacak aktivitas pengunjung perpustakaan secara real-time.

## Teknologi yang Digunakan

- **Frontend:**
  - [ReactJS](https://reactjs.org/): Framework JavaScript untuk membangun antarmuka pengguna.
  - [TailwindCSS](https://tailwindcss.com/): Framework CSS untuk styling yang cepat dan fleksibel.
  - [React Router DOM](https://reactrouter.com/): Untuk manajemen routing halaman.
  - [Axios](https://axios-http.com/): Untuk komunikasi HTTP antara frontend dan backend.
  - [Lucide React](https://lucide.dev/): Library ikon yang ringan dan konsisten untuk digunakan di komponen React.
- **Backend:**
  - [Node.js](https://nodejs.org/): Platform server-side JavaScript.
  - [ExpressJS](https://expressjs.com/): Framework web minimalis untuk Node.js.
  - [MySQL](https://www.mysql.com/): Sistem manajemen basis data relasional.
  - [mysql2](https://www.npmjs.com/package/mysql2): Driver MySQL untuk Node.js.
  - [dotenv](https://www.npmjs.com/package/dotenv): Untuk mengelola variabel lingkungan. *(Catatan: Proyek ini juga menggunakan `dotenvx` untuk mengamankan dan mengelola secrets secara opsional. Lihat `.env` dan dokumentasi `dotenvx` untuk detailnya.)*
- **Development Tools:**
  - [Vite](https://vitejs.dev/): Build tool cepat untuk proyek frontend.
  - [React Developer Tools](https://react.dev/link/react-devtools): Ekstensi browser untuk debugging komponen React. Gunakan React Developer Tools untuk menginspeksi komponen React, mengedit props dan state, serta mengidentifikasi masalah kinerja.

## Fitur Aplikasi

- **Manajemen Buku:**
  - Tambah, edit, hapus data buku (Judul, Pengarang, Penerbit, Tahun, Stok, Lokasi Rak).
  - Tampilkan daftar buku.
- **Manajemen Peminjaman:**
  - Catat peminjaman buku oleh pengunjung (Nama, ID Buku, Tanggal Pinjam, Tanggal Kembali).
  - Validasi stok buku saat peminjaman.
  - Update status peminjaman menjadi "Dikembalikan".
  - Hitung denda otomatis jika terlambat mengembalikan.
- **Manajemen Karyawan:**
  - Tambah, edit, hapus data karyawan.
  - Pilihan jabatan tetap (dropdown).
  - Batas karakter untuk nomor telepon.
- **Aktivitas Perpustakaan:**
  - Catat kedatangan pengunjung (Nama, Keperluan, Catatan).
  - Update status menjadi "Sudah Pulang".
  - Tampilkan daftar pengunjung aktif dan riwayat aktivitas.
- **Tampilan:**
  - Antarmuka pengguna yang responsif dan menarik menggunakan TailwindCSS.
  - Navigasi antar halaman menggunakan React Router.
  - Ikon-ikon intuitif dan konsisten menggunakan Lucide React.

## Struktur Proyek

```
perpustakaan-sekolah/
├── frontend/                 # Kode sumber frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/       # Komponen-komponen reusable (misal: Navbar)
│   │   ├── pages/            # Komponen halaman (misal: Buku, Peminjaman)
│   │   ├── App.jsx           # Komponen utama
│   │   ├── main.jsx          # Entry point aplikasi
│   │   └── input.css         # File CSS untuk Tailwind
│   ├── package.json          # Dependensi dan skrip frontend
│   └── tailwind.config.js    # Konfigurasi TailwindCSS
├── backend/                  # Kode sumber backend Express
│   ├── routes/
│   │   ├── buku.js           # Route CRUD buku
│   │   ├── peminjaman.js     # Route CRUD peminjaman
│   │   ├── karyawan.js       # Route CRUD karyawan
│   │   └── aktivitas.js      # Route CRUD aktivitas
│   ├── config/
│   │   └── db.js             # Konfigurasi koneksi database
│   ├── app.js                # File utama server Express
│   ├── package.json          # Dependensi dan skrip backend
│   └── .env                  # Variabel lingkungan (harus diatur sendiri)
├── README.md                 # File dokumentasi ini
└── .gitignore               # File yang diabaikan oleh Git
```

## Instalasi Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di mesin lokal Anda.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (versi terbaru)
- [npm](https://www.npmjs.com/get-npm) atau [yarn](https://yarnpkg.com/getting-started/install) (terinstal bersama Node.js)
- [MySQL](https://dev.mysql.com/downloads/mysql/) (server database)

---

### 1. Clone Repository

```bash
git clone https://github.com/username-anda/perpustakaan-sekolah.git
cd perpustakaan-sekolah
```

---

### 2. Instalasi Dependensi

#### Frontend

Masuk ke folder `frontend` dan instal dependensi:

```bash
cd frontend
npm install
# atau
yarn install
```

#### Backend

Buka terminal baru, kembali ke root folder, masuk ke `backend`, dan instal dependensi:

```bash
cd ../backend
npm install
# atau
yarn install
```

---

### 3. Konfigurasi Database

1.  **Instal dan Jalankan MySQL Server** di komputer Anda (misalnya melalui XAMPP, WAMP, atau instalasi langsung).
2.  **Buat Database Baru**. Anda bisa menggunakan `phpMyAdmin`, `MySQL Workbench`, atau klien terminal MySQL. Misalnya, buat database dengan nama `perpustakaan_sekolah`:
    ```sql
    CREATE DATABASE perpustakaan_sekolah;
    ```
3.  **Pilih database** yang baru dibuat.
4.  **Buat Tabel-tabel**. Jalankan skrip SQL berikut di database `perpustakaan_sekolah` Anda untuk membuat semua tabel yang diperlukan oleh aplikasi:

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

### 4. Konfigurasi Environment Variable

#### Backend

Di folder `backend`, buat file `.env` berdasarkan `.env.example` (jika ada) atau buat baru:

```env
PORT=5000
DB_HOST=localhost
DB_USER=nama_user_mysql_anda
DB_PASS=kata_sandi_mysql_anda
DB_NAME=perpustakaan_sekolah
```

Pastikan nama user dan password sesuai dengan konfigurasi MySQL Anda. Jika Anda menggunakan XAMPP/WAMP default, biasanya `DB_USER=root` dan `DB_PASS=` (kosong).

#### Frontend (Opsional)

Jika Anda perlu mengganti URL backend, Anda bisa membuat file `.env` di folder `frontend`:

```env
VITE_API_URL=http://localhost:5000/api
```
Lalu ubah semua panggilan `axios` di komponen React untuk menggunakan `import.meta.env.VITE_API_URL` sebagai prefix URL.

---

### 5. Menjalankan Aplikasi

#### Backend

Dari folder `backend`, jalankan server:

```bash
node app.js
# Atau jika menggunakan skrip di package.json:
npm run dev
```
Server akan berjalan di `http://localhost:5000`.

#### Frontend

Dari folder `frontend`, jalankan development server:

```bash
npm run dev
# Atau jika menggunakan skrip di package.json:
yarn dev
```
Frontend akan berjalan di `http://localhost:5173` (atau port lain jika 5173 digunakan).

Buka `http://localhost:5173` di browser Anda. Aplikasi seharusnya sekarang terhubung ke backend dan berfungsi sepenuhnya.

## Kontribusi

Kontribusi sangat dianjurkan! Silakan buka *Issues* untuk melaporkan bug atau mengusulkan fitur baru. Untuk kontribusi kode, silakan buat *Pull Request*.

## Lisensi

[MIT](https://choosealicense.com/licenses/mit/)
```
