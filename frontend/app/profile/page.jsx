'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, MapPin, Mail, Briefcase, Award, Star, ExternalLink } from 'lucide-react';
import * as Icons from 'lucide-react';
import { MainLayout } from '@/layouts/main-layout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GlassCard } from '@/components/ui/glass-card';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/utils/helpers';
import { profileService } from '@/services/profileService';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }
  }),
};

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await profileService.getProfile();
      setProfile(response);
      updateUser(response);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-[rgba(212,175,55,0.15)]" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#D4AF37] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6 lg:p-8">
          <EmptyState
            icon="TriangleAlert"
            title="Failed to load profile"
            description={error}
            actionLabel="Try Again"
            onAction={loadProfile}
          />
        </div>
      </MainLayout>
    );
  }

  const profileData = {
    name: 'User',
    email: '',
    location: '',
    bio: '',
    skills: [],
    experience: [],
    goals: [],
    achievements: [],
    ...(profile || user || {}),
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">

        {/* ─── Profile Header Card ─── */}
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
          <div className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(17,24,39,0.95) 0%, rgba(20,30,46,0.9) 100%)',
              border: '1px solid rgba(212,175,55,0.2)',
            }}>
            {/* Cover */}
            <div className="h-28 relative"
              style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(11,15,25,1) 100%)' }}>
              <div className="absolute inset-0 dot-grid opacity-30" style={{ backgroundSize: '22px 22px' }} />
              {/* Gold glow */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2"
                style={{ background: 'radial-gradient(ellipse at right, rgba(212,175,55,0.15) 0%, transparent 60%)' }} />
            </div>

            <div className="px-8 pb-8 -mt-12">
              <div className="flex flex-col md:flex-row md:items-end gap-6 mb-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-2xl border-4 flex items-center justify-center text-3xl font-black"
                    style={{
                      borderColor: '#0B0F19',
                      background: 'rgba(212,175,55,0.15)',
                      color: '#F5C542',
                      boxShadow: '0 0 0 2px rgba(212,175,55,0.3), 0 0 20px rgba(212,175,55,0.15)',
                    }}>
                    {getInitials(profileData.name)}
                  </div>
                  {/* Online dot */}
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2"
                    style={{ borderColor: '#0B0F19' }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-black text-white mb-1">{profileData.name}</h1>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {profileData.email}
                        </span>
                        {profileData.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                            {profileData.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button className="flex items-center gap-2 flex-shrink-0">
                      <Pencil className="w-3.5 h-3.5" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {profileData.bio && (
                <p className="text-slate-300 text-sm leading-relaxed mb-5 max-w-2xl">{profileData.bio}</p>
              )}

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, i) => (
                  <span key={i} className="tag-gold">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Achievements ─── */}
        {profileData.achievements && profileData.achievements.length > 0 && (
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-600 mb-4">Achievements</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData.achievements.map((achievement, i) => {
                  const Icon = Icons[achievement.icon] || Icons.Award;
                  return (
                    <motion.div
                      key={achievement.id}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <GlassCard className="flex items-center gap-4 p-6 hover:border-[rgba(212,175,55,0.3)] transition-all duration-300 cursor-pointer group">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                          style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}>
                          <Icon className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm">{achievement.title}</h3>
                          {achievement.description && (
                            <p className="text-xs text-slate-500 mt-0.5">{achievement.description}</p>
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Experience + Goals ─── */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Experience */}
          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
            <GlassCard className="h-full p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <Briefcase className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <h2 className="text-base font-bold text-white">Experience</h2>
              </div>
              <div className="space-y-5">
                {profileData.experience.map((exp, i) => (
                  <div key={exp.id}
                    className={`pb-5 ${i < profileData.experience.length - 1 ? 'border-b border-[rgba(255,255,255,0.05)]' : ''}`}>
                    <h3 className="font-bold text-white text-sm mb-1">{exp.title}</h3>
                    <p className="text-[#D4AF37] text-sm font-medium mb-1">{exp.company}</p>
                    <p className="text-xs text-slate-500 mb-2">{exp.duration}</p>
                    {exp.description && (
                      <p className="text-xs text-slate-400 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Goals */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
            <GlassCard className="h-full p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <h2 className="text-base font-bold text-white">Goals & Vision</h2>
              </div>
              <div className="space-y-3">
                {profileData.goals.map((goal, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl"
                    style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.08)' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(212,175,55,0.15)' }}>
                      <Star className="w-2.5 h-2.5 text-[#D4AF37]" />
                    </div>
                    <span className="text-sm text-slate-300 leading-relaxed">{goal}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

      </div>
    </MainLayout>
  );
}
