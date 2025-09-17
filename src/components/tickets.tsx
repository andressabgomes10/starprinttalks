import { useState } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ViewControls } from './view-controls';
import { CajaEntityList, CajaSearchBar, CajaStatsCard, CajaHeader } from './ui/design-system';
import { useTicketData, TicketData } from '../hooks/useEntityData';
import { useTickets } from '../hooks/useTickets';
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
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { transformTicketToEntity } = useTicketData();
  const { 
    tickets, 
    allTickets,
    loading, 
    error, 
    filters, 
    updateFilters, 
    fetchTickets 
  } = useTickets();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchTickets();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getTicketStats = () => {
    if (!allTickets) return {
      total: 0,
      open: 0,
      in_progress: 0,
      resolved: 0,
      high_priority: 0
    };

    return {
      total: allTickets.length,
      open: allTickets.filter(t => t.status === 'open').length,
      in_progress: allTickets.filter(t => t.status === 'in_progress').length,
      resolved: allTickets.filter(t => t.status === 'resolved').length,
      high_priority: allTickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length
    };
  };

  const stats = getTicketStats();

  // Transform tickets para o formato unificado
  const entityItems = tickets.map(ticket => {
    // Convert to TicketData format expected by useTicketData
    const ticketData: TicketData = {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description || '',
      status: ticket.status,
      priority: ticket.priority,
      client: ticket.client_name || 'Cliente não identificado',
      assignee: ticket.assigned_user_name || undefined,
      created: ticket.created_at,
      updated: ticket.updated_at,
      category: ticket.category || 'Geral',
      tags: ticket.tags || [],
      messages: ticket.messages || 0
    };

    return {
      ...transformTicketToEntity(ticketData),
      selected: selectedTicket === ticket.id,
      onClick: () => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id),
      actions: (
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      )
    };
  });

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <p className="text-lg font-medium text-red-600">Erro ao carregar tickets</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <Button 
            onClick={handleRefresh} 
            className="mt-4"
            variant="outline"
          >
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
          title="Gestão de Tickets"
          description="Gerencie e acompanhe todos os tickets de suporte"
          breadcrumbs={[
            { label: 'Dashboard' },
            { label: 'Tickets' }
          ]}
          actions={
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing || loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button className="bg-[var(--caja-yellow)] hover:bg-[var(--caja-yellow)]/90 text-[var(--caja-black)] shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Ticket
              </Button>
            </div>
          }
        />
      </div>

      {/* Stats Section */}
      <div className="px-6 py-6 bg-[var(--muted)]/30">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <CajaStatsCard
            title="Total"
            value={loading ? '...' : stats.total.toString()}
            icon={AlertCircle}
            variant="default"
          />
          <CajaStatsCard
            title="Abertos"
            value={loading ? '...' : stats.open.toString()}
            icon={AlertCircle}
            variant="yellow"
          />
          <CajaStatsCard
            title="Em Andamento"
            value={loading ? '...' : stats.in_progress.toString()}
            icon={Clock}
            variant="brown"
          />
          <CajaStatsCard
            title="Resolvidos"
            value={loading ? '...' : stats.resolved.toString()}
            icon={CheckCircle}
            variant="green"
            change="+8 hoje"
            changeType="positive"
          />
          <CajaStatsCard
            title="Alta Prioridade"
            value={loading ? '...' : stats.high_priority.toString()}
            icon={Zap}
            variant="default"
          />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 border-b border-[var(--border)]">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 max-w-md">
            <CajaSearchBar
              placeholder="Buscar por título, cliente ou ID..."
              value={filters.search}
              onChange={(value) => updateFilters({ search: value })}
            />
          </div>

          <div className="flex items-center space-x-3">
            <Select value={filters.status} onValueChange={(value) => updateFilters({ status: value })}>
              <SelectTrigger className="w-32 border-0 bg-[var(--muted)]/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="resolved">Resolvido</SelectItem>
                <SelectItem value="closed">Fechado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(value) => updateFilters({ priority: value })}>
              <SelectTrigger className="w-32 border-0 bg-[var(--muted)]/50">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* View Controls */}
      <ViewControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        itemCount={tickets.length}
        totalCount={allTickets?.length || 0}
        sortOptions={[
          { value: 'created_at', label: 'Data de Criação' },
          { value: 'updated_at', label: 'Última Atualização' },
          { value: 'title', label: 'Título' },
          { value: 'status', label: 'Status' },
          { value: 'priority', label: 'Prioridade' },
          { value: 'client_name', label: 'Cliente' }
        ]}
      />

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-[var(--muted-foreground)]" />
              <span className="ml-2 text-[var(--muted-foreground)]">Carregando tickets...</span>
            </div>
          ) : (
            <CajaEntityList
              items={entityItems}
              viewMode={viewMode}
              emptyState={
                <div className="text-center space-y-2">
                  <AlertCircle className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
                  <p className="text-lg font-medium text-[var(--muted-foreground)]">
                    {filters.search || filters.status !== 'all' || filters.priority !== 'all' 
                      ? 'Nenhum ticket encontrado com os filtros aplicados'
                      : 'Nenhum ticket encontrado'
                    }
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Tente ajustar seus filtros de pesquisa ou crie um novo ticket
                  </p>
                </div>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}