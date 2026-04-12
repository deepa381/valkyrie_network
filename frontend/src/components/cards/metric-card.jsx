'use client';

import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Card } from '@/components/ui/card';

export function MetricCard({ title, value, trend, icon, className = '' }) {
  const Icon = Icons[icon] || Icons.TrendingUp;
  const isPositive = trend?.startsWith('+');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className={`p-6 bg-zinc-900 border-zinc-800 hover:border-yellow-500/50 transition-all ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-zinc-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-white mb-2">{value}</p>
            {trend && (
              <div className="flex items-center gap-1">
                <span
                  className={`text-sm font-medium ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {trend}
                </span>
                <span className="text-xs text-zinc-500">vs last month</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-yellow-500/10 rounded-lg">
            <Icon className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
