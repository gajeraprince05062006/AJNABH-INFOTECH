import React from 'react';
import { motion, useInView, useMotionValue, useTransform, animate, useSpring, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, Activity, Users, Award, Clock, Bot, Layers, Globe, Smartphone, Rocket, Cpu, Headphones, X, Calendar } from 'lucide-react';


const heroWords = [
  { text: 'Transforming', isAccent: false },
  { text: 'Ideas', isAccent: false },
  { text: 'Into', isAccent: false },
  { text: 'Intelligent', isAccent: false },
  { text: 'Digital Solutions', isAccent: true }
];

const iconMap = {
  Rocket: Rocket,
  Users: Users,
  Cpu: Cpu,
  Headphones: Headphones,
  Award: Award,
  Activity: Activity,
  Clock: Clock
};



const whyChooseUs = [
  "Innovative Technology Solutions",
  "Custom Development Approach",
  "Fast & Efficient Delivery",
  "Scalable Architecture",
  "Long-Term Technical Support"
];

const aboutHighlights = [
  "Custom Software Solutions",
  "Modern Technologies",
  "Business Automation",
  "AI Integration",
  "Scalable Systems",
  "Dedicated Support"
];

const sectionReveal = {
  hidden: { opacity: 0, y: 34, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerReveal = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 }
  }
};

const itemReveal = {
  hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] }
  }
};

