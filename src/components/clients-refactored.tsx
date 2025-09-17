import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ViewControls } from './view-controls';
import { CajaEntityList, CajaSearchBar, CajaStatsCard, CajaHeader } from './ui/design-system';
import { useClients, type Client } from '../hooks/useClients';
import { 
  Plus, 
  RefreshCw,
  MoreVertical,
  Users,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Building
} from 'lucide-react';

export function Clients() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    clients,
    loading,
    error,
    filters,
    updateFilters,
    fetchClients,
    createClient,
    updateClient,
    deleteClient
  } = useClients();

  // Load clients on component mount
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchClients();
    setIsRefreshing(false);
  };

  // Transform clients to entity format for CajaEntityList
  const clientEntities = useMemo(() => {
    return clients.map(client => ({
      id: client.id,
      title: client.name,
      subtitle: client.email,
      description: client.company || 'Cliente individual',
      status: client.status,
      metadata: {
        phone: client.phone,
        company: client.company,
        totalTickets: client.totalTickets,
        openTickets: client.openTickets,
        lastContact: client.lastContact,
        created: client.created,
        updated: client.updated
      },
      actions: [
        {
          label: 'Ver detalhes',
          onClick: () => setSelectedClient(client.id),
          icon: MoreVertical
        }
      ]
    }));
  }, [clients]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = clients.length;
    const active = clients.filter(c => c.status === 'active').length;
    const inactive = clients.filter(c => c.status === 'inactive').length;
    const suspended = clients.filter(c => c.status === 'suspended').length;
    const totalTickets = clients.reduce((sum, client) => sum + client.totalTickets, 0);

    return [
      {
        title: 'Total de Clientes',
        value: total.toString(),
        change: '+8%',
        icon: Users,
        color: 'blue'
      },
      {
        title: 'Ativos',
        value: active.toString(),
        change: '+12%',
        icon: UserCheck,
        color: 'green'
      },
      {
        title: 'Inativos',
        value: inactive.toString(),
        change: '-5%',
        icon: UserX,
        color: 'red'
      },
      {
        title: 'Suspensos',
        value: suspended.toString(),
        change: '+2%',
        icon: UserX,
        color: 'yellow'
      },
      {
        title: 'Total de Tickets',
        value: totalTickets.toString(),
        change: '+15%',
        icon: Mail,
        color: 'purple'
      }
    ];
  }, [clients]);

  // Handle filter changes
  const handleSearchChange = (value: string) => {
    updateFilters({ search: value });
  };

  const handleStatusFilterChange = (value: string) => {
    updateFilters({ status: value });
  };

  const handleSortChange = (value: string) => {
    updateFilters({ sortBy: value });
  };

  const handleSortOrderChange = (value: 'asc' | 'desc') => {
    updateFilters({ sortOrder: value });
  };

  // Handle client actions
  const handleCreateClient = async () => {
    // This would open a modal or navigate to create client page
    console.log('Create client clicked');
  };

  const handleClientAction = async (clientId: string, action: string) => {
    switch (action) {
      case 'view':
        setSelectedClient(clientId);
        break;
      case 'edit':
        // Open edit modal
        console.log('Edit client:', clientId);
        break;
      case 'delete':
        if (confirm('Tem certeza que deseja deletar este cliente?')) {
          await deleteClient(clientId);
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
          <Users className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar clientes</h3>
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
    <div className="space-y-6">
      {/* Header */}
      <CajaHeader
        title="Clientes"
        subtitle="Gerencie todos os clientes do sistema"
        actions={[
          {
            label: 'Novo Cliente',
            onClick: handleCreateClient,
            icon: Plus,
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

      {/* Statistics */}
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

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <CajaSearchBar
            placeholder="Buscar clientes..."
            value={filters.search}
            onChange={handleSearchChange}
            className="max-w-md"
          />
          
          <Select value={filters.status} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
              <SelectItem value="suspended">Suspenso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ViewControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={filters.sortBy}
          onSortByChange={handleSortChange}
          sortOrder={filters.sortOrder}
          onSortOrderChange={handleSortOrderChange}
        />
      </div>

      {/* Clients List */}
      <CajaEntityList
        items={clientEntities}
        viewMode={viewMode}
        loading={loading}
        onItemClick={(item) => setSelectedClient(item.id)}
        onActionClick={handleClientAction}
        emptyMessage="Nenhum cliente encontrado"
        emptyDescription="Adicione seu primeiro cliente ou ajuste os filtros de busca"
      />

      {/* Selected Client Details */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Detalhes do Cliente</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedClient(null)}
              >
                ×
              </Button>
            </div>
            
            {(() => {
              const client = clients.find(c => c.id === selectedClient);
              if (!client) return <div>Cliente não encontrado</div>;
              
              return (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{client.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{client.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Status:</span>
                      <p className="text-gray-600 capitalize">{client.status}</p>
                    </div>
                    <div>
                      <span className="font-medium">Empresa:</span>
                      <p className="text-gray-600">{client.company || 'Não informado'}</p>
                    </div>
                    {client.phone && (
                      <div>
                        <span className="font-medium">Telefone:</span>
                        <p className="text-gray-600">{client.phone}</p>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Total de Tickets:</span>
                      <p className="text-gray-600">{client.totalTickets}</p>
                    </div>
                    <div>
                      <span className="font-medium">Tickets Abertos:</span>
                      <p className="text-gray-600">{client.openTickets}</p>
                    </div>
                    <div>
                      <span className="font-medium">Último Contato:</span>
                      <p className="text-gray-600">
                        {client.lastContact ? new Date(client.lastContact).toLocaleDateString('pt-BR') : 'Nunca'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Email
                    </Button>
                    {client.phone && (
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Ligar
                      </Button>
                    )}
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
