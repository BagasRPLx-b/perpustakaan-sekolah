
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./component/navbar";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  BookOpen, 
  Search,
  Filter
} from "lucide-react";

function App() {
  const [editForm, setEditForm] = useState(null);
  const [buku, setBuku] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    judul: "",
    pengarang: "",
    penerbit: "",
    tahun_terbit: "",
    jumlah_stok: "",
    lokasi_rak: "",
  });

  const fetchBuku = () => {
    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/buku")
      .then((res) => {
        setBuku(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchBuku();
  }, []);

  // Filter buku berdasarkan pencarian
  const filteredBuku = buku.filter((b) =>
    b.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.pengarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.penerbit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.lokasi_rak?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      ...form,
      jumlah_stok: parseInt(form.jumlah_stok, 10),
    };

    axios
      .post("http://localhost:5000/api/buku", formData)
      .then(() => {
        alert("Buku berhasil ditambahkan");
        fetchBuku();
        setForm({
          judul: "",
          pengarang: "",
          penerbit: "",
          tahun_terbit: "",
          jumlah_stok: "",
          lokasi_rak: "",
        });
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Gagal menambahkan buku. Periksa konsol.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const startEdit = (buku) => {
    setEditForm({ ...buku });
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    axios
      .put(`http://localhost:5000/api/buku/${editForm.id}`, {
        ...editForm,
        jumlah_stok: parseInt(editForm.jumlah_stok, 10),
      })
      .then(() => {
        alert("Buku berhasil diedit");
        fetchBuku();
        setEditForm(null);
      })
      .catch((err) => {
        console.error("Error editing book:", err);
        alert("Gagal mengedit buku. Periksa konsol.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const cancelEdit = () => {
    setEditForm(null);
  };

  const deleteBuku = (id) => {
    if (window.confirm("Yakin ingin menghapus buku ini?")) {
      setIsLoading(true);
      axios
        .delete(`http://localhost:5000/api/buku/${id}`)
        .then(() => {
          alert("Buku berhasil dihapus");
          fetchBuku();
        })
        .catch((err) => {
          console.error("Error deleting book:", err);
          alert("Gagal menghapus buku. Periksa konsol.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const getStokColor = (stok) => {
    if (stok <= 0) return "bg-red-100 text-red-800";
    if (stok <= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
              <BookOpen className="text-blue-600" size={32} />
              Perpustakaan Sekolah
            </h1>
            <p className="text-gray-600 mt-2">Kelola koleksi buku perpustakaan dengan mudah</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari buku berdasarkan judul, pengarang, atau lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Buku</p>
                <p className="text-2xl font-bold text-gray-800">{buku.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Stok</p>
                <p className="text-2xl font-bold text-gray-800">
                  {buku.reduce((sum, b) => sum + (b.jumlah_stok || 0), 0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <BookOpen className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rak Terisi</p>
                <p className="text-2xl font-bold text-gray-800">
                  {[...new Set(buku.map(b => b.lokasi_rak))].length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Filter className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-2xl font-bold text-gray-800">
                  {isLoading ? "Memuat..." : "Aktif"}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <BookOpen className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Form Tambah Buku */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <PlusCircle size={24} />
              Tambah Buku Baru
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Buku <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan judul buku"
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pengarang <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama pengarang"
                  value={form.pengarang}
                  onChange={(e) => setForm({ ...form, pengarang: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penerbit
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama penerbit"
                  value={form.penerbit}
                  onChange={(e) => setForm({ ...form, penerbit: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun Terbit
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 2023"
                  value={form.tahun_terbit}
                  onChange={(e) => setForm({ ...form, tahun_terbit: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  min="1900"
                  max="2099"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Stok <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Masukkan jumlah stok"
                  value={form.jumlah_stok}
                  onChange={(e) => setForm({ ...form, jumlah_stok: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi Rak
                </label>
                <input
                  type="text"
                  placeholder="Contoh: A-1, B-2"
                  value={form.lokasi_rak}
                  onChange={(e) => setForm({ ...form, lokasi_rak: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
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
                    Tambah Buku
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Daftar Buku */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white">Daftar Buku</h2>
            <p className="text-gray-300 text-sm mt-1">
              Menampilkan {filteredBuku.length} dari {buku.length} buku
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
                    Judul Buku
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pengarang
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penerbit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rak
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
                      <p className="mt-4 text-gray-500">Memuat data buku...</p>
                    </td>
                  </tr>
                ) : filteredBuku.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">Tidak ada buku ditemukan</p>
                      <p className="text-gray-400 mt-1">
                        {searchTerm ? "Coba dengan kata kunci lain" : "Tambahkan buku baru menggunakan form di atas"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredBuku.map((b) =>
                    editForm && editForm.id === b.id ? (
                      // Mode Edit
                      <tr key={b.id} className="bg-yellow-50 border-l-4 border-yellow-500">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {b.id}
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.judul}
                            onChange={(e) =>
                              setEditForm({ ...editForm, judul: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.pengarang}
                            onChange={(e) =>
                              setEditForm({ ...editForm, pengarang: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.penerbit || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, penerbit: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={editForm.jumlah_stok}
                            onChange={(e) =>
                              setEditForm({ ...editForm, jumlah_stok: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.lokasi_rak || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, lokasi_rak: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={saveEdit}
                              disabled={isLoading}
                              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition"
                            >
                              <Save size={16} />
                              {isLoading ? "Menyimpan..." : "Simpan"}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition"
                            >
                              <X size={16} />
                              Batal
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      // Mode Tampil
                      <tr key={b.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          #{b.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{b.judul}</div>
                          {b.tahun_terbit && (
                            <div className="text-sm text-gray-500">Tahun: {b.tahun_terbit}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-900">{b.pengarang}</td>
                        <td className="px-6 py-4 text-gray-700">{b.penerbit || "-"}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStokColor(b.jumlah_stok)}`}>
                            {b.jumlah_stok} stok
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {b.lokasi_rak || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(b)}
                              className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition"
                            >
                              <Edit size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteBuku(b.id)}
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

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Perpustakaan Sekolah. Sistem Manajemen Buku.</p>
          <p className="mt-1">Total buku dalam database: {buku.length}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
