'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Rocket, Users, TrendingUp, ArrowRight, Sparkles, CheckCircle, Circle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { MainLayout } from '@/layouts/main-layout';
import { MetricCard } from '@/components/cards/metric-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GlassCard } from '@/components/ui/glass-card';
import { MetricCardSkeleton } from '@/components/ui/skeleton-loader';
import { useDashboardStore } from '@/store/dashboardStore';
import { dashboardService } from '@/services/dashboardService';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/utils/helpers';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.4, 0, 0.2, 1] }
  }),
};

export default function DashboardPage() {
  const { metrics, activities, setMetrics, setActivities } = useDashboardStore();
  const { user } = useAuthStore();
  const loading = false;

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [metricsData, activitiesData] = await Promise.all([
          dashboardService.getMetrics(),
          dashboardService.getActivities(),
        ]);
        setMetrics(metricsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };
    loadDashboardData();
  }, [setMetrics, setActivities]);

  const getHourGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8">

        {/* ─── Welcome Banner ─── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative rounded-2xl overflow-hidden px-8 py-7"
            style={{
              background: 'linear-gradient(135deg, rgba(17,24,39,0.95) 0%, rgba(20,30,46,0.9) 100%)',
              border: '1px solid rgba(212,175,55,0.18)',
            }}>
            {/* BG elements */}
            <div className="absolute inset-0 dot-grid opacity-40" style={{ backgroundSize: '24px 24px' }} />
            <div className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse 60% 80% at 90% 50%, rgba(212,175,55,0.08) 0%, transparent 60%)' }} />

            <div className="relative flex items-center justify-between flex-wrap gap-5">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{getHourGreeting()},</p>
                <h1 className="text-2xl md:text-3xl font-black text-white">
                  {user?.name || 'Founder'} <span className="text-[#D4AF37]">✦</span>
                </h1>
                <p className="text-slate-400 text-sm mt-1">Here's your ecosystem overview today.</p>
              </div>

              <div className="flex items-center gap-3">
                <button className="btn-outline-glass flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  Find Co-founder
                </button>
                <button className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold">
                  <Plus className="w-4 h-4" />
                  New Startup
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Metric Cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading ? (
            <>
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
            </>
          ) : (
            <>
              <MetricCard title="Total Matches" value={metrics.totalMatches} trend={metrics.trend.matches} icon="Users" />
              <MetricCard title="Active Startups" value={metrics.activeStartups} trend={metrics.trend.startups} icon="Rocket" />
              <MetricCard title="Investors Interested" value={metrics.investorsInterested} trend={metrics.trend.investors} icon="TrendingUp" />
              <MetricCard title="Mentorship Sessions" value={metrics.mentorshipSessions} trend={metrics.trend.sessions} icon="Calendar" />
            </>
          )}
        </div>

        {/* ─── Activity + Quick Actions ─── */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Recent Activity</h2>
                <button className="text-xs font-semibold text-[#D4AF37] hover:text-[#F5C542] flex items-center gap-1 transition-colors">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {activities.map((activity, i) => {
                  const Icon = Icons[activity.icon] || Icons.Circle;
                  return (
                    <motion.div
                      key={activity.id}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                    >
                      <div className="flex items-start gap-3 p-3.5 rounded-xl transition-all duration-200 group cursor-pointer"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.04)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.15)' }}>
                          <Icon className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white mb-0.5 leading-tight">{activity.title}</p>
                          <p className="text-xs text-slate-400 leading-relaxed mb-1">{activity.description}</p>
                          <p className="text-[11px] text-slate-600">{formatDate(activity.timestamp)}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Quick Actions</h2>
                <span className="tag-gold text-xs">Pro Tips</span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: Plus,
                    title: 'Create New Startup',
                    desc: 'Start building your idea today',
                    primary: true,
                  },
                  {
                    icon: Users,
                    title: 'Find Co-founder',
                    desc: 'Browse AI-matched founders',
                    primary: false,
                  },
                  {
                    icon: Rocket,
                    title: 'Update Startup',
                    desc: 'Track your progress & milestones',
                    primary: false,
                  },
                  {
                    icon: Sparkles,
                    title: 'Founder Intelligence',
                    desc: 'Review your DNA score insights',
                    primary: false,
                  },
                ].map(({ icon: Icon, title, desc, primary }, i) => (
                  <button
                    key={title}
                    className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 group"
                    style={{
                      background: primary ? 'linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(245,197,66,0.1) 100%)' : 'rgba(255,255,255,0.03)',
                      border: primary ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.05)',
                    }}
                    onMouseEnter={e => !primary && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => !primary && (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: primary ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)',
                        border: primary ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.08)',
                      }}>
                      <Icon className="w-4.5 h-4.5" style={{ color: primary ? '#F5C542' : '#94A3B8' }} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm" style={{ color: primary ? '#F5C542' : 'white' }}>{title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  </button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* ─── Startups ─── */}
        <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Your Startups</h2>
                <p className="text-xs text-slate-500 mt-0.5">Track your startup journey</p>
              </div>
              <button className="btn-gold flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold">
                <Plus className="w-3.5 h-3.5" />
                New Startup
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  name: 'AI Insight Pro',
                  stage: 'MVP',
                  stageColor: '#60A5FA',
                  stageBg: 'rgba(96,165,250,0.1)',
                  desc: 'AI-powered analytics for SaaS companies',
                  progress: 65,
                  team: ['A', 'B', 'C'],
                  tags: ['AI/ML', 'SaaS'],
                  milestones: [
                    { title: 'Market Research', done: true },
                    { title: 'MVP Launch', done: true },
                    { title: 'First 100 Users', done: false },
                  ],
                },
                {
                  name: 'EduLearn',
                  stage: 'Idea',
                  stageColor: '#D4AF37',
                  stageBg: 'rgba(212,175,55,0.1)',
                  desc: 'Personalized learning platform for professionals',
                  progress: 20,
                  team: ['S', 'M'],
                  tags: ['EdTech'],
                  milestones: [
                    { title: 'Concept Validation', done: true },
                    { title: 'User Interviews', done: false },
                    { title: 'Prototype Build', done: false },
                  ],
                },
              ].map((startup) => (
                <div key={startup.name}
                  className="rounded-xl p-5 transition-all duration-300 group cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(212,175,55,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white text-base mb-2">{startup.name}</h3>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                        style={{ background: startup.stageBg, color: startup.stageColor }}>
                        {startup.stage}
                      </span>
                    </div>
                    <Rocket className="w-6 h-6 text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">{startup.desc}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-bold text-white">{startup.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${startup.progress}%`,
                          background: 'linear-gradient(90deg, #D4AF37, #F5C542)',
                          boxShadow: '0 0 8px rgba(212,175,55,0.4)',
                        }} />
                    </div>
                  </div>

                  {/* Team */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex -space-x-2">
                      {startup.team.map((initial, idx) => (
                        <div key={idx}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2"
                          style={{
                            background: 'rgba(212,175,55,0.15)',
                            color: '#F5C542',
                            borderColor: '#111827',
                          }}>
                          {initial}
                        </div>
                      ))}
                      <button
                        className="w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)', borderColor: '#111827', color: '#64748b' }}>
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xs text-slate-500">{startup.team.length} members</span>
                  </div>

                  {/* Milestones */}
                  <div className="space-y-1.5">
                    {startup.milestones.map((m) => (
                      <div key={m.title} className="flex items-center gap-2">
                        {m.done
                          ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          : <Circle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />}
                        <span className={`text-xs ${m.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                          {m.title}
                        </span>
                      </div>
                    ))}
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
