import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  MessageSquare, 
  Search, 
  Mail, 
  Clock, 
  User, 
  Phone,
  MessageCircle,
  Send
} from 'lucide-react';
import { mockDataService } from '../../services/mockDataService';

const channelIcons = {
  email: Mail,
  chat: MessageCircle,
  phone: Phone,
  whatsapp: MessageSquare
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

export function Inbox({ user }) {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    filterConversations();
  }, [conversations, searchTerm]);

  const loadConversations = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const conversationsData = mockDataService.getConversations();
    setConversations(conversationsData);
    setIsLoading(false);
  };

  const filterConversations = () => {
    let filtered = conversations;

    if (searchTerm) {
      filtered = filtered.filter(conv => 
        conv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredConversations(filtered);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m atrás`;
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else {
      return `${diffDays}d atrás`;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // Simulate sending message
      setNewMessage('');
      // In a real app, this would update the conversation
    }
  };

  const ConversationCard = ({ conversation, isSelected }) => {
    const ChannelIcon = channelIcons[conversation.channel] || MessageSquare;
    
    return (
      <Card 
        className={`p-4 cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'ring-2 ring-amber-500 bg-amber-50' : 'hover:bg-gray-50'
        }`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {conversation.clientName}
              </h3>
              <div className="flex items-center space-x-2">
                <ChannelIcon className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {formatTime(conversation.lastMessageAt)}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1 truncate">
              {conversation.subject}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {conversation.lastMessage}
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Badge className={priorityColors[conversation.priority]}>
                  {conversation.priority}
                </Badge>
                <span className="text-xs text-gray-500">
                  Agente: {conversation.agent}
                </span>
              </div>
              {conversation.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {conversation.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const ConversationDetail = ({ conversation }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {conversation.clientName}
            </h2>
            <p className="text-sm text-gray-600">{conversation.clientEmail}</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {conversation.subject}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Mock messages */}
        <div className="flex space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-sm text-gray-800">
                Olá, estou com dificuldades para acessar minha conta. Toda vez que tento fazer login, aparece uma mensagem de erro.
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {conversation.clientName} • há 2 horas
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <div className="flex-1 max-w-xs">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg p-3">
              <p className="text-sm">
                Olá! Vou verificar isso imediatamente. Pode me informar qual email você está usando para fazer login?
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">
              {conversation.agent} • há 1 hora
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-sm text-gray-800">
                Estou usando o email {conversation.clientEmail}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {conversation.clientName} • há 30 min
            </p>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <MessageSquare className="h-8 w-8 mr-3 text-blue-500" />
          Conversas
        </h1>
        <p className="text-gray-600 mt-1">
          Gerencie todas as conversas com seus clientes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar conversas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma conversa encontrada</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <ConversationCard
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={selectedConversation?.id === conversation.id}
                  />
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Conversation Detail */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            {selectedConversation ? (
              <ConversationDetail conversation={selectedConversation} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecione uma conversa
                  </h3>
                  <p className="text-gray-500">
                    Escolha uma conversa da lista para ver os detalhes
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}