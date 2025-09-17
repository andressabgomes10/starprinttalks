import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Camera,
  Save,
  LogOut,
  Shield,
  Activity
} from 'lucide-react';

export function Profile({ user, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Usuário Demo',
    email: user?.email || 'demo@cajatalks.com',
    phone: '(11) 99999-9999',
    role: user?.role || 'Admin',
    location: 'São Paulo, SP',
    joinDate: '2024-01-15',
    bio: 'Especialista em atendimento ao cliente com mais de 5 anos de experiência.'
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <User className="h-8 w-8 mr-3 text-blue-500" />
          Meu Perfil
        </h1>
        <p className="text-gray-600 mt-1">
          Gerencie suas informações pessoais e configurações de conta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card className="p-6 text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {profileData.name}
            </h2>
            <p className="text-gray-600 mb-2">{profileData.role}</p>
            <p className="text-sm text-gray-500 mb-4">{profileData.email}</p>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <MapPin className="h-4 w-4 mr-2" />
                {profileData.location}
              </div>
              <div className="flex items-center justify-center">
                <Calendar className="h-4 w-4 mr-2" />
                Desde {formatJoinDate(profileData.joinDate)}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={onLogout}
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair da Conta
              </Button>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Estatísticas</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tickets Resolvidos</span>
                <span className="font-semibold text-blue-600">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avaliação Média</span>
                <span className="font-semibold text-amber-600">4.8⭐</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tempo de Resposta</span>
                <span className="font-semibold text-green-600">2.3h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Este Mês</span>
                <span className="font-semibold text-purple-600">45 tickets</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Informações Pessoais
              </h3>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="text-amber-600 border-amber-200 hover:bg-amber-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="text-gray-600"
                  >
                    Cancelar
                  </Button>
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
                        Salvar
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  {isEditing ? (
                    <Input
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <User className="h-4 w-4 text-gray-400 mr-3" />
                      <span>{profileData.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-4 w-4 text-gray-400 mr-3" />
                      <span>{profileData.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  {isEditing ? (
                    <Input
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-4 w-4 text-gray-400 mr-3" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localização
                  </label>
                  {isEditing ? (
                    <Input
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biografia
                </label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span>{profileData.bio}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-500" />
              Segurança da Conta
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Alterar Senha</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Mantenha sua conta segura com uma senha forte
                </p>
                <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  Alterar Senha
                </Button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Autenticação 2FA</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Adicione uma camada extra de segurança
                </p>
                <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                  Configurar 2FA
                </Button>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-500" />
              Atividade Recente
            </h3>
            <div className="space-y-3">
              {[
                { action: 'Login realizado', time: 'Agora há pouco', type: 'login' },
                { action: 'Ticket #TK001 atualizado', time: 'há 2 horas', type: 'ticket' },
                { action: 'Perfil editado', time: 'há 1 dia', type: 'profile' },
                { action: 'Nova conversa iniciada', time: 'há 2 dias', type: 'conversation' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'login' ? 'bg-green-500' :
                    activity.type === 'ticket' ? 'bg-blue-500' :
                    activity.type === 'profile' ? 'bg-amber-500' :
                    'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}