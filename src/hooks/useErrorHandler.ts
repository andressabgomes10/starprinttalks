import { useState, useCallback, useRef } from 'react';

interface ErrorState {
  message: string;
  code?: string;
  details?: any;
  timestamp: number;
}

interface UseErrorHandlerReturn {
  error: ErrorState | null;
  setError: (error: Error | string, code?: string, details?: any) => void;
  clearError: () => void;
  handleError: (error: Error | string, code?: string, details?: any) => void;
  isError: (code?: string) => boolean;
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setErrorState] = useState<ErrorState | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setError = useCallback((
    error: Error | string,
    code?: string,
    details?: any
  ) => {
    const errorMessage = error instanceof Error ? error.message : error;
    
    setErrorState({
      message: errorMessage,
      code,
      details,
      timestamp: Date.now()
    });

    // Auto-clear error after 5 seconds
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    
    errorTimeoutRef.current = setTimeout(() => {
      setErrorState(null);
    }, 5000);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
  }, []);

  const handleError = useCallback((
    error: Error | string,
    code?: string,
    details?: any
  ) => {
    console.error('Error handled:', { error, code, details });
    setError(error, code, details);
  }, [setError]);

  const isError = useCallback((code?: string) => {
    if (!error) return false;
    if (!code) return true;
    return error.code === code;
  }, [error]);

  return {
    error,
    setError,
    clearError,
    handleError,
    isError
  };
}

// Hook for managing form errors
export function useFormErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getFieldError = useCallback((field: string) => {
    return errors[field];
  }, [errors]);

  const hasErrors = useCallback(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  const hasFieldError = useCallback((field: string) => {
    return !!errors[field];
  }, [errors]);

  return {
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    getFieldError,
    hasErrors,
    hasFieldError
  };
}

// Hook for managing API errors
export function useApiErrorHandler() {
  const { error, setError, clearError, handleError, isError } = useErrorHandler();

  const handleApiError = useCallback((error: any) => {
    let message = 'Erro desconhecido';
    let code = 'UNKNOWN_ERROR';

    if (error?.response?.data?.message) {
      message = error.response.data.message;
      code = error.response.data.code || 'API_ERROR';
    } else if (error?.message) {
      message = error.message;
      code = error.code || 'NETWORK_ERROR';
    } else if (typeof error === 'string') {
      message = error;
      code = 'CUSTOM_ERROR';
    }

    handleError(message, code, {
      originalError: error,
      status: error?.response?.status,
      url: error?.config?.url
    });
  }, [handleError]);

  const handleSupabaseError = useCallback((error: any) => {
    let message = 'Erro no banco de dados';
    let code = 'SUPABASE_ERROR';

    if (error?.message) {
      message = error.message;
      code = error.code || 'SUPABASE_ERROR';
    }

    handleError(message, code, {
      originalError: error,
      details: error?.details,
      hint: error?.hint
    });
  }, [handleError]);

  return {
    error,
    setError,
    clearError,
    handleError,
    isError,
    handleApiError,
    handleSupabaseError
  };
}
