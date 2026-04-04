import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(212,175,55,0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F19] disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        /* Gold primary — the main action button */
        default:
          'bg-gradient-to-br from-[#D4AF37] to-[#F5C542] text-[#0B0F19] font-bold shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.5)] hover:-translate-y-0.5 active:translate-y-0',
        /* Destructive */
        destructive:
          'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15 hover:border-red-500/30',
        /* Glass outline */
        outline:
          'bg-white/5 backdrop-blur-sm border border-white/10 text-slate-200 hover:bg-white/[0.08] hover:border-[rgba(212,175,55,0.3)] hover:text-white',
        /* Subtle secondary */
        secondary:
          'bg-white/5 text-slate-300 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white',
        /* Ghost */
        ghost:
          'text-slate-400 hover:text-white hover:bg-white/5',
        /* Gold text link */
        link:
          'text-[#D4AF37] underline-offset-4 hover:text-[#F5C542] hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 rounded-lg px-3.5 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-base font-bold',
        icon: 'h-9 w-9 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
