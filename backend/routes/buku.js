const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Sekarang file ini sudah ada

// GET semua buku
router.get('/buku', (req, res) => {
  const sql = 'SELECT * FROM buku';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching books:', err);
      return res.status(500).send('Error fetching data');
    }
    res.json(results);
  });
});

// POST tambah buku
router.post('/buku', (req, res) => {
  const { judul, pengarang, penerbit, tahun_terbit, jumlah_stok, lokasi_rak } = req.body;

  // Validasi sederhana
  if (!judul || !pengarang || typeof jumlah_stok !== 'number') {
    return res.status(400).json({ message: 'Judul, pengarang, dan stok wajib diisi dengan benar.' });
  }

  const sql = 'INSERT INTO buku (judul, pengarang, penerbit, tahun_terbit, jumlah_stok, lokasi_rak) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [judul, pengarang, penerbit, tahun_terbit, jumlah_stok, lokasi_rak], (err, result) => {
    if (err) {
      console.error('Error adding book:', err);
      return res.status(500).send('Error adding data');
    }
    res.json({ message: 'Buku berhasil ditambahkan' });
  });
});

// UPDATE buku (Edit)
router.put('/buku/:id', (req, res) => {
    const id = req.params.id;
    const { judul, pengarang, penerbit, tahun_terbit, jumlah_stok, lokasi_rak } = req.body;
  
    // Validasi sederhana
    if (!judul || !pengarang || typeof jumlah_stok !== 'number') {
      return res.status(400).json({ message: 'Judul, pengarang, dan stok wajib diisi dengan benar.' });
    }
  
    const sql = 'UPDATE buku SET judul = ?, pengarang = ?, penerbit = ?, tahun_terbit = ?, jumlah_stok = ?, lokasi_rak = ? WHERE id = ?';
    db.query(sql, [judul, pengarang, penerbit, tahun_terbit, jumlah_stok, lokasi_rak, id], (err, result) => {
      if (err) {
        console.error('Error updating book:', err);
        return res.status(500).send('Error updating data');
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Buku tidak ditemukan' });
      }
      res.json({ message: 'Buku berhasil diupdate' });
    });
  });

  // DELETE buku
router.delete('/buku/:id', (req, res) => {
    const id = req.params.id;
  
    const sql = 'DELETE FROM buku WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error deleting book:', err);
        return res.status(500).send('Error deleting data');
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Buku tidak ditemukan' });
      }
      res.json({ message: 'Buku berhasil dihapus' });
    });
  });

module.exports = router;