import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  User, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  PlusCircle,
  RefreshCw,
  Download,
  Filter,
  Search,
  TrendingUp
} from 'lucide-react';
import Navbar from '../component/navbar';

export default function PeminjamanPage() {
  const [peminjaman, setPeminjaman] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ 
    nama_peminjam: '', 
    buku_id: '', 
    tgl_pinjam: '', 
    tgl_kembali: '' 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');

  // Fungsi untuk mengambil data peminjaman dari backend
  const fetchPeminjaman = () => {
    setIsLoading(true);
    axios.get('http://localhost:5000/api/peminjaman')
      .then(res => {
        console.log('Data peminjaman dari backend:', res.data);
        setPeminjaman(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching loans:', err);
        setIsLoading(false);
      });
  };

  // Ambil data saat komponen dimuat
  useEffect(() => {
    fetchPeminjaman();
  }, []);

  // Fungsi untuk menangani submit form peminjaman
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Konversi buku_id ke number
    const formData = {
      ...form,
      buku_id: parseInt(form.buku_id, 10)
    };

    axios.post('http://localhost:5000/api/peminjaman', formData)
      .then(() => {
        alert('Peminjaman berhasil dicatat');
        fetchPeminjaman(); // Refresh daftar
        setForm({ 
          nama_peminjam: '', 
          buku_id: '', 
          tgl_pinjam: '', 
          tgl_kembali: '' 
        }); // Reset form
      })
      .catch(err => {
        console.error('Error submitting loan:', err);
        if (err.response?.data?.message) {
          alert('Gagal: ' + err.response.data.message);
        } else {
          alert('Gagal mencatat peminjaman. Periksa konsol.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Fungsi untuk mengupdate status peminjaman menjadi 'dikembalikan'
  const updateStatus = (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menandai buku ini sebagai dikembalikan?')) {
      return;
    }
    
    setIsLoading(true);
    axios.put(`http://localhost:5000/api/peminjaman/${id}/status`, { status: 'dikembalikan' })
      .then((response) => {
        const denda = response.data.denda || 0;
        if (denda > 0) {
          alert(`Buku berhasil dikembalikan!\nDenda terlambat: Rp ${denda.toLocaleString('id-ID')}`);
        } else {
          alert('Buku berhasil dikembalikan tepat waktu!');
        }
        fetchPeminjaman(); // Refresh daftar peminjaman
      })
      .catch(err => {
        console.error('Error updating loan status:', err);
        alert('Gagal mengupdate status. Periksa konsol.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Filter peminjaman berdasarkan pencarian dan status
  const filteredPeminjaman = peminjaman.filter(p => {
    const matchesSearch = 
      p.nama_peminjam?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.judul_buku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toString().includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'semua' || 
      p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Hitung statistik
  const stats = {
    total: peminjaman.length,
    dipinjam: peminjaman.filter(p => p.status === 'dipinjam').length,
    dikembalikan: peminjaman.filter(p => p.status === 'dikembalikan').length,
    terlambat: peminjaman.filter(p => {
      if (p.status === 'dipinjam' && p.tgl_kembali) {
        const today = new Date();
        const kembaliDate = new Date(p.tgl_kembali);
        return today > kembaliDate;
      }
      return false;
    }).length,
    totalDenda: peminjaman.reduce((sum, p) => sum + (p.denda || 0), 0)
  };

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Cek apakah tanggal kembali sudah lewat
  const isLate = (tglKembali, status) => {
    if (status === 'dikembalikan') return false;
    const today = new Date();
    const kembaliDate = new Date(tglKembali);
    return today > kembaliDate;
  };

  // Get status badge style
  const getStatusStyle = (status, tglKembali) => {
    if (status === 'dikembalikan') {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    
    if (isLate(tglKembali, status)) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  // Reset form
  const handleResetForm = () => {
    setForm({ 
      nama_peminjam: '', 
      buku_id: '', 
      tgl_pinjam: '', 
      tgl_kembali: '' 
    });
  };

  // Set tanggal pinjam ke hari ini
  const setTodayAsPinjam = () => {
    const today = new Date().toISOString().split('T')[0];
    setForm({...form, tgl_pinjam: today});
  };

  // Set tanggal kembali ke 7 hari dari sekarang
  const setWeekAsKembali = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    setForm({...form, tgl_kembali: nextWeekStr});
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar/>

      <div className="px-4 py-8">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
            <BookOpen className="text-blue-600" size={32} />
            Manajemen Peminjaman
          </h1>
          <p className="text-gray-600 mt-2">
            Kelola peminjaman buku perpustakaan dengan sistem yang terintegrasi
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Peminjaman</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Sedang Dipinjam</p>
                <p className="text-2xl font-bold text-gray-800">{stats.dipinjam}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Sudah Dikembalikan</p>
                <p className="text-2xl font-bold text-gray-800">{stats.dikembalikan}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Terlambat</p>
                <p className="text-2xl font-bold text-gray-800">{stats.terlambat}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Denda</p>
                <p className="text-2xl font-bold text-gray-800">
                  Rp {stats.totalDenda.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BookOpen className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Form Peminjaman */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <PlusCircle size={24} />
              Catat Peminjaman Baru
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Nama Peminjam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap peminjam"
                  value={form.nama_peminjam}
                  onChange={(e) => setForm({...form, nama_peminjam: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen size={16} className="inline mr-2" />
                  ID Buku <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Masukkan ID buku"
                  value={form.buku_id}
                  onChange={(e) => setForm({...form, buku_id: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Tanggal Pinjam <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={form.tgl_pinjam}
                    onChange={(e) => setForm({...form, tgl_pinjam: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={setTodayAsPinjam}
                    className="whitespace-nowrap px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                  >
                    Hari Ini
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Tanggal Kembali <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={form.tgl_kembali}
                    onChange={(e) => setForm({...form, tgl_kembali: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={setWeekAsKembali}
                    className="whitespace-nowrap px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                  >
                    7 Hari
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={handleResetForm}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                <RefreshCw size={18} />
                Reset Form
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                  isLoading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                } text-white shadow-sm`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <PlusCircle size={20} />
                    Catat Peminjaman
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Filter & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, judul buku, atau ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600">Filter Status:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="semua">Semua Status</option>
                <option value="dipinjam">Sedang Dipinjam</option>
                <option value="dikembalikan">Sudah Dikembalikan</option>
              </select>
              
              <button
                onClick={fetchPeminjaman}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition">
                <Download size={18} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Daftar Peminjaman */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white">Daftar Peminjaman</h2>
            <p className="text-gray-300 text-sm mt-1">
              Menampilkan {filteredPeminjaman.length} dari {peminjaman.length} peminjaman
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Peminjam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buku
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Denda
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      </div>
                      <p className="mt-4 text-gray-500">Memuat data peminjaman...</p>
                    </td>
                  </tr>
                ) : filteredPeminjaman.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">
                        {searchTerm || statusFilter !== 'semua' 
                          ? "Tidak ada peminjaman yang sesuai dengan filter" 
                          : "Belum ada data peminjaman"}
                      </p>
                      <p className="text-gray-400 mt-1">
                        {searchTerm || statusFilter !== 'semua' 
                          ? "Coba ubah kata kunci pencarian atau filter" 
                          : "Mulai dengan mencatat peminjaman baru"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredPeminjaman.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          #{p.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{p.nama_peminjam}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{p.judul_buku}</div>
                        <div className="text-sm text-gray-500">ID: {p.buku_id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-blue-500" />
                            <span className="text-sm">
                              <strong>Pinjam:</strong> {formatDate(p.tgl_pinjam)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar size={14} className={isLate(p.tgl_kembali, p.status) ? "text-red-500" : "text-green-500"} />
                            <span className={`text-sm ${isLate(p.tgl_kembali, p.status) ? "text-red-600" : ""}`}>
                              <strong>Kembali:</strong> {formatDate(p.tgl_kembali)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(p.status, p.tgl_kembali)}`}>
                          {p.status === 'dikembalikan' ? (
                            <>
                              <CheckCircle size={14} className="mr-1" />
                              Dikembalikan
                            </>
                          ) : isLate(p.tgl_kembali, p.status) ? (
                            <>
                              <AlertCircle size={14} className="mr-1" />
                              Terlambat
                            </>
                          ) : (
                            <>
                              <Clock size={14} className="mr-1" />
                              Dipinjam
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {p.denda > 0 ? (
                          <div className="text-right">
                            <div className="font-semibold text-red-600">
                              Rp {p.denda.toLocaleString('id-ID')}
                            </div>
                            {isLate(p.tgl_kembali, p.status) && p.status === 'dipinjam' && (
                              <div className="text-xs text-red-500 mt-1">(Akan dikenakan)</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {p.status === 'dipinjam' ? (
                          <button
                            onClick={() => updateStatus(p.id)}
                            disabled={isLoading}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                              isLoading 
                                ? "bg-gray-300 cursor-not-allowed" 
                                : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                            } text-white shadow-sm`}
                          >
                            <CheckCircle size={16} />
                            Tandai Kembali
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle size={16} />
                            <span className="text-sm">Selesai</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <AlertCircle className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Informasi Penting</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Peminjaman buku maksimal 7 hari</li>
                <li>• Denda keterlambatan Rp 2.000 per hari</li>
                <li>• Buku yang hilang akan dikenakan denda 3x harga buku</li>
                <li>• Pastikan data peminjam dan buku sudah valid</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Sistem Manajemen Peminjaman Perpustakaan</p>
          <p className="mt-1">Total peminjaman aktif: {stats.dipinjam} buku</p>
        </div>
      </div>
    </div>
  );
}
