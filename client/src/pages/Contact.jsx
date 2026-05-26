import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    budget: '₹50,000 - ₹2,00,000',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = React.useState([]);
  const [settings, setSettings] = React.useState({
    siteName: 'AJNABH INFOTECH',
    contactEmail: 'contact@ajnabh.com',
    contactPhone: '+91 98765 43210',
    address: 'Corporate Headquarters, AJNABH INFOTECH, India'
  });

  React.useEffect(() => {
    fetch('/api/settings/general')
      .then(res => res.json())
      .then(data => {
        if (data && data.value) {
          setSettings(data.value);
        }
      })
      .catch(err => console.error("Error fetching general settings:", err));

    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setServices(data);
          setFormData(prev => ({ ...prev, service: data[0].title }));
        }
      })
      .catch(err => console.error("Error fetching services:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: `[Phone: ${formData.phone} | Required Service: ${formData.service} | Budget: ${formData.budget}] - ${formData.message}`
        })
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          service: services.length > 0 ? services[0].title : '',
          budget: '₹50,000 - ₹2,00,000',
          message: ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const text = `Hi ${settings.siteName || 'AJNABH INFOTECH'}, I am interested in your services.\nName: ${formData.name}\nService Required: ${formData.service}\nBudget: ${formData.budget}\nMessage: ${formData.message}`;
    const phoneCleaned = settings.contactPhone ? settings.contactPhone.replace(/\D/g, '') : '919876543210';
    const url = `https://wa.me/${phoneCleaned}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="py-24 px-6 md:px-12 premium-site-bg text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-widest text-accent font-bold px-3 py-1 bg-accent/10 rounded-full"
          >
            Contact Us
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mt-6 mb-6"
          >
            Let's Start Your Digital Journey
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary text-lg max-w-2xl mx-auto"
          >
            Have a project in mind or want to learn more about our custom AI agents and software systems? Write to us or call.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Details & Map */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
              <h3 className="text-2xl font-bold mb-4">Contact Info</h3>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl">
                  <Phone size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs text-secondary">Call Us</p>
                  <p className="font-semibold text-sm">{settings.contactPhone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl">
                  <Mail size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs text-secondary">Email Us</p>
                  <p className="font-semibold text-sm">{settings.contactEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl">
                  <MapPin size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs text-secondary">Our Office</p>
                  <p className="font-semibold text-sm">{settings.address}</p>
                </div>
              </div>
            </div>

            {/* Google Map Mockup */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 h-64 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center p-6 text-center">
                <MapPin size={36} className="text-accent mb-3 animate-bounce" />
                <h4 className="font-bold mb-1">Corporate Office Location Map</h4>
                <p className="text-xs text-secondary max-w-xs">Map Loading Mockup - {settings.siteName || 'AJNABH INFOTECH'} HQ, India</p>
                <div className="mt-4 text-[10px] text-accent border border-accent/20 px-3 py-1 rounded bg-accent/10 uppercase tracking-widest font-bold">Interactive Map Integrated</div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex justify-around">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-white transition-colors text-sm font-semibold">LinkedIn</a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-white transition-colors text-sm font-semibold">Twitter</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-white transition-colors text-sm font-semibold">YouTube</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-white transition-colors text-sm font-semibold">Facebook</a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white/5 border border-white/10 rounded-3xl"
          >
            <h3 className="text-2xl font-bold mb-6">Send an Inquiry</h3>
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
                <h4 className="text-xl font-bold">Thank You!</h4>
                <p className="text-secondary text-sm">Your enquiry has been submitted. Our team will contact you shortly.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 px-6 py-2 border border-white/20 rounded-xl hover:bg-white/10 text-xs font-semibold">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-secondary mb-1 block">Name</label>
                  <input required type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl focus:border-accent outline-none text-sm" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-secondary mb-1 block">Company</label>
                    <input type="text" placeholder="Acme Corp" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl focus:border-accent outline-none text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-secondary mb-1 block">Phone</label>
                    <input required type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl focus:border-accent outline-none text-sm" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-secondary mb-1 block">Email</label>
                  <input required type="email" placeholder="john@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl focus:border-accent outline-none text-sm" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-secondary mb-1 block">Required Service</label>
                    <select value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl focus:border-accent outline-none text-sm [&>option]:bg-black">
                      {services.map(s => (
                        <option key={s._id} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-secondary mb-1 block">Est. Budget</label>
                    <select value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl focus:border-accent outline-none text-sm [&>option]:bg-black">
                      <option>&lt; ₹50,000</option>
                      <option>₹50,000 - ₹2,00,000</option>
                      <option>₹2,00,000 - ₹5,00,000</option>
                      <option>₹5,00,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-secondary mb-1 block">Message</label>
                  <textarea required placeholder="Outline your requirements..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-2 bg-black border border-white/10 rounded-xl focus:border-accent outline-none text-sm h-28 resize-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer text-sm">
                    <Send size={16} /> {loading ? 'Sending...' : 'Submit'}
                  </button>
                  <button type="button" onClick={handleWhatsApp} className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm">
                    <MessageSquare size={16} /> WhatsApp
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
