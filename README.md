
```markdown
# 🏫 Sistem Manajemen Perpustakaan Sekolah

Aplikasi web full-stack untuk mengelola operasional perpustakaan sekolah secara digital dan terintegrasi. Sistem ini dirancang khusus untuk membantu pustakawan dalam mengelola koleksi buku, peminjaman, karyawan, dan aktivitas pengunjung dengan antarmuka yang modern dan user-friendly.

![Sistem Manajemen Perpustakaan](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Fitur Utama

### 📚 **Manajemen Buku**
- ✅ Tambah, edit, hapus data buku
- ✅ Pencarian dan filter buku
- ✅ Monitoring stok buku real-time
- ✅ Visualisasi data dengan statistik
- ✅ Badge warna untuk status stok (hijau/kuning/merah)

### 🔄 **Manajemen Peminjaman**
- ✅ Catat peminjaman dengan validasi stok
- ✅ Sistem denda otomatis untuk keterlambatan
- ✅ Dashboard statistik peminjaman
- ✅ Filter berdasarkan status (dipinjam/dikembalikan)
- ✅ Tracking pengembalian dengan one-click

### 👥 **Manajemen Karyawan**
- ✅ Manajemen data staf perpustakaan
- ✅ Pilihan jabatan dengan dropdown terstruktur
- ✅ Perhitungan masa kerja otomatis
- ✅ Visualisasi distribusi jabatan
- ✅ Form dengan validasi lengkap

### 📊 **Aktivitas Pengunjung**
- ✅ Catat kedatangan pengunjung real-time
- ✅ Monitoring pengunjung aktif
- ✅ Dashboard aktivitas harian
- ✅ Statistik keperluan kunjungan
- ✅ Durasi kunjungan otomatis

## 🛠️ Teknologi yang Digunakan

### **Frontend:**
- **React 18** - UI Library
- **TailwindCSS** - Styling Framework
- **React Router DOM** - Navigation
- **Axios** - HTTP Client
- **Lucide React** - Icon Library

### **Backend:**
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MySQL** - Database
- **mysql2** - Database Driver
- **CORS** - Cross-Origin Resource Sharing

### **Development Tools:**
- **Vite** - Build Tool & Dev Server
- **Postman** - API Testing
- **Git** - Version Control
- **ESLint** - Code Linting

## 📁 Struktur Proyek

```
perpustakaan-sekolah/
├── frontend/                 # React Application
│   ├── src/
│   │   ├── components/       # Reusable Components
│   │   │   └── Navbar.jsx    # Navigation Component
│   │   ├── pages/           # Page Components
│   │   │   ├── App.jsx      # Main Book Management
│   │   │   ├── Peminjaman.jsx
│   │   │   ├── Karyawan.jsx
│   │   │   └── Aktivitas.jsx
│   │   ├── App.css          # Global Styles
│   │   └── main.jsx         # Application Entry
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Express.js Server
│   ├── routes/
│   │   ├── buku.js          # Book Routes
│   │   ├── peminjaman.js    # Loan Routes
│   │   ├── karyawan.js      # Employee Routes
│   │   └── aktivitas.js     # Activity Routes
│   ├── config/
│   │   └── db.js           # Database Configuration
│   ├── app.js              # Main Server File
│   └── package.json
└── README.md               # This Documentation
```

## 🚀 Instalasi dan Setup

### **Prerequisites:**
- Node.js (v18 atau lebih baru)
- MySQL (v8.0 atau lebih baru)
- npm atau yarn

### **Langkah 1: Clone Repository**
```bash
git clone https://github.com/yourusername/perpustakaan-sekolah.git
cd perpustakaan-sekolah
```

### **Langkah 2: Setup Database**
1. Buat database MySQL:
```sql
CREATE DATABASE perpustakaan_sekolah;
```

2. Jalankan skrip SQL berikut:
```sql
-- Tabel Buku
CREATE TABLE buku (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(200) NOT NULL,
    pengarang VARCHAR(100),
    penerbit VARCHAR(100),
    tahun_terbit INT,
    jumlah_stok INT NOT NULL DEFAULT 0,
    lokasi_rak VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Peminjaman
CREATE TABLE peminjaman (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_peminjam VARCHAR(100) NOT NULL,
    buku_id INT NOT NULL,
    judul_buku VARCHAR(200),
    tgl_pinjam DATE NOT NULL,
    tgl_kembali DATE NOT NULL,
    status ENUM('dipinjam', 'dikembalikan') DEFAULT 'dipinjam',
    denda DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buku_id) REFERENCES buku(id) ON DELETE CASCADE
);

