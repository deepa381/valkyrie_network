import { cn } from '@/lib/utils';

export function GlassCard({ children, className = '', style = {} }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.35)]',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
