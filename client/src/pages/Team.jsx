import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Globe, Code, Mail } from 'lucide-react';

const Team = () => {
  const [teamMembers, setTeamMembers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        setTeamMembers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching team:", err);
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
            Our Team
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mt-6 mb-6"
          >
            Meet the Builders
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary text-lg max-w-2xl mx-auto"
          >
            A dedicated group of software architects, artificial intelligence engineers, managers, and designers.
          </motion.p>
        </div>

        {/* Team Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member._id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-accent/40 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Placeholder */}
                  <div className="aspect-square bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-5xl mb-6 relative overflow-hidden group">
                    {member.imageUrl && !member.imageUrl.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/) ? (
                      <img src={member.imageUrl} alt={member.name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <span>{member.imageUrl || '👨‍💼'}</span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider block mb-4">{member.role}</span>
                  <p className="text-secondary text-xs font-medium mb-4">{member.experience}</p>
                  
                  {/* Skills */}
                  <div className="mb-6">
                    <h4 className="text-[10px] uppercase text-secondary/60 tracking-wider font-semibold mb-2">Key Expertise</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.skills?.map((s, sidx) => (
                        <span key={sidx} className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/5 rounded text-secondary">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="border-t border-white/5 pt-4 flex gap-4 text-secondary">
                  {member.socialLinks?.linkedin && (
                    <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      <Briefcase size={18} />
                    </a>
                  )}
                  {member.socialLinks?.twitter && (
                    <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      <Globe size={18} />
                    </a>
                  )}
                  {member.socialLinks?.github && (
                    <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      <Code size={18} />
                    </a>
                  )}
                  {member.socialLinks?.mail && (
                    <a href={`mailto:${member.socialLinks.mail}`} className="hover:text-white transition-colors">
                      <Mail size={18} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
