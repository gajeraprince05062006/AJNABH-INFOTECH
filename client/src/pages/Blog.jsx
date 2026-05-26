import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock } from 'lucide-react';

const Blog = () => {
  const [filter, setFilter] = useState("All");
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  React.useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        setBlogPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...new Set(blogPosts.map(p => p.category))];

  const filteredPosts = filter === "All" 
    ? blogPosts 
    : blogPosts.filter(p => p.category === filter);

  return (
    <div className="py-24 px-6 md:px-12 premium-site-bg text-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-widest text-accent font-bold px-3 py-1 bg-accent/10 rounded-full"
          >
            Insights &amp; Articles
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mt-6 mb-6"
          >
            AJNABH Technical Blog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary text-lg max-w-2xl mx-auto"
          >
            Read our latest research papers, deployment guides, and case studies detailing custom ERP structures and automation models.
          </motion.p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer ${filter === cat ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 hover:border-white/20 text-secondary'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Post List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, idx) => (
                <motion.article
                  layout
                  key={post._id || post.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedBlog(post)}
                  className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-accent/40 transition-all duration-500 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-accent px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-full">{post.category}</span>
                      <span className="text-[10px] text-secondary">{post.date || new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>

                    {post.imageUrl && !post.imageUrl.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/) ? (
                      <div className="w-full h-32 mb-4 rounded-xl overflow-hidden bg-neutral-900 border border-white/5">
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover opacity-80" />
                      </div>
                    ) : (
                      <div className="text-4xl mb-4">{post.imageUrl || post.emoji || '📰'}</div>
                    )}
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors duration-300">{post.title}</h3>
                    <p className="text-secondary text-xs leading-relaxed mb-6 line-clamp-4">{post.content || post.desc}</p>
                  </div>

                  <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[10px] text-secondary/60">
                    <span className="font-semibold">By {post.author}</span>
                    <span>{post.readTime || '5 min read'}</span>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Blog Details Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
              className="relative bg-zinc-900/95 border border-white/10 w-full max-w-3xl max-h-[85vh] rounded-3xl overflow-y-auto overflow-x-hidden shadow-2xl flex flex-col font-sans text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors cursor-pointer z-25 bg-black/50 p-2.5 rounded-full border border-white/10 hover:bg-black/80"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Banner Visual / Image */}
              {selectedBlog.imageUrl && !selectedBlog.imageUrl.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/) ? (
                <div className="w-full h-56 md:h-72 overflow-hidden bg-neutral-950 border-b border-white/5 relative">
                  <img
                    src={selectedBlog.imageUrl}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-80" />
                </div>
              ) : (
                <div className="w-full h-44 bg-zinc-950/80 border-b border-white/5 flex items-center justify-center text-7xl relative overflow-hidden flex-shrink-0">
                  <div className="absolute w-64 h-64 bg-accent/10 rounded-full blur-3xl -top-10 -left-10" />
                  <div className="absolute w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -bottom-10 -right-10" />
                  <span className="relative z-10">{selectedBlog.imageUrl || selectedBlog.emoji || '📰'}</span>
                </div>
              )}

              {/* Modal Content */}
              <div className="p-8 md:p-10 space-y-6">
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                  <span className="uppercase font-extrabold tracking-wider text-accent px-3 py-1 bg-accent/10 border border-accent/25 rounded-full">
                    {selectedBlog.category || 'Technology'}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} />
                    {selectedBlog.date || (selectedBlog.createdAt ? new Date(selectedBlog.createdAt).toLocaleDateString() : 'Latest')}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} />
                    {selectedBlog.readTime || '5 min read'}
                  </span>
                </div>

                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {selectedBlog.title}
                </h2>

                <div className="border-t border-white/10 pt-6">
                  <p className="text-zinc-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedBlog.content || selectedBlog.desc}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-6 flex items-center gap-3 text-xs text-zinc-400">
                  <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-bold">
                    {selectedBlog.author ? selectedBlog.author.charAt(0) : 'A'}
                  </div>
                  <div>
                    <p className="font-bold text-white">Written by {selectedBlog.author || 'AJNABH Team'}</p>
                    <p className="text-[10px] text-zinc-500">Technical Writer @ AJNABH INFOTECH</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;
