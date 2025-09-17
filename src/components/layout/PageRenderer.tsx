import { Suspense, lazy, memo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loading } from '../loading';
import { usePagePreload } from '../../hooks';
import type { PageType } from '../../hooks/useAppState';

// Função helper para criar lazy components com error boundary
const createLazyComponent = (importFn: () => Promise<any>, componentName: string) => {
  return lazy(() => 
    importFn().then(module => {
      if (module[componentName]) return { default: module[componentName] };
      if (module.default) return { default: module.default };
      throw new Error(`${componentName} component not found`);
    }).catch((error) => {
      console.error(`Error loading ${componentName}:`, error);
      return { 
        default: () => (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Erro ao carregar {componentName}
              </h3>
              <p className="text-gray-600">
                Tente recarregar a página ou entre em contato com o suporte.
              </p>
            </div>
          </div>
        )
      };
    })
  );
};

// Lazy load page components with optimized imports
const Dashboard = createLazyComponent(() => import('../dashboard'), 'Dashboard');
const Inbox = createLazyComponent(() => import('../inbox'), 'Inbox');
const Tickets = createLazyComponent(() => import('../tickets'), 'Tickets');
const Clients = createLazyComponent(() => import('../clients'), 'Clients');
const Settings = createLazyComponent(() => import('../settings'), 'Settings');

// Preload components for better UX - será substituído pelo hook

interface PageRendererProps {
  currentPage: PageType;
}

const pageComponents: Record<PageType, React.LazyExoticComponent<() => JSX.Element>> = {
  dashboard: Dashboard,
  inbox: Inbox,
  tickets: Tickets,
  clients: Clients,
  settings: Settings,
};

export const PageRenderer = memo(function PageRenderer({ currentPage }: PageRendererProps) {
  const PageComponent = pageComponents[currentPage];
  const { 
    preloadCriticalPages, 
    preloadSecondaryPages, 
    preloadRefactoredComponents,
    isLoaded 
  } = usePagePreload();

  // Preload components on mount
  useEffect(() => {
    // Preload páginas críticas imediatamente
    preloadCriticalPages();
    
    // Preload componentes refatorados
    preloadRefactoredComponents();
    
    // Preload páginas secundárias com delay
    const timer = setTimeout(() => {
      preloadSecondaryPages();
    }, 3000);

    return () => clearTimeout(timer);
  }, [preloadCriticalPages, preloadSecondaryPages, preloadRefactoredComponents]);

  // Preload specific component when hovering over navigation
  const handlePreload = useCallback((page: PageType) => {
    switch (page) {
      case 'tickets':
        if (!isLoaded('Tickets')) {
          import('../tickets');
        }
        break;
      case 'clients':
        if (!isLoaded('Clients')) {
          import('../clients');
        }
        break;
      case 'inbox':
        if (!isLoaded('Inbox')) {
          import('../inbox');
        }
        break;
      case 'settings':
        if (!isLoaded('Settings')) {
          import('../settings');
        }
        break;
    }
  }, [isLoaded]);

  if (!PageComponent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Página não encontrada
          </h3>
          <p className="text-gray-600">
            A página solicitada não existe ou foi movida.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ 
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        <Suspense 
          fallback={
            <div className="flex items-center justify-center h-64">
              <Loading />
            </div>
          }
        >
          <PageComponent />
        </Suspense>
      </motion.div>
    </div>
  );
});