-- Tabel Karyawan
CREATE TABLE karyawan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    jabatan VARCHAR(50) NOT NULL,
    no_telepon VARCHAR(15),
    email VARCHAR(100),
    tgl_masuk DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Aktivitas
CREATE TABLE aktivitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_pengunjung VARCHAR(100) NOT NULL,
    keperluan VARCHAR(50) NOT NULL,
    catatan TEXT,
    waktu_masuk TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    waktu_pulang TIMESTAMP NULL,
    status ENUM('Masih di Perpus', 'Sudah Pulang') DEFAULT 'Masih di Perpus',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Langkah 3: Setup Backend**
```bash
cd backend
npm install
```

Buat file `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=perpustakaan_sekolah
```

### **Langkah 4: Setup Frontend**
```bash
cd ../frontend
npm install
```

### **Langkah 5: Jalankan Aplikasi**
**Backend:**
```bash
cd backend
npm start
```
Server berjalan di `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm run dev
```
Aplikasi berjalan di `http://localhost:5173`

## 📱 Halaman dan Fitur

### **1. Dashboard Buku (`/`)**
- **Form Tambah Buku**: Input lengkap data buku
- **Daftar Buku**: Tabel dengan edit inline
- **Search & Filter**: Pencarian real-time
- **Stats Cards**: Total buku, stok, rak, status

### **2. Manajemen Peminjaman (`/peminjaman`)**
- **Form Peminjaman**: Dengan validasi stok
- **Denda Otomatis**: Rp 2.000/hari keterlambatan
- **Pengembalian**: One-click return system
- **Dashboard**: Statistik peminjaman

### **3. Manajemen Karyawan (`/karyawan`)**
- **Form Karyawan**: Data lengkap dengan email
- **Dropdown Jabatan**: 8 pilihan jabatan
- **Masa Kerja**: Perhitungan otomatis
- **Distribusi**: Visualisasi per jabatan

### **4. Aktivitas Pengunjung (`/aktivitas`)**
- **Catat Kedatangan**: Form dengan keperluan
- **Pengunjung Aktif**: Monitoring real-time
- **Riwayat**: Filter berdasarkan tanggal/status
- **Analytics**: Statistik keperluan kunjungan

## 🔧 API Endpoints

### **Buku**
```
GET    /api/buku           # Get all books
GET    /api/buku/:id       # Get single book
POST   /api/buku           # Create new book
PUT    /api/buku/:id       # Update book
DELETE /api/buku/:id       # Delete book
```

### **Peminjaman**
```
GET    /api/peminjaman              # Get all loans
POST   /api/peminjaman              # Create new loan
PUT    /api/peminjaman/:id/status   # Update loan status
GET    /api/peminjaman/aktif        # Get active loans
```

### **Karyawan**
```
GET    /api/karyawan       # Get all employees
POST   /api/karyawan       # Add new employee
PUT    /api/karyawan/:id   # Update employee
DELETE /api/karyawan/:id   # Delete employee
```

### **Aktivitas**
```
GET    /api/aktivitas              # Get all activities
GET    /api/aktivitas/aktif        # Get active visitors
POST   /api/aktivitas              # Record new activity
PUT    /api/aktivitas/:id/pulang   # Mark as returned
```

## 🎨 UI/UX Features

### **Design System:**
- **Gradient Backgrounds**: Profesional dan modern
- **Card-based Layout**: Rapi dan terorganisir
- **Consistent Color Scheme**: Biru sebagai warna utama
- **Responsive Design**: Optimal di semua device

