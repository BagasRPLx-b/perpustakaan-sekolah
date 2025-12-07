import './index.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Import komponen Router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// Import komponen-komponen halaman
import App from './App.jsx'
import PeminjamanPage from './pages/Peminjaman.jsx'
import KaryawanPage from './pages/Karyawan.jsx';
import AktivitasPage from './pages/Aktivitas.jsx' // Tambahkan ini


// Definisikan rute-rute aplikasi
const router = createBrowserRouter([
  {
    path: "/", // Halaman utama (App.jsx)
    element: <App />,
  },
  {
    path: "/peminjaman", // Rute untuk halaman peminjaman
    element: <PeminjamanPage />,
  },
  {
    path: "/karyawan", // Rute untuk halaman karyawan
    element: <KaryawanPage />,
  },
  {
    path: "/aktivitas", // Tambahkan rute baru
    element: <AktivitasPage />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Bungkus aplikasi dengan RouterProvider */}
    <RouterProvider router={router} />
  </StrictMode>,
)