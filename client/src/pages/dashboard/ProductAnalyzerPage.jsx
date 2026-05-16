import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiDownload, FiCopy, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { productService } from '../../services';
import AILoadingAnimation from '../../components/ui/AILoadingAnimation';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import useProducts from '../../hooks/useProducts';

function ResultCard({ product, onDelete }) {
  const r = product.aiResult;

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(product.rawJson, null, 2));
    toast.success('JSON copied to clipboard!');
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(product.rawJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${product.title.replace(/\s+/g, '_')}_ai_result.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('JSON downloaded!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold font-poppins truncate">{product.title}</h4>
          <p className="text-gray-500 text-xs mt-0.5">{new Date(product.createdAt).toLocaleDateString()}</p>
        </div>
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-gray-500 text-xs mb-1">Category</p>
          <p className="text-emerald-400 text-sm font-medium">{r?.category || '—'}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-gray-500 text-xs mb-1">Sub-Category</p>
          <p className="text-blue-400 text-sm font-medium">{r?.subCategory || '—'}</p>
        </div>
      </div>

      {/* Eco Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-gray-400 text-xs">Eco Score</span>
          <span className="text-emerald-400 text-sm font-bold">{r?.ecoScore ?? 0}/100</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${r?.ecoScore ?? 0}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
          />
        </div>
      </div>

      {/* SEO Tags */}
      {r?.seoTags?.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-500 text-xs mb-2">SEO Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {r.seoTags.map((tag, i) => (
              <span key={i} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sustainability Filters */}
      {r?.sustainabilityFilters?.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-500 text-xs mb-2">Sustainability Filters</p>
          <div className="flex flex-wrap gap-1.5">
            {r.sustainabilityFilters.map((f, i) => (
              <span key={i} className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                🌿 {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {r?.summary && (
        <p className="text-gray-400 text-xs leading-relaxed mb-4 bg-white/5 rounded-xl p-3">{r.summary}</p>
      )}

      <div className="flex gap-2">
        <button onClick={copyJSON} className="flex-1 flex items-center justify-center gap-1.5 btn-secondary py-2 text-xs">
          <FiCopy size={13} /> Copy JSON
        </button>
        <button onClick={downloadJSON} className="flex-1 flex items-center justify-center gap-1.5 btn-primary py-2 text-xs">
          <FiDownload size={13} /> Download
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <FiTrash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export default function ProductAnalyzerPage() {
  const [form, setForm] = useState({ title: '', description: '' });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [search, setSearch] = useState('');
  const fileRef = useRef(null);
  const { products, loading, pagination, fetchProducts, deleteProduct } = useProducts();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB.'); return; }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error('Title and description are required.'); return; }
    setAnalyzing(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      if (image) fd.append('image', image);
      await productService.analyze(fd);
      toast.success('Product analyzed successfully!');
      setForm({ title: '', description: '' });
      setImage(null);
      setImagePreview('');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product analysis?')) return;
    await deleteProduct(id);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchProducts({ search: e.target.value });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white font-poppins flex items-center gap-2">
          🏷️ AI Product Analyzer
        </h1>
        <p className="text-gray-400 text-sm mt-1">Generate AI-powered categories, SEO tags, and eco scores for your products.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="card sticky top-20">
            <h3 className="text-white font-semibold font-poppins mb-4">Analyze New Product</h3>
            {analyzing ? (
              <AILoadingAnimation text="AI is categorizing your product..." />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Product Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Bamboo Water Bottle 500ml"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the product, materials, features, and sustainability aspects..."
                    rows={4}
                    className="input-field resize-none"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1.5">Product Image (optional)</label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-white/20 hover:border-emerald-500/50 rounded-xl p-4 text-center cursor-pointer transition-all group"
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setImage(null); setImagePreview(''); }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <FiUpload className="mx-auto text-gray-500 group-hover:text-emerald-400 mb-2 transition-colors" size={24} />
                        <p className="text-gray-500 text-xs group-hover:text-gray-400 transition-colors">
                          Click to upload (JPG, PNG, WebP · max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </div>

                <button type="submit" className="btn-primary w-full">
                  🤖 Analyze with AI
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search products..."
              className="input-field pl-10"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Loading products..." />
            </div>
          ) : products.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-5xl mb-3">🏷️</div>
              <p className="text-gray-400">No products analyzed yet.</p>
              <p className="text-gray-600 text-sm mt-1">Submit your first product to get started.</p>
            </div>
          ) : (
            <AnimatePresence>
              {products.map((product) => (
                <ResultCard key={product._id} product={product} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchProducts({ page })}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    page === pagination.page
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
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
