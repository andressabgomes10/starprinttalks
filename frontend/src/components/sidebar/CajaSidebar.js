import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Ticket, 
  Users, 
  Settings, 
  User, 
  UserCheck, 
  BarChart3, 
  BookOpen, 
  Zap,
  Activity,
  ChevronLeft,
  LogOut
} from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inbox', label: 'Conversas', icon: MessageSquare, badge: 3 },
  { id: 'tickets', label: 'Tickets', icon: Ticket, badge: 12 },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'team', label: 'Equipe', icon: UserCheck },
  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  { id: 'knowledge-base', label: 'Base de Conhecimento', icon: BookOpen },
  { id: 'integrations', label: 'Integrações', icon: Zap },
  { id: 'activity-log', label: 'Log de Atividades', icon: Activity },
];

const bottomMenuItems = [
  { id: 'settings', label: 'Configurações', icon: Settings },
  { id: 'profile', label: 'Perfil', icon: User },
];

export function CajaSidebar({ 
  currentPage, 
  onPageChange, 
  isCollapsed = false, 
  onToggleCollapse,
  isMobile = false,
  onClose,
  user 
}) {
  const handleItemClick = (itemId) => {
    onPageChange(itemId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const SidebarButton = ({ item, isActive }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      className={`w-full justify-start h-12 px-3 ${
        isActive 
          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' 
          : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
      } ${isCollapsed && !isMobile ? 'px-2' : ''}`}
      onClick={() => handleItemClick(item.id)}
    >
      <item.icon className={`h-5 w-5 ${isCollapsed && !isMobile ? '' : 'mr-3'}`} />
      {(!isCollapsed || isMobile) && (
        <span className="flex-1 text-left">{item.label}</span>
      )}
      {(!isCollapsed || isMobile) && item.badge && (
        <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
          isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
        }`}>
          {item.badge}
        </span>
      )}
    </Button>
  );

  return (
    <div className={`${
      isMobile ? 'w-80' : isCollapsed ? 'w-20' : 'w-72'
    } bg-white h-full border-r border-gray-200 flex flex-col transition-all duration-300 shadow-sm`}>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Cajá Talks</h2>
                <p className="text-xs text-gray-500">Atendimento</p>
              </div>
            </div>
          )}
          
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="p-1.5 hover:bg-gray-100"
            >
              <ChevronLeft className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            </Button>
          )}
          
          {isMobile && onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100"
            >
              ✕
            </Button>
          )}
        </div>
      </div>

      {/* User Info */}
      {(!isCollapsed || isMobile) && user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => (
            <SidebarButton
              key={item.id}
              item={item}
              isActive={currentPage === item.id}
            />
          ))}
          
          <div className="py-2">
            <Separator className="bg-gray-200" />
          </div>
          
          {bottomMenuItems.map((item) => (
            <SidebarButton
              key={item.id}
              item={item}
              isActive={currentPage === item.id}
            />
          ))}
        </nav>
      </div>

      {/* Footer */}
      {(!isCollapsed || isMobile) && (
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
            onClick={() => {
              if (window.confirm('Tem certeza que deseja sair?')) {
                localStorage.removeItem('cajatalks_auth');
                window.location.reload();
              }
            }}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sair
          </Button>
        </div>
      )}
    </div>
  );
}