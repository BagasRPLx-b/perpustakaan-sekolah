import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/navbar';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Phone, 
  Calendar,
  Briefcase,
  Search,
  Filter,
  RefreshCw,
  Download,
  Award,
  Clock,
  TrendingUp,
  Mail
} from 'lucide-react';

export default function KaryawanPage() {
  // Daftar jabatan yang sudah ditentukan
  const jabatanOptions = [
    "Kepala Perpustakaan",
    "Staf Pelayanan",
    "Staf Koleksi",
    "Staf IT",
    "Pustakawan",
    "Asisten Pustakawan",
    "Admin Sistem",
    "Lainnya"
  ];

  const [karyawan, setKaryawan] = useState([]);
  const [form, setForm] = useState({ 
    nama: '', 
    jabatan: '', 
    no_telepon: '', 
    tgl_masuk: '',
    email: '' 
  });
  const [editForm, setEditForm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [jabatanFilter, setJabatanFilter] = useState('semua');

  const fetchKaryawan = () => {
    setIsLoading(true);
    axios.get('http://localhost:5000/api/karyawan')
      .then(res => {
        setKaryawan(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching employees:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchKaryawan();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    axios.post('http://localhost:5000/api/karyawan', form)
      .then(() => {
        alert('Karyawan berhasil ditambahkan');
        fetchKaryawan();
        setForm({ 
          nama: '', 
          jabatan: '', 
          no_telepon: '', 
          tgl_masuk: '',
          email: '' 
        });
      })
      .catch(err => {
        console.error('Error submitting employee:', err);
        if (err.response?.data?.message) {
          alert('Gagal: ' + err.response.data.message);
        } else {
          alert('Gagal menambahkan karyawan. Periksa konsol.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const startEdit = (k) => {
    setEditForm({ ...k });
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    axios.put(`http://localhost:5000/api/karyawan/${editForm.id}`, editForm)
      .then(() => {
        alert('Karyawan berhasil diedit');
        fetchKaryawan();
        setEditForm(null);
      })
      .catch(err => {
        console.error('Error editing employee:', err);
        if (err.response?.data?.message) {
          alert('Gagal: ' + err.response.data.message);
        } else {
          alert('Gagal mengedit karyawan. Periksa konsol.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const cancelEdit = () => {
    setEditForm(null);
  };

  const deleteKaryawan = (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus karyawan "${nama}"?`)) {
      setIsLoading(true);
      axios.delete(`http://localhost:5000/api/karyawan/${id}`)
        .then(() => {
          alert('Karyawan berhasil dihapus');
          fetchKaryawan();
        })
        .catch(err => {
          console.error('Error deleting employee:', err);
          alert('Gagal menghapus karyawan. Periksa konsol.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  // Filter karyawan berdasarkan pencarian dan jabatan
  const filteredKaryawan = karyawan.filter(k => {
    const matchesSearch = 
      k.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.no_telepon?.includes(searchTerm) ||
      k.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.id.toString().includes(searchTerm);
    
    const matchesJabatan = 
      jabatanFilter === 'semua' || 
      k.jabatan === jabatanFilter;
    
    return matchesSearch && matchesJabatan;
  });

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

  // Hitung lama bekerja dalam tahun
  const calculateYearsOfWork = (tglMasuk) => {
    if (!tglMasuk) return 0;
    const masukDate = new Date(tglMasuk);
    const today = new Date();
    const diffTime = Math.abs(today - masukDate);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
    return diffYears;
  };

  // Hitung statistik
  const stats = {
    total: karyawan.length,
    byJabatan: jabatanOptions.reduce((acc, jabatan) => {
      acc[jabatan] = karyawan.filter(k => k.jabatan === jabatan).length;
      return acc;
    }, {}),
    avgWorkYears: karyawan.length > 0 
      ? (karyawan.reduce((sum, k) => sum + calculateYearsOfWork(k.tgl_masuk), 0) / karyawan.length).toFixed(1)
      : 0
  };

  // Get jabatan color
  const getJabatanColor = (jabatan) => {
    const colors = {
      'Kepala Perpustakaan': 'bg-purple-100 text-purple-800 border-purple-200',
      'Staf Pelayanan': 'bg-blue-100 text-blue-800 border-blue-200',
      'Staf Koleksi': 'bg-green-100 text-green-800 border-green-200',
      'Staf IT': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Pustakawan': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Asisten Pustakawan': 'bg-orange-100 text-orange-800 border-orange-200',
      'Admin Sistem': 'bg-red-100 text-red-800 border-red-200',
      'Lainnya': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[jabatan] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Reset form
  const handleResetForm = () => {
    setForm({ 
      nama: '', 
      jabatan: '', 
      no_telepon: '', 
      tgl_masuk: '',
      email: '' 
    });
  };

  // Set tanggal masuk ke hari ini
  const setTodayAsMasuk = () => {
    const today = new Date().toISOString().split('T')[0];
    setForm({...form, tgl_masuk: today});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Navbar/>
      <div className="px-4 py-8">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
            <Users className="text-blue-600" size={32} />
            Manajemen Karyawan
          </h1>
          <p className="text-gray-600 mt-2">
            Kelola data karyawan perpustakaan dengan sistem yang terintegrasi
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Karyawan</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pustakawan Aktif</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.byJabatan['Pustakawan'] || 0}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Award className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rata-rata Masa Kerja</p>
                <p className="text-2xl font-bold text-gray-800">{stats.avgWorkYears} tahun</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Form Tambah/Edit Karyawan */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden ${
          editForm ? 'border-yellow-300' : ''
        }`}>
          <div className={`p-6 ${
            editForm 
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' 
              : 'bg-gradient-to-r from-blue-600 to-blue-500'
          }`}>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              {editForm ? <Edit size={24} /> : <UserPlus size={24} />}
              {editForm ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}
            </h2>
            {editForm && (
              <p className="text-yellow-100 text-sm mt-1">
                Sedang mengedit data karyawan: <strong>{editForm.nama}</strong>
              </p>
            )}
          </div>
          
          <form onSubmit={editForm ? saveEdit : handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={editForm ? editForm.nama : form.nama}
                  onChange={(e) => editForm
                    ? setEditForm({...editForm, nama: e.target.value})
                    : setForm({...form, nama: e.target.value})
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={editForm ? editForm.jabatan : form.jabatan}
                    onChange={(e) => editForm
                      ? setEditForm({...editForm, jabatan: e.target.value})
                      : setForm({...form, jabatan: e.target.value})
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none pr-10"
                    required
                  >
                    <option value="">-- Pilih Jabatan --</option>
                    {jabatanOptions.map((jabatan, index) => (
                      <option key={index} value={jabatan}>{jabatan}</option>
                    ))}
                  </select>
                  <Briefcase className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    placeholder="nama@example.com"
                    value={editForm ? editForm.email : form.email}
                    onChange={(e) => editForm
                      ? setEditForm({...editForm, email: e.target.value})
                      : setForm({...form, email: e.target.value})
                    }
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Telepon
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={editForm ? editForm.no_telepon : form.no_telepon}
                    onChange={(e) => editForm
                      ? setEditForm({...editForm, no_telepon: e.target.value})
                      : setForm({...form, no_telepon: e.target.value})
                    }
                    maxLength="13"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Masuk
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="date"
                      value={editForm ? editForm.tgl_masuk : form.tgl_masuk}
                      onChange={(e) => editForm
                        ? setEditForm({...editForm, tgl_masuk: e.target.value})
                        : setForm({...form, tgl_masuk: e.target.value})
                      }
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  {!editForm && (
                    <button
                      type="button"
                      onClick={setTodayAsMasuk}
                      className="whitespace-nowrap px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                    >
                      Hari Ini
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-end">
                <div className="flex gap-2 w-full">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                      isLoading 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : editForm
                          ? "bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600"
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
                        {editForm ? <Save size={20} /> : <UserPlus size={20} />}
                        {editForm ? 'Simpan Perubahan' : 'Tambah Karyawan'}
                      </>
                    )}
                  </button>
                  
                  {editForm ? (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                    >
                      <X size={20} />
                      Batal
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                    >
                      <RefreshCw size={20} />
                      Reset
                    </button>
                  )}
                </div>
              </div>
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
                  placeholder="Cari berdasarkan nama, email, atau telepon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <span className="text-sm text-gray-600">Filter Jabatan:</span>
              </div>
              <select
                value={jabatanFilter}
                onChange={(e) => setJabatanFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="semua">Semua Jabatan</option>
                {jabatanOptions.map((jabatan, index) => (
                  <option key={index} value={jabatan}>{jabatan}</option>
                ))}
              </select>
              
              <button
                onClick={fetchKaryawan}
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

        {/* Daftar Karyawan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white">Daftar Karyawan</h2>
            <p className="text-gray-300 text-sm mt-1">
              Menampilkan {filteredKaryawan.length} dari {karyawan.length} karyawan
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
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jabatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Masuk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Masa Kerja
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
                      <p className="mt-4 text-gray-500">Memuat data karyawan...</p>
                    </td>
                  </tr>
                ) : filteredKaryawan.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <Users size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">
                        {searchTerm || jabatanFilter !== 'semua' 
                          ? "Tidak ada karyawan yang sesuai dengan filter" 
                          : "Belum ada data karyawan"}
                      </p>
                      <p className="text-gray-400 mt-1">
                        {searchTerm || jabatanFilter !== 'semua' 
                          ? "Coba ubah kata kunci pencarian atau filter" 
                          : "Mulai dengan menambahkan karyawan baru"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredKaryawan.map(k =>
                    editForm && editForm.id === k.id ? (
                      // Mode Edit Row
                      <tr key={k.id} className="bg-yellow-50 border-l-4 border-yellow-500">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            #{k.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.nama}
                            onChange={(e) => setEditForm({...editForm, nama: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={editForm.jabatan}
                            onChange={(e) => setEditForm({...editForm, jabatan: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          >
                            {jabatanOptions.map((jabatan, index) => (
                              <option key={index} value={jabatan}>{jabatan}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="relative">
                              <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                              <input
                                type="tel"
                                value={editForm.no_telepon || ''}
                                onChange={(e) => setEditForm({...editForm, no_telepon: e.target.value})}
                                maxLength="13"
                                className="w-full pl-8 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                placeholder="08xxxxxxxxxx"
                              />
                            </div>
                            <div className="relative">
                              <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                              <input
                                type="email"
                                value={editForm.email || ''}
                                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                className="w-full pl-8 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                placeholder="email@example.com"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="date"
                            value={editForm.tgl_masuk || ''}
                            onChange={(e) => setEditForm({...editForm, tgl_masuk: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500">
                            {calculateYearsOfWork(editForm.tgl_masuk)} tahun
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={saveEdit}
                              disabled={isLoading}
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition"
                            >
                              <Save size={16} />
                              {isLoading ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition"
                            >
                              <X size={16} />
                              Batal
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      // Mode Tampil Row
                      <tr key={k.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            #{k.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{k.nama}</div>
                          {k.email && (
                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <Mail size={14} />
                              {k.email}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getJabatanColor(k.jabatan)}`}>
                            <Briefcase size={14} className="mr-1" />
                            {k.jabatan}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone size={16} className="text-gray-400" />
                            <span>{k.no_telepon || '-'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar size={16} className="text-gray-400" />
                            <span>{formatDate(k.tgl_masuk)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            <Clock size={14} className="mr-1" />
                            {calculateYearsOfWork(k.tgl_masuk)} tahun
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(k)}
                              className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition"
                            >
                              <Edit size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteKaryawan(k.id, k.nama)}
                              className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition"
                            >
                              <Trash2 size={16} />
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Distribution by Jabatan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribusi Karyawan per Jabatan</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {jabatanOptions.map((jabatan, index) => {
              const count = stats.byJabatan[jabatan] || 0;
              const percentage = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0;
              
              return (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 truncate">{jabatan}</span>
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
          <p>© {new Date().getFullYear()} Sistem Manajemen Karyawan Perpustakaan</p>
          <p className="mt-1">Total karyawan aktif: {stats.total} orang</p>
        </div>
      </div>
    </div>
  );
}
