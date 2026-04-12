'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Icons from 'lucide-react';
import { NAVIGATION_LINKS } from '@/utils/constants';
import { cn } from '@/lib/utils';

export function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar Panel */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 h-full w-64 z-50 lg:translate-x-0 flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #0D1117 0%, #0B0F19 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="flex-shrink-0 px-5 py-5 border-b border-[rgba(255,255,255,0.05)]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F5C542] group-hover:shadow-gold-sm transition-all duration-300" />
              <Icons.Zap className="w-5 h-5 text-[#0B0F19] relative z-10 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight leading-none">VALKYRIE</span>
              <span className="text-[10px] text-[#D4AF37] block leading-none tracking-widest font-medium mt-0.5">NETWORK</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {/* Nav label */}
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-3">Menu</p>

          <ul className="space-y-1">
            {NAVIGATION_LINKS.map((link) => {
              const Icon = Icons[link.icon] || Icons.Circle;
              const isActive = pathname === link.href;

              return (
                <li key={link.href}>
                  <Link
                    href={link.disabled ? '#' : link.href}
                    onClick={(e) => {
                      if (link.disabled) e.preventDefault();
                      onClose?.();
                    }}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group',
                      isActive
                        ? 'text-[#F5C542]'
                        : link.disabled
                        ? 'text-slate-700 cursor-not-allowed'
                        : 'text-slate-400 hover:text-white'
                    )}
                    style={isActive ? {
                      background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(245,197,66,0.07) 100%)',
                      border: '1px solid rgba(212,175,55,0.25)',
                      boxShadow: '0 0 20px rgba(212,175,55,0.08)',
                    } : undefined}
                  >
                    {/* Left accent bar for active */}
                    {isActive && (
                      <motion.div
                        layoutId="activeBar"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                        style={{ background: 'linear-gradient(to bottom, #D4AF37, #F5C542)' }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    {/* Icon */}
                    <div className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                      isActive
                        ? ''
                        : link.disabled
                        ? ''
                        : 'group-hover:bg-white/5'
                    )}
                      style={isActive ? { background: 'rgba(212,175,55,0.12)' } : undefined}
                    >
                      <Icon className={cn(
                        'w-4 h-4',
                        isActive ? 'text-[#D4AF37]' : link.disabled ? 'text-slate-700' : 'text-slate-400 group-hover:text-white'
                      )} />
                    </div>

                    <span className="flex-1">{link.name}</span>

                    {link.disabled && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#475569', border: '1px solid rgba(255,255,255,0.05)' }}>
                        Soon
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Upgrade Card */}
        <div className="flex-shrink-0 p-4 border-t border-[rgba(255,255,255,0.05)]">
          <div className="relative rounded-2xl overflow-hidden p-4 animate-border-glow"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(245,197,66,0.05) 100%)',
              border: '1px solid rgba(212,175,55,0.2)',
            }}>
            {/* Pattern */}
            <div className="absolute inset-0 dot-grid opacity-30" style={{ backgroundSize: '20px 20px' }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Icons.Crown className="w-4 h-4 text-[#D4AF37]" />
                <p className="text-sm font-bold text-white">Upgrade to Pro</p>
              </div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Unlock AI matching, advanced analytics & premium features.
              </p>
              <button className="w-full py-2 rounded-xl text-xs font-bold btn-gold">
                Upgrade Now ✦
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(7,9,15,0.7)', backdropFilter: 'blur(4px)' }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
