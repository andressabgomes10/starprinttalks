import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  FileText,
  Calendar,
  User,
  Tag,
  TrendingUp
} from 'lucide-react';
import { mockDataService } from '../../services/mockDataService';

const statusColors = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-gray-100 text-gray-800'
};

const statusLabels = {
  published: 'Publicado',
  draft: 'Rascunho',
  archived: 'Arquivado'
};

export function KnowledgeBase({ user }) {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, categoryFilter]);

  const loadArticles = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const articlesData = mockDataService.getArticles();
    setArticles(articlesData);
    setIsLoading(false);
  };

  const filterArticles = () => {
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(article => article.category === categoryFilter);
    }

    setFilteredArticles(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getUniqueCategories = () => {
    const categories = articles.map(article => article.category);
    return [...new Set(categories)];
  };

  const ArticleCard = ({ article }) => (
    <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setSelectedArticle(article)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{article.title}</h3>
            <p className="text-sm text-gray-500">#{article.id}</p>
          </div>
        </div>
        <Badge className={statusColors[article.status]}>
          {statusLabels[article.status]}
        </Badge>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {article.content.substring(0, 120)}...
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {article.author}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(article.createdAt)}
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {article.views} visualizações
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
            {article.category}
          </span>
          <div className="flex space-x-1">
            {article.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {tag}
              </span>
            ))}
            {article.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                +{article.tags.length - 2}
              </span>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
      </div>
    </Card>
  );

  const ArticleDetail = ({ article, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Visualizar Artigo</h2>
            <Button variant="ghost" onClick={onClose}>✕</Button>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>
              <Badge className={statusColors[article.status]}>
                {statusLabels[article.status]}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                Por {article.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Criado em {formatDate(article.createdAt)}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Atualizado em {formatDate(article.updatedAt)}
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {article.views} visualizações
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {article.category}
              </span>
              {article.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {article.content}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              ID do Artigo: {article.id}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="text-gray-600">
                <Eye className="h-4 w-4 mr-2" />
                Visualizar Público
              </Button>
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                <Edit className="h-4 w-4 mr-2" />
                Editar Artigo
              </Button>
            </div>
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
            <BookOpen className="h-8 w-8 mr-3 text-green-500" />
            Base de Conhecimento
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie artigos e documentação para sua equipe e clientes
          </p>
        </div>
        <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Novo Artigo
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Todas as Categorias</option>
            {getUniqueCategories().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Artigos</p>
              <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Publicados</p>
              <p className="text-2xl font-bold text-green-600">
                {articles.filter(a => a.status === 'published').length}
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-green-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Visualizações</p>
              <p className="text-2xl font-bold text-blue-600">
                {articles.reduce((acc, a) => acc + a.views, 0)}
              </p>
            </div>
            <Eye className="h-8 w-8 text-blue-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categorias</p>
              <p className="text-2xl font-bold text-purple-600">
                {getUniqueCategories().length}
              </p>
            </div>
            <Tag className="h-8 w-8 text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum artigo encontrado
              </h3>
              <p className="text-gray-500">
                {searchTerm || categoryFilter !== 'all'
                  ? 'Tente ajustar os filtros para encontrar mais resultados.'
                  : 'Comece criando seu primeiro artigo.'}
              </p>
            </Card>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <ArticleDetail 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}
    </div>
  );
}