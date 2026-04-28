'use client';

import { motion } from 'framer-motion';
import { MapPin, Sparkles, Eye, Check, Loader2 } from 'lucide-react';
import { getInitials } from '@/utils/helpers';

export function MatchCard({ match, onConnect, onViewProfile, connected = false, connecting = false, className = '' }) {
  const scoreColor =
    match.matchScore >= 90 ? '#34D399' :
    match.matchScore >= 75 ? '#60A5FA' :
    match.matchScore >= 60 ? '#D4AF37' :
    '#F97316';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`group ${className}`}
    >
      <div className="relative rounded-2xl p-5 h-full flex flex-col overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(17,24,39,0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Hover border glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.3)' }} />

        {/* Background corner gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, rgba(212,175,55,0.08) 0%, transparent 70%)' }} />

        {/* Header: Avatar + Score + Info */}
        <div className="flex items-start gap-4 mb-4 relative z-10">
          {/* Avatar with match score badge */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-lg font-black"
              style={{
                borderColor: 'rgba(212,175,55,0.4)',
                background: 'rgba(212,175,55,0.1)',
                color: '#F5C542',
              }}>
              {getInitials(match.name)}
            </div>
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#111827]" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-base leading-tight mb-0.5 truncate">{match.name}</h3>
            <p className="text-sm font-medium mb-1" style={{ color: '#D4AF37' }}>{match.role}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{match.location}</span>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative w-16 h-16">
              {/* SVG Circle */}
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32" cy="32" r="26"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="4"
                />
                <circle
                  cx="32" cy="32" r="26"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - match.matchScore / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 4px ${scoreColor}60)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-black text-white leading-none">{match.matchScore}%</span>
                <span className="text-[8px] text-slate-500 leading-none mt-0.5">match</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2 relative z-10">
          {match.bio}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-5 relative z-10">
          {match.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="tag-glass text-xs">
              {skill}
            </span>
          ))}
          {match.skills.length > 3 && (
            <span className="tag-glass text-xs">
              +{match.skills.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto relative z-10">
          <button
            onClick={() => onConnect(match)}
            disabled={connected || connecting}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              connected ? '' : connecting ? 'opacity-80' : 'btn-gold'
            }`}
            style={connected ? {
              background: 'rgba(52,211,153,0.15)',
              border: '1px solid rgba(52,211,153,0.3)',
              color: '#34D399',
            } : connecting ? {
              background: 'rgba(212,175,55,0.2)',
              border: '1px solid rgba(212,175,55,0.3)',
              color: '#D4AF37',
            } : undefined}
          >
            {connecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
             connected ? <Check className="w-3.5 h-3.5" /> :
             <Sparkles className="w-3.5 h-3.5" />}
            {connecting ? 'Sending…' : connected ? 'Connected!' : 'Connect'}
          </button>
          <button
            onClick={() => onViewProfile(match)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 btn-outline-glass"
          >
            <Eye className="w-3.5 h-3.5" />
            Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
}
