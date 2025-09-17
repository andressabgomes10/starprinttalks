import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth helpers
export const authService = {
  // Login com email e senha
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Registro de novo usuário
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Obter usuário atual
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Resetar senha
  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },

  // Escutar mudanças de auth
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const dbService = {
  // Tickets
  async getTickets() {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createTicket(ticket) {
    const { data, error } = await supabase
      .from('tickets')
      .insert([ticket])
      .select();
    return { data: data?.[0], error };
  },

  async updateTicket(id, updates) {
    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', id)
      .select();
    return { data: data?.[0], error };
  },

  async deleteTicket(id) {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Clientes
  async getClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createClient(client) {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select();
    return { data: data?.[0], error };
  },

  async updateClient(id, updates) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select();
    return { data: data?.[0], error };
  },

  // Conversas
  async getConversations() {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('last_message_at', { ascending: false });
    return { data, error };
  },

  async createConversation(conversation) {
    const { data, error } = await supabase
      .from('conversations')
      .insert([conversation])
      .select();
    return { data: data?.[0], error };
  },

  // Mensagens
  async getMessages(conversationId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  async sendMessage(message) {
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select();
    return { data: data?.[0], error };
  },

  // Artigos da base de conhecimento
  async getArticles() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createArticle(article) {
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select();
    return { data: data?.[0], error };
  },

  async updateArticle(id, updates) {
    const { data, error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select();
    return { data: data?.[0], error };
  },

  // Equipe
  async getTeamMembers() {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('name');
    return { data, error };
  },

  // Log de atividades
  async getActivityLog() {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    return { data, error };
  },

  async logActivity(activity) {
    const { data, error } = await supabase
      .from('activity_log')
      .insert([activity])
      .select();
    return { data: data?.[0], error };
  }
};