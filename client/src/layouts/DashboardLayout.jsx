import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiTag, FiFileText, FiBarChart2, FiMessageSquare,
  FiShield, FiLogOut, FiMenu, FiX, FiUser, FiBell,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const navItems = [
  { to: '/dashboard', icon: <FiGrid size={18} />, label: 'Overview', exact: true },
  { to: '/dashboard/products', icon: <FiTag size={18} />, label: 'Product Analyzer' },
  { to: '/dashboard/proposals', icon: <FiFileText size={18} />, label: 'B2B Proposals' },
  { to: '/dashboard/impact', icon: <FiBarChart2 size={18} />, label: 'Impact Reports' },
  { to: '/dashboard/chat', icon: <FiMessageSquare size={18} />, label: 'AI Support' },
];

const adminItems = [
  { to: '/dashboard/admin', icon: <FiShield size={18} />, label: 'Admin Panel' },
];

function SidebarLink({ item }) {
  return (
    <NavLink
      to={item.to}
      end={item.exact}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
          isActive
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`
      }
    >
      <span className="flex-shrink-0">{item.icon}</span>
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <span className="text-white font-bold text-xs font-poppins">NA</span>
        </div>
        <span className="font-bold text-white font-poppins text-base">
          NA <span className="text-emerald-400">AI</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        <p className="text-gray-600 text-xs font-semibold uppercase tracking-widest px-3 mb-2">Main</p>
        {navItems.map((item) => <SidebarLink key={item.to} item={item} />)}

        {isAdmin && (
          <>
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-widest px-3 mt-4 mb-2">Admin</p>
            {adminItems.map((item) => <SidebarLink key={item.to} item={item} />)}
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold font-poppins flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-sm transition-all duration-200"
        >
          <FiLogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-gray-900/80 border-r border-white/10 backdrop-blur-xl fixed top-0 left-0 h-full z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 left-0 h-full w-60 bg-gray-900 border-r border-white/10 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-gray-950/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <FiMenu size={20} />
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-emerald-400 transition-colors rounded-lg hover:bg-white/5"
            >
              {isDark ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 relative">
              <FiBell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold font-poppins cursor-pointer">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
