'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, TriangleAlert as AlertTriangle, Target, Users, Award } from 'lucide-react';
import { MainLayout } from '@/layouts/main-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { intelligenceService } from '@/services/intelligenceService';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }
  }),
};

const CardHeader = ({ icon: Icon, title, color = '#D4AF37' }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
      style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
      <Icon className="w-4 h-4" style={{ color }} />
    </div>
    <h2 className="text-base font-bold text-white">{title}</h2>
  </div>
);

export default function FounderIntelligencePage() {
  const [founderDNA, setFounderDNA] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDna = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await intelligenceService.getDna();
      setFounderDNA(response);
    } catch (err) {
      setError(err.message || 'Failed to load founder intelligence');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDna();
  }, []);

  const traitColors = ['#D4AF37', '#60A5FA', '#34D399', '#F97316', '#A78BFA', '#FB7185'];

  // Always render the page shell — use fallback DNA if needed
  const dna = founderDNA || {
    overallScore: 0,
    personalityType: 'Loading...',
    leadershipStyle: 'Loading...',
    stressBehavior: 'Loading...',
    traits: [
      { name: 'Vision', score: 0 }, { name: 'Execution', score: 0 },
      { name: 'Resilience', score: 0 }, { name: 'Communication', score: 0 },
      { name: 'Leadership', score: 0 }, { name: 'Adaptability', score: 0 },
    ],
    strengths: ['Loading insights...'],
    blindSpots: ['Loading insights...'],
    idealCofounder: { traits: [], skills: [], personality: 'Loading...' },
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8">

        {/* ─── Page Header ─── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs font-semibold px-2 py-1 rounded-lg"
              style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
              AI + Psychology
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
            Founder <span style={{ background: 'linear-gradient(90deg,#D4AF37,#F5C542)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Intelligence</span>
          </h1>
          <p className="text-slate-400 text-sm">Understand your founder DNA and unlock your full potential</p>
        </motion.div>

        {/* Error banner (non-blocking) */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <p className="text-sm text-orange-300">{error} — showing default profile</p>
            <button onClick={loadDna} className="ml-auto text-xs text-orange-400 hover:text-orange-300 font-semibold">Retry</button>
          </div>
        )}

        {/* ─── DNA Score Hero ─── */}
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
          <div className="relative rounded-2xl overflow-hidden px-8 py-8"
            style={{
              background: 'linear-gradient(135deg, rgba(17,24,39,0.95) 0%, rgba(20,30,46,0.9) 100%)',
              border: '1px solid rgba(212,175,55,0.25)',
            }}>
            <div className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse 70% 100% at 0% 50%, rgba(212,175,55,0.08) 0%, transparent 60%)' }} />

            <div className="relative flex flex-col md:flex-row items-center gap-10">
              {/* Score Ring */}
              <div className="relative flex-shrink-0">
                <div className="w-44 h-44">
                  <svg className="w-44 h-44 -rotate-90" viewBox="0 0 176 176">
                    <circle cx="88" cy="88" r="76" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <circle
                      cx="88" cy="88" r="76"
                      fill="none"
                      stroke="url(#goldGrad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 76}`}
                      strokeDashoffset={loading ? `${2 * Math.PI * 76}` : `${2 * Math.PI * 76 * (1 - dna.overallScore / 100)}`}
                      style={{ filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.6))', transition: 'stroke-dashoffset 1.5s ease' }}
                    />
                    <defs>
                      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#D4AF37" />
                        <stop offset="100%" stopColor="#F5C542" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {loading ? (
                      <div className="w-6 h-6 rounded-full border-2 border-[rgba(212,175,55,0.3)] border-t-[#D4AF37] animate-spin" />
                    ) : (
                      <>
                        <span className="text-4xl font-black text-white leading-none">{dna.overallScore}</span>
                        <span className="text-sm text-slate-400 mt-1">/ 100</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center md:text-left">
                <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                  <Award className="w-5 h-5 text-[#D4AF37]" />
                  <h2 className="text-xl font-black text-white">Your Founder DNA Score</h2>
                </div>
                <p className="text-slate-300 text-base mb-5">
                  You're in the <span className="text-[#F5C542] font-bold">top {dna.overallScore > 70 ? '1%' : '10%'}</span> of founders on the platform.
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-xl"
                    style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.2)' }}>
                    ✦ {dna.overallScore >= 80 ? 'Excellent' : dna.overallScore >= 60 ? 'Strong' : 'Developing'}
                  </span>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-xl"
                    style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                    {dna.personalityType}
                  </span>
                </div>
              </div>

              {/* Trait quick stats */}
              <div className="ml-auto hidden lg:grid grid-cols-2 gap-4">
                {dna.traits.slice(0, 4).map((trait, i) => (
                  <div key={trait.name} className="text-center px-5 py-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-xl font-black mb-0.5" style={{ color: traitColors[i] }}>{trait.score}%</div>
                    <div className="text-xs text-slate-500 font-medium">{trait.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Traits + Strengths ─── */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
            <GlassCard className="h-full p-6">
              <CardHeader icon={Brain} title="Trait Analysis" />
              <div className="space-y-5">
                {dna.traits.map((trait, index) => (
                  <div key={trait.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-300">{trait.name}</span>
                      <span className="text-sm font-bold" style={{ color: traitColors[index] }}>{trait.score}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${trait.score}%` }}
                        transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                        style={{
                          background: `linear-gradient(90deg, ${traitColors[index]}80, ${traitColors[index]})`,
                          boxShadow: `0 0 8px ${traitColors[index]}50`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
            <GlassCard className="h-full p-6">
              <CardHeader icon={TrendingUp} title="Key Strengths" color="#34D399" />
              <div className="space-y-3">
                {dna.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 p-3.5 rounded-xl"
                    style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.12)' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(52,211,153,0.15)' }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-sm text-slate-300 leading-relaxed">{strength}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* ─── Blind Spots + Leadership Profile ─── */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
            <GlassCard className="h-full p-6">
              <CardHeader icon={AlertTriangle} title="Blind Spots" color="#F97316" />
              <div className="space-y-3">
                {dna.blindSpots.map((blindSpot, index) => (
                  <div key={index} className="flex items-start gap-3 p-3.5 rounded-xl"
                    style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.12)' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(249,115,22,0.15)' }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    </div>
                    <span className="text-sm text-slate-300 leading-relaxed">{blindSpot}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
            <GlassCard className="h-full p-6">
              <CardHeader icon={Target} title="Leadership Profile" color="#A78BFA" />
              <div className="space-y-5">
                {[
                  { label: 'Leadership Style', value: dna.leadershipStyle, color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
                  { label: 'Personality Type', value: dna.personalityType, color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
                ].map(({ label, value, color, bg, border }) => (
                  <div key={label}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-2">{label}</p>
                    <span className="inline-block text-sm font-semibold px-4 py-2 rounded-xl"
                      style={{ background: bg, color, border: `1px solid ${border}` }}>
                      {value}
                    </span>
                  </div>
                ))}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-2">Under Stress</p>
                  <p className="text-sm text-slate-300 leading-relaxed p-3.5 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {dna.stressBehavior}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* ─── Ideal Co-founder ─── */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
          <GlassCard className="p-6">
            <CardHeader icon={Users} title="Ideal Co-founder Profile" />
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { label: 'Complementary Traits', items: dna.idealCofounder?.traits || [], color: '#D4AF37', bg: 'rgba(212,175,55,0.1)', border: 'rgba(212,175,55,0.2)' },
                { label: 'Required Skills', items: dna.idealCofounder?.skills || [], color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
                { label: 'Personality', items: [dna.idealCofounder?.personality || '—'], color: '#34D399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
              ].map(({ label, items, color, bg, border }) => (
                <div key={label}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.length > 0 ? items.map((item, i) => (
                      <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-lg"
                        style={{ background: bg, color, border: `1px solid ${border}` }}>
                        {item}
                      </span>
                    )) : (
                      <span className="text-xs text-slate-600">Complete your profile to see insights</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

      </div>
    </MainLayout>
  );
}
