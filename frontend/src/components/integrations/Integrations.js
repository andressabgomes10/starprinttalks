import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Zap, 
  MessageSquare, 
  Mail, 
  BarChart3, 
  Users, 
  Settings,
  Check,
  Plus,
  ExternalLink
} from 'lucide-react';

const integrations = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Conecte sua conta do WhatsApp Business para receber e enviar mensagens',
    icon: MessageSquare,
    category: 'Messaging',
    status: 'connected',
    color: 'green'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Receba notificações e gerencie tickets diretamente no Slack',
    icon: MessageSquare,
    category: 'Messaging',
    status: 'available',
    color: 'purple'
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Sincronize emails e gerencie conversas através do Gmail',
    icon: Mail,
    category: 'Email',
    status: 'connected',
    color: 'red'
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    description: 'Integração completa com Microsoft Outlook e Office 365',
    icon: Mail,
    category: 'Email',
    status: 'available',
    color: 'blue'
  },
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    description: 'Sincronize dados de clientes e histórico de interações',
    icon: Users,
    category: 'CRM',
    status: 'available',
    color: 'orange'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Integração completa com Salesforce CRM e Sales Cloud',
    icon: Users,
    category: 'CRM',
    status: 'available',
    color: 'blue'
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Acompanhe métricas de suporte e comportamento dos usuários',
    icon: BarChart3,
    category: 'Analytics',
    status: 'connected',
    color: 'yellow'
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    description: 'Analytics avançado para entender o comportamento dos clientes',
    icon: BarChart3,
    category: 'Analytics',
    status: 'available',
    color: 'purple'
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Transforme tickets em cards do Trello para melhor organização',
    icon: Settings,
    category: 'Productivity',
    status: 'available',
    color: 'blue'
  },
  {
    id: 'asana',
    name: 'Asana',
    description: 'Gerencie projetos e tickets de suporte no Asana',
    icon: Settings,
    category: 'Productivity',
    status: 'available',
    color: 'pink'
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Notificações e gestão de comunidade através do Discord',
    icon: MessageSquare,
    category: 'Messaging',
    status: 'available',
    color: 'indigo'
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Colaboração em equipe e notificações no Teams',
    icon: MessageSquare,
    category: 'Messaging',
    status: 'available',
    color: 'blue'
  }
];

export function Integrations({ user }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [connectedIntegrations, setConnectedIntegrations] = useState(
    integrations.filter(i => i.status === 'connected').map(i => i.id)
  );

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'Messaging', label: 'Mensagens' },
    { id: 'Email', label: 'Email' },
    { id: 'CRM', label: 'CRM' },
    { id: 'Analytics', label: 'Analytics' },
    { id: 'Productivity', label: 'Produtividade' }
  ];

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === selectedCategory);

  const handleConnect = (integrationId) => {
    setConnectedIntegrations(prev => [...prev, integrationId]);
  };

  const handleDisconnect = (integrationId) => {
    setConnectedIntegrations(prev => prev.filter(id => id !== integrationId));
  };

  const isConnected = (integrationId) => {
    return connectedIntegrations.includes(integrationId);
  };

  const getColorClasses = (color) => {
    const colors = {
      green: 'from-green-400 to-green-600',
      purple: 'from-purple-400 to-purple-600',
      red: 'from-red-400 to-red-600',
      blue: 'from-blue-400 to-blue-600',
      orange: 'from-orange-400 to-orange-600',
      yellow: 'from-yellow-400 to-yellow-600',
      pink: 'from-pink-400 to-pink-600',
      indigo: 'from-indigo-400 to-indigo-600'
    };
    return colors[color] || 'from-gray-400 to-gray-600';
  };

  const IntegrationCard = ({ integration }) => {
    const connected = isConnected(integration.id);
    const Icon = integration.icon;

    return (
      <Card className="p-6 hover:shadow-md transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${getColorClasses(integration.color)} rounded-xl flex items-center justify-center`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{integration.name}</h3>
              <Badge variant="outline" className="text-xs">
                {integration.category}
              </Badge>
            </div>
          </div>
          {connected && (
            <Badge className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              Conectado
            </Badge>
          )}
        </div>

        <p className="text-gray-600 mb-6">{integration.description}</p>

        <div className="flex items-center justify-between">
          {connected ? (
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDisconnect(integration.id)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Desconectar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Settings className="h-4 w-4 mr-1" />
                Configurar
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => handleConnect(integration.id)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Conectar
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-500 hover:text-gray-700"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Zap className="h-8 w-8 mr-3 text-yellow-500" />
          Integrações
        </h1>
        <p className="text-gray-600 mt-1">
          Conecte suas ferramentas favoritas para turbinar seu atendimento
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Integrações Disponíveis</p>
              <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
            </div>
            <Zap className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conectadas</p>
              <p className="text-2xl font-bold text-green-600">{connectedIntegrations.length}</p>
            </div>
            <Check className="h-8 w-8 text-green-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categorias</p>
              <p className="text-2xl font-bold text-blue-600">{categories.length - 1}</p>
            </div>
            <Settings className="h-8 w-8 text-blue-400" />
          </div>
        </Card>
      </div>

      {/* Category Filter */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id 
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" 
                : "text-gray-600 hover:text-gray-800"
              }
            >
              {category.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Popular Integrations */}
      {selectedCategory === 'all' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mais Populares</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {integrations
              .filter(i => ['whatsapp', 'gmail', 'slack'].includes(i.id))
              .map(integration => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
          </div>
        </div>
      )}

      {/* All Integrations */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {selectedCategory === 'all' ? 'Todas as Integrações' : `Categoria: ${categories.find(c => c.id === selectedCategory)?.label}`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map(integration => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      </div>

      {/* Help Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Precisa de ajuda com integrações?
          </h3>
          <p className="text-gray-600 mb-4">
            Nossa equipe pode ajudar você a configurar e otimizar suas integrações
          </p>
          <div className="flex justify-center space-x-3">
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
              <Mail className="h-4 w-4 mr-2" />
              Contatar Suporte
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Documentação
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}