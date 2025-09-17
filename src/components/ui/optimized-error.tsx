import { memo } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, RefreshCw, X, AlertTriangle, Info } from 'lucide-react';
import { Button } from './button';

interface OptimizedErrorProps {
  title?: string;
  message: string;
  code?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'error' | 'warning' | 'info';
  showDetails?: boolean;
  details?: any;
  className?: string;
}

const variantConfig = {
  error: {
    icon: AlertCircle,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800'
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800'
  }
};

export const OptimizedError = memo(function OptimizedError({
  title = 'Erro',
  message,
  code,
  onRetry,
  onDismiss,
  variant = 'error',
  showDetails = false,
  details,
  className = ''
}: OptimizedErrorProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        ${config.bgColor} ${config.borderColor} ${config.textColor}
        border rounded-lg p-4 ${className}
      `}
    >
      <div className="flex items-start">
        <Icon className={`h-5 w-5 ${config.iconColor} mt-0.5 mr-3 flex-shrink-0`} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              {title}
              {code && (
                <span className="ml-2 text-xs opacity-75">
                  ({code})
                </span>
              )}
            </h3>
            
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <p className="mt-1 text-sm">
            {message}
          </p>
          
          {showDetails && details && (
            <details className="mt-2">
              <summary className="text-xs cursor-pointer hover:underline">
                Ver detalhes técnicos
              </summary>
              <pre className="mt-2 text-xs bg-black bg-opacity-10 p-2 rounded overflow-auto">
                {JSON.stringify(details, null, 2)}
              </pre>
            </details>
          )}
          
          {onRetry && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Tentar novamente
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// Error boundary component
export const ErrorBoundary = memo(function ErrorBoundary({
  children,
  fallback,
  onError
}: {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: any) => void;
}) {
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  if (error) {
    if (fallback) {
      const FallbackComponent = fallback;
      return <FallbackComponent error={error} reset={reset} />;
    }

    return (
      <OptimizedError
        title="Algo deu errado"
        message={error.message}
        onRetry={reset}
        showDetails={process.env.NODE_ENV === 'development'}
        details={error.stack}
      />
    );
  }

  return <>{children}</>;
});

// Inline error component
export const InlineError = memo(function InlineError({
  message,
  className = ''
}: {
  message: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`text-red-600 text-sm mt-1 ${className}`}
    >
      <div className="flex items-center">
        <AlertCircle className="h-4 w-4 mr-1" />
        {message}
      </div>
    </motion.div>
  );
});

// Toast error component
export const ToastError = memo(function ToastError({
  message,
  onDismiss,
  duration = 5000
}: {
  message: string;
  onDismiss: () => void;
  duration?: number;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-4 right-4 z-50 max-w-sm"
    >
      <OptimizedError
        title="Erro"
        message={message}
        onDismiss={onDismiss}
        variant="error"
      />
    </motion.div>
  );
});

// Network error component
export const NetworkError = memo(function NetworkError({
  onRetry,
  onDismiss
}: {
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <OptimizedError
      title="Erro de Conexão"
      message="Não foi possível conectar ao servidor. Verifique sua conexão com a internet."
      code="NETWORK_ERROR"
      onRetry={onRetry}
      onDismiss={onDismiss}
      variant="error"
    />
  );
});

// Permission error component
export const PermissionError = memo(function PermissionError({
  onRetry,
  onDismiss
}: {
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <OptimizedError
      title="Acesso Negado"
      message="Você não tem permissão para realizar esta ação."
      code="PERMISSION_DENIED"
      onRetry={onRetry}
      onDismiss={onDismiss}
      variant="warning"
    />
  );
});
