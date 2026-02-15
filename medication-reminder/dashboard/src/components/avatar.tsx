'use client';

import { cn } from '@/lib/utils';
import { getInitials, getAvatarColor } from '@/lib/utils';

const sizeMap = {
  sm: 'w-9 h-9 text-sm',
  md: 'w-11 h-11 text-base',
  lg: 'w-16 h-16 text-xl',
};

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name);
  const bg = getAvatarColor(name);

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white shrink-0 ring-2 ring-white dark:ring-card',
        sizeMap[size],
        className
      )}
      style={{ background: bg }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
