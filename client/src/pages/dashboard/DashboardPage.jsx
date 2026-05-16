import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiTag, FiFileText, FiBarChart2, FiMessageSquare, FiArrowRight, FiClock } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';

const chartData = [
  { name: 'Jan', products: 12, proposals: 4 },
  { name: 'Feb', products: 19, proposals: 7 },
  { name: 'Mar', products: 28, proposals: 11 },
  { name: 'Apr', products: 35, proposals: 15 },
  { name: 'May', products: 42, proposals: 18 },
  { name: 'Jun', products: 58, proposals: 24 },
  { name: 'Jul', products: 71, proposals: 31 },
];

const quickActions = [
  { to: '/dashboard/products', icon: <FiTag size={20} />, label: 'Analyze Product', desc: 'AI categorization', color: 'emerald' },
  { to: '/dashboard/proposals', icon: <FiFileText size={20} />, label: 'New Proposal', desc: 'B2B generator', color: 'blue' },
  { to: '/dashboard/impact', icon: <FiBarChart2 size={20} />, label: 'Impact Report', desc: 'ESG analytics', color: 'purple' },
  { to: '/dashboard/chat', icon: <FiMessageSquare size={20} />, label: 'AI Support', desc: 'Chat assistant', color: 'orange' },
];

const colorMap = {
  emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400',
  blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-400',
  purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-400',
  orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/30 text-orange-400',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-white/10 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="text-white font-semibold">{p.value}</span></p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats()
      .then(({ data }) => setStats(data.data))
      .catch(() => toast.error('Failed to load dashboard stats.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <LoadingSpinner size="lg" text="Loading dashboard..." />
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white font-poppins">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here's what's happening with your AI platform today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🏷️" label="Products Analyzed" value={stats?.stats?.productsCount ?? 0} change="+12%" color="emerald" delay={0} />
        <StatCard icon="📋" label="Proposals Generated" value={stats?.stats?.proposalsCount ?? 0} change="+8%" color="blue" delay={0.1} />
        <StatCard icon="💰" label="Budget Managed" value={`$${((stats?.stats?.totalBudget ?? 0) / 1000).toFixed(1)}K`} change="+24%" color="purple" delay={0.2} />
        <StatCard icon="✅" label="AI Success Rate" value={`${stats?.stats?.successRate ?? 100}%`} change="+2%" color="orange" delay={0.3} />
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 card"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold font-poppins">AI Usage Analytics</h3>
              <p className="text-gray-500 text-xs mt-0.5">Products & proposals over time</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProposals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="products" name="Products" stroke="#10b981" strokeWidth={2} fill="url(#colorProducts)" />
              <Area type="monotone" dataKey="proposals" name="Proposals" stroke="#3b82f6" strokeWidth={2} fill="url(#colorProposals)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-white font-semibold font-poppins mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                to={action.to}
                className={`flex items-center gap-3 p-3 bg-gradient-to-r ${colorMap[action.color]} border rounded-xl hover:scale-[1.02] transition-all duration-200 group`}
              >
                <span className="flex-shrink-0">{action.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{action.label}</p>
                  <p className="text-gray-500 text-xs">{action.desc}</p>
                </div>
                <FiArrowRight size={14} className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h3 className="text-white font-semibold font-poppins mb-4 flex items-center gap-2">
          <FiClock size={16} className="text-emerald-400" />
          Recent AI Activity
        </h3>
        {stats?.recentActivity?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentActivity.slice(0, 6).map((log, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.success ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-sm capitalize">{log.type?.replace('_', ' ')}</p>
                  <p className="text-gray-600 text-xs">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${log.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {log.success ? 'Success' : 'Failed'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No AI activity yet.</p>
            <Link to="/dashboard/products" className="text-emerald-400 text-sm hover:underline mt-1 inline-block">
              Analyze your first product →
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
