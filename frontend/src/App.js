import React, { useEffect, useState } from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from './components/ui/toaster';

// Components
import { AuthForm } from './components/auth/AuthForm';
import { CajaSidebar } from './components/sidebar/CajaSidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { Inbox } from './components/inbox/Inbox';
import { Tickets } from './components/tickets/Tickets';
import { Clients } from './components/clients/Clients';
import { Settings } from './components/settings/Settings';
import { Profile } from './components/profile/Profile';
import { Team } from './components/team/Team';
import { Reports } from './components/reports/Reports';
import { KnowledgeBase } from './components/knowledge-base/KnowledgeBase';
import { Integrations } from './components/integrations/Integrations';
import { ActivityLog } from './components/activity-log/ActivityLog';

// Mock data service
import { mockDataService } from './services/mockDataService';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  // Check for existing session
  useEffect(() => {
    const savedAuth = localStorage.getItem('cajatalks_auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsLoggedIn(true);
      setUser(authData.user);
      mockDataService.setCurrentUser(authData.user);
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('cajatalks_auth', JSON.stringify({ user: userData }));
    mockDataService.setCurrentUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('cajatalks_auth');
    mockDataService.clearCurrentUser();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsMobileSidebarOpen(false);
  };

  // Mobile Header Component
  const MobileHeader = () => (
    <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="w-6 h-6 flex flex-col justify-center space-y-1">
          <div className="w-full h-0.5 bg-gray-600 transition-all"></div>
          <div className="w-full h-0.5 bg-gray-600 transition-all"></div>
          <div className="w-full h-0.5 bg-gray-600 transition-all"></div>
        </div>
      </button>
      
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <span className="font-semibold text-gray-800">Cajá Talks</span>
      </div>
      
      <div className="w-8 h-8"></div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'inbox': return <Inbox user={user} />;
      case 'tickets': return <Tickets user={user} />;
      case 'clients': return <Clients user={user} />;
      case 'settings': return <Settings user={user} />;
      case 'profile': return <Profile user={user} onLogout={handleLogout} />;
      case 'team': return <Team user={user} />;
      case 'reports': return <Reports user={user} />;
      case 'knowledge-base': return <KnowledgeBase user={user} />;
      case 'integrations': return <Integrations user={user} />;
      case 'activity-log': return <ActivityLog user={user} />;
      default: return <Dashboard user={user} />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <AuthForm onLogin={handleLogin} />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <CajaSidebar
            currentPage={currentPage}
            onPageChange={handlePageChange}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            user={user}
          />
        </div>

        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 lg:hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <CajaSidebar
            currentPage={currentPage}
            onPageChange={handlePageChange}
            isMobile={true}
            onClose={() => setIsMobileSidebarOpen(false)}
            user={user}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <MobileHeader />
          <div className="flex-1 overflow-auto">
            {renderCurrentPage()}
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}