const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const bukuRoutes = require('./routes/buku');
const peminjamanRoutes = require('./routes/peminjaman');
const aktivitasRoutes = require('./routes/aktivitas'); // Tambahkan ini
const karyawanRoutes = require('./routes/karyawan'); // Pastikan ini diimpor

app.use('/api', bukuRoutes);
app.use('/api', peminjamanRoutes);
app.use('/api', aktivitasRoutes); // Tambahkan ini
app.use('/api', karyawanRoutes); // Pastikan ini digunakan

app.get('/', (req, res) => {
  res.send('API Perpustakaan Sekolah Berjalan');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});