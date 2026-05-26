import React from 'react';
import { motion } from 'framer-motion';
import { Code, Smartphone, Cpu, Database, Palette, Cloud, CheckCircle } from 'lucide-react';

const iconMap = {
  "Code": <Code size={32} className="text-accent" />,
  "Smartphone": <Smartphone size={32} className="text-accent" />,
  "Cpu": <Cpu size={32} className="text-accent" />,
  "Database": <Database size={32} className="text-accent" />,
  "Palette": <Palette size={32} className="text-accent" />,
  "Cloud": <Cloud size={32} className="text-accent" />
};

const Services = () => {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching services:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="py-24 px-6 md:px-12 premium-site-bg text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-widest text-accent font-bold px-3 py-1 bg-accent/10 rounded-full"
          >
            Our Services
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mt-6 mb-6"
          >
            AI Solutions &amp; Software Development
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary text-lg max-w-2xl mx-auto"
          >
            We provide full-cycle digital transformation services, empowering businesses with robust applications and intelligent automation.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-accent/40 transition-colors duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl w-fit mb-6">
                    {/* Render icon based on mapping, or fallback to Code */}
                    {iconMap[service.title.split(' ')[0]] || <Code size={32} className="text-accent" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-secondary text-sm mb-6 leading-relaxed">{service.description || service.desc}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-xs uppercase tracking-wider text-accent font-semibold mb-3">Key Features</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.features?.map((feat, fidx) => (
                        <span key={fidx} className="text-xs text-secondary flex items-center gap-1">
                          <CheckCircle size={12} className="text-accent flex-shrink-0" /> {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xs uppercase tracking-wider text-accent font-semibold mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.tech?.map((t, tidx) => (
                        <span key={tidx} className="text-[10px] px-2 py-1 bg-white/5 border border-white/5 rounded text-secondary font-mono">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mt-4">
                  <h4 className="text-xs uppercase tracking-wider text-secondary font-semibold mb-2">Development Process</h4>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 text-[10px] text-secondary/60">
                    {service.process?.map((step, sidx) => (
                      <React.Fragment key={sidx}>
                        <span className="text-center font-medium max-w-[120px] sm:max-w-[70px] sm:truncate">{step}</span>
                        {sidx < service.process.length - 1 && (
                          <span className="transform rotate-90 sm:rotate-0 my-1 sm:my-0">&rarr;</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
