import { createContext, useContext, ReactNode } from 'react';
import { useAppState } from '../hooks/useAppState';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { useConnectionStatus } from '../hooks/useConnectionStatus';
import type { PageType } from '../hooks/useAppState';

interface AppContextType {
  // App State
  state: ReturnType<typeof useAppState>['state'];
  actions: ReturnType<typeof useAppState>['actions'];
  
  // User Preferences
  preferences: ReturnType<typeof useUserPreferences>['preferences'];
  updatePreference: ReturnType<typeof useUserPreferences>['updatePreference'];
  updateNestedPreference: ReturnType<typeof useUserPreferences>['updateNestedPreference'];
  
  // Connection Status
  isOnline: boolean;
  
  // Computed values
  isMobile: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const appState = useAppState();
  const userPreferences = useUserPreferences();
  const { isOnline } = useConnectionStatus();
  
  // Simple mobile detection (can be enhanced)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const value: AppContextType = {
    state: appState.state,
    actions: appState.actions,
    preferences: userPreferences.preferences,
    updatePreference: userPreferences.updatePreference,
    updateNestedPreference: userPreferences.updateNestedPreference,
    isOnline,
    isMobile,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Convenience hooks for specific parts of the context
export function useAppActions() {
  return useAppContext().actions;
}

export function useAppPreferences() {
  const { preferences, updatePreference, updateNestedPreference } = useAppContext();
  return { preferences, updatePreference, updateNestedPreference };
}

export function useAppConnection() {
  return useAppContext().isOnline;
}