import { Outlet } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <Outlet />
    </div>
  );
}