### **User Experience:**
- **Real-time Search**: Filter data secara instan
- **Inline Editing**: Edit data tanpa pindah halaman
- **Loading States**: Feedback visual untuk proses
- **Empty States**: UI yang informatif saat kosong
- **Confirmation Dialogs**: Mencegah aksi tidak sengaja

### **Visual Indicators:**
- **Status Badges**: Warna berbeda untuk setiap status
- **Progress Bars**: Visualisasi data persentase
- **Icons**: Menggunakan Lucide React konsisten
- **Animations**: Transisi halus untuk interaksi

## 🚀 Deployment

### **Backend (Railway/Heroku):**
```bash
# Build dan deploy backend
cd backend
git push heroku main
```

### **Frontend (Vercel/Netlify):**
```bash
# Build frontend
cd frontend
npm run build

# Deploy build folder ke hosting
```

### **Environment Variables Production:**
```env
# Backend
NODE_ENV=production
DATABASE_URL=mysql://user:pass@host:port/dbname
PORT=3000

# Frontend
VITE_API_URL=https://your-backend-api.com
```

## 📊 Database Schema Diagram

```
┌─────────────┐      ┌──────────────┐
│    BUKU     │      │  PEMINJAMAN  │
├─────────────┤      ├──────────────┤
│ id          │◄─────┤ buku_id      │
│ judul       │      │ nama_peminjam│
│ pengarang   │      │ tgl_pinjam   │
│ stok        │      │ status       │
│ rak         │      │ denda        │
└─────────────┘      └──────────────┘

┌─────────────┐      ┌──────────────┐
│  KARYAWAN   │      │  AKTIVITAS   │
├─────────────┤      ├──────────────┤
│ id          │      │ id           │
│ nama        │      │ pengunjung   │
│ jabatan     │      │ keperluan    │
│ telepon     │      │ waktu_masuk  │
│ tgl_masuk   │      │ status       │
└─────────────┘      └──────────────┘
```

## 🔐 Keamanan

### **Best Practices:**
- **Input Validation**: Validasi di frontend dan backend
- **SQL Injection Protection**: Menggunakan parameterized queries
- **CORS Configuration**: Restrict origins jika diperlukan
- **Error Handling**: Tidak menampilkan error detail ke client

### **Authentication (Future Enhancement):**
```javascript
// Rencana implementasi login
// - JWT based authentication
// - Role-based access control (Admin/Staff)
// - Session management
```

## 🧪 Testing

### **Manual Testing:**
- [ ] CRUD operations semua modul
- [ ] Form validations
- [ ] Error handling
- [ ] Responsive design
- [ ] Cross-browser compatibility

### **Automated Testing (Future):**
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests with Cypress
npm run cypress:open
```

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan ikuti langkah-langkah berikut:

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

### **Guidelines:**
- Ikuti struktur kode yang ada
- Gunakan komponen yang reusable
- Tambahkan dokumentasi untuk fitur baru
- Test perubahan sebelum submit

## 📝 Changelog

### **v1.0.0 - Initial Release**
- ✅ Manajemen buku lengkap
- ✅ Sistem peminjaman dengan denda
- ✅ Manajemen karyawan
- ✅ Tracking aktivitas pengunjung
- ✅ UI/UX modern dengan TailwindCSS
- ✅ Responsive design

### **v1.1.0 - Planned Features**
- [ ] Export data ke Excel/PDF
- [ ] Notifikasi email untuk denda
- [ ] QR Code untuk buku
- [ ] Laporan statistik bulanan
- [ ] Multi-user dengan roles

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail.

## 🙏 Acknowledgments

- **TailwindCSS** untuk framework styling yang luar biasa
- **Lucide** untuk koleksi ikon yang konsisten
- **React Community** untuk ekosistem yang solid
- **All Contributors** yang membantu pengembangan

---

<div align="center">
  
**Dibuat dengan ❤️ untuk Perpustakaan Sekolah**

"Transformasi Digital untuk Pendidikan yang Lebih Baik"

</div>
```
