const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET semua karyawan
router.get('/karyawan', (req, res) => {
  const sql = 'SELECT * FROM karyawan ORDER BY id';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).send('Error fetching data');
    }
    res.json(results);
  });
});

// POST tambah karyawan
router.post('/karyawan', (req, res) => {
  const { nama, jabatan, no_telepon, tgl_masuk } = req.body;
  // Tgl_masuk bisa null, jadi validasi opsional
  if (!nama) {
    return res.status(400).json({ message: 'Nama wajib diisi.' });
  }

  const sql = 'INSERT INTO karyawan (nama, jabatan, no_telepon, tgl_masuk) VALUES (?, ?, ?, ?)';
  db.query(sql, [nama, jabatan, no_telepon, tgl_masuk], (err, result) => {
    if (err) {
      console.error('Error adding employee:', err);
      return res.status(500).send('Error adding data');
    }
    res.json({ message: 'Karyawan berhasil ditambahkan' });
  });
});

// PUT edit karyawan
router.put('/karyawan/:id', (req, res) => {
  const id = req.params.id;
  const { nama, jabatan, no_telepon, tgl_masuk } = req.body;

  if (!nama) {
    return res.status(400).json({ message: 'Nama wajib diisi.' });
  }

  const sql = 'UPDATE karyawan SET nama = ?, jabatan = ?, no_telepon = ?, tgl_masuk = ? WHERE id = ?';
  db.query(sql, [nama, jabatan, no_telepon, tgl_masuk, id], (err, result) => {
    if (err) {
      console.error('Error updating employee:', err);
      return res.status(500).send('Error updating data');
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Karyawan tidak ditemukan' });
    }
    res.json({ message: 'Karyawan berhasil diupdate' });
  });
});

// DELETE karyawan
router.delete('/karyawan/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM karyawan WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).send('Error deleting data');
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Karyawan tidak ditemukan' });
    }
    res.json({ message: 'Karyawan berhasil dihapus' });
  });
});

module.exports = router;