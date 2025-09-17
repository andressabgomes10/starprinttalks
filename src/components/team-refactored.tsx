import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { CajaEntityList, CajaSearchBar, CajaStatsCard, CajaHeader } from './ui/design-system';
import { useUsers, type User } from '../hooks/useUsers';
import { useLoading, useErrorHandler } from '../hooks';
import { 
  UserPlus,
  MoreHorizontal,
  Users,
  Activity,
  Star,
  Crown,
  Shield,
  User,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export function Team() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    users,
    loading,
    error,
    filters,
    updateFilters,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserStats
  } = useUsers();

  const { setLoading, withLoading } = useLoading();
  const { handleError, clearError } = useErrorHandler();

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'agent' as const,
    department: '',
    status: 'offline' as const
  });

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUsers();
    setIsRefreshing(false);
  };

  // Transform users to entity format for CajaEntityList
  const userEntities = useMemo(() => {
    return users.map(user => ({
      id: user.id,
      title: user.name,
      subtitle: user.email,
      description: user.department,
      status: user.status,
      metadata: {
        role: user.role,
        department: user.department,
        joinDate: user.joinDate,
        lastActive: user.lastActive,
        stats: user.stats
      },
      actions: [
        {
          label: 'Ver detalhes',
          onClick: () => setSelectedMember(user.id),
          icon: MoreHorizontal
        }
      ]
    }));
  }, [users]);

  // Calculate statistics
  const stats = useMemo(() => {
    const userStats = getUserStats();
    
    return [
      {
        title: 'Total de Membros',
        value: userStats.total.toString(),
        change: '+2 este mês',
        icon: Users,
        color: 'blue'
      },
      {
        title: 'Online Agora',
        value: userStats.online.toString(),
        change: 'Ativo',
        icon: Activity,
        color: 'green'
      },
      {
        title: 'Administradores',
        value: userStats.admins.toString(),
        change: 'Gestão',
        icon: Crown,
        color: 'purple'
      },
      {
        title: 'Agentes',
        value: userStats.agents.toString(),
        change: 'Atendimento',
        icon: User,
        color: 'yellow'
      },
      {
        title: 'Supervisores',
        value: userStats.supervisors.toString(),
        change: 'Supervisão',
        icon: Shield,
        color: 'brown'
      }
    ];
  }, [getUserStats]);

  // Handle filter changes
  const handleSearchChange = (value: string) => {
    updateFilters({ search: value });
  };

  const handleRoleFilterChange = (value: string) => {
    updateFilters({ role: value });
  };

  const handleDepartmentFilterChange = (value: string) => {
    updateFilters({ department: value });
  };

  const handleStatusFilterChange = (value: string) => {
    updateFilters({ status: value });
  };

  // Handle user actions
  const handleCreateUser = async () => {
    try {
      clearError();
      
      // Validate form
      if (!newUser.name.trim()) {
        handleError('Nome é obrigatório');
        return;
      }
      
      if (!newUser.email.trim()) {
        handleError('Email é obrigatório');
        return;
      }
      
      if (!newUser.department.trim()) {
        handleError('Departamento é obrigatório');
        return;
      }

      // Create user
      await withLoading('createUser', async () => {
        await createUser({
          name: newUser.name.trim(),
          email: newUser.email.trim(),
          role: newUser.role,
          department: newUser.department.trim(),
          status: newUser.status
        });
      });

      // Reset form and close modal
      setNewUser({ name: '', email: '', role: 'agent', department: '', status: 'offline' });
      setIsAddUserOpen(false);
      
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Erro ao criar usuário');
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    switch (action) {
      case 'view':
        setSelectedMember(userId);
        break;
      case 'edit':
        // Open edit modal
        console.log('Edit user:', userId);
        break;
      case 'delete':
        if (confirm('Tem certeza que deseja deletar este usuário?')) {
          try {
            await deleteUser(userId);
          } catch (err) {
            handleError(err instanceof Error ? err.message : 'Erro ao deletar usuário');
          }
        }
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar usuários</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-6 border-b border-[var(--border)] bg-white/50 backdrop-blur-sm">
        <CajaHeader
          title="Gestão de Equipe"
          description="Gerencie membros da equipe e permissões"
          breadcrumbs={[
            { label: 'Dashboard' },
            { label: 'Equipe' }
          ]}
          actions={[
            {
              label: 'Adicionar Membro',
              onClick: () => setIsAddUserOpen(true),
              icon: UserPlus,
              variant: 'default'
            },
            {
              label: 'Atualizar',
              onClick: handleRefresh,
              icon: RefreshCw,
              variant: 'outline',
              loading: isRefreshing
            }
          ]}
        />
      </div>

      {/* Stats Section */}
      <div className="px-6 py-6 bg-[var(--muted)]/30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <CajaStatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color={stat.color as any}
            />
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 py-4 border-b border-[var(--border)] bg-white/30">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <CajaSearchBar
              placeholder="Buscar membros da equipe..."
              value={filters.search}
              onChange={handleSearchChange}
              className="max-w-md"
            />
            
            <Select value={filters.role} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Cargos</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="agent">Agente</SelectItem>
                <SelectItem value="client">Cliente</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.department} onValueChange={handleDepartmentFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Departamentos</SelectItem>
                <SelectItem value="Customer Success">Customer Success</SelectItem>
                <SelectItem value="Suporte Técnico">Suporte Técnico</SelectItem>
                <SelectItem value="Vendas">Vendas</SelectItem>
                <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="away">Ausente</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              Lista
            </Button>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 px-6 py-6">
        <CajaEntityList
          items={userEntities}
          viewMode={viewMode}
          loading={loading}
          onItemClick={(item) => setSelectedMember(item.id)}
          onActionClick={handleUserAction}
          emptyMessage="Nenhum membro encontrado"
          emptyDescription="Adicione membros à sua equipe ou ajuste os filtros de busca"
        />
      </div>

      {/* Add User Modal */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Membro</DialogTitle>
            <DialogDescription>
              Adicione um novo membro à sua equipe preenchendo as informações abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newName">Nome Completo *</Label>
              <Input
                id="newName"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="Digite o nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newEmail">Email *</Label>
              <Input
                id="newEmail"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="Digite o email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newRole">Cargo</Label>
              <Select value={newUser.role} onValueChange={(value: any) => setNewUser({...newUser, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Agente</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newDepartment">Departamento *</Label>
              <Input
                id="newDepartment"
                value={newUser.department}
                onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                placeholder="Digite o departamento"
              />
            </div>
            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={handleCreateUser} 
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Criando...' : 'Adicionar'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddUserOpen(false)} 
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Selected User Details */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Detalhes do Membro</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMember(null)}
              >
                ×
              </Button>
            </div>
            
            {(() => {
              const user = users.find(u => u.id === selectedMember);
              if (!user) return <div>Membro não encontrado</div>;
              
              return (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Cargo:</span>
                      <p className="text-gray-600 capitalize">{user.role}</p>
                    </div>
                    <div>
                      <span className="font-medium">Departamento:</span>
                      <p className="text-gray-600">{user.department}</p>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <p className="text-gray-600 capitalize">{user.status}</p>
                    </div>
                    <div>
                      <span className="font-medium">Data de Entrada:</span>
                      <p className="text-gray-600">{user.joinDate}</p>
                    </div>
                    <div>
                      <span className="font-medium">Última Atividade:</span>
                      <p className="text-gray-600">{user.lastActive}</p>
                    </div>
                    <div>
                      <span className="font-medium">Avaliação:</span>
                      <p className="text-gray-600">{user.stats.rating}/5</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-semibold text-lg">{user.stats.tickets}</div>
                      <div className="text-gray-600">Tickets</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-semibold text-lg">{user.stats.conversations}</div>
                      <div className="text-gray-600">Conversas</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-semibold text-lg">{user.stats.rating}</div>
                      <div className="text-gray-600">Avaliação</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
