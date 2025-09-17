import { useCallback, useEffect, useRef } from 'react';

interface PreloadOptions {
  delay?: number;
  priority?: 'high' | 'medium' | 'low';
}

interface PreloadItem {
  name: string;
  importFn: () => Promise<any>;
  loaded: boolean;
  loading: boolean;
  error: Error | null;
}

export function usePreload() {
  const preloadCache = useRef<Map<string, PreloadItem>>(new Map());
  const preloadQueue = useRef<PreloadItem[]>([]);
  const isProcessing = useRef(false);

  // Adicionar item à fila de preload
  const addToPreloadQueue = useCallback((name: string, importFn: () => Promise<any>, options: PreloadOptions = {}) => {
    if (preloadCache.current.has(name)) {
      return; // Já está no cache
    }

    const item: PreloadItem = {
      name,
      importFn,
      loaded: false,
      loading: false,
      error: null
    };

    preloadCache.current.set(name, item);
    preloadQueue.current.push(item);

    // Processar fila se não estiver processando
    if (!isProcessing.current) {
      processPreloadQueue();
    }
  }, []);

  // Processar fila de preload
  const processPreloadQueue = useCallback(async () => {
    if (isProcessing.current || preloadQueue.current.length === 0) {
      return;
    }

    isProcessing.current = true;

    while (preloadQueue.current.length > 0) {
      const item = preloadQueue.current.shift();
      if (!item) continue;

      try {
        item.loading = true;
        await item.importFn();
        item.loaded = true;
        item.loading = false;
        
        console.log(`✅ Preloaded: ${item.name}`);
      } catch (error) {
        item.error = error instanceof Error ? error : new Error('Unknown error');
        item.loading = false;
        console.warn(`❌ Failed to preload ${item.name}:`, error);
      }
    }

    isProcessing.current = false;
  }, []);

  // Preload com delay
  const preloadWithDelay = useCallback((name: string, importFn: () => Promise<any>, delay: number = 0) => {
    if (delay > 0) {
      setTimeout(() => {
        addToPreloadQueue(name, importFn);
      }, delay);
    } else {
      addToPreloadQueue(name, importFn);
    }
  }, [addToPreloadQueue]);

  // Preload batch de componentes
  const preloadComponents = useCallback((components: Array<{ name: string; importFn: () => Promise<any>; delay?: number }>) => {
    components.forEach(({ name, importFn, delay = 0 }) => {
      preloadWithDelay(name, importFn, delay);
    });
  }, [preloadWithDelay]);

  // Verificar se componente está carregado
  const isLoaded = useCallback((name: string) => {
    const item = preloadCache.current.get(name);
    return item?.loaded || false;
  }, []);

  // Verificar se componente está carregando
  const isLoading = useCallback((name: string) => {
    const item = preloadCache.current.get(name);
    return item?.loading || false;
  }, []);

  // Obter erro de preload
  const getError = useCallback((name: string) => {
    const item = preloadCache.current.get(name);
    return item?.error || null;
  }, []);

  // Limpar cache
  const clearCache = useCallback(() => {
    preloadCache.current.clear();
    preloadQueue.current = [];
    isProcessing.current = false;
  }, []);

  // Estatísticas do cache
  const getCacheStats = useCallback(() => {
    const items = Array.from(preloadCache.current.values());
    return {
      total: items.length,
      loaded: items.filter(item => item.loaded).length,
      loading: items.filter(item => item.loading).length,
      errors: items.filter(item => item.error).length,
      queued: preloadQueue.current.length
    };
  }, []);

  return {
    addToPreloadQueue,
    preloadWithDelay,
    preloadComponents,
    isLoaded,
    isLoading,
    getError,
    clearCache,
    getCacheStats,
    processPreloadQueue
  };
}

// Hook específico para preload de páginas
export function usePagePreload() {
  const { preloadComponents, isLoaded, isLoading, getError } = usePreload();

  // Preload de páginas críticas
  const preloadCriticalPages = useCallback(() => {
    preloadComponents([
      { name: 'Dashboard', importFn: () => import('../components/dashboard'), delay: 0 },
      { name: 'Tickets', importFn: () => import('../components/tickets'), delay: 1000 },
      { name: 'Clients', importFn: () => import('../components/clients'), delay: 1500 }
    ]);
  }, [preloadComponents]);

  // Preload de páginas secundárias
  const preloadSecondaryPages = useCallback(() => {
    preloadComponents([
      { name: 'Inbox', importFn: () => import('../components/inbox'), delay: 3000 },
      { name: 'Settings', importFn: () => import('../components/settings'), delay: 5000 }
    ]);
  }, [preloadComponents]);

  // Preload de componentes refatorados
  const preloadRefactoredComponents = useCallback(() => {
    preloadComponents([
      { name: 'TicketsRefactored', importFn: () => import('../components/tickets-refactored'), delay: 2000 },
      { name: 'ClientsRefactored', importFn: () => import('../components/clients-refactored'), delay: 2500 },
      { name: 'TeamRefactored', importFn: () => import('../components/team-refactored'), delay: 3000 }
    ]);
  }, [preloadComponents]);

  // Preload de hooks
  const preloadHooks = useCallback(() => {
    preloadComponents([
      { name: 'useTickets', importFn: () => import('./useTickets'), delay: 0 },
      { name: 'useClients', importFn: () => import('./useClients'), delay: 0 },
      { name: 'useUsers', importFn: () => import('./useUsers'), delay: 0 },
      { name: 'useLoading', importFn: () => import('./useLoading'), delay: 0 },
      { name: 'useErrorHandler', importFn: () => import('./useErrorHandler'), delay: 0 }
    ]);
  }, [preloadComponents]);

  return {
    preloadCriticalPages,
    preloadSecondaryPages,
    preloadRefactoredComponents,
    preloadHooks,
    isLoaded,
    isLoading,
    getError
  };
}

