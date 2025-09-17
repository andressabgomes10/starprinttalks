// Export all hooks for easy importing
export { useAppState } from './useAppState';
export { useConnectionStatus } from './useConnectionStatus';
export { useKeyboardShortcuts, useAppKeyboardShortcuts } from './useKeyboardShortcuts';
export { useUserPreferences } from './useUserPreferences';
export { usePerformance, useExecutionTime } from './usePerformance';
export { useTickets } from './useTickets';
export { useClients } from './useClients';
export { useConversations } from './useConversations';
export { useUsers } from './useUsers';
export { useLoading, useMultipleLoading, useAsyncOperation } from './useLoading';
export { usePreload, usePagePreload } from './usePreload';
export { useErrorHandler, useFormErrors, useApiErrorHandler } from './useErrorHandler';
export { 
  useViewState, 
  usePagination, 
  useResponsive,
  filterItems,
  sortItems,
  paginateItems,
  getStatusColor,
  formatTimeAgo,
  truncateText
} from './useDesignSystem';

// Re-export types
export type { PageType } from './useAppState';
export type { ViewState, PaginationState } from './useDesignSystem';