'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages or API routes
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/api')) {
      return;
    }

    // Small delay to not block page load
    const timer = setTimeout(() => {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pagePath: pathname,
          referrer: document.referrer || null,
        }),
      }).catch(() => {
        // Silently fail
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
