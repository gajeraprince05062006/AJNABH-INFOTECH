import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Shield, Zap, Sparkles } from 'lucide-react';



const Products = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
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
            Our Products
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mt-6 mb-6"
          >
            Ready-to-Deploy Enterprise Platforms
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary text-lg max-w-2xl mx-auto"
          >
            Pre-built, highly secure software packages designed to plug into your business models and automate workloads immediately.
          </motion.p>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-16">
            {products.map((prod, index) => (
              <motion.div
                key={prod._id || index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-3xl grid md:grid-cols-2 gap-12 items-center"
              >
                {/* Left Column: Details */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-accent px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-full">{prod.badge || "Product"}</span>
                  <h3 className="text-3xl font-bold mt-4 mb-2">{prod.name}</h3>
                  {prod.tagline && <p className="text-sm text-accent/80 font-medium mb-6">{prod.tagline}</p>}
                  <p className="text-secondary text-sm leading-relaxed mb-6">{prod.overview}</p>
                  
                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-xs uppercase text-accent font-semibold tracking-wider mb-3">Core Features</h4>
                    <ul className="space-y-2">
                      {prod.features?.map((feat, fidx) => (
                        <li key={fidx} className="text-xs text-secondary flex items-start gap-2">
                          <Check size={14} className="text-accent mt-0.5 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="text-xs uppercase text-accent font-semibold tracking-wider mb-3">Key Benefits</h4>
                    <ul className="space-y-2">
                      {prod.benefits?.map((bene, bidx) => (
                        <li key={bidx} className="text-xs text-secondary flex items-start gap-2">
                          <Zap size={14} className="text-accent mt-0.5 flex-shrink-0" />
                          <span>{bene}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column: Placeholders for Screenshots / Pricing / Demo */}
                <div className="space-y-6">
                  {/* Screenshot Placeholder */}
                  <div className="aspect-video bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-secondary/40 relative overflow-hidden group">
                    {prod.imageUrl ? (
                      <img src={prod.imageUrl} alt={prod.name} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <>
                        <span className="text-4xl mb-2">📸</span>
                        <span className="text-xs font-semibold uppercase tracking-wider">Dashboard Screenshot</span>
                        <span className="text-[10px] text-secondary/30 mt-1">Live Sandbox Preview</span>
                      </>
                    )}
                  </div>

                  {/* Pricing / Demo Action Block */}
                  <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] uppercase text-secondary/60 font-semibold tracking-wider">Pricing Starting At</span>
                        <p className="text-lg font-bold text-accent">{prod.price}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-accent font-mono font-bold">Standard Licence</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {prod.demoUrl && (
                        <a href={prod.demoUrl.startsWith('http') ? prod.demoUrl : '#'} target="_blank" rel="noopener noreferrer" className="flex-grow py-3 bg-white text-black font-semibold text-xs rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5">
                          {prod.demoUrl.startsWith('http') ? "View Demo" : prod.demoUrl} <ArrowUpRight size={14} />
                        </a>
                      )}
                      {!prod.demoUrl && (
                        <button className="flex-grow py-3 bg-white text-black font-semibold text-xs rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5">
                          Request Sandbox Demo <ArrowUpRight size={14} />
                        </button>
                      )}
                    </div>
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

export default Products;
