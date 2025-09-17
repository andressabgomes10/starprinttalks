import { renderHook, act } from '@testing-library/react';
import { useAppState } from '../useAppState';

describe('useAppState Hook', () => {
  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useAppState());
    
    expect(result.current.state.currentPage).toBe('dashboard');
    expect(result.current.state.isLoggedIn).toBe(false);
    expect(result.current.state.isMobileSidebarOpen).toBe(false);
    expect(result.current.state.isSidebarCollapsed).toBe(false);
    expect(result.current.state.isMobileMenuOpen).toBe(false);
    expect(result.current.state.isSearchOpen).toBe(false);
    expect(result.current.state.isOnboardingOpen).toBe(false);
  });

  it('handles page changes', () => {
    const { result } = renderHook(() => useAppState());
    
    act(() => {
      result.current.actions.setCurrentPage('tickets');
    });
    
    expect(result.current.state.currentPage).toBe('tickets');
    
    act(() => {
      result.current.actions.setCurrentPage('clients');
    });
    
    expect(result.current.state.currentPage).toBe('clients');
  });

  it('handles login state changes', () => {
    const { result } = renderHook(() => useAppState());
    
    act(() => {
      result.current.actions.login();
    });
    
    expect(result.current.state.isLoggedIn).toBe(true);
    
    act(() => {
      result.current.actions.logout();
    });
    
    expect(result.current.state.isLoggedIn).toBe(false);
  });

  it('handles mobile sidebar state changes', () => {
    const { result } = renderHook(() => useAppState());
    
    act(() => {
      result.current.actions.toggleMobileSidebar();
    });
    
    expect(result.current.state.isMobileSidebarOpen).toBe(true);
    
    act(() => {
      result.current.actions.closeMobileSidebar();
    });
    
    expect(result.current.state.isMobileSidebarOpen).toBe(false);
  });

  it('handles sidebar collapse state changes', () => {
    const { result } = renderHook(() => useAppState());
    
    act(() => {
      result.current.actions.toggleSidebarCollapse();
    });
    
    expect(result.current.state.isSidebarCollapsed).toBe(true);
    
    act(() => {
      result.current.actions.toggleSidebarCollapse();
    });
    
    expect(result.current.state.isSidebarCollapsed).toBe(false);
  });

  it('handles mobile menu state changes', () => {
    const { result } = renderHook(() => useAppState());
    
    act(() => {
      result.current.actions.toggleMobileMenu();
    });
    
    expect(result.current.state.isMobileMenuOpen).toBe(true);
    
    act(() => {
      result.current.actions.closeMobileMenu();
    });
    
    expect(result.current.state.isMobileMenuOpen).toBe(false);
  });

  it('handles search state changes', () => {
    const { result } = renderHook(() => useAppState());
    
    act(() => {
      result.current.actions.openSearch();
    });
    
    expect(result.current.state.isSearchOpen).toBe(true);
    
    act(() => {
      result.current.actions.closeSearch();
    });
    
    expect(result.current.state.isSearchOpen).toBe(false);
  });

  it('handles onboarding state changes', () => {
    const { result } = renderHook(() => useAppState());
    
    act(() => {
      result.current.actions.openOnboarding();
    });
    
    expect(result.current.state.isOnboardingOpen).toBe(true);
    
    act(() => {
      result.current.actions.closeOnboarding();
    });
    
    expect(result.current.state.isOnboardingOpen).toBe(false);
  });

  it('handles multiple state changes simultaneously', () => {
    const { result } = renderHook(() => useAppState());
    
    act(() => {
      result.current.actions.login();
      result.current.actions.setCurrentPage('inbox');
      result.current.actions.toggleMobileSidebar();
      result.current.actions.toggleSidebarCollapse();
    });
    
    expect(result.current.state.isLoggedIn).toBe(true);
    expect(result.current.state.currentPage).toBe('inbox');
    expect(result.current.state.isMobileSidebarOpen).toBe(true);
    expect(result.current.state.isSidebarCollapsed).toBe(true);
  });

  it('maintains state independence between different properties', () => {
    const { result } = renderHook(() => useAppState());
    
    // Muda apenas uma propriedade
    act(() => {
      result.current.actions.login();
    });
    
    expect(result.current.state.isLoggedIn).toBe(true);
    expect(result.current.state.currentPage).toBe('dashboard'); // Não mudou
    expect(result.current.state.isMobileSidebarOpen).toBe(false); // Não mudou
    
    // Muda outra propriedade
    act(() => {
      result.current.actions.setCurrentPage('tickets');
    });
    
    expect(result.current.state.isLoggedIn).toBe(true); // Mantém o valor anterior
    expect(result.current.state.currentPage).toBe('tickets');
    expect(result.current.state.isMobileSidebarOpen).toBe(false); // Ainda não mudou
  });

  it('handles rapid state changes', () => {
    const { result } = renderHook(() => useAppState());
    
    // Simula mudanças rápidas de estado
    act(() => {
      result.current.actions.toggleMobileSidebar();
      result.current.actions.toggleMobileSidebar();
      result.current.actions.toggleMobileSidebar();
    });
    
    expect(result.current.state.isMobileSidebarOpen).toBe(true);
  });

  it('provides stable function references', () => {
    const { result, rerender } = renderHook(() => useAppState());
    
    const initialSetCurrentPage = result.current.actions.setCurrentPage;
    const initialLogin = result.current.actions.login;
    
    // Re-renderiza o hook
    rerender();
    
    // As funções devem ser as mesmas (referência estável)
    expect(result.current.actions.setCurrentPage).toBe(initialSetCurrentPage);
    expect(result.current.actions.login).toBe(initialLogin);
  });

  it('handles edge cases with page values', () => {
    const { result } = renderHook(() => useAppState());
    
    // Testa com diferentes valores de página
    const validPages = ['dashboard', 'inbox', 'tickets', 'clients', 'settings', 'profile', 'team', 'reports', 'knowledge-base', 'integrations', 'activity-log'];
    
    validPages.forEach(page => {
      act(() => {
        result.current.actions.setCurrentPage(page as any);
      });
      
      expect(result.current.state.currentPage).toBe(page);
    });
  });

  it('handles boolean state toggles', () => {
    const { result } = renderHook(() => useAppState());
    
    // Testa toggle de estados booleanos
    expect(result.current.state.isMobileSidebarOpen).toBe(false);
    
    act(() => {
      result.current.actions.toggleMobileSidebar();
    });
    
    expect(result.current.state.isMobileSidebarOpen).toBe(true);
    
    act(() => {
      result.current.actions.toggleMobileSidebar();
    });
    
    expect(result.current.state.isMobileSidebarOpen).toBe(false);
  });

  it('resets to dashboard on logout', () => {
    const { result } = renderHook(() => useAppState());
    
    // Muda para uma página diferente
    act(() => {
      result.current.actions.setCurrentPage('tickets');
    });
    
    expect(result.current.state.currentPage).toBe('tickets');
    
    // Faz logout
    act(() => {
      result.current.actions.logout();
    });
    
    expect(result.current.state.isLoggedIn).toBe(false);
    expect(result.current.state.currentPage).toBe('dashboard'); // Deve voltar para dashboard
  });
});