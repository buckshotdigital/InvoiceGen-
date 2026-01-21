'use client';

import { ToastContainer } from './Toast';
import { useToastContext } from '@/contexts/ToastContext';

export function ToastManager() {
  const { toasts, dismissToast } = useToastContext();
  return <ToastContainer toasts={toasts} onDismiss={dismissToast} />;
}
