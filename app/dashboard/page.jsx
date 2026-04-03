'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Rocket, Users, TrendingUp } from 'lucide-react';
import * as Icons from 'lucide-react';
import { MainLayout } from '@/layouts/main-layout';
import { MetricCard } from '@/components/cards/metric-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MetricCardSkeleton } from '@/components/ui/skeleton-loader';
import { useDashboardStore } from '@/store/dashboardStore';
import { dashboardService } from '@/services/dashboardService';
import { formatDate } from '@/utils/helpers';

export default function DashboardPage() {
  const { metrics, activities, setMetrics, setActivities } = useDashboardStore();
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

  return (
    <MainLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-zinc-400">Welcome back! Here&apos;s your overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            <>
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
            </>
          ) : (
            <>
              <MetricCard
                title="Total Matches"
                value={metrics.totalMatches}
                trend={metrics.trend.matches}
                icon="Users"
              />
              <MetricCard
                title="Active Startups"
                value={metrics.activeStartups}
                trend={metrics.trend.startups}
                icon="Rocket"
              />
              <MetricCard
                title="Investors Interested"
                value={metrics.investorsInterested}
                trend={metrics.trend.investors}
                icon="TrendingUp"
              />
              <MetricCard
                title="Mentorship Sessions"
                value={metrics.mentorshipSessions}
                trend={metrics.trend.sessions}
                icon="Calendar"
              />
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 bg-zinc-900 border-zinc-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-yellow-500 hover:text-yellow-400"
                >
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {activities.map((activity) => {
                  const Icon = Icons[activity.icon] || Icons.Circle;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 bg-black rounded-lg hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <Icon className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium mb-1">{activity.title}</p>
                        <p className="text-sm text-zinc-400 mb-2">
                          {activity.description}
                        </p>
                        <p className="text-xs text-zinc-600">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 bg-zinc-900 border-zinc-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              </div>

              <div className="space-y-3">
                <Button className="w-full justify-start h-auto py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  <Plus className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Create New Startup</div>
                    <div className="text-xs opacity-80">Start building your idea</div>
                  </div>
                </Button>

                <Button className="w-full justify-start h-auto py-4 bg-zinc-800 hover:bg-zinc-700 text-white">
                  <Users className="w-5 h-5 mr-3 text-yellow-500" />
                  <div className="text-left">
                    <div className="font-semibold">Find Co-founder</div>
                    <div className="text-xs text-zinc-400">
                      Browse matched founders
                    </div>
                  </div>
                </Button>

                <Button className="w-full justify-start h-auto py-4 bg-zinc-800 hover:bg-zinc-700 text-white">
                  <Rocket className="w-5 h-5 mr-3 text-yellow-500" />
                  <div className="text-left">
                    <div className="font-semibold">Update Startup</div>
                    <div className="text-xs text-zinc-400">Track your progress</div>
                  </div>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Your Startups</h2>
              <Button
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Startup
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-black rounded-lg border border-zinc-800 hover:border-yellow-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      AI Insight Pro
                    </h3>
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                      MVP
                    </Badge>
                  </div>
                  <Rocket className="w-8 h-8 text-yellow-500" />
                </div>

                <p className="text-sm text-zinc-400 mb-4">
                  AI-powered analytics for SaaS companies
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Progress</span>
                    <span className="text-white font-semibold">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-zinc-800 text-zinc-300"
                  >
                    AI/ML
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-zinc-800 text-zinc-300"
                  >
                    SaaS
                  </Badge>
                </div>
              </div>

              <div className="p-6 bg-black rounded-lg border border-zinc-800 hover:border-yellow-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">EduLearn</h3>
                    <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                      Idea
                    </Badge>
                  </div>
                  <Rocket className="w-8 h-8 text-yellow-500" />
                </div>

                <p className="text-sm text-zinc-400 mb-4">
                  Personalized learning platform for professionals
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Progress</span>
                    <span className="text-white font-semibold">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-zinc-800 text-zinc-300"
                  >
                    EdTech
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}
