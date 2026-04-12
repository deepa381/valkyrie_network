'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Rocket,
  Users,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Circle,
} from 'lucide-react';
import * as Icons from 'lucide-react';

import { MainLayout } from '@/layouts/main-layout';
import { MetricCard } from '@/components/cards/metric-card';
import { GlassCard } from '@/components/ui/glass-card';
import { MetricCardSkeleton } from '@/components/ui/skeleton-loader';
import { EmptyState } from '@/components/ui/empty-state';

import { useDashboardStore } from '@/store/dashboardStore';
import { dashboardService } from '@/services/dashboardService';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/utils/helpers';

/* ─── Animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.07,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

export default function DashboardPage() {
  // 🔥 CRITICAL FIX — prevent SSR crash
  const [mounted, setMounted] = useState(false);

  const { metrics, activities, setMetrics, setActivities } =
    useDashboardStore();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ensure client render only
  useEffect(() => {
    setMounted(true);
  }, []);

  // fetch data only after mount
  useEffect(() => {
    if (!mounted) return;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const [metricsData, activitiesData] = await Promise.all([
          dashboardService.getMetrics(),
          dashboardService.getActivities(),
        ]);

        setMetrics(metricsData);
        setActivities(activitiesData);
      } catch (err) {
        setError(err?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [mounted, setMetrics, setActivities]);

  // block SSR render
  if (!mounted) return null;

  const getHourGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-8">

        {/* Welcome */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="p-6 rounded-xl bg-black/40 border border-yellow-500/20">
            <h1 className="text-xl font-bold text-white">
              {getHourGreeting()}, {user?.name || 'Founder'}
            </h1>
            <p className="text-gray-400 text-sm">
              Here's your dashboard overview.
            </p>
          </div>
        </motion.div>

        {/* Metrics */}
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
              <MetricCard title="Matches" value={metrics?.totalMatches || 0} />
              <MetricCard title="Startups" value={metrics?.activeStartups || 0} />
              <MetricCard title="Investors" value={metrics?.investorsInterested || 0} />
              <MetricCard title="Sessions" value={metrics?.mentorshipSessions || 0} />
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <EmptyState title="Error" description={error} />
        )}

        {/* Activity */}
        <GlassCard className="p-6">
          <h2 className="text-white font-bold mb-4">Recent Activity</h2>

          {activities?.length === 0 ? (
            <EmptyState title="No activity" />
          ) : (
            activities.map((a) => {
              const Icon = Icons[a.icon] || Icons.Circle;
              return (
                <div key={a.id} className="flex gap-3 mb-3">
                  <Icon className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="text-white text-sm">{a.title}</p>
                    <p className="text-xs text-gray-400">
                      {formatDate(a.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </GlassCard>

      </div>
    </MainLayout>
  );
}