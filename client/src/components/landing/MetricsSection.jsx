import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CountUp } from '../../hooks/CountUp';

const metrics = [
  { value: 1247, suffix: '+', label: 'Products Analyzed', icon: '🏷️' },
  { value: 384, suffix: '+', label: 'B2B Proposals Generated', icon: '📋' },
  { value: 98, suffix: '%', label: 'AI Accuracy Rate', icon: '🎯' },
  { value: 2.4, suffix: 'M', prefix: '$', label: 'ROI Generated', icon: '💰' },
  { value: 340, suffix: '%', label: 'Average ROI Increase', icon: '📈' },
  { value: 99.9, suffix: '%', label: 'Platform Uptime', icon: '⚡' },
];

function MetricCard({ metric, inView, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="text-center p-6 glass rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group"
    >
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{metric.icon}</div>
      <div className="text-3xl sm:text-4xl font-bold text-white font-poppins mb-1">
        {metric.prefix || ''}
        {inView ? <CountUp end={metric.value} decimals={metric.value % 1 !== 0 ? 1 : 0} /> : '0'}
        {metric.suffix}
      </div>
      <p className="text-gray-400 text-sm">{metric.label}</p>
    </motion.div>
  );
}

export default function MetricsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="metrics" className="section-padding bg-gradient-to-b from-gray-950 to-emerald-950/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-block text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-4 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
            Platform Metrics
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-poppins mb-4">
            Numbers That <span className="gradient-text">Speak for Themselves</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Real results from businesses using NA AI Systems to transform their sustainable commerce operations.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {metrics.map((metric, i) => (
            <MetricCard key={i} metric={metric} inView={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
