import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const solutions = [
  {
    step: '01',
    icon: '📤',
    title: 'Upload Your Products',
    description: 'Submit product titles, descriptions, and images through our intuitive dashboard or REST API.',
    color: 'emerald',
  },
  {
    step: '02',
    icon: '🤖',
    title: 'AI Analyzes & Categorizes',
    description: 'GPT-4o-mini processes your data and generates categories, SEO tags, eco scores, and sustainability filters.',
    color: 'blue',
  },
  {
    step: '03',
    icon: '📊',
    title: 'Generate Proposals & Reports',
    description: 'Create B2B proposals with ROI estimates and ESG impact reports for investors and stakeholders.',
    color: 'purple',
  },
  {
    step: '04',
    icon: '🚀',
    title: 'Scale Your Business',
    description: 'Export results, integrate via API, and use AI insights to close deals and grow sustainably.',
    color: 'orange',
  },
];

const colorMap = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', step: 'text-emerald-500' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', step: 'text-blue-500' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', step: 'text-purple-500' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', step: 'text-orange-500' },
};

export default function SolutionsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="solutions" className="section-padding bg-gradient-to-b from-emerald-950/10 to-gray-950 relative">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-block text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-4 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-poppins mb-4">
            From Upload to <span className="gradient-text">AI-Powered Insights</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get started in minutes. Our streamlined workflow takes you from raw product data to actionable AI insights.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {solutions.map((s, i) => {
            const c = colorMap[s.color];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15 }}
                className={`relative ${c.bg} border ${c.border} rounded-2xl p-6 backdrop-blur-sm`}
              >
                {/* Connector line */}
                {i < solutions.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-3 w-6 h-0.5 bg-gradient-to-r from-white/20 to-transparent z-10" />
                )}
                <div className={`text-5xl font-black font-poppins ${c.step} opacity-20 mb-2`}>{s.step}</div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="text-white font-bold font-poppins mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/60 to-emerald-700/40 border border-emerald-500/30 p-8 sm:p-12 text-center"
        >
          <div className="absolute inset-0 bg-gradient-radial from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-poppins mb-3 relative z-10">
            Start Transforming Your Commerce Today
          </h3>
          <p className="text-emerald-200/70 mb-6 max-w-xl mx-auto relative z-10">
            Join hundreds of sustainable businesses already using NA AI Systems to automate, analyze, and grow.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 btn-primary text-base px-8 py-4 relative z-10"
          >
            Get Started Free <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
