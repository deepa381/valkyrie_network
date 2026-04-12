'use client';

import { motion, useInView, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import {
  ArrowRight, Zap, Users, Rocket, Brain, TrendingUp, Shield,
  Star, ChevronRight, Play, Globe, Award, Lightbulb,
  Target, BarChart3, Linkedin, Twitter, Instagram, Youtube,
  Check, Sparkles, Crown, Building2, DollarSign, BookOpen,
  Megaphone
} from 'lucide-react';

/* ─── Animated Counter ─── */
type AnimatedCounterProps = {
  target: number;
  suffix?: string;
  duration?: number;
};

function AnimatedCounter({ target, suffix = '', duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(eased * target));

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Section Fade In ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

/* ─── Abstract Hero Graphic ─── */
function HeroGraphic() {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border border-[rgba(212,175,55,0.15)] animate-spin-slow" />
      {/* Middle ring */}
      <div className="absolute inset-8 rounded-full border border-[rgba(212,175,55,0.1)]"
        style={{ animation: 'spin-slow 18s linear infinite reverse' }} />
      {/* Glow orb center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.25)_0%,transparent_70%)] animate-pulse-gold" />
          <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.15)_0%,transparent_70%)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Crown className="w-16 h-16 text-[#D4AF37]" style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.8))' }} />
          </div>
        </div>
      </div>
      {/* Floating cards on the ring */}
      {[
        { icon: Users, label: 'Co-Founders', angle: 0, value: '5.2K+' },
        { icon: Rocket, label: 'Startups', angle: 90, value: '1.2K+' },
        { icon: DollarSign, label: 'Investors', angle: 180, value: '450+' },
        { icon: Globe, label: 'Countries', angle: 270, value: '50+' },
      ].map(({ icon: Icon, label, angle, value }, i) => {
        const rad = (angle * Math.PI) / 180;
        const r = 45; // % from center
        const x = 50 + r * Math.sin(rad);
        const y = 50 - r * Math.cos(rad);
        return (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="glass-card rounded-xl px-3 py-2 flex items-center gap-2 min-w-[90px] animate-float"
              style={{ animationDelay: `${i * 0.8}s` }}>
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(212,175,55,0.15)' }}>
                <Icon className="w-3.5 h-3.5 text-[#F5C542]" />
              </div>
              <div>
                <div className="text-white font-bold text-xs leading-none">{value}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{label}</div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Main Landing Page ─── */
export default function LandingPage() {

  const pillars = [
    { icon: Rocket, title: 'Founder Forge', desc: 'Turn ideas into successful startups with expert guidance' },
    { icon: Users, title: 'Valkyrie Guild', desc: 'Connect with elite women founders globally' },
    { icon: Shield, title: 'War Room', desc: 'Get strategic support from industry experts' },
    { icon: DollarSign, title: 'Capital Circle', desc: 'Access funding & investment opportunities' },
    { icon: BookOpen, title: 'Skill Dominion', desc: 'Master skills for leadership & growth' },
    { icon: Megaphone, title: 'Influence Engine', desc: 'Build your brand & global visibility' },
    { icon: Brain, title: 'Intelligence Layer', desc: 'AI + Psychology for smarter decisions' },
  ];

  const stats = [
    { value: 5200, suffix: '+', label: 'Women Founders', icon: Users },
    { value: 1200, suffix: '+', label: 'Startups Built', icon: Rocket },
    { value: 450, suffix: '+', label: 'Investors', icon: DollarSign },
    { value: 50, suffix: '+', label: 'Countries', icon: Globe },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Create Your Profile',
      desc: 'Sign up and complete your founder profile with your vision, skills, and goals.',
      icon: Target,
    },
    {
      step: '02',
      title: 'Get Matched & Connected',
      desc: 'Our AI engine matches you with co-founders, mentors, and investors aligned with your goals.',
      icon: Sparkles,
    },
    {
      step: '03',
      title: 'Build & Scale',
      desc: 'Launch your startup with community support, funding access, and strategic guidance.',
      icon: TrendingUp,
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'CEO, HealthAI',
      quote: 'Valkyrie Network helped me find my co-founder within weeks. The matching algorithm is incredible — we are like-minded in every way.',
      metric: 'Raised $2M Seed',
      initials: 'PS',
    },
    {
      name: 'Amara Osei',
      role: 'Founder, EdTechGlobal',
      quote: 'The War Room sessions with industry experts transformed my pitch. I walked away with three investor introductions.',
      metric: '3 Investor Intros',
      initials: 'AO',
    },
    {
      name: 'Sofia Martinez',
      role: 'CTO, FinFlow',
      quote: "As a technical founder, I needed a business co-founder. Valkyrie's AI matched me with someone who perfectly complements my skills.",
      metric: '92% Match Score',
      initials: 'SM',
    },
  ];

  const valueProps = [
    {
      icon: Shield,
      title: 'Founder-First Security',
      desc: 'Private profiles, verified members, and a trusted founder network built for safety.',
    },
    {
      icon: Brain,
      title: 'Intelligence Layer',
      desc: 'AI + psychology signals that surface the highest-fit co-founders and mentors.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      desc: 'Connect across 50+ countries with localized community and capital access.',
    },
  ];

  const featureHighlights = [
    {
      icon: Sparkles,
      title: 'Precision Matching',
      desc: 'Deep signal scoring that aligns vision, values, and complementary skills.',
    },
    {
      icon: BarChart3,
      title: 'Founder Intelligence',
      desc: 'Track your DNA score, growth arcs, and leadership insights in one dashboard.',
    },
    {
      icon: DollarSign,
      title: 'Capital Readiness',
      desc: 'Pitch feedback, investor readiness checklists, and warm intros.',
    },
  ];

  const partners = ['Atlas Ventures', 'Nimbus Capital', 'Aurora Labs', 'Founders Guild', 'Northstar Angels'];

  const successStories = [
    {
      name: 'Lena Park',
      company: 'Aether Health',
      story: 'Matched with a clinical co-founder in 12 days and closed a $1.8M seed round.',
      metric: 'Seed Raised: $1.8M',
    },
    {
      name: 'Noor Ali',
      company: 'Gridline AI',
      story: 'Built a founding team across 3 time zones and shipped their MVP in 9 weeks.',
      metric: 'MVP Launch: 9 weeks',
    },
    {
      name: 'Harper Kim',
      company: 'Keystone Fin',
      story: 'Used Founder Intelligence to refine her pitch and secure 5 investor meetings.',
      metric: 'Investor Intros: 5',
    },
  ];

  const communityHighlights = [
    {
      icon: Users,
      title: 'Founder Circles',
      desc: 'Weekly curated pods for accountability and progress sharing.',
    },
    {
      icon: Megaphone,
      title: 'Live Masterclasses',
      desc: 'Tactical sessions with operators, investors, and growth leaders.',
    },
    {
      icon: Award,
      title: 'Demo Days',
      desc: 'Showcase milestones and pitch to aligned capital partners.',
    },
  ];

  const footerLinks = {
    Explore: ['About Us', 'How It Works', '7 Pillars', 'Resources', 'Events'],
    'For Founders': ['Find Co-Founders', 'Raise Funding', 'Mentorship', 'Startup Support'],
    'For Investors': ['Invest in Startups', 'Deal Flow', 'Partnerships'],
  };

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: '#0B0F19' }}>

      {/* ─── NAVBAR ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F5C542] opacity-90" />
              <Zap className="w-5 h-5 text-[#0B0F19] relative z-10 font-black" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">VALKYRIE</span>
              <span className="text-[10px] text-[#D4AF37] block leading-none tracking-widest font-medium">NETWORK</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {['Home', 'About', '7 Pillars', 'Ecosystem', 'For Founders', 'For Investors', 'Resources'].map((item, i) => (
              <Link key={item} href={i === 0 ? '/' : `#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  i === 0
                    ? 'text-[#F5C542] bg-[rgba(212,175,55,0.1)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}>
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/login"
              className="text-sm text-slate-300 hover:text-white transition-colors px-3.5 py-2 rounded-lg border border-white/10 hover:border-white/20">
              Login
            </Link>
            <Link href="/auth/signup"
              className="btn-gold text-sm font-bold px-5 py-2 rounded-lg flex items-center gap-2">
              Join Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background Layers */}
        <div className="absolute inset-0 dot-grid" style={{ backgroundSize: '28px 28px' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(212,175,55,0.12) 0%, transparent 60%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 80% at -20% 60%, rgba(212,175,55,0.07) 0%, transparent 50%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 80% at 120% 60%, rgba(212,175,55,0.07) 0%, transparent 50%)' }} />

        <div className="relative container mx-auto px-6 max-w-7xl py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: Copy */}
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
              <motion.div variants={fadeUp} className="mb-6">
                <span className="tag-gold inline-flex items-center gap-1.5 mb-6">
                  <Sparkles className="w-3 h-3" />
                  The Global Ecosystem for Women Founders
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp}
                className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.05]">
                Build Startups.<br />
                Find Co-Founders.<br />
                <span className="gradient-text glow-text-gold">Become a Leader.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-slate-400 mb-10 max-w-lg leading-relaxed">
                Valkyrie Network is the global ecosystem for women founders to{' '}
                <span className="text-[#F5C542] font-medium">build</span>,{' '}
                <span className="text-[#F5C542] font-medium">collaborate</span>,{' '}
                <span className="text-[#F5C542] font-medium">raise capital</span>, and{' '}
                <span className="text-[#F5C542] font-medium">lead</span> with confidence.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-14">
                <Link href="/auth/signup"
                  className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold">
                  Join the Movement <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="#how-it-works"
                  className="btn-outline-glass inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold">
                  <Play className="w-4 h-4 fill-current" /> Watch Demo
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                {['AI-Powered Matching', 'Founder Intelligence', 'Global Community'].map((badge) => (
                  <span key={badge} className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                    <Check className="w-3 h-3 text-[#D4AF37]" />
                    {badge}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Abstract Graphic */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="relative hidden lg:flex items-center justify-center">
              <HeroGraphic />
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: 'linear-gradient(to bottom, transparent, #0B0F19)' }} />
      </section>

      {/* ─── STATS STRIP ─── */}
      <section className="py-16 relative">
        <div className="section-divider mb-16" />
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, suffix, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="glass-card rounded-2xl p-6 text-center hover:glow-gold transition-all duration-300">
                  <div className="inline-flex p-2.5 rounded-xl mb-4"
                    style={{ background: 'rgba(212,175,55,0.12)' }}>
                    <Icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">
                    <AnimatedCounter target={value} suffix={suffix} />
                  </div>
                  <div className="text-sm text-slate-400 font-medium">{label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="section-divider mt-16" />
      </section>

      {/* ─── VALUE PROPOSITION ─── */}
      <section id="value-proposition" className="py-24 relative">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 65%)' }} />
        <div className="container mx-auto px-6 max-w-6xl relative">
          <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <span className="tag-gold mb-4 inline-block">Why Valkyrie</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              A founder ecosystem built for <span className="gradient-text">scale</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need to meet, match, and move faster with the right people.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {valueProps.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -6 }}
              >
                <div className="glass-card rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}>
                    <Icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURE HIGHLIGHTS ─── */}
      <section className="py-24 relative">
        <div className="section-divider mb-20" />
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <span className="tag-gold mb-4 inline-block">Core Features</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Premium tools for <span className="gradient-text">founder velocity</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Align insights, relationships, and capital in one intelligent workspace.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {featureHighlights.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -6 }}
              >
                <div className="glass-card rounded-2xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}>
                      <Icon className="w-4.5 h-4.5 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-base font-bold text-white">{title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARTNER LOGOS ─── */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="glass-card rounded-2xl px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-sm text-slate-400 font-semibold uppercase tracking-widest">
                Trusted by capital partners
              </p>
              <div className="flex flex-wrap items-center gap-4 justify-center">
                {partners.map((partner) => (
                  <span key={partner}
                    className="text-sm text-slate-300 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMMUNITY PREVIEW ─── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 radial-gold-glow" />
        <div className="container mx-auto px-6 max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="tag-gold mb-4 inline-block">Community</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Built for founders who move <span className="gradient-text">together</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                Get plugged into curated cohorts, invite-only events, and operator-led playbooks.
              </p>
              <div className="flex gap-3">
                <Link href="/auth/signup" className="btn-gold px-6 py-3 rounded-xl text-sm font-bold">
                  Join the Community
                </Link>
                <Link href="#" className="btn-outline-glass px-6 py-3 rounded-xl text-sm font-semibold">
                  View Events
                </Link>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-5">
              {communityHighlights.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <div className="glass-card rounded-2xl p-5 h-full">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}>
                      <Icon className="w-4.5 h-4.5 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7 PILLARS ─── */}
      <section id="7-pillars" className="py-24 relative">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 70%)' }} />
        <div className="container mx-auto px-6 max-w-7xl relative">
          <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-16">
            <span className="tag-gold mb-4 inline-block">Complete Ecosystem</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              The 7 Pillars of <span className="gradient-text">Valkyrie Network</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A complete ecosystem to Build, Grow & Lead your startup journey
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {pillars.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <div className="glass-card rounded-2xl p-5 h-full flex flex-col items-center text-center group cursor-pointer
                  hover:border-[rgba(212,175,55,0.3)] hover:shadow-gold transition-all duration-300">
                  <div className="p-3 rounded-xl mb-4 transition-all duration-300"
                    style={{ background: 'rgba(212,175,55,0.1)' }}>
                    <Icon className="w-6 h-6 text-[#D4AF37] group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-2 leading-tight">{title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 relative">
        <div className="section-divider mb-24" />
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="tag-gold mb-4 inline-block">Simple Process</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                How It <span className="gradient-text">Works</span>
              </h2>
              <p className="text-slate-400 text-lg">
                Get started in 3 simple steps and join thousands of founders already building the future.
              </p>
            </motion.div>

            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-8 top-12 bottom-12 w-px"
                style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.5), rgba(212,175,55,0.1))' }} />

              <div className="space-y-8">
                {howItWorks.map(({ step, title, desc, icon: Icon }, i) => (
                  <motion.div
                    key={step}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="flex gap-6 items-start"
                  >
                    <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl border-2 border-[rgba(212,175,55,0.4)]
                      flex items-center justify-center"
                      style={{ background: 'rgba(212,175,55,0.1)', backdropFilter: 'blur(8px)' }}>
                      <span className="text-[#D4AF37] font-black text-sm">{step}</span>
                    </div>
                    <div className="flex-1 glass-card rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-[#D4AF37]" />
                        <h3 className="font-bold text-white text-base">{title}</h3>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOUNDER SUCCESS STORIES ─── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 line-grid" style={{ backgroundSize: '40px 40px' }} />
        <div className="container mx-auto px-6 max-w-6xl relative">
          <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-14">
            <span className="tag-gold mb-4 inline-block">Success Stories</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Founder wins that <span className="gradient-text">compound</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Real outcomes from founders who matched, built, and raised through Valkyrie.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map(({ name, company, story, metric }, i) => (
              <motion.div
                key={name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -6 }}
              >
                <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}>
                      <Star className="w-4.5 h-4.5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{name}</p>
                      <p className="text-slate-500 text-xs">{company}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1">{story}</p>
                  <span className="tag-gold text-xs self-start">{metric}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 relative">
        <div className="absolute inset-0 line-grid" style={{ backgroundSize: '40px 40px' }} />
        <div className="container mx-auto px-6 max-w-6xl relative">
          <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-16">
            <span className="tag-gold mb-4 inline-block">Founder Stories</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Trusted by <span className="gradient-text">Leaders Worldwide</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, quote, metric, initials }, i) => (
              <motion.div
                key={name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -6 }}
              >
                <div className="glass-card rounded-2xl p-6 h-full flex flex-col hover:border-[rgba(212,175,55,0.25)] transition-all duration-300">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array(5).fill(0).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1">"{quote}"</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-[rgba(212,175,55,0.4)]
                        flex items-center justify-center text-[#D4AF37] font-bold text-sm"
                        style={{ background: 'rgba(212,175,55,0.1)' }}>
                        {initials}
                      </div>
                      <div>
                        <div className="text-white font-semibold text-sm">{name}</div>
                        <div className="text-slate-500 text-xs">{role}</div>
                      </div>
                    </div>
                    <span className="tag-gold text-xs">{metric}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative rounded-3xl overflow-hidden border border-[rgba(212,175,55,0.2)]"
              style={{ background: 'linear-gradient(135deg, rgba(17,24,39,0.9) 0%, rgba(20,30,46,0.95) 100%)' }}>
              {/* Background glow */}
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 120%, rgba(212,175,55,0.15) 0%, transparent 60%)' }} />
              <div className="absolute inset-0 dot-grid opacity-50" style={{ backgroundSize: '28px 28px' }} />

              <div className="relative px-8 md:px-16 py-16">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                      Join a <span className="gradient-text">Global Movement</span>
                    </h2>
                    <p className="text-slate-400 text-base leading-relaxed">
                      Be part of the largest network of women founders, builders, and investors shaping the future of entrepreneurship.
                    </p>
                  </div>
                  <div>
                    <div className="flex gap-3">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3.5 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-[rgba(212,175,55,0.4)]"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      />
                      <button className="btn-gold px-6 py-3.5 rounded-xl text-sm font-bold whitespace-nowrap">
                        Join Network
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">No spam, ever. Unsubscribe anytime.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] pt-16 pb-8">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-5">
                <div className="relative w-9 h-9 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F5C542]" />
                  <Zap className="w-5 h-5 text-[#0B0F19] relative z-10" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white tracking-tight">VALKYRIE</span>
                  <span className="text-[10px] text-[#D4AF37] block leading-none tracking-widest">NETWORK</span>
                </div>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-56">
                Empowering women to build, lead, and transform the world.
              </p>
              <div className="flex gap-3">
                {[Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <a key={i} href="#"
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#D4AF37] transition-all duration-200 hover:bg-[rgba(212,175,55,0.1)]"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{section}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-slate-500 hover:text-[#D4AF37] text-sm transition-colors duration-200">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">Newsletter</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Get updates on opportunities, events, and founder stories.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 rounded-l-lg text-xs text-white placeholder:text-slate-600 outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRight: 'none',
                  }}
                />
                <button className="btn-gold px-3 py-2 rounded-r-lg">
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="section-divider mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-xs">© 2024 Valkyrie Network. All rights reserved.</p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'Contact'].map((l) => (
                <a key={l} href="#" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
