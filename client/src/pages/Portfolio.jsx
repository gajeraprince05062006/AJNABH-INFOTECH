import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });
  }, []);

  const filteredProjects = projects;



  return (
    <div className="py-24 px-6 md:px-12 premium-site-bg text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-widest text-accent font-bold px-3 py-1 bg-accent/10 rounded-full"
          >
            Projects
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mt-6 mb-6"
          >
            Engineering Proof
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary text-lg max-w-2xl mx-auto"
          >
            Explore our showcase of custom web products, mobile apps, enterprise ERP architectures, and artificial intelligence solutions.
          </motion.p>
        </div>


        {/* Project Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  layout
                  key={project._id || project.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-accent/40 transition-colors duration-500 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video bg-white/5 flex items-center justify-center text-6xl border-b border-white/5 relative overflow-hidden group">
                      {project.imageUrl && !project.imageUrl.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/) ? (
                        <img src={project.imageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <span className="z-10">{project.imageUrl || '📸'}</span>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="text-[10px] uppercase tracking-wider text-accent font-bold block mb-2">Project</span>
                      <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                      <p className="text-secondary text-xs leading-relaxed mb-6">{project.description}</p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-white/5 mt-4">
                    <div className="flex flex-wrap gap-1.5 pt-4">
                      {project.techStack?.map((t, tidx) => (
                        <span key={tidx} className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/5 rounded text-secondary font-mono">{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
