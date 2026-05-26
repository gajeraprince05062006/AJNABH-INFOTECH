import { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { Lock, X, AlertCircle } from 'lucide-react';
import HomeExtra from './pages/HomeExtra';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Products from './pages/Products';
import Team from './pages/Team';
import Blog from './pages/Blog';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import { AnimatePresence, motion } from 'framer-motion';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Projects', path: '/portfolio' },
  { label: 'Products', path: '/products' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

function CenterRevealNav({ onBrandClick }) {
  const [isVisible, setIsVisible] = useState(true);
  const hideTimer = useRef(null);
  const [clickCount, setClickCount] = useState(0);
  const lastClickTime = useRef(0);

  const handleBrandClick = (e) => {
    const now = Date.now();
    if (now - lastClickTime.current > 3000) {
      setClickCount(1);
    } else {
      const nextCount = clickCount + 1;
      setClickCount(nextCount);
      if (nextCount === 8) {
        setClickCount(0);
        onBrandClick();
      }
    }
    lastClickTime.current = now;
  };

  useEffect(() => {
    hideTimer.current = window.setTimeout(() => setIsVisible(false), 1800);

    return () => {
      if (hideTimer.current) {
        window.clearTimeout(hideTimer.current);
      }
    };
  }, []);

  const showNav = () => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
    }
    setIsVisible(true);
  };

  const scheduleHideNav = () => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
    }
    hideTimer.current = window.setTimeout(() => setIsVisible(false), 800);
  };

  return (
    <div
      className={isVisible ? 'center-nav-zone is-visible' : 'center-nav-zone'}
      aria-label="Primary navigation area"
      onMouseEnter={showNav}
      onMouseLeave={scheduleHideNav}
      onFocus={showNav}
    >
      <nav className="center-reveal-nav" aria-label="Primary navigation">
        <NavLink to="/" end className="center-reveal-nav__brand" aria-label="AJNABH INFOTECH home" onClick={handleBrandClick}>
          <img src="/logo.png" alt="AJNABH INFOTECH" className="center-reveal-nav__logo" />
          <span>AJNABH INFOTECH</span>
        </NavLink>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => (
              isActive ? 'center-reveal-nav__link is-active' : 'center-reveal-nav__link'
            )}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function AmbientBackground() {
  return (
    <div className="site-ambient" aria-hidden="true">
      <div className="site-ambient__grid" />
      <div className="site-ambient__beam site-ambient__beam--one" />
      <div className="site-ambient__beam site-ambient__beam--two" />
      <div className="site-ambient__particle-field" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -12, filter: 'blur(10px)' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomeExtra />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/products" element={<Products />} />
          <Route path="/team" element={<Team />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function Footer() {
  const [settings, setSettings] = useState({
    siteName: 'AJNABH INFOTECH',
    contactEmail: 'contact@ajnabh.com',
    contactPhone: '+91 98765 43210',
    address: 'India',
    footerDescription: 'Transforming ideas into intelligent digital solutions. We build modern software, AI systems, and enterprise platforms.',
    footerTagline: 'Innovation • Technology • Growth'
  });

  useEffect(() => {
    fetch('/api/settings/general')
      .then(res => res.json())
      .then(data => {
        if (data && data.value) {
          setSettings({
            siteName: data.value.siteName || 'AJNABH INFOTECH',
            contactEmail: data.value.contactEmail || 'contact@ajnabh.com',
            contactPhone: data.value.contactPhone || '+91 98765 43210',
            address: data.value.address || 'India',
            footerDescription: data.value.footerDescription || 'Transforming ideas into intelligent digital solutions. We build modern software, AI systems, and enterprise platforms.',
            footerTagline: data.value.footerTagline || 'Innovation • Technology • Growth'
          });
        }
      })
      .catch(err => console.error('Failed to load footer settings:', err));
  }, []);

  const navigate = (path) => {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Projects', path: '/portfolio' },
    { label: 'Products', path: '/products' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="site-footer relative z-10">
      <div className="site-footer__gradient-border" />
      <div className="site-footer__container">
        {/* Brand Column */}
        <div className="site-footer__brand">
          <div className="site-footer__brand-logo">
            <img src="/logo.png" alt={settings.siteName} className="site-footer__logo-img" />
            <span className="site-footer__brand-name">{settings.siteName}</span>
          </div>
          <p className="site-footer__brand-desc">
            {settings.footerDescription}
          </p>
        </div>

        {/* Quick Links */}
        <div className="site-footer__links-group">
          <h4 className="site-footer__heading">Quick Links</h4>
          <ul className="site-footer__link-list">
            {quickLinks.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className="site-footer__link"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="site-footer__links-group">
          <h4 className="site-footer__heading">Get in Touch</h4>
          <ul className="site-footer__link-list">
            <li className="site-footer__contact-item">{settings.contactEmail}</li>
            <li className="site-footer__contact-item">{settings.contactPhone}</li>
            <li className="site-footer__contact-item">{settings.address}</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="site-footer__bottom">
        <p className="site-footer__copyright">
          © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
        </p>
        <p className="site-footer__tagline">
          {settings.footerTagline}
        </p>
      </div>
    </footer>
  );
}

function LoginModal({ onClose, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('adminToken', data.token);
        sessionStorage.setItem('adminUser', JSON.stringify(data.user));
        onSuccess();
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('Connection to server failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-zinc-900/95 border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl relative space-y-6 mx-4"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-accent/20 border border-accent/30 rounded-2xl flex items-center justify-center text-accent">
            <Lock size={22} />
          </div>
          <h3 className="font-extrabold text-xl tracking-tight">Admin Gate</h3>
          <p className="text-xs text-zinc-400 font-sans">Enter credentials to unlock control panel</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2 font-sans">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-left">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">Username</label>
            <input 
              type="text" 
              required
              value={username} 
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs focus:border-accent focus:outline-none transition-colors text-white"
              placeholder="Enter username"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">Password</label>
            <input 
              type="password" 
              required
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs focus:border-accent focus:outline-none transition-colors text-white"
              placeholder="Enter password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-semibold rounded-xl text-xs cursor-pointer transition-colors mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : 'Unlock Admin'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    !!sessionStorage.getItem('adminToken')
  );
  const [showLoginModal, setShowLoginModal] = useState(false);

  // If we are in the admin view
  if (window.location.pathname.startsWith('/admin')) {
    if (isAdminLoggedIn) {
      return (
        <AdminDashboard 
          onLogout={() => {
            sessionStorage.removeItem('adminToken');
            sessionStorage.removeItem('adminUser');
            setIsAdminLoggedIn(false);
            window.location.href = '/';
          }} 
        />
      );
    } else {
      // Show login modal directly on /admin route
      return (
        <div className="flex flex-col min-h-screen bg-background text-white relative items-center justify-center">
          <AmbientBackground />
          <LoginModal 
            onClose={() => {
              window.location.href = '/';
            }} 
            onSuccess={() => {
              setIsAdminLoggedIn(true);
            }}
          />
        </div>
      );
    }
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-white relative">
        <AmbientBackground />
        <CenterRevealNav onBrandClick={() => setShowLoginModal(true)} />
        <main className="flex-grow pt-28">
          <AnimatedRoutes />
        </main>
        <Footer />
        <AnimatePresence>
          {showLoginModal && (
            <LoginModal 
              onClose={() => setShowLoginModal(false)} 
              onSuccess={() => {
                setIsAdminLoggedIn(true);
                setShowLoginModal(false);
                window.location.href = '/admin';
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
