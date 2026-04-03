'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Save } from 'lucide-react';
import { MainLayout } from '@/layouts/main-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { dummySettings } from '@/utils/dummyData';

export default function SettingsPage() {
  const [settings, setSettings] = useState(dummySettings);
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
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-zinc-400">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 bg-zinc-900 border-zinc-800">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Profile Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-white">Profile Visibility</Label>
                    <p className="text-sm text-zinc-400 mt-1">
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

                <Separator className="bg-zinc-800" />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-white">Show Email</Label>
                    <p className="text-sm text-zinc-400 mt-1">
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

                <Separator className="bg-zinc-800" />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-white">Show Location</Label>
                    <p className="text-sm text-zinc-400 mt-1">
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
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="p-6 bg-zinc-900 border-zinc-800">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Notifications</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-sm text-zinc-400 mt-1">
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

                <Separator className="bg-zinc-800" />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-white">Match Alerts</Label>
                    <p className="text-sm text-zinc-400 mt-1">
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

                <Separator className="bg-zinc-800" />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-white">Weekly Digest</Label>
                    <p className="text-sm text-zinc-400 mt-1">
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

                <Separator className="bg-zinc-800" />

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-white">Investor Alerts</Label>
                    <p className="text-sm text-zinc-400 mt-1">
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
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="p-6 bg-zinc-900 border-zinc-800">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Security</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-white">
                    Current Password
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                    className="bg-black border-zinc-800 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-white">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    className="bg-black border-zinc-800 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    className="bg-black border-zinc-800 text-white"
                  />
                </div>

                <Button
                  variant="outline"
                  className="border-zinc-700 text-white hover:bg-zinc-800"
                >
                  Update Password
                </Button>
              </div>
            </Card>
          </motion.div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              className="border-zinc-700 text-white hover:bg-zinc-900"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
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
