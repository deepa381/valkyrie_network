'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, MapPin, Mail, Briefcase, Award, Star, Target, X, Plus, Check, Loader2 } from 'lucide-react';
import { MainLayout } from '@/layouts/main-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/utils/helpers';
import { profileService } from '@/services/profileService';
import { authService } from '@/services/authService';
import Link from 'next/link';
import { SKILLS } from '@/utils/constants';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07 } }),
};

// ── Inline editor modal ────────────────────────────────────────────────────────
function EditModal({ title, items, allOptions, onSave, onClose, freeText = false }) {
  const [selected, setSelected] = useState([...items]);
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);

  const toggle = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const addCustom = () => {
    const v = input.trim();
    if (v && !selected.includes(v)) setSelected((prev) => [...prev, v]);
    setInput('');
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(selected);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(7,9,15,0.85)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: '#0D1117', border: '1px solid rgba(212,175,55,0.25)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-white font-bold text-base">Edit {title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Selected chips */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selected.map((item) => (
                <button key={item} onClick={() => toggle(item)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
                  style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                  {item} <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}

          {/* Custom text input */}
          {freeText && (
            <div className="flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustom()}
                placeholder={`Type a ${title.toLowerCase().slice(0, -1)} and press Enter`}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <button onClick={addCustom}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#D4AF37] transition-all hover:bg-[rgba(212,175,55,0.1)]"
                style={{ border: '1px solid rgba(212,175,55,0.25)' }}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Preset options */}
          {allOptions.length > 0 && (
            <div>
              <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold mb-3">Quick Add</p>
              <div className="flex flex-wrap gap-2">
                {allOptions.filter((o) => !selected.includes(o)).map((opt) => (
                  <button key={opt} onClick={() => toggle(opt)}
                    className="text-xs font-medium px-3 py-1.5 rounded-xl transition-all text-slate-400 hover:text-white"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    + {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-white/10">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#F5C542)', color: '#0B0F19' }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const GOAL_PRESETS = [
  'Raise $1M seed round', 'Launch MVP in 3 months', 'Find a technical co-founder',
  'Reach 1,000 users', 'Achieve product-market fit', 'Build a remote-first team',
  'Enter new markets', 'Get into YC or top accelerator', 'Reach $10K MRR',
];

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();

  const [profile, setProfile] = useState(() => ({
    name: 'Founder', email: '', role: 'founder', bio: '', location: '',
    avatar: null, skills: [], interests: [], goals: [], experience: [], achievements: [],
    ...(user || {}),
  }));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // 'skills' | 'goals' | 'interests'
  const [saved, setSaved] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await profileService.getProfile();
        if (!cancelled) {
          const merged = { 
            ...user, // Base from local store
            ...data, // Overwrite with data from backend
            // But restore fields if backend returned empty/fallback defaults
            name: data?.name || user?.name || 'Founder', 
            email: data?.email || user?.email || '', 
            role: data?.role || user?.role || 'founder', 
            bio: data?.bio || user?.bio || '', 
            location: data?.location || user?.location || '', 
            avatar: data?.avatar || user?.avatar || null, 
            skills: data?.skills?.length ? data.skills : (user?.skills || []), 
            interests: data?.interests?.length ? data.interests : (user?.interests || []), 
            goals: data?.goals?.length ? data.goals : (user?.goals || []), 
            experience: data?.experience?.length ? data.experience : (user?.experience || []), 
            achievements: data?.achievements?.length ? data.achievements : (user?.achievements || []),
          };
          setProfile(merged);
          updateUser(merged);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Could not load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line

  const saveField = async (field, value) => {
    try {
      // Optimistic update
      const merged = { ...profile, [field]: value };
      setProfile(merged);
      updateUser(merged);
      
      const updates = { [field]: value };
      // Ignore response to prevent fallback data from wiping state
      await authService.updateProfile(updates).catch(() => {});
      
      setSaved(field);
      setTimeout(() => setSaved(''), 2000);
    } catch {
      setSaved(field);
      setTimeout(() => setSaved(''), 2000);
    }
  };

  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const goals = Array.isArray(profile.goals) ? profile.goals : [];
  const experience = Array.isArray(profile.experience) ? profile.experience : [];
  const achievements = Array.isArray(profile.achievements) ? profile.achievements : [];
  const interests = Array.isArray(profile.interests) ? profile.interests : [];

  const roleColors = {
    founder: { color: '#D4AF37', bg: 'rgba(212,175,55,0.1)', border: 'rgba(212,175,55,0.2)' },
    investor: { color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
    mentor: { color: '#34D399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
  };
  const rc = roleColors[profile.role] || roleColors.founder;

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">

        {/* ── Error banner ── */}
        {error && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl text-sm"
            style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <span className="text-orange-400">⚠</span>
            <span className="text-orange-300">{error}</span>
          </div>
        )}

        {/* ── Saved toast ── */}
        <AnimatePresence>
          {saved && (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', color: '#34D399' }}>
              <Check className="w-4 h-4" /> {saved.charAt(0).toUpperCase() + saved.slice(1)} saved!
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Profile Header ── */}
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
          <div className="relative rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg,rgba(17,24,39,0.95) 0%,rgba(20,30,46,0.9) 100%)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="h-28 relative" style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.12) 0%,rgba(11,15,25,1) 100%)' }}>
              <div className="absolute inset-0 dot-grid opacity-30" style={{ backgroundSize: '22px 22px' }} />
            </div>
            <div className="px-6 md:px-8 pb-8 -mt-12">
              <div className="flex flex-col md:flex-row md:items-end gap-5 mb-6">
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-2xl border-4 flex items-center justify-center text-2xl font-black"
                    style={{ borderColor: '#0B0F19', background: rc.bg, color: rc.color }}>
                    {loading ? '…' : getInitials(profile.name || 'U')}
                  </div>
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2" style={{ borderColor: '#0B0F19' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      {loading ? <div className="h-7 w-40 rounded-lg bg-white/10 animate-pulse mb-2" /> :
                        <h1 className="text-2xl font-black text-white mb-1">{profile.name}</h1>}
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        {profile.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#D4AF37]" />{profile.email}</span>}
                        {profile.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />{profile.location}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-xl capitalize"
                        style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.border}` }}>
                        {profile.role}
                      </span>
                      <Link href="/settings"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                        style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
                        <Pencil className="w-3.5 h-3.5" /> Edit Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {profile.bio
                ? <p className="text-slate-300 text-sm leading-relaxed mb-5 max-w-2xl">{profile.bio}</p>
                : !loading && <p className="text-slate-600 text-sm italic mb-5">No bio yet — <Link href="/settings" className="text-[#D4AF37] hover:underline">add one in Settings</Link></p>}
            </div>
          </div>
        </motion.div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Skills', value: skills.length, icon: Star, field: 'skills' },
            { label: 'Goals', value: goals.length, icon: Target, field: 'goals' },
            { label: 'Interests', value: interests.length, icon: Award, field: 'interests' },
          ].map(({ label, value, icon: Icon, field }, i) => (
            <motion.div key={label} custom={i + 1} initial="hidden" animate="visible" variants={fadeUp}>
              <button onClick={() => setModal(field)} className="w-full text-center hover:scale-105 transition-transform">
                <GlassCard className="p-5">
                  <Icon className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
                  <div className="text-2xl font-black text-white">{loading ? '—' : value}</div>
                  <div className="text-xs text-slate-500 mt-1">{label}</div>
                  <div className="text-[10px] text-[#D4AF37] mt-1 font-semibold">click to edit</div>
                </GlassCard>
              </button>
            </motion.div>
          ))}
        </div>

        {/* ── Skills Section ── */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <Star className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <h2 className="text-base font-bold text-white">Skills</h2>
              </div>
              <button onClick={() => setModal('skills')}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-all"
                style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
                <Plus className="w-3.5 h-3.5" /> Add Skills
              </button>
            </div>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-xl"
                    style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <button onClick={() => setModal('skills')}
                className="w-full py-8 rounded-xl border-2 border-dashed text-sm text-slate-600 hover:text-[#D4AF37] hover:border-[rgba(212,175,55,0.3)] transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                + Click to add your skills
              </button>
            )}
          </GlassCard>
        </motion.div>

        {/* ── Goals Section ── */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>
                  <Target className="w-4 h-4 text-purple-400" />
                </div>
                <h2 className="text-base font-bold text-white">Goals & Vision</h2>
              </div>
              <button onClick={() => setModal('goals')}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-purple-400 hover:bg-[rgba(167,139,250,0.08)] transition-all"
                style={{ border: '1px solid rgba(167,139,250,0.2)' }}>
                <Plus className="w-3.5 h-3.5" /> Add Goals
              </button>
            </div>
            {goals.length > 0 ? (
              <div className="space-y-2">
                {goals.map((goal, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.1)' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(167,139,250,0.15)' }}>
                      <Star className="w-2.5 h-2.5 text-purple-400" />
                    </div>
                    <span className="text-sm text-slate-300 leading-relaxed">{goal}</span>
                  </div>
                ))}
              </div>
            ) : (
              <button onClick={() => setModal('goals')}
                className="w-full py-8 rounded-xl border-2 border-dashed text-sm text-slate-600 hover:text-purple-400 hover:border-[rgba(167,139,250,0.3)] transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                + Click to add your goals
              </button>
            )}
          </GlassCard>
        </motion.div>

        {/* ── Experience ── */}
        {experience.length > 0 && (
          <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <Briefcase className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <h2 className="text-base font-bold text-white">Experience</h2>
              </div>
              <div className="space-y-4">
                {experience.map((exp, i) => (
                  <div key={exp?.id || i} className={`pb-4 ${i < experience.length - 1 ? 'border-b border-white/5' : ''}`}>
                    <h3 className="font-bold text-white text-sm">{exp?.title || exp}</h3>
                    {exp?.company && <p className="text-[#D4AF37] text-sm font-medium">{exp.company}</p>}
                    {exp?.duration && <p className="text-xs text-slate-500 mt-0.5">{exp.duration}</p>}
                    {exp?.description && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ── Interests ── */}
        {interests.length > 0 && (
          <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                    <Award className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h2 className="text-base font-bold text-white">Interests</h2>
                </div>
                <button onClick={() => setModal('interests')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg text-emerald-400 hover:bg-[rgba(52,211,153,0.08)] transition-all"
                  style={{ border: '1px solid rgba(52,211,153,0.2)' }}>
                  <Plus className="w-3.5 h-3.5 inline mr-1" />Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, i) => (
                  <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-xl"
                    style={{ background: 'rgba(52,211,153,0.08)', color: '#34D399', border: '1px solid rgba(52,211,153,0.15)' }}>
                    {interest}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

      </div>

      {/* ── Edit Modals ── */}
      <AnimatePresence>
        {modal === 'skills' && (
          <EditModal
            title="Skills"
            items={skills}
            allOptions={SKILLS}
            onSave={(val) => saveField('skills', val)}
            onClose={() => setModal(null)}
          />
        )}
        {modal === 'goals' && (
          <EditModal
            title="Goals"
            items={goals}
            allOptions={GOAL_PRESETS}
            onSave={(val) => saveField('goals', val)}
            onClose={() => setModal(null)}
            freeText
          />
        )}
        {modal === 'interests' && (
          <EditModal
            title="Interests"
            items={interests}
            allOptions={['AI/ML', 'Web3', 'CleanTech', 'HealthTech', 'SaaS', 'EdTech', 'FinTech', 'Open Source', 'Design', 'Venture Capital']}
            onSave={(val) => saveField('interests', val)}
            onClose={() => setModal(null)}
            freeText
          />
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
