import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { dashboardService } from '../../services';
import AILoadingAnimation from '../../components/ui/AILoadingAnimation';
import { toast } from 'react-toastify';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-white/10 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-emerald-400 font-semibold">{payload[0]?.value}</p>
    </div>
  );
};

export default function ImpactReportPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const { data } = await dashboardService.generateReport();
      setReport(data.data.report);
      toast.success('Impact report generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  const radarData = report?.metrics?.map((m) => ({
    subject: m.label,
    value: parseFloat(m.value) || 50,
  })) || [];

  const barData = report?.metrics?.map((m) => ({
    name: m.label.length > 12 ? m.label.slice(0, 12) + '…' : m.label,
    value: parseFloat(m.value) || 0,
    change: m.change,
  })) || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-poppins flex items-center gap-2">
            🌱 AI Impact Reports
          </h1>
          <p className="text-gray-400 text-sm mt-1">Generate comprehensive ESG and sustainability impact reports powered by AI.</p>
        </div>
        <button
          onClick={generateReport}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </motion.div>

      {loading && (
        <div className="card">
          <AILoadingAnimation text="AI is analyzing your sustainability impact..." />
        </div>
      )}

      {!loading && !report && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card text-center py-16">
          <div className="text-6xl mb-4">🌍</div>
          <h3 className="text-white font-bold font-poppins text-xl mb-2">Generate Your ESG Impact Report</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            Our AI analyzes your platform activity to generate carbon reduction metrics, plastic savings, eco impact scores, and comprehensive ESG summaries.
          </p>
          <button onClick={generateReport} className="btn-primary mx-auto">
            🤖 Generate AI Report
          </button>
        </motion.div>
      )}

      {report && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Top Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card border border-emerald-500/30 text-center">
              <div className="text-4xl mb-2">🌿</div>
              <p className="text-3xl font-bold text-emerald-400 font-poppins">
                {report.carbonReduction?.value} {report.carbonReduction?.unit}
              </p>
              <p className="text-gray-400 text-sm mt-1">Carbon Reduction</p>
              <p className="text-gray-600 text-xs mt-1">{report.carbonReduction?.description}</p>
            </div>
            <div className="card border border-blue-500/30 text-center">
              <div className="text-4xl mb-2">♻️</div>
              <p className="text-3xl font-bold text-blue-400 font-poppins">
                {report.plasticSavings?.value} {report.plasticSavings?.unit}
              </p>
              <p className="text-gray-400 text-sm mt-1">Plastic Savings</p>
              <p className="text-gray-600 text-xs mt-1">{report.plasticSavings?.description}</p>
            </div>
            <div className="card border border-purple-500/30 text-center">
              <div className="text-4xl mb-2">⭐</div>
              <p className="text-3xl font-bold text-purple-400 font-poppins">{report.ecoImpactScore}/100</p>
              <p className="text-gray-400 text-sm mt-1">Eco Impact Score</p>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${report.ecoImpactScore}%` }}
                  transition={{ duration: 1.2 }}
                  className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-400"
                />
              </div>
            </div>
          </div>

          {/* ESG Summary */}
          <div className="card border border-emerald-500/20">
            <h3 className="text-white font-semibold font-poppins mb-3 flex items-center gap-2">
              📄 ESG Summary
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm">{report.esgSummary}</p>
          </div>

          {/* Charts */}
          {radarData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-white font-semibold font-poppins mb-4">Sustainability Radar</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <Radar name="Score" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="card">
                <h3 className="text-white font-semibold font-poppins mb-4">Metrics Overview</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} margin={{ left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Metrics Table */}
          {report.metrics?.length > 0 && (
            <div className="card">
              <h3 className="text-white font-semibold font-poppins mb-4">Detailed Metrics</h3>
              <div className="space-y-3">
                {report.metrics.map((m, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-gray-300 text-sm">{m.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold text-sm">{m.value}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        m.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {m.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
