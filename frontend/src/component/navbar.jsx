
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Users, 
  Activity,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { 
      name: 'Home', 
      path: '/', 
      icon: <Home size={20} />,
      label: 'Dashboard Buku'
    },
    { 
      name: 'Peminjaman', 
      path: '/peminjaman', 
      icon: <BookOpen size={20} />,
      label: 'Manajemen Peminjaman'
    },
    { 
      name: 'Karyawan', 
      path: '/karyawan', 
      icon: <Users size={20} />,
      label: 'Manajemen Karyawan'
    },
    { 
      name: 'Aktivitas', 
      path: '/aktivitas', 
      icon: <Activity size={20} />,
      label: 'Aktivitas Pengunjung'
    },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      // Logika logout di sini
      alert('Anda telah logout');
      // window.location.href = '/login'; // Uncomment jika ada halaman login
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                  <BookOpen size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                    Perpustakaan Sekolah
                  </h1>
                  <p className="text-xs text-gray-400">Sistem Manajemen Terpadu</p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg mx-1 transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  title={item.label}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                  {isActive(item.path) && (
                    <div className="ml-2 w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                  )}
                </Link>
              ))}
              
              {/* User Profile & Logout */}
              <div className="ml-6 flex items-center gap-4 pl-6 border-l border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="font-bold">AD</span>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium">Admin Perpustakaan</p>
                    <p className="text-xs text-gray-400">Super Admin</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  title="Keluar dari sistem"
                >
                  <LogOut size={18} />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X size={24} className="block" />
                ) : (
                  <Menu size={24} className="block" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                  {isActive(item.path) && (
                    <div className="ml-auto w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                  )}
                </Link>
              ))}
              
              {/* Mobile Profile & Logout */}
              <div className="mt-4 pt-4 border-t border-gray-700 mx-2">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="font-bold">AD</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Admin Perpustakaan</p>
                    <p className="text-xs text-gray-400">Super Admin</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg mx-2 mt-2 transition-all duration-300"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Active Page Indicator */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          {navigation
            .filter(item => location.pathname.startsWith(item.path) && item.path !== '/')
            .map(item => (
              <span key={item.path} className="flex items-center">
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">{item.label}</span>
              </span>
            ))}
        </div>
      </div>

      {/* Custom CSS untuk animasi */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
