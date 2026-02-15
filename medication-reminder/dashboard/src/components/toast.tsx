'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle2; className: string }> = {
  success: {
    icon: CheckCircle2,
    className: 'border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-500/20',
  },
  error: {
    icon: XCircle,
    className: 'border-red-500/30 bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300 dark:border-red-500/20',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-amber-500/30 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-500/20',
  },
  info: {
    icon: Info,
    className: 'border-blue-500/30 bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-500/20',
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => {
          const config = variantConfig[t.variant];
          const Icon = config.icon;
          return (
            <div
              key={t.id}
              className={cn(
                'flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg animate-slide-up',
                config.className
              )}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm flex-1">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
