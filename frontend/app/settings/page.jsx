'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Save, Sparkles } from 'lucide-react';
import { MainLayout } from '@/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { GlassInput } from '@/components/ui/glass-input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { GlassCard } from '@/components/ui/glass-card';

const defaultSettings = {
  profile: {
    visibility: 'public',
    showEmail: false,
    showLocation: true,
  },
  notifications: {
    emailNotifications: true,
    matchAlerts: true,
    weeklyDigest: true,
    investorAlerts: true,
  },
  privacy: {
    profileVisible: true,
    showActivity: true,
    allowMessages: true,
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSetting = (category, key, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    });
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="tag-gold text-xs">Account Controls</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account, security, and preferences</p>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-xl font-bold text-white">Profile Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-white text-sm font-semibold">Profile Visibility</label>
                    <p className="text-sm text-slate-400 mt-1">
                      Make your profile visible to other founders
                    </p>
                  </div>
                  <Switch
                    checked={settings.profile.visibility === 'public'}
                    onCheckedChange={(checked) =>
                      updateSetting('profile', 'visibility', checked ? 'public' : 'private')
                    }
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-white text-sm font-semibold">Show Email</label>
                    <p className="text-sm text-slate-400 mt-1">
                      Display your email on your profile
                    </p>
                  </div>
                  <Switch
                    checked={settings.profile.showEmail}
                    onCheckedChange={(checked) =>
                      updateSetting('profile', 'showEmail', checked)
                    }
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-white text-sm font-semibold">Show Location</label>
                    <p className="text-sm text-slate-400 mt-1">
                      Display your location on your profile
                    </p>
                  </div>
                  <Switch
                    checked={settings.profile.showLocation}
                    onCheckedChange={(checked) =>
                      updateSetting('profile', 'showLocation', checked)
                    }
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-xl font-bold text-white">Notifications</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-white text-sm font-semibold">Email Notifications</label>
                    <p className="text-sm text-slate-400 mt-1">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting('notifications', 'emailNotifications', checked)
                    }
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-white text-sm font-semibold">Match Alerts</label>
                    <p className="text-sm text-slate-400 mt-1">
                      Get notified when you have new matches
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.matchAlerts}
                    onCheckedChange={(checked) =>
                      updateSetting('notifications', 'matchAlerts', checked)
                    }
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-white text-sm font-semibold">Weekly Digest</label>
                    <p className="text-sm text-slate-400 mt-1">
                      Receive a weekly summary of your activity
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.weeklyDigest}
                    onCheckedChange={(checked) =>
                      updateSetting('notifications', 'weeklyDigest', checked)
                    }
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-white text-sm font-semibold">Investor Alerts</label>
                    <p className="text-sm text-slate-400 mt-1">
                      Get notified when investors view your profile
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.investorAlerts}
                    onCheckedChange={(checked) =>
                      updateSetting('notifications', 'investorAlerts', checked)
                    }
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-xl font-bold text-white">Security</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="current-password" className="text-white text-sm font-semibold">
                    Current Password
                  </label>
                  <GlassInput
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-white text-sm font-semibold">
                    New Password
                  </label>
                  <GlassInput
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-white text-sm font-semibold">
                    Confirm New Password
                  </label>
                  <GlassInput
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>

                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                  Update Password
                </Button>
              </div>
            </GlassCard>
          </motion.div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="btn-gold text-black font-semibold"
            >
              <Save className="w-4 h-4 mr-2" />
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
