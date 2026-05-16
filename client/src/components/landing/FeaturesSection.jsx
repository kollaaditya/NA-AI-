import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    icon: '🏷️',
    title: 'AI Product Categorizer',
    description: 'Automatically classify products with AI-generated categories, SEO tags, sustainability filters, and eco scores in seconds.',
    tags: ['Auto-categorize', 'SEO Tags', 'Eco Score'],
    color: 'from-emerald-500/20 to-emerald-600/5',
    border: 'border-emerald-500/30',
  },
  {
    icon: '📋',
    title: 'B2B Proposal Generator',
    description: 'Generate professional B2B proposals with budget allocation, ROI estimates, and sustainability summaries powered by GPT-4.',
    tags: ['Budget Planning', 'ROI Analysis', 'PDF Export'],
    color: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/30',
  },
  {
    icon: '🌱',
    title: 'ESG Impact Reporting',
    description: 'Measure and report your environmental impact with carbon reduction metrics, plastic savings, and comprehensive ESG summaries.',
    tags: ['Carbon Tracking', 'ESG Reports', 'Sustainability'],
    color: 'from-green-500/20 to-green-600/5',
    border: 'border-green-500/30',
  },
  {
    icon: '💬',
    title: 'AI WhatsApp Support Bot',
    description: 'Automate customer support with an intelligent chatbot that handles FAQs, refunds, and order tracking 24/7.',
    tags: ['24/7 Support', 'FAQ Automation', 'Order Tracking'],
    color: 'from-purple-500/20 to-purple-600/5',
    border: 'border-purple-500/30',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description: 'Monitor all AI operations, user activity, and business metrics from a single, powerful admin dashboard.',
    tags: ['Real-time Data', 'User Management', 'AI Logs'],
    color: 'from-orange-500/20 to-orange-600/5',
    border: 'border-orange-500/30',
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    description: 'Bank-grade security with JWT authentication, rate limiting, Cloudflare SSL, and AWS infrastructure protection.',
    tags: ['JWT Auth', 'Rate Limiting', 'Cloudflare SSL'],
    color: 'from-red-500/20 to-red-600/5',
    border: 'border-red-500/30',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="section-padding bg-gray-950 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-4 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
            Platform Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-poppins mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Scale with AI</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A complete AI-powered suite designed for sustainable commerce businesses ready to grow.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`bg-gradient-to-br ${feature.color} border ${feature.border} rounded-2xl p-6 backdrop-blur-sm cursor-default group`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white font-poppins mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{feature.description}</p>
              <div className="flex flex-wrap gap-2">
                {feature.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
