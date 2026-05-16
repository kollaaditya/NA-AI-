import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

const faqs = [
  {
    q: 'How does the AI product categorization work?',
    a: 'Our AI analyzes your product title, description, and images using GPT-4o-mini to generate accurate categories, sub-categories, SEO tags, sustainability filters, and an eco score. Results are returned in structured JSON format and saved to your account.',
  },
  {
    q: 'What makes the B2B proposal generator unique?',
    a: 'The AI understands your industry, budget, and company context to generate tailored proposals with product recommendations, budget allocation breakdowns, ROI estimates, and sustainability summaries — all exportable as PDF.',
  },
  {
    q: 'How is my data secured?',
    a: 'We use JWT authentication, bcrypt password hashing, Helmet security headers, rate limiting, and Cloudflare SSL. All data is stored in MongoDB Atlas with encryption at rest. We are GDPR compliant and follow AWS security best practices.',
  },
  {
    q: 'Can I integrate NA AI Systems with my existing platform?',
    a: 'Yes. Our RESTful API is fully documented and supports standard JSON responses. You can integrate with any e-commerce platform, ERP system, or custom application using our API endpoints.',
  },
  {
    q: 'What is the ESG impact reporting feature?',
    a: 'The AI analyzes your business activity and generates comprehensive ESG reports including carbon reduction metrics, plastic savings, eco impact scores, and sustainability summaries — perfect for investor reporting and green financing applications.',
  },
  {
    q: 'Is there a free trial available?',
    a: 'Yes! You can register for free and start using the platform immediately. The free tier includes product analysis, proposal generation, and impact reporting with generous usage limits.',
  },
  {
    q: 'What cloud infrastructure does NA AI Systems use?',
    a: 'Our platform runs on AWS EC2 and Elastic Beanstalk for the backend, AWS S3 and CloudFront for the frontend, MongoDB Atlas for the database, and Cloudflare for CDN, DNS, and SSL — ensuring 99.9% uptime and global performance.',
  },
];

function FAQItem({ faq, index, inView }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07 }}
      className="border border-white/10 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-colors"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-white/5 hover:bg-white/8 transition-colors"
      >
        <span className="text-white font-medium text-sm sm:text-base pr-4">{faq.q}</span>
        <span className="text-emerald-400 flex-shrink-0">
          {open ? <FiMinus size={18} /> : <FiPlus size={18} />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-5 pb-5 pt-3 text-gray-400 text-sm leading-relaxed bg-white/2">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="faq" className="section-padding bg-gray-950 relative">
      <div className="max-w-3xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="inline-block text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-4 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-poppins mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-gray-400">Everything you need to know about NA AI Systems.</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
