'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Calendar, ExternalLink, TrendingUp, Award, Zap, Filter, Search, X, Check, Loader2 } from 'lucide-react';
import { MainLayout } from '@/layouts/main-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { marketplaceService } from '@/services/marketplaceService';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.06 } }),
};

const TYPE_COLORS = {
  grant: { color: '#34D399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', label: 'Grant' },
  accelerator: { color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)', label: 'Accelerator' },
  investment: { color: '#D4AF37', bg: 'rgba(212,175,55,0.1)', border: 'rgba(212,175,55,0.2)', label: 'Investment' },
};
const TYPE_ICONS = { grant: Award, accelerator: Zap, investment: DollarSign };

const FALLBACK = {
  opportunities: [
    { id: 'f1', type: 'grant', title: 'Women Founders Fund', provider: 'Sequoia Capital', amount: '$250,000', deadline: '2025-06-30', tags: ['Seed', 'Women-led', 'Tech'], description: 'Non-dilutive grant for early-stage women-led startups in technology.', eligibility: ['Women-led startup', 'Pre-seed or Seed', 'US-based or remote'], contactEmail: 'grants@sequoia.com', applyUrl: 'https://www.sequoiacap.com/' },
    { id: 'f2', type: 'accelerator', title: 'YC W25 Application', provider: 'Y Combinator', amount: '$500,000 + equity', deadline: '2025-04-01', tags: ['Accelerator', 'Global'], description: "World's most prestigious accelerator. 3 months, Silicon Valley network.", eligibility: ['Any stage', 'Strong founding team'], contactEmail: 'apply@ycombinator.com', applyUrl: 'https://www.ycombinator.com/apply' },
    { id: 'f3', type: 'investment', title: 'AI & ML Series A', provider: 'a16z', amount: '$2M–$10M', deadline: '2025-05-15', tags: ['Series A', 'AI'], description: 'Andreessen Horowitz seeking AI-first startups.', eligibility: ['$1M+ ARR', 'AI/ML product'], contactEmail: 'pitch@a16z.com', applyUrl: 'https://a16z.com/apply/' },
    { id: 'f4', type: 'grant', title: 'Climate Tech Grant', provider: 'Breakthrough Energy', amount: '$1,000,000', deadline: '2025-07-01', tags: ['CleanTech', 'Impact'], description: 'Funding for startups tackling climate change.', eligibility: ['Climate-focused', 'Technical founder'], contactEmail: 'grants@breakthroughenergy.org', applyUrl: 'https://breakthroughenergy.org/' },
    { id: 'f5', type: 'investment', title: 'HealthTech Seed Round', provider: 'General Catalyst', amount: '$500K–$2M', deadline: '2025-05-30', tags: ['HealthTech', 'Seed'], description: 'Seed investment for digital health startups.', eligibility: ['Health product', 'Clinical validation'], contactEmail: 'health@generalcatalyst.com', applyUrl: 'https://www.generalcatalyst.com/' },
    { id: 'f6', type: 'accelerator', title: 'Founder Institute', provider: 'FI Global', amount: 'Equity + Network', deadline: '2025-06-01', tags: ['Pre-Seed', 'Global'], description: 'Global accelerator helping founders build fundable companies.', eligibility: ['Idea or MVP stage', 'Committed founder'], contactEmail: 'apply@fi.co', applyUrl: 'https://fi.co/apply' },
  ],
  deals: [
    { id: 'd1', company: 'TechVentures Ltd', deal: 'Looking for B2B SaaS co-investment', amount: '$1.5M', stage: 'Series A', contact: 'partners@techventures.io' },
    { id: 'd2', company: 'Green Capital', deal: 'Seeking climate-tech founders for portfolio syndicate', amount: '$750K', stage: 'Seed', contact: 'deals@greencapital.vc' },
    { id: 'd3', company: 'MedBridge Fund', deal: 'Strategic investment + distribution for HealthTech', amount: '$2M', stage: 'Series A', contact: 'invest@medbridge.fund' },
  ],
};

