import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Users,
  Building,
  Save,
  Check
} from 'lucide-react';

export function Settings({ user }) {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'general', label: 'Geral', icon: SettingsIcon },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'company', label: 'Empresa', icon: Building },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'team', label: 'Equipe', icon: Users },
    { id: 'integrations', label: 'Integrações', icon: Globe }
  ];

  const TabButton = ({ tab, isActive }) => (
    <button
      onClick={() => setActiveTab(tab.id)}
      className={`flex items-center space-x-2 w-full px-4 py-3 text-left rounded-lg transition-colors ${
        isActive 
          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <tab.icon className="h-5 w-5" />
      <span>{tab.label}</span>
    </button>
  );

  const GeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações Gerais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Empresa
            </label>
            <Input defaultValue="Cajá Talks" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de Contato
            </label>
            <Input defaultValue="contato@cajatalks.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <Input defaultValue="(11) 99999-9999" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuso Horário
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option>America/Sao_Paulo</option>
              <option>America/New_York</option>
              <option>Europe/London</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificações</h3>
        <div className="space-y-4">
          {[
            { label: 'Novos tickets', description: 'Ser notificado quando um novo ticket for criado' },
            { label: 'Mensagens', description: 'Receber notificações de novas mensagens' },
            { label: 'Relatórios', description: 'Relatórios semanais e mensais' },
            { label: 'Atualizações', description: 'Novidades e atualizações do sistema' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{item.label}</h4>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Segurança</h3>
        <div className="space-y-6">
          <Card className="p-4">
            <h4 className="font-medium text-gray-900 mb-2">Alterar Senha</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha Atual
                </label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha
                </label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nova Senha
                </label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50">
                Alterar Senha
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium text-gray-900 mb-2">Autenticação de Dois Fatores</h4>
            <p className="text-sm text-gray-600 mb-4">
              Adicione uma camada extra de segurança à sua conta
            </p>
            <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
              Ativar 2FA
            </Button>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium text-gray-900 mb-2">Sessões Ativas</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Sessão Atual</p>
                  <p className="text-sm text-gray-500">Chrome, São Paulo • Agora</p>
                </div>
                <span className="text-green-600 text-sm font-medium">Ativo</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Mobile App</p>
                  <p className="text-sm text-gray-500">iOS, São Paulo • há 2 horas</p>
                </div>
                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  Encerrar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const CompanySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Empresa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Razão Social
            </label>
            <Input defaultValue="Cajá Talks Tecnologia Ltda" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CNPJ
            </label>
            <Input defaultValue="12.345.678/0001-99" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inscrição Estadual
            </label>
            <Input defaultValue="123.456.789.123" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço
            </label>
            <Input defaultValue="Rua das Flores, 123" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cidade
            </label>
            <Input defaultValue="São Paulo" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CEP
            </label>
            <Input defaultValue="01234-567" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return <GeneralSettings />;
      case 'notifications': return <NotificationSettings />;
      case 'security': return <SecuritySettings />;
      case 'company': return <CompanySettings />;
      default: 
        return (
          <div className="text-center py-12">
            <SettingsIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Em Desenvolvimento
            </h3>
            <p className="text-gray-500">
              Esta seção estará disponível em breve.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <SettingsIcon className="h-8 w-8 mr-3 text-gray-600" />
          Configurações
        </h1>
        <p className="text-gray-600 mt-1">
          Gerencie as configurações da sua conta e empresa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                />
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {renderTabContent()}
            
            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  {saved && (
                    <div className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-2" />
                      <span className="text-sm">Configurações salvas com sucesso!</span>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Salvando...
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}