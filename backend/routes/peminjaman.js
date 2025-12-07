const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET semua peminjaman (dengan nama_peminjam dan judul_buku)
router.get('/peminjaman', (req, res) => {
  console.log('Menerima request GET /peminjaman');
  const sql = `
    SELECT 
      p.id,
      p.nama_peminjam,
      p.buku_id,
      b.judul AS judul_buku,
      p.tgl_pinjam,
      p.tgl_kembali,
      p.status,
      p.denda
    FROM peminjaman p
    JOIN buku b ON p.buku_id = b.id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching loans:', err);
      return res.status(500).send('Error fetching data: ' + err.message);
    }
    console.log('Berhasil mengambil data peminjaman:', results.length, 'item');
    res.json(results);
  });
});

// POST peminjaman baru (dengan nama_peminjam)
router.post('/peminjaman', (req, res) => {
  console.log('Menerima request POST /peminjaman dengan body:', req.body);

  const { nama_peminjam, buku_id, tgl_pinjam, tgl_kembali } = req.body;

  // Validasi sederhana
  if (!nama_peminjam || !buku_id || !tgl_pinjam || !tgl_kembali) {
    console.log('Validasi gagal: Data tidak lengkap');
    return res.status(400).json({ message: 'Nama Peminjam, ID Buku, Tanggal Pinjam, dan Tanggal Kembali wajib diisi.' });
  }

  // Pastikan buku_id adalah number
  const bukuIdInt = parseInt(buku_id, 10);
  if (isNaN(bukuIdInt)) {
    console.log('Validasi gagal: ID Buku bukan angka');
    return res.status(400).json({ message: 'ID Buku harus berupa angka.' });
  }

  console.log('Memeriksa stok buku dengan ID:', bukuIdInt);

  // 1. Cek apakah buku ada dan stoknya > 0
  const cekStokSql = 'SELECT jumlah_stok FROM buku WHERE id = ?';
  db.query(cekStokSql, [bukuIdInt], (err, results) => {
    if (err) {
      console.error('Error checking stock:', err);
      return res.status(500).send('Error checking stock: ' + err.message);
    }

    if (results.length === 0) {
      console.log('Buku dengan ID', bukuIdInt, 'tidak ditemukan');
      return res.status(404).json({ message: 'Buku tidak ditemukan.' });
    }

    const stokSaatIni = results[0].jumlah_stok;
    console.log('Stok saat ini untuk buku ID', bukuIdInt, ':', stokSaatIni);

    if (stokSaatIni <= 0) {
      console.log('Stok buku ID', bukuIdInt, 'habis');
      return res.status(400).json({ message: 'Stok buku habis. Tidak bisa dipinjam.' });
    }

    // 2. Jika stok cukup, kurangi stok dan simpan peminjaman
    const kurangiStokSql = 'UPDATE buku SET jumlah_stok = jumlah_stok - 1 WHERE id = ?';
    const simpanPeminjamanSql = 'INSERT INTO peminjaman (nama_peminjam, buku_id, tgl_pinjam, tgl_kembali) VALUES (?, ?, ?, ?)';

    console.log('Memulai transaksi...');

    // Gunakan transaksi untuk memastikan keduanya berhasil atau gagal bersamaan
    db.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).send('Error starting transaction: ' + err.message);
      }
      console.log('Transaksi dimulai');

      db.query(kurangiStokSql, [bukuIdInt], (err, result) => {
        if (err) {
          console.error('Error updating stock in transaction:', err);
          return db.rollback(() => res.status(500).send('Error updating stock in transaction: ' + err.message));
        }
        console.log('Stok buku ID', bukuIdInt, 'berhasil dikurangi');

        db.query(simpanPeminjamanSql, [nama_peminjam, bukuIdInt, tgl_pinjam, tgl_kembali], (err, result) => {
          if (err) {
            console.error('Error saving loan in transaction:', err);
            return db.rollback(() => res.status(500).send('Error saving loan in transaction: ' + err.message));
          }
          console.log('Peminjaman berhasil dicatat di database');

          db.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              return db.rollback(() => res.status(500).send('Error committing transaction: ' + err.message));
            }
            console.log('Transaksi berhasil di-commit');
            res.json({ message: 'Peminjaman berhasil dicatat dan stok buku dikurangi.' });
          });
        });
      });
    });
  });
});

// UPDATE status peminjaman (menjadi 'dikembalikan') + Hitung Denda
router.put('/peminjaman/:id/status', (req, res) => {
  console.log('Menerima request PUT /peminjaman/:id/status dengan params:', req.params, 'dan body:', req.body);

  const id = req.params.id;
  const { status } = req.body;

  // Validasi sederhana
  if (!status || (status !== 'dipinjam' && status !== 'dikembalikan')) {
    return res.status(400).json({ message: 'Status harus dipinjam atau dikembalikan.' });
  }

  // 1. Ambil data peminjaman
  const sqlAmbil = 'SELECT tgl_kembali FROM peminjaman WHERE id = ?';
  db.query(sqlAmbil, [id], (err, results) => {
    if (err) {
      console.error('Error fetching loan for update:', err);
      return res.status(500).send('Error fetching loan data: ' + err.message);
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
    }

    const tglKembaliDatabase = new Date(results[0].tgl_kembali);
    const tglKembaliSekarang = new Date(); // Tanggal saat buku dikembalikan
    let denda = 0;

    // 2. Jika status berubah menjadi 'dikembalikan', hitung denda
    if (status === 'dikembalikan') {
      const selisihHari = Math.floor((tglKembaliSekarang - tglKembaliDatabase) / (1000 * 60 * 60 * 24));
      if (selisihHari > 0) {
        // Misalnya denda Rp 1000 per hari keterlambatan
        denda = selisihHari * 1000;
      }
    }

    // 3. Update status dan denda
    const sqlUpdate = 'UPDATE peminjaman SET status = ?, denda = ? WHERE id = ?';
    db.query(sqlUpdate, [status, denda, id], (err, result) => {
      if (err) {
        console.error('Error updating loan status and fine:', err);
        return res.status(500).send('Error updating  ' + err.message);
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
      }
      res.json({ message: 'Status peminjaman berhasil diupdate', denda: denda });
    });
  });
});

module.exports = router;