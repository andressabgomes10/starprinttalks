import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Users, 
  Search, 
  Plus, 
  User, 
  Mail, 
  Phone,
  MoreVertical,
  Star,
  Clock,
  Ticket,
  TrendingUp
} from 'lucide-react';
import { mockDataService } from '../../services/mockDataService';

const statusColors = {
  online: 'bg-green-100 text-green-800',
  busy: 'bg-amber-100 text-amber-800',
  away: 'bg-gray-100 text-gray-800',
  offline: 'bg-red-100 text-red-800'
};

const statusLabels = {
  online: 'Online',
  busy: 'Ocupado',
  away: 'Ausente',
  offline: 'Offline'
};

export function Team({ user }) {
  const [team, setTeam] = useState([]);
  const [filteredTeam, setFilteredTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    loadTeam();
  }, []);

  useEffect(() => {
    filterTeam();
  }, [team, searchTerm]);

  const loadTeam = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const teamData = mockDataService.getTeam();
    setTeam(teamData);
    setIsLoading(false);
  };

  const filterTeam = () => {
    let filtered = team;

    if (searchTerm) {
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTeam(filtered);
  };

  const getStatusIcon = (status) => {
    const colors = {
      online: 'bg-green-500',
      busy: 'bg-amber-500',
      away: 'bg-gray-500',
      offline: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const TeamMemberCard = ({ member }) => (
    <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setSelectedMember(member)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusIcon(member.status)} rounded-full border-2 border-white`}></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.role}</p>
            <p className="text-xs text-gray-500">{member.department}</p>
          </div>
        </div>
        <Badge className={statusColors[member.status]}>
          {statusLabels[member.status]}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2" />
          {member.email}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">{member.stats.ticketsResolved}</p>
          <p className="text-xs text-gray-500">Tickets</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-amber-600">{member.stats.customerSatisfaction}⭐</p>
          <p className="text-xs text-gray-500">Satisfação</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          TMR: {member.stats.avgResponseTime}
        </div>
        <div className="flex items-center text-amber-600">
          <Ticket className="h-4 w-4 mr-1" />
          {member.stats.activeTickets} ativos
        </div>
      </div>
    </Card>
  );

  const MemberDetail = ({ member, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Detalhes do Membro</h2>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusIcon(member.status)} rounded-full border-2 border-white`}></div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
              <p className="text-sm text-gray-500">{member.department}</p>
              <Badge className={statusColors[member.status]}>
                {statusLabels[member.status]}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Informações de Contato</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{member.email}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Estatísticas</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tickets Resolvidos:</span>
                  <span className="font-semibold">{member.stats.ticketsResolved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tempo Médio de Resposta:</span>
                  <span className="font-semibold">{member.stats.avgResponseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Satisfação do Cliente:</span>
                  <span className="font-semibold">{member.stats.customerSatisfaction}⭐</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tickets Ativos:</span>
                  <span className="font-semibold text-amber-600">{member.stats.activeTickets}</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Performance Este Mês</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">45</p>
                <p className="text-sm text-gray-600">Tickets Resolvidos</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">98%</p>
                <p className="text-sm text-gray-600">Taxa de Resolução</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">2.1h</p>
                <p className="text-sm text-gray-600">Tempo Médio</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
              <Mail className="h-4 w-4 mr-2" />
              Enviar Mensagem
            </Button>
            <Button variant="outline" className="flex-1">
              <Ticket className="h-4 w-4 mr-2" />
              Atribuir Ticket
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
            Equipe
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie sua equipe de atendimento
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Membro
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar membros da equipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Membros</p>
              <p className="text-2xl font-bold text-gray-900">{team.length}</p>
            </div>
            <Users className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Online</p>
              <p className="text-2xl font-bold text-green-600">
                {team.filter(m => m.status === 'online').length}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ocupados</p>
              <p className="text-2xl font-bold text-amber-600">
                {team.filter(m => m.status === 'busy').length}
              </p>
            </div>
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Satisfação Média</p>
              <p className="text-2xl font-bold text-purple-600">
                {(team.reduce((acc, m) => acc + m.stats.customerSatisfaction, 0) / team.length).toFixed(1)}⭐
              </p>
            </div>
            <Star className="h-8 w-8 text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum membro encontrado
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? 'Tente ajustar o termo de busca para encontrar mais resultados.'
                  : 'Comece adicionando membros à sua equipe.'}
              </p>
            </Card>
          </div>
        ) : (
          filteredTeam.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))
        )}
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <MemberDetail 
          member={selectedMember} 
          onClose={() => setSelectedMember(null)} 
        />
      )}
    </div>
  );
}