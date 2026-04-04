'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/* Animated counter hook */
function useCounter(target, duration = 1000, inView) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const isFloat = String(target).includes('.');
    const numericTarget = parseFloat(String(target).replace(/[^0-9.]/g, '')) || 0;
    const suffix = String(target).replace(/[0-9.]/g, '');

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * numericTarget;
      setValue(isFloat ? current.toFixed(1) + suffix : Math.floor(current) + suffix);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target, duration]);
  return value || '0';
}

export function MetricCard({ title, value, trend, icon, className = '' }) {
  const Icon = Icons[icon] || Icons.TrendingUp;
  const isPositive = trend?.startsWith('+');
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const displayValue = useCounter(value, 1200, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`group ${className}`}
    >
      <div className="relative rounded-2xl p-6 h-full overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(17,24,39,0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Hover border glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.25)' }} />

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full"
            style={{ background: 'radial-gradient(circle at top right, rgba(212,175,55,0.12) 0%, transparent 70%)' }} />
        </div>

        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">{title}</p>
            <p className="text-3xl font-black text-white mb-2 leading-none">{displayValue}</p>
            {trend && (
              <div className="flex items-center gap-1.5">
                <div className={`flex items-center gap-0.5 text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive
                    ? <TrendingUp className="w-3 h-3" />
                    : <TrendingDown className="w-3 h-3" />}
                  {trend}
                </div>
                <span className="text-[11px] text-slate-600">vs last month</span>
              </div>
            )}
          </div>

          {/* Icon Box */}
          <div className="relative flex-shrink-0 ml-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                background: 'rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.2)',
              }}>
              <Icon className="w-5 h-5 text-[#D4AF37]" />
            </div>
            {/* Icon glow */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: '0 0 20px rgba(212,175,55,0.25)' }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
