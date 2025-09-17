import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Ticket,
  Plus,
  User,
  Clock
} from 'lucide-react';
import { mockDataService } from '../../services/mockDataService';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  blocked: 'bg-red-100 text-red-800'
};

export function Clients({ user }) {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm, statusFilter]);

  const loadClients = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const clientsData = mockDataService.getClients();
    setClients(clientsData);
    setIsLoading(false);
  };

  const filterClients = () => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    setFilteredClients(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / 86400000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffDays > 0) {
      return `${diffDays}d atrás`;
    } else if (diffHours > 0) {
      return `${diffHours}h atrás`;
    } else {
      return 'Agora há pouco';
    }
  };

  const ClientCard = ({ client }) => (
    <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setSelectedClient(client)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{client.name}</h3>
            <p className="text-sm text-gray-500">ID: {client.id}</p>
          </div>
        </div>
        <Badge className={statusColors[client.status]}>
          {client.status === 'active' ? 'Ativo' : 
           client.status === 'inactive' ? 'Inativo' : 'Bloqueado'}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2" />
          {client.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2" />
          {client.phone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Building className="h-4 w-4 mr-2" />
          {client.company}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{client.totalTickets}</p>
          <p className="text-xs text-gray-500">Total Tickets</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-600">{client.openTickets}</p>
          <p className="text-xs text-gray-500">Em Aberto</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Último Contato</p>
          <p className="text-sm font-medium">{getTimeAgo(client.lastContact)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          Cliente desde {formatDate(client.createdAt)}
        </div>
        <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
          Ver Detalhes
        </Button>
      </div>
    </Card>
  );

  const ClientDetail = ({ client, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Detalhes do Cliente</h2>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{client.name}</h3>
              <p className="text-gray-600">{client.company}</p>
              <Badge className={statusColors[client.status]}>
                {client.status === 'active' ? 'Ativo' : 
                 client.status === 'inactive' ? 'Inativo' : 'Bloqueado'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Informações de Contato</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{client.company}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Estatísticas</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total de Tickets:</span>
                  <span className="font-semibold">{client.totalTickets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tickets em Aberto:</span>
                  <span className="font-semibold text-amber-600">{client.openTickets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cliente desde:</span>
                  <span className="font-semibold">{formatDate(client.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Último contato:</span>
                  <span className="font-semibold">{getTimeAgo(client.lastContact)}</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex space-x-3">
            <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
              <Mail className="h-4 w-4 mr-2" />
              Enviar Email
            </Button>
            <Button variant="outline" className="flex-1">
              <Ticket className="h-4 w-4 mr-2" />
              Criar Ticket
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-500" />
            Clientes
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie todos os seus clientes
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="blocked">Bloqueado</option>
          </select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <Users className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-green-600">
                {clients.filter(c => c.status === 'active').length}
              </p>
            </div>
            <User className="h-8 w-8 text-green-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Novos Este Mês</p>
              <p className="text-2xl font-bold text-blue-600">
                {clients.filter(c => {
                  const clientDate = new Date(c.createdAt);
                  const thisMonth = new Date();
                  return clientDate.getMonth() === thisMonth.getMonth() && 
                         clientDate.getFullYear() === thisMonth.getFullYear();
                }).length}
              </p>
            </div>
            <Plus className="h-8 w-8 text-blue-400" />
          </div>
        </Card>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum cliente encontrado
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros para encontrar mais resultados.'
                  : 'Comece adicionando seu primeiro cliente.'}
              </p>
            </Card>
          </div>
        ) : (
          filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))
        )}
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <ClientDetail 
          client={selectedClient} 
          onClose={() => setSelectedClient(null)} 
        />
      )}
    </div>
  );
}