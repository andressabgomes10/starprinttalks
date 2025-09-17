import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Activity, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Ticket,
  MessageSquare,
  Settings,
  Users,
  Shield,
  FileText,
  Download
} from 'lucide-react';

const activities = [
  {
    id: 'ACT001',
    type: 'ticket_created',
    description: 'Ticket #TK001 foi criado',
    user: 'João Santos',
    details: 'Problema com login do cliente',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    icon: Ticket,
    color: 'blue'
  },
  {
    id: 'ACT002',
    type: 'ticket_updated',
    description: 'Status do ticket #TK002 alterado para "Em Andamento"',
    user: 'Ana Oliveira',
    details: 'Ticket: Solicitação de reembolso',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    icon: Ticket,
    color: 'amber'
  },
  {
    id: 'ACT003',
    type: 'message_sent',
    description: 'Nova mensagem enviada para Maria Silva',
    user: 'João Santos',
    details: 'Conversa #CONV001',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    icon: MessageSquare,
    color: 'green'
  },
  {
    id: 'ACT004',
    type: 'user_login',
    description: 'Login realizado no sistema',
    user: 'Pedro Costa',
    details: 'IP: 192.168.1.100',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    icon: Shield,
    color: 'purple'
  },
  {
    id: 'ACT005',
    type: 'client_created',
    description: 'Novo cliente registrado',
    user: 'Sistema',
    details: 'Cliente: Carolina Lima',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    icon: Users,
    color: 'indigo'
  },
  {
    id: 'ACT006',
    type: 'settings_updated',
    description: 'Configurações de notificação atualizadas',
    user: 'Ana Oliveira',
    details: 'Email notifications enabled',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    icon: Settings,
    color: 'gray'
  },
  {
    id: 'ACT007',
    type: 'article_published',
    description: 'Artigo "Como fazer login" foi publicado',
    user: 'João Santos',
    details: 'Base de Conhecimento',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    icon: FileText,
    color: 'green'
  },
  {
    id: 'ACT008',
    type: 'ticket_resolved',
    description: 'Ticket #TK003 foi resolvido',
    user: 'Ana Oliveira',
    details: 'Dúvida sobre funcionalidade',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    icon: Ticket,
    color: 'green'
  }
];

const activityTypes = [
  { value: 'all', label: 'Todos os Tipos' },
  { value: 'ticket_created', label: 'Tickets Criados' },
  { value: 'ticket_updated', label: 'Tickets Atualizados' },
  { value: 'ticket_resolved', label: 'Tickets Resolvidos' },
  { value: 'message_sent', label: 'Mensagens Enviadas' },
  { value: 'user_login', label: 'Logins' },
  { value: 'client_created', label: 'Clientes Criados' },
  { value: 'settings_updated', label: 'Configurações' },
  { value: 'article_published', label: 'Artigos Publicados' }
];

export function ActivityLog({ user }) {
  const [filteredActivities, setFilteredActivities] = useState(activities);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  useEffect(() => {
    const loadActivities = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    };

    loadActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [searchTerm, typeFilter, userFilter]);

  const filterActivities = () => {
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === typeFilter);
    }

    if (userFilter !== 'all') {
      filtered = filtered.filter(activity => activity.user === userFilter);
    }

    setFilteredActivities(filtered);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `há ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `há ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else {
      return `há ${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      amber: 'bg-amber-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
      gray: 'bg-gray-500'
    };
    return colors[color] || 'bg-gray-500';
  };

  const getUniqueUsers = () => {
    const users = activities.map(activity => activity.user);
    return [...new Set(users)];
  };

  const ActivityCard = ({ activity }) => {
    const Icon = activity.icon;
    
    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-4">
          <div className={`w-10 h-10 ${getColorClasses(activity.color)} rounded-full flex items-center justify-center`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-900">
                {activity.description}
              </p>
              <span className="text-xs text-gray-500">
                {formatTimestamp(activity.timestamp)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              {activity.details}
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-xs text-gray-500">
                <User className="h-3 w-3 mr-1" />
                {activity.user}
              </div>
              <Badge variant="outline" className="text-xs">
                {activity.id}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
            <Activity className="h-8 w-8 mr-3 text-purple-500" />
            Log de Atividades
          </h1>
          <p className="text-gray-600 mt-1">
            Acompanhe todas as atividades e mudanças no sistema
          </p>
        </div>
        <Button variant="outline" className="text-gray-600">
          <Download className="h-4 w-4 mr-2" />
          Exportar Log
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar atividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {activityTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos os Usuários</option>
            {getUniqueUsers().map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>Últimas 24 horas</option>
            <option>Última semana</option>
            <option>Último mês</option>
            <option>Personalizado</option>
          </select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Atividades</p>
              <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
            </div>
            <Activity className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Últimas 24h</p>
              <p className="text-2xl font-bold text-blue-600">
                {activities.filter(a => {
                  const diff = Date.now() - new Date(a.timestamp).getTime();
                  return diff < 24 * 60 * 60 * 1000;
                }).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Usuários Ativos</p>
              <p className="text-2xl font-bold text-green-600">{getUniqueUsers().length}</p>
            </div>
            <Users className="h-8 w-8 text-green-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tipos de Ação</p>
              <p className="text-2xl font-bold text-purple-600">{activityTypes.length - 1}</p>
            </div>
            <Filter className="h-8 w-8 text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <Card className="p-12 text-center">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma atividade encontrada
            </h3>
            <p className="text-gray-500">
              {searchTerm || typeFilter !== 'all' || userFilter !== 'all'
                ? 'Tente ajustar os filtros para encontrar mais resultados.'
                : 'As atividades aparecerão aqui conforme ocorrerem no sistema.'}
            </p>
          </Card>
        ) : (
          filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        )}
      </div>

      {/* Load More */}
      {filteredActivities.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline" className="text-gray-600">
            Carregar Mais Atividades
          </Button>
        </div>
      )}
    </div>
  );
}