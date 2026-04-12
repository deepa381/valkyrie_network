import * as React from 'react';
import { cn } from '@/lib/utils';

const GlassInput = React.forwardRef(function GlassInput(
  { className = '', ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-[rgba(212,175,55,0.45)] focus:ring-2 focus:ring-[rgba(212,175,55,0.12)]',
        className
      )}
      {...props}
    />
  );
});

export { GlassInput };
