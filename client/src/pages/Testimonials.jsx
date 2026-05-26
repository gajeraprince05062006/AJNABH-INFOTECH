import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const [testimonials, setTestimonials] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching testimonials:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="py-24 px-6 md:px-12 premium-site-bg text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-widest text-accent font-bold px-3 py-1 bg-accent/10 rounded-full"
          >
            Testimonials
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mt-6 mb-6"
          >
            What Our Clients Say
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary text-lg max-w-2xl mx-auto"
          >
            Don't just take our word for it. Read reviews from founders and product leads who have optimized their workflows.
          </motion.p>
        </div>
        {/* Testimonials Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {testimonials.map((test, idx) => (
              <motion.div
                key={test._id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="break-inside-avoid p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-accent/40 transition-colors duration-500 relative group"
              >
                <Quote size={40} className="absolute top-6 right-6 text-white/5 group-hover:text-accent/10 transition-colors" />
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-2xl overflow-hidden border border-white/10">
                    {test.imageUrl && !test.imageUrl.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/) ? (
                      <img src={test.imageUrl} alt={test.clientName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{test.imageUrl || '👤'}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{test.clientName}</h3>
                    <span className="text-[10px] uppercase font-semibold text-accent tracking-wider">{test.company}</span>
                  </div>
                </div>

                <div className="flex gap-1 mb-4 text-accent">
                  {[...Array(test.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                <p className="text-secondary text-sm leading-relaxed italic">"{test.review}"</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
