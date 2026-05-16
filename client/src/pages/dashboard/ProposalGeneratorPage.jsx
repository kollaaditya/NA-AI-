import { useState, useCallback } from 'react';
import { proposalService } from '../../services';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiSearch, FiDollarSign, FiBriefcase, FiTrendingUp } from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import AILoadingAnimation from '../../components/ui/AILoadingAnimation';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import useProposals from '../../hooks/useProposals';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

function ProposalCard({ proposal, onDelete }) {
  const r = proposal.aiResult;
  const [expanded, setExpanded] = useState(false);

  const pieData = r?.budgetAllocation?.map((b) => ({
    name: b.category,
    value: b.amount,
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card border border-blue-500/20 hover:border-blue-500/40 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h4 className="text-white font-bold font-poppins">{proposal.companyName}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-gray-500 text-xs flex items-center gap-1">
              <FiBriefcase size={11} /> {proposal.industry}
            </span>
            <span className="text-emerald-400 text-xs flex items-center gap-1">
              <FiDollarSign size={11} /> ${proposal.budget?.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full border ${
            proposal.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            proposal.status === 'sent' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
            'bg-gray-500/10 text-gray-400 border-gray-500/20'
          }`}>
            {proposal.status}
          </span>
          <button
            onClick={() => onDelete(proposal._id)}
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {/* ROI Highlight */}
      {r?.roiEstimate && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
            <p className="text-emerald-400 font-bold text-lg font-poppins">{r.roiEstimate.percentage}%</p>
            <p className="text-gray-500 text-xs">ROI</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
            <p className="text-blue-400 font-bold text-sm font-poppins">{r.roiEstimate.timeframe}</p>
            <p className="text-gray-500 text-xs">Timeframe</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
            <p className="text-purple-400 font-bold text-sm font-poppins">${(r.roiEstimate.savings / 1000).toFixed(0)}K</p>
            <p className="text-gray-500 text-xs">Savings</p>
          </div>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-emerald-400 text-xs hover:text-emerald-300 transition-colors mb-3"
      >
        {expanded ? '▲ Hide details' : '▼ View full proposal'}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {/* Budget Pie Chart */}
            {pieData.length > 0 && (
              <div className="mb-4">
                <p className="text-gray-400 text-xs mb-2">Budget Allocation</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [`$${v.toLocaleString()}`, '']}
                      contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recommendations */}
            {r?.recommendations?.length > 0 && (
              <div className="mb-4">
                <p className="text-gray-400 text-xs mb-2">Recommendations</p>
                <div className="space-y-2">
                  {r.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 bg-white/5 rounded-xl p-3">
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">{rec.product}</p>
                        <p className="text-gray-500 text-xs">{rec.description}</p>
                      </div>
                      <span className="text-emerald-400 text-xs font-semibold flex-shrink-0">${rec.cost?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {r?.sustainabilitySummary && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
                <p className="text-emerald-400 text-xs font-semibold mb-1">🌿 Sustainability Summary</p>
                <p className="text-gray-400 text-xs leading-relaxed">{r.sustainabilitySummary}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProposalGeneratorPage() {
  const [form, setForm] = useState({ companyName: '', budget: '', industry: '' });
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState('');
  const { proposals, loading, pagination, fetchProposals, deleteProposal } = useProposals();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName || !form.budget || !form.industry) {
      toast.error('All fields are required.');
      return;
    }
    if (parseFloat(form.budget) < 1000) {
      toast.error('Budget must be at least $1,000.');
      return;
    }
    setGenerating(true);
    try {
      await proposalService.create({ ...form, budget: parseFloat(form.budget) });
      toast.success('B2B Proposal generated!');
      setForm({ companyName: '', budget: '', industry: '' });
      fetchProposals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchProposals({ search: e.target.value });
  };

  const industries = ['Technology', 'Retail', 'Manufacturing', 'Healthcare', 'Agriculture', 'Energy', 'Logistics', 'Finance', 'Education', 'Other'];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white font-poppins flex items-center gap-2">
          📋 B2B Proposal Generator
        </h1>
        <p className="text-gray-400 text-sm mt-1">Generate AI-powered B2B proposals with budget allocation, ROI estimates, and sustainability summaries.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <div className="card sticky top-20">
            <h3 className="text-white font-semibold font-poppins mb-4">Generate New Proposal</h3>
            {generating ? (
              <AILoadingAnimation text="AI is crafting your proposal..." />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="e.g. GreenTech Solutions Ltd"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Budget (USD) *</label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="number"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      placeholder="50000"
                      min="1000"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Industry *</label>
                  <select
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="" disabled>Select industry</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind} className="bg-gray-900">{ind}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <FiTrendingUp size={16} />
                  Generate Proposal
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search proposals..."
              className="input-field pl-10"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading proposals..." />
            </div>
          ) : proposals.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-5xl mb-3">📋</div>
              <p className="text-gray-400">No proposals generated yet.</p>
              <p className="text-gray-600 text-sm mt-1">Create your first B2B proposal above.</p>
            </div>
          ) : (
            <AnimatePresence>
              {proposals.map((proposal) => (
                <ProposalCard key={proposal._id} proposal={proposal} onDelete={deleteProposal} />
              ))}
            </AnimatePresence>
          )}

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchProposals({ page })}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    page === pagination.page ? 'bg-emerald-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
