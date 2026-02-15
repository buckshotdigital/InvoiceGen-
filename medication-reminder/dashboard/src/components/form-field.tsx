'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

// ─── FormField ───────────────────────────────────────────

interface FormFieldProps {
  label: string;
  error?: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, error, helper, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
      {!error && helper && <p className="text-xs text-muted-foreground">{helper}</p>}
    </div>
  );
}

// ─── Input ───────────────────────────────────────────────

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full px-4 py-2.5 rounded-xl border border-border/60 bg-background text-[15px] text-foreground placeholder:text-muted-foreground',
      'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition-colors',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

// ─── Select ──────────────────────────────────────────────

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'w-full px-4 py-2.5 rounded-xl border border-border/60 bg-background text-[15px] text-foreground',
      'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition-colors',
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';

// ─── Button ──────────────────────────────────────────────

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        secondary: 'bg-white dark:bg-card border border-border/60 text-foreground hover:bg-muted/50',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        outline: 'border border-border/60 bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-11 px-4',
        lg: 'h-12 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
