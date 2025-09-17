import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ViewControls } from './view-controls';
import { CajaEntityList, CajaSearchBar, CajaStatsCard, CajaHeader } from './ui/design-system';
import { useTickets, type Ticket } from '../hooks/useTickets';
import { 
  Plus, 
  RefreshCw,
  MoreVertical,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Activity
} from 'lucide-react';

export function Tickets() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    tickets,
    loading,
    error,
    filters,
    updateFilters,
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket
  } = useTickets();

  // Load tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTickets();
    setIsRefreshing(false);
  };

  // Transform tickets to entity format for CajaEntityList
  const ticketEntities = useMemo(() => {
    return tickets.map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      subtitle: ticket.client,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      metadata: {
        assignee: ticket.assignee,
        category: ticket.category,
        tags: ticket.tags,
        messages: ticket.messages,
        created: ticket.created,
        updated: ticket.updated
      },
      actions: [
        {
          label: 'Ver detalhes',
          onClick: () => setSelectedTicket(ticket.id),
          icon: MoreVertical
        }
      ]
    }));
  }, [tickets]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in_progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const urgent = tickets.filter(t => t.priority === 'urgent').length;

    return [
      {
        title: 'Total de Tickets',
        value: total.toString(),
        change: '+12%',
        icon: Activity,
        color: 'blue'
      },
      {
        title: 'Em Aberto',
        value: open.toString(),
        change: '+5%',
        icon: AlertCircle,
        color: 'red'
      },
      {
        title: 'Em Progresso',
        value: inProgress.toString(),
        change: '+8%',
        icon: Clock,
        color: 'yellow'
      },
      {
        title: 'Resolvidos',
        value: resolved.toString(),
        change: '+15%',
        icon: CheckCircle,
        color: 'green'
      },
      {
        title: 'Urgentes',
        value: urgent.toString(),
        change: '+3%',
        icon: Zap,
        color: 'purple'
      }
    ];
  }, [tickets]);

  // Handle filter changes
  const handleSearchChange = (value: string) => {
    updateFilters({ search: value });
  };

  const handleStatusFilterChange = (value: string) => {
    updateFilters({ status: value });
  };

  const handlePriorityFilterChange = (value: string) => {
    updateFilters({ priority: value });
  };

  const handleSortChange = (value: string) => {
    updateFilters({ sortBy: value });
  };

  const handleSortOrderChange = (value: 'asc' | 'desc') => {
    updateFilters({ sortOrder: value });
  };

  // Handle ticket actions
  const handleCreateTicket = async () => {
    // This would open a modal or navigate to create ticket page
    console.log('Create ticket clicked');
  };

  const handleTicketAction = async (ticketId: string, action: string) => {
    switch (action) {
      case 'view':
        setSelectedTicket(ticketId);
        break;
      case 'edit':
        // Open edit modal
        console.log('Edit ticket:', ticketId);
        break;
      case 'delete':
        if (confirm('Tem certeza que deseja deletar este ticket?')) {
          await deleteTicket(ticketId);
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar tickets</h3>
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
        title="Tickets"
        subtitle="Gerencie todos os tickets de suporte"
        actions={[
          {
            label: 'Novo Ticket',
            onClick: handleCreateTicket,
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
            placeholder="Buscar tickets..."
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
              <SelectItem value="open">Aberto</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="resolved">Resolvido</SelectItem>
              <SelectItem value="closed">Fechado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.priority} onValueChange={handlePriorityFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Prioridades</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
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

      {/* Tickets List */}
      <CajaEntityList
        items={ticketEntities}
        viewMode={viewMode}
        loading={loading}
        onItemClick={(item) => setSelectedTicket(item.id)}
        onActionClick={handleTicketAction}
        emptyMessage="Nenhum ticket encontrado"
        emptyDescription="Crie seu primeiro ticket ou ajuste os filtros de busca"
      />

      {/* Selected Ticket Details */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Detalhes do Ticket</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTicket(null)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            
            {(() => {
              const ticket = tickets.find(t => t.id === selectedTicket);
              if (!ticket) return <div>Ticket não encontrado</div>;
              
              return (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{ticket.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Cliente:</span>
                      <p className="text-gray-600">{ticket.client}</p>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <p className="text-gray-600 capitalize">{ticket.status}</p>
                    </div>
                    <div>
                      <span className="font-medium">Prioridade:</span>
                      <p className="text-gray-600 capitalize">{ticket.priority}</p>
                    </div>
                    <div>
                      <span className="font-medium">Responsável:</span>
                      <p className="text-gray-600">{ticket.assignee || 'Não atribuído'}</p>
                    </div>
                  </div>
                  
                  {ticket.tags.length > 0 && (
                    <div>
                      <span className="font-medium text-sm">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {ticket.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
