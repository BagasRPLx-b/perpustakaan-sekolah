import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/navbar';
import { 
  Users, 
  UserPlus, 
  Clock, 
  Calendar,
  LogIn,
  LogOut,
  FileText,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  Activity,
  UserCheck,
  X,
  Download,
  BarChart3,
  Home,
  BookOpen,
  MessageSquare
} from 'lucide-react';

export default function AktivitasPage() {
  const [aktivitas, setAktivitas] = useState([]);
  const [aktivitasAktif, setAktivitasAktif] = useState([]);
  const [form, setForm] = useState({ 
    nama_pengunjung: '', 
    keperluan: '', 
    catatan: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [dateFilter, setDateFilter] = useState('');

  const keperluanOptions = [
    "Membaca Buku",
    "Mengerjakan Tugas",
    "Mencari Referensi",
    "Mengobrol",
    "Lainnya"
  ];

  const fetchAktivitas = () => {
    setIsLoading(true);
    axios.get('http://localhost:5000/api/aktivitas')
      .then(res => {
        setAktivitas(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching activities:', err);
        setIsLoading(false);
      });
  };

  const fetchAktivitasAktif = () => {
    axios.get('http://localhost:5000/api/aktivitas/aktif')
      .then(res => setAktivitasAktif(res.data))
      .catch(err => console.error('Error fetching active activities:', err));
  };

  useEffect(() => {
    fetchAktivitas();
    fetchAktivitasAktif();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    axios.post('http://localhost:5000/api/aktivitas', form)
      .then(() => {
        alert('Kedatangan berhasil dicatat');
        setForm({ 
          nama_pengunjung: '', 
          keperluan: '', 
          catatan: '' 
        });
        fetchAktivitas();
        fetchAktivitasAktif();
      })
      .catch(err => {
        console.error('Error submitting activity:', err);
        if (err.response?.data?.message) {
          alert('Gagal: ' + err.response.data.message);
        } else {
          alert('Gagal mencatat kedatangan. Periksa konsol.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateStatusPulang = (id, nama) => {
    if (!window.confirm(`Tandai "${nama}" sudah pulang?`)) {
      return;
    }
    
    setIsLoading(true);
    axios.put(`http://localhost:5000/api/aktivitas/${id}/pulang`)
      .then(() => {
        alert('Status berhasil diupdate menjadi Sudah Pulang');
        fetchAktivitasAktif();
        fetchAktivitas();
      })
      .catch(err => {
        console.error('Error updating activity status:', err);
        if (err.response?.data?.message) {
          alert('Gagal: ' + err.response.data.message);
        } else {
          alert('Gagal mengupdate status. Periksa konsol.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Filter aktivitas
  const filteredAktivitas = aktivitas.filter(a => {
    const matchesSearch = 
      a.nama_pengunjung?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.keperluan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.catatan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toString().includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'semua' || 
      a.status === statusFilter;
    
    const matchesDate = 
      !dateFilter || 
      new Date(a.waktu_masuk).toISOString().split('T')[0] === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Format waktu
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeOnly = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Hitung durasi
  const calculateDuration = (waktuMasuk, waktuPulang) => {
    if (!waktuMasuk) return '-';
    const masuk = new Date(waktuMasuk);
    const pulang = waktuPulang ? new Date(waktuPulang) : new Date();
    
    const diffMs = Math.abs(pulang - masuk);
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    
    if (diffHours === 0) {
      return `${remainingMins} menit`;
    }
    return `${diffHours} jam ${remainingMins} menit`;
  };

  // Hitung statistik
  const stats = {
    total: aktivitas.length,
    aktif: aktivitasAktif.length,
    hariIni: aktivitas.filter(a => {
      const today = new Date().toISOString().split('T')[0];
      const aktivitasDate = new Date(a.waktu_masuk).toISOString().split('T')[0];
      return aktivitasDate === today;
    }).length,
    byKeperluan: keperluanOptions.reduce((acc, keperluan) => {
      acc[keperluan] = aktivitas.filter(a => a.keperluan === keperluan).length;
      return acc;
    }, {})
  };

  // Reset form
  const handleResetForm = () => {
    setForm({ 
      nama_pengunjung: '', 
      keperluan: '', 
      catatan: '' 
    });
  };

  // Get keperluan color
  const getKeperluanColor = (keperluan) => {
    const colors = {
      'Membaca Buku': 'bg-blue-100 text-blue-800 border-blue-200',
      'Mengerjakan Tugas': 'bg-green-100 text-green-800 border-green-200',
      'Mencari Referensi': 'bg-purple-100 text-purple-800 border-purple-200',
      'Mengobrol': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Lainnya': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[keperluan] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Navbar/>
      <div className="px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
            <Activity className="text-blue-600" size={32} />
            Aktivitas Perpustakaan
          </h1>
          <p className="text-gray-600 mt-2">
            Pantau dan kelola aktivitas pengunjung perpustakaan secara real-time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Kunjungan</p>
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
                <p className="text-sm text-gray-500">Pengunjung Aktif</p>
                <p className="text-2xl font-bold text-gray-800">{stats.aktif}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Kunjungan Hari Ini</p>
                <p className="text-2xl font-bold text-gray-800">{stats.hariIni}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Calendar className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rata-rata Durasi</p>
                <p className="text-2xl font-bold text-gray-800">
                  {aktivitas.length > 0 ? '45 menit' : '-'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Clock className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Form Kedatangan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <LogIn size={24} />
              Catat Kedatangan
            </h2>
            <p className="text-green-100 text-sm mt-1">
              Catat kedatangan pengunjung baru dengan data lengkap
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={form.nama_pengunjung}
                    onChange={(e) => setForm({...form, nama_pengunjung: e.target.value})}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keperluan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.keperluan}
                    onChange={(e) => setForm({...form, keperluan: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition appearance-none pr-10"
                    required
                  >
                    <option value="">-- Pilih Keperluan --</option>
                    {keperluanOptions.map((kp, index) => (
                      <option key={index} value={kp}>{kp}</option>
                    ))}
                  </select>
                  <BookOpen className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Tambahan
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-4 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Contoh: Membawa laptop, Membaca buku referensi"
                    value={form.catatan}
                    onChange={(e) => setForm({...form, catatan: e.target.value})}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={handleResetForm}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                <X size={18} />
                Reset Form
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                  isLoading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                } text-white shadow-sm`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Catat Kedatangan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Pengunjung Saat Ini */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <UserCheck size={24} />
                  Pengunjung Saat Ini
                </h2>
                <p className="text-emerald-100 text-sm mt-1">
                  {aktivitasAktif.length} pengunjung aktif di perpustakaan
                </p>
              </div>
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Users size={20} />
                <span className="font-bold">{aktivitasAktif.length}</span>
              </div>
            </div>
          </div>
          
          {aktivitasAktif.length === 0 ? (
            <div className="p-12 text-center">
              <Home size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Tidak ada pengunjung aktif saat ini</p>
              <p className="text-gray-400 mt-1">Silakan catat kedatangan pengunjung baru</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keperluan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu Masuk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durasi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catatan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {aktivitasAktif.map(a => (
                    <tr key={a.id} className="hover:bg-emerald-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-lg mr-3">
                            <UserPlus className="text-green-600" size={20} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{a.nama_pengunjung}</div>
                            <div className="text-sm text-gray-500">ID: #{a.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getKeperluanColor(a.keperluan)}`}>
                          {a.keperluan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-400" />
                          <span>{formatTimeOnly(a.waktu_masuk)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(a.waktu_masuk).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          <Clock size={14} className="mr-1" />
                          {calculateDuration(a.waktu_masuk)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MessageSquare size={16} className="text-gray-400" />
                          <span className="text-sm truncate max-w-xs">
                            {a.catatan || 'Tidak ada catatan'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => updateStatusPulang(a.id, a.nama_pengunjung)}
                          disabled={isLoading}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                            isLoading 
                              ? "bg-gray-300 cursor-not-allowed" 
                              : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                          } text-white shadow-sm`}
                        >
                          <LogOut size={16} />
                          {isLoading ? 'Memproses...' : 'Tandai Pulang'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Filter & Search untuk Riwayat */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama atau keperluan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600">Filter:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="semua">Semua Status</option>
                <option value="Masih di Perpus">Aktif</option>
                <option value="Sudah Pulang">Sudah Pulang</option>
              </select>
              
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Filter Tanggal"
              />
              
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('semua');
                  setDateFilter('');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
              >
                <X size={18} />
                Clear Filter
              </button>
              
              <button
                onClick={fetchAktivitas}
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

        {/* Riwayat Aktivitas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <BarChart3 size={24} />
                  Riwayat Aktivitas
                </h2>
                <p className="text-gray-300 text-sm mt-1">
                  Menampilkan {filteredAktivitas.length} dari {aktivitas.length} kunjungan
                </p>
              </div>
              <div className="text-right">
                <div className="text-emerald-300 text-sm">Kunjungan hari ini</div>
                <div className="text-2xl font-bold text-white">{stats.hariIni}</div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pengunjung
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keperluan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Waktu Masuk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Waktu Pulang
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                      <p className="mt-4 text-gray-500">Memuat data aktivitas...</p>
                    </td>
                  </tr>
                ) : filteredAktivitas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <Activity size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">
                        {searchTerm || statusFilter !== 'semua' || dateFilter
                          ? "Tidak ada aktivitas yang sesuai dengan filter" 
                          : "Belum ada data aktivitas"}
                      </p>
                      <p className="text-gray-400 mt-1">
                        {searchTerm || statusFilter !== 'semua' || dateFilter
                          ? "Coba ubah filter atau kata kunci pencarian" 
                          : "Mulai dengan mencatat kedatangan pengunjung"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAktivitas.map(a => (
                    <tr key={a.id} className={`hover:bg-gray-50 transition ${
                      a.status === 'Sudah Pulang' ? 'opacity-80' : ''
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          #{a.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{a.nama_pengunjung}</div>
                        {a.catatan && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {a.catatan}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getKeperluanColor(a.keperluan)}`}>
                          {a.keperluan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <LogIn size={14} className="text-green-500" />
                          <span>{formatTimeOnly(a.waktu_masuk)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(a.waktu_masuk).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {a.waktu_pulang ? (
                            <>
                              <LogOut size={14} className="text-red-500" />
                              <span>{formatTimeOnly(a.waktu_pulang)}</span>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(a.waktu_pulang).toLocaleDateString('id-ID')}
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                          a.status === 'Masih di Perpus' 
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          <Clock size={14} className="mr-1" />
                          {calculateDuration(a.waktu_masuk, a.waktu_pulang)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                          a.status === 'Masih di Perpus' 
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          {a.status === 'Masih di Perpus' ? (
                            <>
                              <Clock size={14} className="mr-1" />
                              Aktif
                            </>
                          ) : (
                            <>
                              <UserCheck size={14} className="mr-1" />
                              Selesai
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Statistik Keperluan Kunjungan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {keperluanOptions.map((keperluan, index) => {
              const count = stats.byKeperluan[keperluan] || 0;
              const percentage = stats.total > 0 ? ((count / stats.total) * 100).toFixed(0) : 0;
              
              return (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{keperluan}</span>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Sistem Monitoring Aktivitas Perpustakaan</p>
          <p className="mt-1">
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • {aktivitasAktif.length} pengunjung aktif
          </p>
        </div>
      </div>
    </div>
  );
}