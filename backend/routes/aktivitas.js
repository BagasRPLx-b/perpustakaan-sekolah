const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET semua aktivitas (untuk riwayat)
router.get('/aktivitas', (req, res) => {
  const sql = `
    SELECT id, nama_pengunjung, keperluan, catatan, waktu_masuk, waktu_pulang, status
    FROM aktivitas
    ORDER BY waktu_masuk DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching activities:', err);
      return res.status(500).send('Error fetching data');
    }
    res.json(results);
  });
});

// GET aktivitas aktif (status 'Masih di Perpus')
router.get('/aktivitas/aktif', (req, res) => {
  const sql = `
    SELECT id, nama_pengunjung, keperluan, catatan, waktu_masuk, status
    FROM aktivitas
    WHERE status = 'Masih di Perpus'
    ORDER BY waktu_masuk DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching active activities:', err);
      return res.status(500).send('Error fetching data');
    }
    res.json(results);
  });
});

// POST aktivitas baru (kedatangan)
router.post('/aktivitas', (req, res) => {
  const { nama_pengunjung, keperluan, catatan } = req.body;

  if (!nama_pengunjung || !keperluan) {
    return res.status(400).json({ message: 'Nama Pengunjung dan Keperluan wajib diisi.' });
  }

  const sql = 'INSERT INTO aktivitas (nama_pengunjung, keperluan, catatan) VALUES (?, ?, ?)';
  db.query(sql, [nama_pengunjung, keperluan, catatan], (err, result) => {
    if (err) {
      console.error('Error adding activity:', err);
      return res.status(500).send('Error adding data');
    }
    res.json({ message: 'Kedatangan berhasil dicatat' });
  });
});

// PUT update status aktivitas menjadi 'Sudah Pulang'
router.put('/aktivitas/:id/pulang', (req, res) => {
  const id = req.params.id;

  const sql = 'UPDATE aktivitas SET status = "Sudah Pulang", waktu_pulang = CURRENT_TIMESTAMP WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error updating activity status:', err);
      return res.status(500).send('Error updating data');
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Aktivitas tidak ditemukan' });
    }
    res.json({ message: 'Status aktivitas berhasil diupdate menjadi Sudah Pulang' });
  });
});

module.exports = router;