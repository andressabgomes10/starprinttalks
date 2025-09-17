import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Users, 
  Ticket,
  Clock,
  Star,
  Activity
} from 'lucide-react';

export function Reports({ user }) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsLoading(false);
    };

    loadReports();
  }, [selectedPeriod]);

  const periods = [
    { value: 'day', label: 'Hoje' },
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mês' },
    { value: 'quarter', label: 'Este Trimestre' }
  ];

  const ReportCard = ({ title, value, change, icon: Icon, color = "blue" }) => {
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
            {change && (
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">{change}</span>
                <span className="text-gray-500 ml-1">vs período anterior</span>
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

  const ChartCard = ({ title, children }) => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64 flex items-center justify-center">
        {children}
      </div>
    </Card>
  );

  const MockChart = ({ type, color = "blue" }) => (
    <div className="w-full h-full flex items-end justify-center space-x-2">
      {[65, 45, 78, 52, 84, 39, 72].map((height, index) => (
        <div
          key={index}
          className={`bg-gradient-to-t from-${color}-400 to-${color}-600 rounded-t`}
          style={{ 
            height: `${height}%`, 
            width: '40px',
            minHeight: '20px'
          }}
        />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
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

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-purple-500" />
            Relatórios e Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Acompanhe o desempenho da sua equipe e satisfação dos clientes
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          <Button variant="outline" className="text-gray-600">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ReportCard
          title="Tickets Resolvidos"
          value="156"
          change="+23%"
          icon={Ticket}
          color="green"
        />
        <ReportCard
          title="Tempo Médio de Resposta"
          value="2.3h"
          change="-15%"
          icon={Clock}
          color="blue"
        />
        <ReportCard
          title="Satisfação do Cliente"
          value="4.8⭐"
          change="+0.2"
          icon={Star}
          color="amber"
        />
        <ReportCard
          title="Equipe Ativa"
          value="12"
          change="+2"
          icon={Users}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Tickets por Dia">
          <MockChart type="bar" color="blue" />
        </ChartCard>
        
        <ChartCard title="Satisfação dos Clientes">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-amber-500 mb-2">4.8</div>
              <div className="text-amber-400 text-2xl mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-600">Média geral</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Performance da Equipe">
          <MockChart type="bar" color="green" />
        </ChartCard>

        <ChartCard title="Canais de Atendimento">
          <div className="w-full h-full flex items-center justify-center">
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email</span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
                <span className="text-sm font-medium">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Chat</span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
                <span className="text-sm font-medium">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">WhatsApp</span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '10%'}}></div>
                </div>
                <span className="text-sm font-medium">10%</span>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2 text-amber-500" />
            Top Performers
          </h3>
          <div className="space-y-4">
            {[
              { name: 'João Santos', tickets: 45, rating: 4.9 },
              { name: 'Ana Oliveira', tickets: 38, rating: 4.7 },
              { name: 'Pedro Silva', tickets: 32, rating: 4.8 }
            ].map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {agent.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{agent.name}</p>
                    <p className="text-sm text-gray-500">{agent.tickets} tickets</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-600">{agent.rating}⭐</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-500" />
            Atividades Recentes
          </h3>
          <div className="space-y-4">
            {[
              { action: 'Ticket #TK001 resolvido', time: '2 min', user: 'João Santos' },
              { action: 'Nova avaliação 5⭐', time: '15 min', user: 'Cliente: Maria' },
              { action: 'Ticket #TK045 criado', time: '1 hora', user: 'Ana Oliveira' },
              { action: 'Meta mensal atingida', time: '2 horas', user: 'Sistema' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-gray-900">{activity.action}</p>
                  <p className="text-gray-500">por {activity.user} • há {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Goals */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Metas do Mês
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Tickets Resolvidos</span>
                <span className="font-medium">156/200</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '78%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Satisfação (>4.5⭐)</span>
                <span className="font-medium">4.8/4.5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Tempo Resposta (<3h)</span>
                <span className="font-medium">2.3h/3h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}