import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Ticket, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { mockDataService } from '../../services/mockDataService';

export function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const dashboardStats = mockDataService.getDashboardStats();
      setStats(dashboardStats);
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, trend, trendText, color = "blue" }) => {
    const colorClasses = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600", 
      amber: "from-amber-500 to-orange-500",
      purple: "from-purple-500 to-purple-600"
    };

    return (
      <Card className="p-6 bg-white border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
            {trend && (
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">{trend}</span>
                <span className="text-gray-500 ml-1">{trendText}</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </Card>
    );
  };

  const QuickActionCard = ({ title, description, buttonText, onClick, icon: Icon }) => (
    <Card className="p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onClick}
            className="border-amber-200 text-amber-700 hover:bg-amber-50"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo, {user?.name || 'Usuário'}! 👋
        </h1>
        <p className="text-gray-600">
          Aqui está um resumo das atividades de hoje. Tudo está funcionando perfeitamente!
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Tickets"
          value={stats?.totalTickets || 0}
          icon={Ticket}
          trend="+12%"
          trendText="este mês"
          color="blue"
        />
        <StatCard
          title="Tickets Abertos"
          value={stats?.openTickets || 0}
          icon={AlertCircle}
          trend="+8%"
          trendText="esta semana"
          color="amber"
        />
        <StatCard
          title="Clientes Ativos"
          value={stats?.activeClients || 0}
          icon={Users}
          trend="+15%"
          trendText="este mês"
          color="green"
        />
        <StatCard
          title="Satisfação"
          value={`${stats?.customerSatisfaction || 0}⭐`}
          icon={Star}
          trend="+0.2"
          trendText="este mês"
          color="purple"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Conversas Ativas"
          value={stats?.activeConversations || 0}
          icon={MessageSquare}
          color="blue"
        />
        <StatCard
          title="Tickets Resolvidos"
          value={stats?.resolvedTickets || 0}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Tempo Médio de Resposta"
          value={stats?.avgResponseTime || '0h'}
          icon={Clock}
          trend="-0.5h"
          trendText="melhorou"
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Novo Ticket"
            description="Criar um novo ticket de suporte"
            buttonText="Criar Ticket"
            icon={Ticket}
            onClick={() => {/* Navigate to tickets */}}
          />
          <QuickActionCard
            title="Ver Conversas"
            description="Verificar conversas pendentes"
            buttonText="Abrir Inbox"
            icon={MessageSquare}
            onClick={() => {/* Navigate to inbox */}}
          />
          <QuickActionCard
            title="Relatório Diário"
            description="Gerar relatório de atividades"
            buttonText="Gerar Relatório"
            icon={TrendingUp}
            onClick={() => {/* Navigate to reports */}}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Atividade Recente</h2>
        <div className="space-y-4">
          {[
            { 
              action: 'Ticket #TK001 foi atualizado', 
              time: 'há 2 minutos', 
              user: 'João Santos',
              type: 'update'
            },
            { 
              action: 'Nova conversa iniciada com Maria Silva', 
              time: 'há 15 minutos', 
              user: 'Ana Oliveira',
              type: 'conversation'
            },
            { 
              action: 'Ticket #TK003 foi resolvido', 
              time: 'há 1 hora', 
              user: 'João Santos',
              type: 'resolved'
            },
            { 
              action: 'Novo cliente registrado: Pedro Costa', 
              time: 'há 2 horas', 
              user: 'Sistema',
              type: 'new_client'
            }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                activity.type === 'resolved' ? 'bg-green-500' :
                activity.type === 'update' ? 'bg-blue-500' :
                activity.type === 'conversation' ? 'bg-amber-500' :
                'bg-purple-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">por {activity.user} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}