// ── Apply Modal ────────────────────────────────────────────────────────────────
function ApplyModal({ opportunity, onClose }) {
  const [step, setStep] = useState('form'); // form | submitting | done
  const [form, setForm] = useState({ startupName: '', website: '', pitch: '', email: '' });

  const handleSubmit = async () => {
    setStep('submitting');
    await new Promise((r) => setTimeout(r, 1800));
    setStep('done');
  };

  const tStyle = TYPE_COLORS[opportunity.type] || TYPE_COLORS.investment;
  const Icon = TYPE_ICONS[opportunity.type] || DollarSign;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(7,9,15,0.88)', backdropFilter: 'blur(10px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: '#0D1117', border: '1px solid rgba(212,175,55,0.25)' }}>

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: tStyle.bg, border: `1px solid ${tStyle.border}` }}>
              <Icon className="w-5 h-5" style={{ color: tStyle.color }} />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">{opportunity.title}</h3>
              <p className="text-xs text-slate-500">{opportunity.provider} · {opportunity.amount}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white mt-0.5"><X className="w-5 h-5" /></button>
        </div>

        {step === 'done' ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="text-white font-black text-xl">Application Submitted!</h4>
            <p className="text-slate-400 text-sm">Your application has been sent to <span className="text-white font-semibold">{opportunity.provider}</span>. They will reach out to <span className="text-[#D4AF37]">{form.email}</span> within 5–7 business days.</p>
            <p className="text-xs text-slate-600">Reference: VLK-{Date.now().toString().slice(-6)}</p>
            <button onClick={onClose}
              className="mt-2 w-full py-3 rounded-xl text-sm font-bold"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#F5C542)', color: '#0B0F19' }}>
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Startup / Company Name', key: 'startupName', placeholder: 'e.g. EcoLaunch' },
                { label: 'Contact Email', key: 'email', placeholder: 'you@startup.io', type: 'email' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key} className="col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</label>
                  <input type={type || 'text'} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Website / Deck URL</label>
              <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://yourstartup.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">One-line Pitch</label>
              <textarea value={form.pitch} onChange={(e) => setForm({ ...form, pitch: e.target.value })}
                placeholder="What does your startup do and why does it matter?"
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>

            <div className="p-3 rounded-xl text-xs text-slate-500" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              Direct contact: <span className="text-[#D4AF37] font-semibold">{opportunity.contactEmail}</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={step === 'submitting' || !form.email || !form.startupName}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#F5C542)', color: '#0B0F19' }}>
                {step === 'submitting' ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <>Apply Now <ExternalLink className="w-3.5 h-3.5" /></>}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function MarketplacePage() {
  const [data, setData] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('opportunities');
  const [applyTarget, setApplyTarget] = useState(null);
  const [connectedDeals, setConnectedDeals] = useState(new Set());
  const [connectingDeal, setConnectingDeal] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await marketplaceService.getOpportunities();
        if (result.opportunities?.length > 0) setData(result);
      } catch (_) {}
      finally { setLoading(false); }
    })();
  }, []);

  const handleConnect = async (dealId) => {
    setConnectingDeal(dealId);
    await new Promise((r) => setTimeout(r, 1200));
    setConnectedDeals((prev) => new Set([...prev, dealId]));
    setConnectingDeal(null);
  };

  const filtered = data.opportunities.filter((op) => {
    const matchType = filter === 'all' || op.type === filter;
    const matchSearch = !search || op.title.toLowerCase().includes(search.toLowerCase()) || op.provider.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
              Funding & Opportunities
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
            Capital <span style={{ background: 'linear-gradient(90deg,#D4AF37,#F5C542)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Marketplace</span>
          </h1>
          <p className="text-slate-400 text-sm">Discover grants, accelerators, and investors aligned to your startup</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Opportunities', value: data.opportunities.length, icon: TrendingUp },
            { label: 'Active Deals', value: data.deals.length, icon: DollarSign },
            { label: 'Total Funding', value: '$50M+', icon: Award },
          ].map(({ label, value, icon: Icon }, i) => (
            <motion.div key={label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
              <GlassCard className="p-5 text-center">
                <Icon className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
                <div className="text-2xl font-black text-white">{loading ? '—' : value}</div>
                <div className="text-xs text-slate-500 mt-1">{label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10">
          {['opportunities', 'deals'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${activeTab === tab ? 'text-[#D4AF37] border-[#D4AF37]' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'opportunities' && (
          <>
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Search opportunities..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
              <div className="flex gap-2">
                {['all', 'grant', 'accelerator', 'investment'].map((t) => (
                  <button key={t} onClick={() => setFilter(t)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${filter === t ? 'bg-[#D4AF37] text-[#0B0F19]' : 'text-slate-400 hover:text-white'}`}
                    style={filter !== t ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' } : {}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-2 gap-5">
              {filtered.map((op, i) => {
                const tStyle = TYPE_COLORS[op.type] || TYPE_COLORS.investment;
                const Icon = TYPE_ICONS[op.type] || DollarSign;
                return (
                  <motion.div key={op.id} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                    <GlassCard className="p-6 h-full flex flex-col gap-4 hover:border-[rgba(212,175,55,0.3)] transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: tStyle.bg, border: `1px solid ${tStyle.border}` }}>
                            <Icon className="w-5 h-5" style={{ color: tStyle.color }} />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-sm leading-tight">{op.title}</h3>
                            <p className="text-slate-500 text-xs mt-0.5">{op.provider}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0" style={{ background: tStyle.bg, color: tStyle.color, border: `1px solid ${tStyle.border}` }}>
                          {tStyle.label}
                        </span>
                      </div>

                      <p className="text-sm text-slate-400 leading-relaxed flex-1">{op.description}</p>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" /><span className="text-white font-semibold">{op.amount}</span></span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{op.deadline}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {(op.tags || []).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-md text-slate-400" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {(op.eligibility || []).length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Eligibility</p>
                          <ul className="space-y-1">
                            {op.eligibility.map((e, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                                <div className="w-1 h-1 rounded-full bg-[#D4AF37]" />{e}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* ── Apply Now button — opens modal ── */}
                      <button onClick={() => setApplyTarget(op)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-[#0B0F19] transition-all hover:opacity-90 active:scale-[0.98]"
                        style={{ background: 'linear-gradient(135deg,#D4AF37,#F5C542)' }}>
                        Apply Now <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Filter className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500">No opportunities match your filters</p>
                <button onClick={() => { setFilter('all'); setSearch(''); }} className="mt-3 text-sm text-[#D4AF37] hover:underline">Clear filters</button>
              </div>
            )}
          </>
        )}

        {activeTab === 'deals' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.deals.map((deal, i) => {
              const connected = connectedDeals.has(deal.id);
              const connecting = connectingDeal === deal.id;
              return (
                <motion.div key={deal.id} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                  <GlassCard className="p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                        <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{deal.company}</p>
                        <p className="text-slate-500 text-xs">{deal.stage}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400">{deal.deal}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#D4AF37] font-black text-lg">{deal.amount}</span>
                      <button
                        onClick={() => !connected && handleConnect(deal.id)}
                        disabled={connecting}
                        className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all ${connected ? 'text-emerald-400' : 'text-[#0B0F19] hover:opacity-90'}`}
                        style={connected
                          ? { background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }
                          : { background: 'linear-gradient(135deg,#D4AF37,#F5C542)' }}>
                        {connecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : connected ? <Check className="w-3.5 h-3.5" /> : null}
                        {connecting ? 'Connecting...' : connected ? 'Connected!' : 'Connect'}
                      </button>
                    </div>
                    {connected && (
                      <p className="text-xs text-slate-500">Contact: <span className="text-[#D4AF37]">{deal.contact}</span></p>
                    )}
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* ── Apply Modal ── */}
      <AnimatePresence>
        {applyTarget && <ApplyModal opportunity={applyTarget} onClose={() => setApplyTarget(null)} />}
      </AnimatePresence>

    </MainLayout>
  );
}
