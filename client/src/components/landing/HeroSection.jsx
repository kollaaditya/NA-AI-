import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

const floatingBadges = [
  { icon: '🌿', label: 'Eco Score: 94', top: '20%', left: '5%', delay: 0 },
  { icon: '🤖', label: 'AI Powered', top: '15%', right: '5%', delay: 0.3 },
  { icon: '📊', label: 'ROI +340%', bottom: '30%', left: '3%', delay: 0.6 },
  { icon: '🔒', label: 'Enterprise Secure', bottom: '25%', right: '3%', delay: 0.9 },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Floating badges */}
      {floatingBadges.map((badge, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{ delay: badge.delay + 1, duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute hidden lg:flex items-center gap-2 glass rounded-xl px-3 py-2 text-sm font-medium text-white shadow-xl"
          style={{ top: badge.top, left: badge.left, right: badge.right, bottom: badge.bottom }}
        >
          <span>{badge.icon}</span>
          <span className="text-gray-200 text-xs">{badge.label}</span>
        </motion.div>
      ))}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 border border-emerald-500/30"
        >
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-sm font-medium">AI-Powered Sustainable Commerce Platform</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white font-poppins leading-tight mb-6"
        >
          Transforming{' '}
          <span className="gradient-text">Sustainable</span>
          <br />
          Commerce with{' '}
          <span className="relative">
            <span className="gradient-text">AI</span>
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Automate product categorization, generate B2B proposals, and measure your ESG impact — all powered by cutting-edge AI.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-8 py-4 w-full sm:w-auto justify-center">
            Start Free Trial
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary flex items-center gap-2 text-base px-8 py-4 w-full sm:w-auto justify-center"
          >
            <FiPlay size={16} />
            See How It Works
          </button>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mx-auto max-w-4xl"
        >
          <div className="glass rounded-2xl border border-emerald-500/20 overflow-hidden shadow-2xl shadow-emerald-500/10">
            {/* Mock browser bar */}
            <div className="bg-gray-900/80 px-4 py-3 flex items-center gap-2 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              </div>
              <div className="flex-1 mx-4 bg-white/5 rounded-md px-3 py-1 text-xs text-gray-500 text-center">
                app.naaisystems.com/dashboard
              </div>
            </div>
            {/* Dashboard preview content */}
            <div className="bg-gray-900/60 p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Products Analyzed', value: '1,247', color: 'emerald' },
                  { label: 'Proposals Generated', value: '384', color: 'blue' },
                  { label: 'Eco Score Avg', value: '87/100', color: 'green' },
                  { label: 'ROI Generated', value: '$2.4M', color: 'purple' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="bg-white/5 rounded-xl p-3 border border-white/10"
                  >
                    <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
                    <p className="text-white font-bold text-sm font-poppins">{stat.value}</p>
                  </motion.div>
                ))}
              </div>
              {/* Mock chart bars */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-gray-400 text-xs mb-3">AI Usage Analytics</p>
                <div className="flex items-end gap-2 h-16">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 1 + i * 0.05, duration: 0.4 }}
                      className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-sm opacity-80"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-emerald-500/5 rounded-3xl blur-2xl -z-10" />
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-12 text-gray-500 text-sm"
        >
          {['AWS Powered', 'SOC 2 Compliant', 'GDPR Ready', 'ISO 27001', '99.9% Uptime'].map((badge) => (
            <div key={badge} className="flex items-center gap-1.5">
              <span className="text-emerald-500">✓</span>
              <span>{badge}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
