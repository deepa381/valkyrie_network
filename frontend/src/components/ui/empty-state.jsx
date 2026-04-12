'use client';

import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyState({
  icon = 'Inbox',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) {
  const Icon = Icons[icon] || Icons.Inbox;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <div className="p-4 bg-zinc-800/50 rounded-full mb-4">
        <Icon className="w-12 h-12 text-zinc-500" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 mb-6 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
