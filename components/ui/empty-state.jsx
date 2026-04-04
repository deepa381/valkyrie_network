'use client';

import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';

export function EmptyState({
  icon = 'Inbox',
  title,
  description,
  actionLabel,
  onAction,
  size = 'page',
  className = '',
}) {
  const Icon = Icons[icon] || Icons.Inbox;
  const isCompact = size === 'compact';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={`flex flex-col items-center justify-center text-center ${
        isCompact ? 'py-8 px-5' : 'py-20 px-6'
      } ${className}`}
    >
      {/* Icon with layered glow rings */}
      <div className={isCompact ? 'relative mb-5' : 'relative mb-8'}>
        {/* Outer pulse ring */}
        <div className="absolute inset-0 rounded-full animate-pulse-gold"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
            width: isCompact ? '115%' : '120%',
            height: isCompact ? '115%' : '120%',
            top: isCompact ? '-7.5%' : '-10%',
            left: isCompact ? '-7.5%' : '-10%',
          }} />
        {/* Middle ring */}
        <div className={`${isCompact ? 'w-16 h-16 rounded-xl' : 'w-20 h-20 rounded-2xl'} flex items-center justify-center`}
          style={{
            background: 'rgba(212,175,55,0.06)',
            border: '1px solid rgba(212,175,55,0.15)',
            boxShadow: '0 0 30px rgba(212,175,55,0.08)',
          }}>
          {/* Inner ring */}
          <div className={`${isCompact ? 'w-11 h-11 rounded-lg' : 'w-14 h-14 rounded-xl'} flex items-center justify-center`}
            style={{
              background: 'rgba(212,175,55,0.1)',
              border: '1px solid rgba(212,175,55,0.2)',
            }}>
            <Icon className={`${isCompact ? 'w-5 h-5' : 'w-7 h-7'} text-[#D4AF37]`}
              style={{ filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.5))' }} />
          </div>
        </div>
      </div>

      {/* Text */}
      <h3 className={`${isCompact ? 'text-base' : 'text-xl'} font-black text-white mb-2 leading-tight`}>{title}</h3>
      <p className={`${isCompact ? 'text-xs mb-5' : 'text-sm mb-8'} text-slate-400 leading-relaxed max-w-sm`}>{description}</p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={`btn-gold inline-flex items-center gap-2 ${
            isCompact ? 'px-4 py-2 text-xs rounded-lg' : 'px-6 py-3 text-sm rounded-xl'
          } font-bold`}
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}
