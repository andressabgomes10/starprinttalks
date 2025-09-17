import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { CajaLogoWithText } from './ui/caja-logo';
import { Badge } from './ui/badge';
import { 
  Home, MessageSquare, Ticket, Users, Settings, User, BarChart3, BookOpen, Plug,
  X, Search, Bell, HelpCircle
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
  onSearchOpen: () => void;
}

export function MobileMenu({ isOpen, onClose, currentPage, onPageChange, onSearchOpen }: MobileMenuProps) {
  const menuItems = [
    { icon: Home, label: 'Dashboard', page: 'dashboard' },
    { icon: MessageSquare, label: 'Conversas', page: 'inbox', badge: '3' },
    { icon: Ticket, label: 'Tickets', page: 'tickets', badge: '12' },
    { icon: Users, label: 'Clientes', page: 'clients' },
    { icon: BarChart3, label: 'Relatórios', page: 'reports' },
    { icon: BookOpen, label: 'Base de Conhecimento', page: 'knowledge-base' },
    { icon: Plug, label: 'Integrações', page: 'integrations' },
    { icon: User, label: 'Equipe', page: 'team' },
    { icon: Settings, label: 'Configurações', page: 'settings' },
    { icon: User, label: 'Perfil', page: 'profile' },
  ];

  const quickActions = [
    { icon: Search, label: 'Busca Global', action: () => { onSearchOpen(); onClose(); } },
    { icon: Bell, label: 'Notificações', action: () => console.log('Notifications') },
    { icon: HelpCircle, label: 'Ajuda', action: () => console.log('Help') },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              mass: 0.8
            }}
            className="fixed inset-y-0 right-0 w-80 bg-white/95 backdrop-blur-sm z-50 md:hidden shadow-2xl border-l border-[var(--border)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <CajaLogoWithText 
                logoSize="sm" 
                textSize="md" 
                variant="default"
                animated={true}
              />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onClose}
                className="hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-4">Navegação</h3>
                {menuItems.map((item) => (
                  <Button
                    key={item.page}
                    variant={currentPage === item.page ? "default" : "ghost"}
                    className={`w-full justify-start h-12 ${
                      currentPage === item.page 
                        ? "bg-[var(--caja-yellow)] text-[var(--caja-black)] hover:bg-[var(--caja-yellow)]/90" 
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => onPageChange(item.page)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-2">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 space-y-2">
                <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-4">Ações Rápidas</h3>
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-12"
                    onClick={action.action}
                  >
                    <action.icon className="h-5 w-5 mr-3" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--muted-foreground)] text-center">
                Star Print Talks v1.0
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}