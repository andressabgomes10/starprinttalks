import React, { useState, useCallback, useEffect } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

const toasts: Toast[] = [];
const listeners: Array<(toasts: Toast[]) => void> = [];

let toastId = 0;

function addToast(toast: Omit<Toast, 'id'>) {
  const id = (++toastId).toString();
  const newToast = { ...toast, id };
  toasts.push(newToast);
  
  listeners.forEach(listener => listener([...toasts]));
  
  // Remove toast after 5 seconds
  setTimeout(() => {
    removeToast(id);
  }, 5000);
  
  return id;
}

function removeToast(id: string) {
  const index = toasts.findIndex(toast => toast.id === id);
  if (index > -1) {
    toasts.splice(index, 1);
    listeners.forEach(listener => listener([...toasts]));
  }
}

export function useToast() {
  const [toastList, setToastList] = useState<Toast[]>([...toasts]);

  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const toast = useCallback((toast: Omit<Toast, 'id'>) => {
    return addToast(toast);
  }, []);

  const dismiss = useCallback((id: string) => {
    removeToast(id);
  }, []);

  // Subscribe to toast changes
  useEffect(() => {
    const unsubscribe = subscribe(setToastList);
    return unsubscribe;
  }, [subscribe]);

  return {
    toast,
    dismiss,
    toasts: toastList,
  };
}