import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiTag, FiFileText, FiMessageSquare, FiSearch, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import StatCard from '../../components/ui/StatCard';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';

function UsersTable({ users, onToggle }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left text-gray-500 font-medium py-3 px-2">User</th>
            <th className="text-left text-gray-500 font-medium py-3 px-2 hidden sm:table-cell">Role</th>
            <th className="text-left text-gray-500 font-medium py-3 px-2 hidden md:table-cell">Joined</th>
            <th className="text-left text-gray-500 font-medium py-3 px-2">Status</th>
            <th className="text-left text-gray-500 font-medium py-3 px-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm truncate max-w-[120px]">{user.name}</p>
                    <p className="text-gray-500 text-xs truncate max-w-[120px]">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-2 hidden sm:table-cell">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="py-3 px-2 text-gray-500 text-xs hidden md:table-cell">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  user.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-3 px-2">
                <button
                  onClick={() => onToggle(user._id)}
                  className={`p-1.5 rounded-lg transition-all ${
                    user.isActive
                      ? 'text-emerald-400 hover:bg-emerald-500/10'
                      : 'text-red-400 hover:bg-red-500/10'
                  }`}
                  title={user.isActive ? 'Deactivate' : 'Activate'}
                >
                  {user.isActive ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, usersRes, contactsRes] = await Promise.all([
          dashboardService.adminGetStats(),
          dashboardService.adminGetUsers(),
          dashboardService.adminGetContacts(),
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data.users);
        setContacts(contactsRes.data.data.contacts);
      } catch {
        toast.error('Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleToggleUser = async (id) => {
    try {
      const { data } = await dashboardService.adminToggleUser(id);
      setUsers((prev) => prev.map((u) => u._id === id ? data.data.user : u));
      toast.success(data.message);
    } catch {
      toast.error('Failed to update user status.');
    }
  };

  const handleUserSearch = async (e) => {
    setUserSearch(e.target.value);
    try {
      const { data } = await dashboardService.adminGetUsers({ search: e.target.value });
      setUsers(data.data.users);
    } catch {}
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner size="lg" text="Loading admin panel..." />
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'activity', label: 'AI Logs', icon: '🤖' },
    { id: 'contacts', label: 'Contacts', icon: '📧' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white font-poppins flex items-center gap-2">
          🛡️ Admin Panel
        </h1>
        <p className="text-gray-400 text-sm mt-1">Manage users, monitor AI activity, and oversee platform operations.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="👥" label="Total Users" value={stats?.stats?.usersCount ?? 0} color="emerald" delay={0} />
            <StatCard icon="🏷️" label="Products Analyzed" value={stats?.stats?.productsCount ?? 0} color="blue" delay={0.1} />
            <StatCard icon="📋" label="Proposals Generated" value={stats?.stats?.proposalsCount ?? 0} color="purple" delay={0.2} />
            <StatCard icon="📧" label="New Contacts" value={stats?.stats?.newContacts ?? 0} color="orange" delay={0.3} />
          </div>

          {/* Recent Users */}
          <div className="card">
            <h3 className="text-white font-semibold font-poppins mb-4 flex items-center gap-2">
              <FiUsers size={16} className="text-emerald-400" /> Recent Users
            </h3>
            <div className="space-y-3">
              {stats?.recentUsers?.map((user) => (
                <div key={user._id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">{user.name}</p>
                    <p className="text-gray-500 text-xs">{user.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {user.role}
                  </span>
                  <span className="text-gray-600 text-xs hidden sm:block">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-white font-semibold font-poppins">User Management</h3>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="text"
                value={userSearch}
                onChange={handleUserSearch}
                placeholder="Search users..."
                className="input-field pl-9 py-2 text-sm w-56"
              />
            </div>
          </div>
          <UsersTable users={users} onToggle={handleToggleUser} />
        </motion.div>
      )}

      {/* AI Logs Tab */}
      {activeTab === 'activity' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
          <h3 className="text-white font-semibold font-poppins mb-4">Recent AI Activity Logs</h3>
          <div className="space-y-3">
            {stats?.recentLogs?.map((log, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.success ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-sm capitalize">{log.type?.replace('_', ' ')}</p>
                  <p className="text-gray-600 text-xs">{log.user?.name} · {log.user?.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${log.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {log.success ? 'Success' : 'Failed'}
                  </span>
                  <p className="text-gray-600 text-xs mt-0.5">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
          <h3 className="text-white font-semibold font-poppins mb-4">Contact Submissions</h3>
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No contact submissions yet.</p>
            ) : contacts.map((c) => (
              <div key={c._id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-white font-medium text-sm">{c.name}</p>
                    <p className="text-gray-500 text-xs">{c.email} {c.company && `· ${c.company}`}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      c.status === 'new' ? 'bg-emerald-500/10 text-emerald-400' :
                      c.status === 'read' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {c.status}
                    </span>
                    <span className="text-gray-600 text-xs">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{c.message}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
