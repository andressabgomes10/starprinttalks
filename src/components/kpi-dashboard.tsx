import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Users, 
  Clock, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Target,
  Calendar,
  CheckCircle
} from 'lucide-react';

interface KPIData {
  remoteAttendances: {
    current: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  };
  averageResolutionTime: {
    current: string;
    target: string;
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  };
  customerSatisfaction: {
    current: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  };
}

interface KPIDashboardProps {
  data: KPIData;
  period: 'day' | 'week' | 'month';
}

export function KPIDashboard({ data, period }: KPIDashboardProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Target className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const getPeriodLabel = (period: 'day' | 'week' | 'month') => {
    switch (period) {
      case 'day':
        return 'Hoje';
      case 'week':
        return 'Esta Semana';
      case 'month':
        return 'Este Mês';
      default:
        return 'Período';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Indicadores de Performance
          </h2>
          <p className="text-[var(--muted-foreground)]">
            Acompanhamento de produtividade e qualidade do atendimento
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Calendar className="h-4 w-4 mr-2" />
          {getPeriodLabel(period)}
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Nº de Atendimentos Remotos */}
        <Card className="border-l-4 border-l-[var(--caja-yellow)]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Users className="h-5 w-5 text-[var(--caja-yellow)]" />
              <span>Atendimentos Remotos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-[var(--foreground)]">
                  {data.remoteAttendances.current}
                </span>
                <span className="text-sm text-[var(--muted-foreground)]">
                  / {data.remoteAttendances.target}
                </span>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(data.remoteAttendances.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(data.remoteAttendances.trend)}`}>
                    {data.remoteAttendances.percentage > 0 ? '+' : ''}{data.remoteAttendances.percentage}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Progresso da Meta</span>
                  <span className="font-medium">{data.remoteAttendances.percentage}%</span>
                </div>
                <Progress 
                  value={Math.min(data.remoteAttendances.percentage, 100)} 
                  className="h-2"
                />
              </div>

              <div className="text-xs text-[var(--muted-foreground)]">
                <p>Meta: {data.remoteAttendances.target} atendimentos/dia por operador</p>
                <p>Frequência: Diário (consolidado semanal e mensal)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Tempo Médio de Resolução (TMR) */}
        <Card className="border-l-4 border-l-[var(--caja-green)]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Clock className="h-5 w-5 text-[var(--caja-green)]" />
              <span>Tempo Médio de Resolução</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-[var(--foreground)]">
                  {data.averageResolutionTime.current}
                </span>
                <span className="text-sm text-[var(--muted-foreground)]">
                  / {data.averageResolutionTime.target}
                </span>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(data.averageResolutionTime.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(data.averageResolutionTime.trend)}`}>
                    {data.averageResolutionTime.percentage > 0 ? '+' : ''}{data.averageResolutionTime.percentage}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Eficiência</span>
                  <span className="font-medium">{data.averageResolutionTime.percentage}%</span>
                </div>
                <Progress 
                  value={Math.min(data.averageResolutionTime.percentage, 100)} 
                  className="h-2"
                />
              </div>

              <div className="text-xs text-[var(--muted-foreground)]">
                <p>Meta: {data.averageResolutionTime.target} (SLA)</p>
                <p>Frequência: Diário, consolidado semanal e mensal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Satisfação do Cliente (CSAT) */}
        <Card className="border-l-4 border-l-[var(--caja-blue)]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Star className="h-5 w-5 text-[var(--caja-blue)]" />
              <span>Satisfação do Cliente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-[var(--foreground)]">
                  {data.customerSatisfaction.current}%
                </span>
                <span className="text-sm text-[var(--muted-foreground)]">
                  / {data.customerSatisfaction.target}%
                </span>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(data.customerSatisfaction.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(data.customerSatisfaction.trend)}`}>
                    {data.customerSatisfaction.percentage > 0 ? '+' : ''}{data.customerSatisfaction.percentage}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Progresso da Meta</span>
                  <span className="font-medium">{data.customerSatisfaction.percentage}%</span>
                </div>
                <Progress 
                  value={Math.min(data.customerSatisfaction.percentage, 100)} 
                  className="h-2"
                />
              </div>

              <div className="text-xs text-[var(--muted-foreground)]">
                <p>Meta: ≥ {data.customerSatisfaction.target}% de satisfação</p>
                <p>Frequência: Após cada atendimento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-[var(--caja-green)]" />
            <span>Resumo dos Indicadores</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <h4 className="font-medium text-[var(--foreground)]">Produtividade</h4>
              <p className="text-[var(--muted-foreground)]">
                {data.remoteAttendances.current} de {data.remoteAttendances.target} atendimentos realizados
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-[var(--foreground)]">Eficiência</h4>
              <p className="text-[var(--muted-foreground)]">
                TMR de {data.averageResolutionTime.current} vs meta de {data.averageResolutionTime.target}
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-[var(--foreground)]">Qualidade</h4>
              <p className="text-[var(--muted-foreground)]">
                {data.customerSatisfaction.current}% de satisfação vs meta de {data.customerSatisfaction.target}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Dados de exemplo para demonstração
export const mockKPIData: KPIData = {
  remoteAttendances: {
    current: 45,
    target: 60,
    trend: 'up',
    percentage: 75
  },
  averageResolutionTime: {
    current: '2h 30min',
    target: '4h',
    trend: 'up',
    percentage: 62
  },
  customerSatisfaction: {
    current: 87,
    target: 85,
    trend: 'up',
    percentage: 102
  }
};
