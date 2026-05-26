import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Eye, Heart, Compass, Star, Briefcase, Globe, Code, Mail } from 'lucide-react';

const values = [
  { icon: <Compass size={24} className="text-accent" />, title: "Innovation", desc: "Pushing technical boundaries to develop creative, forward-thinking solutions." },
  { icon: <Star size={24} className="text-accent" />, title: "Quality", desc: "Writing clean code and testing meticulously to deliver robust software." },
  { icon: <Shield size={24} className="text-accent" />, title: "Trust", desc: "Building long-term, transparent partnerships with clients and employees." },
  { icon: <Target size={24} className="text-accent" />, title: "Growth", desc: "Continuously improving our skillsets and business methods." },
  { icon: <Heart size={24} className="text-accent" />, title: "Support", desc: "Standing by our products and clients with dedicated post-launch support." }
];

const About = () => {
  const [teamMembers, setTeamMembers] = React.useState([]);
  const [loadingTeam, setLoadingTeam] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        setTeamMembers(data);
        setLoadingTeam(false);
      })
      .catch(err => {
        console.error("Error fetching team:", err);
        setLoadingTeam(false);
      });
  }, []);

  return (
    <div className="py-24 px-6 md:px-12 premium-site-bg text-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-widest text-accent font-bold px-3 py-1 bg-accent/10 rounded-full"
          >
            About Us
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mt-6 mb-6"
          >
            Innovating the Digital Future
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary text-lg max-w-2xl mx-auto"
          >
            We align design, tech, and engineering to build products that optimize operations and scale effortlessly.
          </motion.p>
        </div>

        {/* Intro */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold">Who We Are</h2>
            <p className="text-secondary leading-relaxed">
              AJNABH INFOTECH is a premier technology agency specializing in software solutions, AI systems, responsive websites, applications, and custom enterprise tools.
            </p>
            <p className="text-secondary leading-relaxed">
              Our engineering team focuses on creating secure, reliable, and scalable architectures that remove manual bottlenecks and empower companies to operate faster and smarter.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white/5 border border-white/10 rounded-3xl"
          >
            <h3 className="text-xl font-bold mb-4">Company Story</h3>
            <p className="text-secondary text-sm leading-relaxed mb-4">
              We started with a simple belief: automation shouldn't be overly complex. Over the years, we have grown from a small group of coders into a comprehensive agency delivering digital transformation across various sectors.
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              Whether building school ERPs, voice agents, or robust e-commerce solutions, we maintain a client-first methodology focused on clean metrics.
            </p>
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex gap-6 items-start">
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl">
              <Target size={28} className="text-accent" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
              <p className="text-secondary text-sm leading-relaxed">Deliver innovative, scalable, and secure technology solutions that drive actual efficiency and solve critical business hurdles.</p>
            </div>
          </div>
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex gap-6 items-start">
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl">
              <Eye size={28} className="text-accent" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
              <p className="text-secondary text-sm leading-relaxed">Become a trusted global technology partner known for engineering excellence, reliable automation, and transparent developer practices.</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {values.map((val, idx) => (
              <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <div className="mb-4">{val.icon}</div>
                <h4 className="font-bold text-lg mb-2">{val.title}</h4>
                <p className="text-secondary text-xs leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4">Our Team Members</h3>
          <p className="text-secondary text-sm max-w-lg mx-auto mb-10">
            Meet the people building secure, scalable, and thoughtful digital products for our clients.
          </p>

          {loadingTeam ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : teamMembers.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {teamMembers.map((member, idx) => (
                <motion.div
                  key={member._id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-accent/40 transition-all duration-500 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-square bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-4xl mb-6 relative overflow-hidden">
                      {member.imageUrl && !member.imageUrl.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/) ? (
                        <img src={member.imageUrl} alt={member.name} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <span className="text-accent font-bold">
                          {(member.name || 'TM').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <h4 className="text-2xl font-bold mb-1">{member.name}</h4>
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider block mb-4">{member.role}</span>
                    {member.experience && <p className="text-secondary text-xs font-medium mb-4">{member.experience}</p>}

                    {member.skills?.length > 0 && (
                      <div className="mb-6">
                        <h5 className="text-[10px] uppercase text-secondary/60 tracking-wider font-semibold mb-2">Key Expertise</h5>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.map((skill, skillIdx) => (
                            <span key={skillIdx} className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/5 rounded text-secondary">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

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
          ) : (
            <p className="text-secondary text-sm py-10">No team members available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
