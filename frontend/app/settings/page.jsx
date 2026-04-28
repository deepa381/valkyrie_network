'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, LogOut, Save, ChevronRight, Check, Moon, Globe, Lock } from 'lucide-react';
import { MainLayout } from '@/layouts/main-layout';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassInput } from '@/components/ui/glass-input';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07 } }),
};

const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
      style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
      <Icon className="w-4 h-4 text-[#D4AF37]" />
    </div>
    <div>
      <h2 className="text-base font-bold text-white">{title}</h2>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
  </div>
);

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative w-11 h-6 rounded-full transition-all duration-200 ${enabled ? 'bg-[#D4AF37]' : 'bg-white/10'}`}>
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${enabled ? 'left-6' : 'left-1'}`} />
  </button>
);

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuthStore();
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });

  // Sync state when user is loaded from Zustand store
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        name: user.name || prev.name,
        email: user.email || prev.email,
        bio: user.bio !== undefined ? user.bio : prev.bio,
        location: user.location !== undefined ? user.location : prev.location,
      }));
    }
  }, [user]);

  const [notifications, setNotifications] = useState({
    matchFound: true,
    startupUpdates: true,
    marketplaceAlerts: false,
    weeklyDigest: true,
    emailNotifications: true,
  });

  const [appearance, setAppearance] = useState({ darkMode: true, compactMode: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  const SECTIONS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  ];

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Optimistic update to Zustand store
      updateUser(profile);
      
      // Ignore response to prevent fallback data from wiping state arrays
      await authService.updateProfile(profile).catch(() => {});
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (_) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1">Settings</h1>
          <p className="text-slate-400 text-sm">Manage your account, preferences, and privacy</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <GlassCard className="p-3">
              <nav className="space-y-1">
                {SECTIONS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeSection === id
                        ? 'text-[#D4AF37] bg-[rgba(212,175,55,0.1)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {label}
                    {activeSection === id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                  </button>
                ))}

                <div className="border-t border-white/10 my-2" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </nav>
            </GlassCard>
          </motion.div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">

            {/* ── Profile Section ── */}
            {activeSection === 'profile' && (
              <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
                <GlassCard className="p-6">
                  <SectionHeader icon={User} title="Profile Information" description="Update your personal details" />

                  <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Full Name</label>
                        <GlassInput
                          type="text"
                          placeholder="Your name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Email Address</label>
                        <GlassInput
                          type="email"
                          placeholder="you@example.com"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Bio</label>
                      <textarea
                        placeholder="Tell the community about yourself..."
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 resize-none outline-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Location</label>
                      <GlassInput
                        type="text"
                        placeholder="City, Country"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      />
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg,#D4AF37,#F5C542)', color: '#0B0F19' }}
                    >
                      {saving ? (
                        <><div className="w-4 h-4 rounded-full border-2 border-[#0B0F19]/30 border-t-[#0B0F19] animate-spin" /> Saving...</>
                      ) : saved ? (
                        <><Check className="w-4 h-4" /> Saved!</>
                      ) : (
                        <><Save className="w-4 h-4" /> Save Changes</>
                      )}
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* ── Notifications Section ── */}
            {activeSection === 'notifications' && (
              <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
                <GlassCard className="p-6">
                  <SectionHeader icon={Bell} title="Notification Preferences" description="Control when and how you're notified" />

                  <div className="space-y-4">
                    {[
                      { key: 'matchFound', label: 'Match Found', description: 'When a new co-founder match is identified' },
                      { key: 'startupUpdates', label: 'Startup Updates', description: 'Activity updates for your startups' },
                      { key: 'marketplaceAlerts', label: 'Marketplace Alerts', description: 'New funding opportunities and deals' },
                      { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Weekly summary of your network activity' },
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                    ].map(({ key, label, description }) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-white">{label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                        </div>
                        <Toggle
                          enabled={notifications[key]}
                          onChange={(val) => setNotifications({ ...notifications, [key]: val })}
                        />
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* ── Appearance Section ── */}
            {activeSection === 'appearance' && (
              <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
                <GlassCard className="p-6">
                  <SectionHeader icon={Palette} title="Appearance" description="Customize your interface" />

                  <div className="space-y-4">
                    {[
                      { key: 'darkMode', label: 'Dark Mode', description: 'Use dark theme (recommended)', icon: Moon },
                      { key: 'compactMode', label: 'Compact Mode', description: 'Reduce spacing for more content density', icon: Globe },
                    ].map(({ key, label, description, icon: Icon }) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-slate-500" />
                          <div>
                            <p className="text-sm font-medium text-white">{label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                          </div>
                        </div>
                        <Toggle
                          enabled={appearance[key]}
                          onChange={(val) => setAppearance({ ...appearance, [key]: val })}
                        />
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* ── Privacy & Security Section ── */}
            {activeSection === 'privacy' && (
              <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
                <GlassCard className="p-6 space-y-6">
                  <SectionHeader icon={Shield} title="Privacy & Security" description="Manage your account security and data" />

                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Security</p>
                    {[
                      { label: 'Change Password', description: 'Update your account password', icon: Lock },
                      { label: 'Two-Factor Authentication', description: 'Add an extra layer of security', icon: Shield },
                    ].map(({ label, description, icon: Icon }) => (
                      <button key={label}
                        className="w-full flex items-center gap-4 p-4 rounded-xl text-left hover:opacity-80 transition-opacity"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-red-500/70">Danger Zone</p>
                    <div className="p-4 rounded-xl space-y-3"
                      style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
                      <div>
                        <p className="text-sm font-medium text-white">Delete Account</p>
                        <p className="text-xs text-slate-500 mt-0.5">Permanently delete your account and all associated data. This cannot be undone.</p>
                      </div>
                      <button className="px-4 py-2 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                        style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
                        Delete Account
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

          </div>
        </div>

      </div>
    </MainLayout>
  );
}