function CountUpNumber({ value }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const numericValue = Number.parseInt(value, 10);
  const suffix = value.replace(String(numericValue), '');
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  React.useEffect(() => {
    if (!inView || Number.isNaN(numericValue)) return undefined;

    const controls = animate(count, numericValue, {
      duration: 1,
      ease: 'easeOut'
    });

    return () => controls.stop();
  }, [count, inView, numericValue]);

  if (Number.isNaN(numericValue)) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

const HomeExtra = () => {
  const heroRef = React.useRef(null);
  const heroVisualRef = React.useRef(null);
  const [portfolioPreview, setPortfolioPreview] = React.useState([]);
  const [testimonials, setTestimonials] = React.useState([]);
  const [servicesPreview, setServicesPreview] = React.useState([]);
  const [blogPreview, setBlogPreview] = React.useState([]);
  const [heroStats, setHeroStats] = React.useState([
    { id: 'projects', iconName: 'Rocket', value: '50+', label: 'Projects Completed' },
    { id: 'clients', iconName: 'Users', value: '20+', label: 'Happy Clients' },
    { id: 'products', iconName: 'Cpu', value: '5+', label: 'AI Products' },
    { id: 'support', iconName: 'Headphones', value: '24/7', label: 'Support Available' }
  ]);

  React.useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setPortfolioPreview(data.slice(0, 4)))
      .catch(console.error);

    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => setTestimonials(data.slice(0, 3)))
      .catch(console.error);

    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServicesPreview(data.slice(0, 6)))
      .catch(console.error);

    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => setBlogPreview(data.slice(0, 3)))
      .catch(console.error);

    fetch('/api/settings/stats')
      .then(res => res.json())
      .then(data => {
        if (data && data.value) {
          setHeroStats(data.value);
        }
      })
      .catch(console.error);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Parallax Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 120 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const cardLT_X = useTransform(mouseXSpring, [-0.5, 0.5], [-20, 20]);
  const cardLT_Y = useTransform(mouseYSpring, [-0.5, 0.5], [-20, 20]);

  const cardLB_X = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]);
  const cardLB_Y = useTransform(mouseYSpring, [-0.5, 0.5], [12, -12]);

  const cardRT_X = useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]);
  const cardRT_Y = useTransform(mouseYSpring, [-0.5, 0.5], [-15, 15]);

  const cardRB_X = useTransform(mouseXSpring, [-0.5, 0.5], [15, -15]);
  const cardRB_Y = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15]);

  const handleHeroMouseMove = (event) => {
    const hero = heroRef.current;
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);

    hero.style.setProperty('--hero-x', (x * 2).toFixed(3));
    hero.style.setProperty('--hero-y', (y * 2).toFixed(3));
    heroVisualRef.current?.style.setProperty('--hero-x', (x * 2).toFixed(3));
    heroVisualRef.current?.style.setProperty('--hero-y', (y * 2).toFixed(3));
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    heroVisualRef.current?.style.setProperty('--hero-x', '0');
    heroVisualRef.current?.style.setProperty('--hero-y', '0');
  };

  return (
    <div className="premium-site-bg text-white space-y-32 pb-24 font-sans premium-motion-page overflow-x-clip">
      {/* 1. Hero Container Section */}
      <div className="relative w-full pt-4 pb-20 md:pt-6 md:pb-28 overflow-visible">
        {/* Hero-only background: animated AJNABH logo, orbit rings, and low-opacity particles */}
        <div ref={heroVisualRef} className="hero-logo-scene absolute inset-x-0 top-0 h-[580px] pointer-events-none z-0" aria-hidden="true">
          <div className="hero-logo-particles">
            <span className="hero-particle hero-particle--one" />
            <span className="hero-particle hero-particle--two" />
            <span className="hero-particle hero-particle--three" />
            <span className="hero-particle hero-particle--four" />
            <span className="hero-neural-line hero-neural-line--one" />
            <span className="hero-neural-line hero-neural-line--two" />
            <span className="hero-neural-line hero-neural-line--three" />
          </div>
          <div className="hero-logo-stage">
            <div className="hero-logo-orbit hero-logo-orbit--outer" />
            <div className="hero-logo-orbit hero-logo-orbit--middle" />
            <div className="hero-logo-orbit hero-logo-orbit--inner" />
            <img src="/logo.png" alt="" className="hero-logo-object" />
          </div>
        </div>

        {/* Main Content & Side Columns Container (Desktop: Row, Mobile: Column) */}
        <div className="max-w-[1360px] mx-auto px-6 relative z-10 flex xl:flex-row flex-col items-center justify-between gap-8 min-h-[640px]">

          {/* Left Column (Floating Cards) - hidden on mobile/tablet */}
          <div className="hidden xl:flex flex-col justify-between h-[460px] w-64 pointer-events-none select-none">
            {/* AI Solutions */}
            <motion.div
              style={{ x: cardLT_X, y: cardLT_Y }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="pointer-events-auto w-64 hero-glass-card p-6 rounded-[20px] border border-accent/15 bg-zinc-950/40 backdrop-blur-xl shadow-xl flex flex-col items-start text-left group"
            >
              <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-4 shadow-[0_0_10px_rgba(0,210,255,0.1)]">
                <Bot size={20} />
              </div>
              <h3 className="font-extrabold text-sm text-white mb-1.5">AI Solutions</h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed mb-3 font-sans">Intelligent systems for smarter business decisions.</p>
              <span className="text-accent text-sm font-bold group-hover:translate-x-2 transition-transform duration-300 select-none">→</span>
            </motion.div>

            {/* ERP Systems */}
            <motion.div
              style={{ x: cardLB_X, y: cardLB_Y }}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.8 }}
              className="pointer-events-auto w-64 hero-glass-card p-6 rounded-[20px] border border-accent/15 bg-zinc-950/40 backdrop-blur-xl shadow-xl flex flex-col items-start text-left group"
            >
              <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-4 shadow-[0_0_10px_rgba(0,210,255,0.1)]">
                <Layers size={20} />
              </div>
              <h3 className="font-extrabold text-sm text-white mb-1.5">ERP Systems</h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed mb-3 font-sans">Powerful ERP solutions to streamline your business operations.</p>
              <span className="text-accent text-sm font-bold group-hover:translate-x-2 transition-transform duration-300 select-none">→</span>
            </motion.div>
          </div>

          {/* Center Column (Hero Text + Buttons + Stats) - active on all devices */}
          <motion.div
            ref={heroRef}
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleHeroMouseLeave}
            className="flex-grow max-w-3xl xl:max-w-2xl mx-auto text-center flex flex-col items-center select-none z-10"
            initial="hidden"
            animate="visible"
            variants={staggerReveal}
          >
            {/* Mockup capsule label */}
            <motion.div variants={itemReveal} className="flex justify-center mb-5 z-10 relative select-none">
              <span className="text-[10px] tracking-[0.2em] text-accent font-extrabold px-5 py-2 border border-accent/20 bg-accent/10 rounded-full shadow-[0_0_15px_rgba(0,210,255,0.06)]">
                INNOVATIVE TECHNOLOGY SOLUTIONS
              </span>
            </motion.div>

            <motion.h1 className="hero-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mt-2 mb-6 leading-tight z-10 relative max-w-3xl">
              {heroWords.map((word, index) => {
                return (
                  <React.Fragment key={`${word.text}-${index}`}>
                    {word.isAccent && <br />}
                    <motion.span
                      className={`hero-heading__word ${word.isAccent ? 'text-accent drop-shadow-[0_0_20px_rgba(0,210,255,0.45)] whitespace-nowrap' : 'text-white'}`}
                      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.6, delay: 0.08 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {word.text}{' '}
                    </motion.span>
                  </React.Fragment>
                );
              })}
            </motion.h1>

            <p className="text-secondary text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed z-10 relative font-sans">
              AJNABH INFOTECH builds modern websites, mobile applications, AI systems, ERP platforms and custom software solutions that help businesses grow faster through technology and innovation.
            </p>

            {/* CTA Buttons Group matching mockup */}
            <motion.div variants={itemReveal} className="flex flex-wrap items-center justify-center gap-6 mt-4 mb-4 z-20 relative">
              <button
                onClick={() => navigateTo('/contact')}
                className="premium-button cta-magnetic px-7 py-3.5 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all flex items-center gap-2 cursor-pointer text-sm shadow-lg shadow-white/5"
              >
                Start Your Project <ArrowRight size={16} />
              </button>
            </motion.div>

            {/* Statistics panel matching mockup columns */}
            <motion.div
              variants={itemReveal}
              className="hero-stats-panel w-full max-w-5xl mx-auto mt-16 p-6 bg-zinc-950/30 backdrop-blur-xl border border-white/5 rounded-[24px] shadow-[0_0_40px_rgba(0,0,0,0.6)] relative z-20"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
                {heroStats.map((stat, index) => {
                  const IconComponent = iconMap[stat.iconName] || Rocket;
                  let plClass = "md:pl-8";
                  if (index === 0) plClass = "md:pl-4";

                  return (
                    <div key={stat.id || index} className={`flex items-center gap-4 py-2 md:py-0 justify-center md:justify-start ${plClass}`}>
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent shadow-[0_0_10px_rgba(0,210,255,0.05)]">
                        <IconComponent size={18} />
                      </div>
                      <div className="text-left leading-tight font-sans text-white">
                        <h4 className="text-2xl md:text-3xl font-extrabold text-white font-mono leading-none">
                          <CountUpNumber value={stat.value} />
                        </h4>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-400 mt-1.5 font-bold">{stat.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Mobile/Tablet Grid of Service Cards matching mockup card layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 xl:hidden text-left max-w-xl w-full z-20 relative font-sans">
              <div className="hero-glass-card p-5 rounded-2xl border border-accent/15 bg-zinc-950/40 backdrop-blur-xl flex flex-col items-start group">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-3 shadow-[0_0_10px_rgba(0,210,255,0.1)]">
                  <Bot size={18} />
                </div>
                <h3 className="font-bold text-sm text-white mb-1">AI Solutions</h3>
                <p className="text-zinc-400 text-[11px] leading-relaxed">Intelligent systems for smarter business decisions.</p>
                <span className="text-accent text-xs font-bold mt-2">→</span>
              </div>

              <div className="hero-glass-card p-5 rounded-2xl border border-accent/15 bg-zinc-950/40 backdrop-blur-xl flex flex-col items-start group">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-3 shadow-[0_0_10px_rgba(0,210,255,0.1)]">
                  <Layers size={18} />
                </div>
                <h3 className="font-bold text-sm text-white mb-1">ERP Systems</h3>
                <p className="text-zinc-400 text-[11px] leading-relaxed">Powerful ERP solutions to streamline your business operations.</p>
                <span className="text-accent text-xs font-bold mt-2">→</span>
              </div>

              <div className="hero-glass-card p-5 rounded-2xl border border-accent/15 bg-zinc-950/40 backdrop-blur-xl flex flex-col items-start group">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-3 shadow-[0_0_10px_rgba(0,210,255,0.1)]">
                  <Globe size={18} />
                </div>
                <h3 className="font-bold text-sm text-white mb-1">Web Development</h3>
                <p className="text-zinc-400 text-[11px] leading-relaxed">Modern, responsive and high-performance websites.</p>
                <span className="text-accent text-xs font-bold mt-2">→</span>
              </div>

              <div className="hero-glass-card p-5 rounded-2xl border border-accent/15 bg-zinc-950/40 backdrop-blur-xl flex flex-col items-start group">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-3 shadow-[0_0_10px_rgba(0,210,255,0.1)]">
                  <Smartphone size={18} />
                </div>
                <h3 className="font-bold text-sm text-white mb-1">Mobile Applications</h3>
                <p className="text-zinc-400 text-[11px] leading-relaxed">User-friendly mobile apps for iOS and Android platforms.</p>
                <span className="text-accent text-xs font-bold mt-2">→</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column (Floating Cards) - hidden on mobile/tablet */}
          <div className="hidden xl:flex flex-col justify-between h-[460px] w-64 pointer-events-none select-none">
            {/* Web Development */}
            <motion.div
              style={{ x: cardRT_X, y: cardRT_Y }}
              animate={{ y: [0, -9, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.4 }}
              className="pointer-events-auto w-64 hero-glass-card p-6 rounded-[20px] border border-accent/15 bg-zinc-950/40 backdrop-blur-xl shadow-xl flex flex-col items-start text-left group"
            >
              <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-4 shadow-[0_0_10px_rgba(0,210,255,0.1)]">
                <Globe size={20} />
              </div>
              <h3 className="font-extrabold text-sm text-white mb-1.5">Web Development</h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed mb-3 font-sans">Modern, responsive and high-performance websites.</p>
              <span className="text-accent text-sm font-bold group-hover:translate-x-2 transition-transform duration-300 select-none">→</span>
            </motion.div>

            {/* Mobile Applications */}
            <motion.div
              style={{ x: cardRB_X, y: cardRB_Y }}
              animate={{ y: [0, -11, 0] }}
              transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 1.2 }}
              className="pointer-events-auto w-64 hero-glass-card p-6 rounded-[20px] border border-accent/15 bg-zinc-950/40 backdrop-blur-xl shadow-xl flex flex-col items-start text-left group"
            >
              <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-4 shadow-[0_0_10px_rgba(0,210,255,0.1)]">
                <Smartphone size={20} />
              </div>
              <h3 className="font-extrabold text-sm text-white mb-1.5">Mobile Applications</h3>
              <p className="text-zinc-400 text-[11px] leading-relaxed mb-3 font-sans">User-friendly mobile apps for iOS and Android platforms.</p>
              <span className="text-accent text-sm font-bold group-hover:translate-x-2 transition-transform duration-300 select-none">→</span>
            </motion.div>
          </div>

        </div>
      </div>



      {/* 2. Company Intro */}
      <motion.section className="reveal-section max-w-5xl mx-auto px-6" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent font-bold px-3 py-1 bg-accent/10 rounded-full">Who We Are</span>
            <h2 className="animated-title text-3xl md:text-5xl font-bold mt-4 mb-6 leading-tight">Who We Are</h2>
          </div>
          <div className="premium-card p-8 bg-white/5 border border-white/10 rounded-3xl">
            <p className="text-secondary leading-relaxed text-sm">
              AJNABH INFOTECH is a technology-driven IT company focused on creating innovative digital products and intelligent software solutions. We specialize in web development, mobile applications, AI-powered systems, ERP platforms and business automation tools designed to improve efficiency and accelerate growth.
            </p>
            <p className="text-secondary leading-relaxed text-sm mt-4">
              We combine technology, creativity and strategic thinking to deliver scalable solutions tailored to every business requirement.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {aboutHighlights.map((item, idx) => (
                <p key={idx} className="glow-text text-xs font-semibold text-secondary">✓ {item}</p>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3. Service Preview Cards */}
      <motion.section className="reveal-section max-w-6xl mx-auto px-6" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-accent font-bold px-3 py-1 bg-accent/10 rounded-full">Our Services</span>
          <h2 className="animated-title text-3xl md:text-4xl font-bold mt-4">Our Services</h2>
        </div>
        <motion.div className="grid md:grid-cols-3 gap-6" variants={staggerReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-70px' }}>
          {servicesPreview.map((service, index) => (
            <motion.div key={service._id || index} variants={itemReveal} className="premium-card service-card p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-accent/40 transition-all">
              <h3 className="font-bold text-lg mb-2">{service.title}</h3>
              <p className="text-secondary text-xs leading-relaxed">{service.description || service.desc}</p>
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center mt-10">
          <button onClick={() => navigateTo('/services')} className="premium-button text-accent hover:underline inline-flex items-center gap-1 text-sm font-semibold cursor-pointer">
            Explore All Services <ArrowRight size={16} />
          </button>
        </div>
      </motion.section>

      {/* 4. Why Choose Us */}
      <motion.section className="reveal-section max-w-5xl mx-auto px-6" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent font-bold px-3 py-1 bg-accent/10 rounded-full">Why Choose Us</span>
            <h2 className="animated-title text-3xl md:text-4xl font-bold mt-4 mb-6">Why Choose AJNABH INFOTECH</h2>
            <p className="text-secondary text-sm leading-relaxed mb-6">
              We deliver future-ready digital solutions by combining innovation, technology and business understanding.
            </p>
          </div>
          <motion.div className="grid grid-cols-2 gap-4" variants={staggerReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-70px' }}>
            {whyChooseUs.map((item, idx) => (
              <motion.div key={idx} variants={itemReveal} className="premium-card tech-chip p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
                <CheckCircle2 size={16} className="text-accent flex-shrink-0" />
                <span className="text-xs font-semibold text-secondary">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>


      {/* 6. Portfolio Preview */}
      <motion.section className="reveal-section max-w-6xl mx-auto px-6" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent font-bold px-3 py-1 bg-accent/10 rounded-full">Featured Work</span>
            <h2 className="animated-title text-3xl font-bold mt-4">Our Recent Projects</h2>
          </div>
          <button onClick={() => navigateTo('/portfolio')} className="premium-button text-accent hover:underline flex items-center gap-1 text-sm font-semibold cursor-pointer">
            View All Work <ArrowRight size={16} />
          </button>
        </div>
        <motion.div className="grid md:grid-cols-2 gap-8" variants={staggerReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-70px' }}>
          {portfolioPreview.map((project, idx) => (
            <motion.div key={project._id || idx} variants={itemReveal} className="premium-card portfolio-card p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
              <div className="aspect-video bg-neutral-900 rounded-2xl flex items-center justify-center text-4xl overflow-hidden relative border border-white/5">
                {project.imageUrl && !project.imageUrl.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/) ? (
                  <img src={project.imageUrl} alt={`${project.title} preview`} loading="lazy" className="portfolio-card__image absolute inset-0 w-full h-full object-cover opacity-80" />
                ) : (
                  <span>{project.imageUrl || '📸'}</span>
                )}
              </div>
              <h3 className="font-bold text-lg">{project.title}</h3>
              <p className="text-secondary text-xs">{project.description || project.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 8. Blog Preview */}
      <motion.section className="reveal-section max-w-6xl mx-auto px-6" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent font-bold px-3 py-1 bg-accent/10 rounded-full">Latest Insights</span>
            <h2 className="animated-title text-3xl font-bold mt-4">From Our Blog</h2>
          </div>
          <button onClick={() => navigateTo('/blog')} className="premium-button text-accent hover:underline inline-flex items-center gap-1 text-sm font-semibold cursor-pointer self-start md:self-auto">
            View All Blogs <ArrowRight size={16} />
          </button>
        </div>
        <motion.div className="grid md:grid-cols-3 gap-6" variants={staggerReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-70px' }}>
          {blogPreview.map((post, idx) => (
            <motion.article
              key={post._id || post.title || idx}
              variants={itemReveal}
              className="premium-card p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col min-h-[320px] cursor-default hover:border-accent/40 transition-all duration-300 group"
            >
              {post.imageUrl && !post.imageUrl.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/) ? (
                <div className="h-36 mb-5 rounded-xl overflow-hidden bg-neutral-900 border border-white/5">
                  <img src={post.imageUrl} alt={post.title} loading="lazy" className="w-full h-full object-cover opacity-85" />
                </div>
              ) : (
                <div className="h-36 mb-5 rounded-xl bg-neutral-900/80 border border-white/5 flex items-center justify-center text-4xl">
                  {post.imageUrl || post.emoji || 'News'}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3 text-[10px] text-secondary/80 mb-4">
                <span className="uppercase font-bold tracking-wider text-accent px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-full">{post.category || 'Technology'}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} />
                  {post.date || (post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Latest')}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-300">{post.title}</h3>
              <p className="text-secondary text-xs leading-relaxed line-clamp-3 flex-grow">{post.content || post.desc}</p>
              <div className="border-t border-white/5 mt-5 pt-4 flex items-center justify-between text-[10px] text-secondary/70">
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Users size={12} />
                  {post.author || 'AJNABH Team'}
                </span>
                <span>{post.readTime || '5 min read'}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      {/* 9. Testimonials Preview */}
      <motion.section className="reveal-section max-w-4xl mx-auto px-6 text-center" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
        <span className="text-xs uppercase tracking-widest text-accent font-bold px-3 py-1 bg-accent/10 rounded-full">Client Reviews</span>
        <h2 className="animated-title text-3xl font-bold mt-4 mb-8">What Our Clients Say</h2>
        <div className="premium-card testimonial-float p-8 bg-white/5 border border-white/10 rounded-3xl relative">
          {testimonials.map((review, idx) => (
            <p key={review._id || idx} className="text-lg italic text-secondary leading-relaxed mb-4">
              "{review.review || review}"
            </p>
          ))}
        </div>
        <button onClick={() => navigateTo('/testimonials')} className="premium-button text-accent hover:underline mt-6 inline-flex items-center gap-1 text-xs font-semibold cursor-pointer">
          Read All Client Testimonials <ArrowRight size={16} />
        </button>
      </motion.section>

      {/* 10. Final CTA */}
      <motion.section className="reveal-section max-w-4xl mx-auto px-6 text-center" variants={sectionReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
        <div className="premium-card p-12 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-accent/20 to-transparent pointer-events-none opacity-40"></div>
          <h2 className="animated-title text-3xl md:text-5xl font-bold mb-4 relative">Ready To Build Your Next Digital Solution?</h2>
          <p className="text-secondary text-sm max-w-lg mx-auto mb-8 relative">
            Partner with AJNABH INFOTECH to transform your ideas into innovative digital products and intelligent software solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative">
            <button
              onClick={() => navigateTo('/contact')}
              className="premium-button cta-magnetic px-8 py-3 bg-white/10 border border-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 transition-colors cursor-pointer text-sm"
            >
              Contact Us
            </button>
          </div>
          <p className="footer-reveal text-xs text-secondary mt-8 relative">Innovation • Technology • Growth</p>
        </div>
      </motion.section>
    </div>
  );
};

export default HomeExtra;
