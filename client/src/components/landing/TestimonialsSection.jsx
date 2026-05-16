import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Head of Sustainability',
    company: 'GreenTech Solutions',
    avatar: 'SM',
    rating: 5,
    text: 'NA AI Systems transformed how we categorize our 10,000+ product catalog. What used to take weeks now takes hours. The eco scoring feature alone has helped us win 3 major enterprise contracts.',
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    name: 'James Okonkwo',
    role: 'CEO',
    company: 'EcoCommerce Africa',
    avatar: 'JO',
    rating: 5,
    text: 'The B2B proposal generator is a game-changer. We close deals 60% faster now. The AI understands our industry and generates proposals that actually resonate with our clients.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    name: 'Priya Sharma',
    role: 'VP of Operations',
    company: 'SustainHub India',
    avatar: 'PS',
    rating: 5,
    text: 'The ESG impact reporting feature helped us secure $2M in green financing. Investors love the detailed carbon reduction metrics and sustainability summaries the AI generates.',
    color: 'from-purple-500 to-purple-700',
  },
  {
    name: 'Carlos Rivera',
    role: 'CTO',
    company: 'Verde Commerce',
    avatar: 'CR',
    rating: 5,
    text: 'Integration was seamless. The API is well-documented, the dashboard is intuitive, and the AI accuracy is impressive. Our team adopted it within a day.',
    color: 'from-orange-500 to-orange-700',
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="testimonials" className="section-padding bg-gray-950 relative">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-block text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-4 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
            Customer Stories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-poppins mb-4">
            Trusted by <span className="gradient-text">Industry Leaders</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            See how sustainable commerce businesses are scaling with NA AI Systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="card hover:border-emerald-500/30 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm font-poppins flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm font-poppins">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
