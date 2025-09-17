/**
 * Cloudflare Worker para Star Print Talks
 * API Backend usando Cloudflare D1 Database
 */

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Handle CORS preflight
function handleCORS(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }
}

// Helper function to generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// API Routes
const routes = {
  // Health check
  'GET /health': async () => {
    return new Response(JSON.stringify({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'Star Print Talks API (D1)'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  },

  // Users endpoints
  'GET /api/users': async (request, env) => {
    try {
      const { results } = await env.starprinttalks_db.prepare('SELECT * FROM users ORDER BY created_at DESC').all()
      
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  'POST /api/users': async (request, env) => {
    try {
      const body = await request.json()
      
      // Gerar UUID se não fornecido
      if (!body.id) {
        body.id = generateUUID()
      }
      
      const { success, error } = await env.starprinttalks_db
        .prepare('INSERT INTO users (id, email, full_name, role, is_active) VALUES (?, ?, ?, ?, ?)')
        .bind(body.id, body.email, body.full_name, body.role || 'client', body.is_active !== false)
        .run()
      
      if (!success) throw new Error(error)
      
      // Buscar o usuário criado
      const { results } = await env.starprinttalks_db
        .prepare('SELECT * FROM users WHERE id = ?')
        .bind(body.id)
        .first()
      
      return new Response(JSON.stringify(results), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  // Clients endpoints
  'GET /api/clients': async (request, env) => {
    try {
      const { results } = await env.starprinttalks_db
        .prepare('SELECT * FROM clients ORDER BY created_at DESC')
        .all()
      
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  'POST /api/clients': async (request, env) => {
    try {
      const body = await request.json()
      
      // Gerar UUID se não fornecido
      if (!body.id) {
        body.id = generateUUID()
      }
      
      const { success, error } = await env.starprinttalks_db
        .prepare('INSERT INTO clients (id, name, email, phone, company, status) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(
          body.id, 
          body.name, 
          body.email, 
          body.phone || null, 
          body.company || null, 
          body.status || 'active'
        )
        .run()
      
      if (!success) throw new Error(error)
      
      // Buscar o cliente criado
      const { results } = await env.starprinttalks_db
        .prepare('SELECT * FROM clients WHERE id = ?')
        .bind(body.id)
        .first()
      
      return new Response(JSON.stringify(results), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  // Tickets endpoints
  'GET /api/tickets': async (request, env) => {
    try {
      const { results } = await env.starprinttalks_db
        .prepare(`
          SELECT 
            t.*,
            c.name as client_name,
            c.email as client_email,
            c.company as client_company,
            u.full_name as assigned_user_name,
            u.email as assigned_user_email,
            creator.full_name as creator_name,
            creator.email as creator_email
          FROM tickets t
          LEFT JOIN clients c ON t.client_id = c.id
          LEFT JOIN users u ON t.assigned_to = u.id
          LEFT JOIN users creator ON t.created_by = creator.id
          ORDER BY t.created_at DESC
        `)
        .all()
      
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  'POST /api/tickets': async (request, env) => {
    try {
      const body = await request.json()
      
      // Gerar UUID se não fornecido
      if (!body.id) {
        body.id = generateUUID()
      }
      
      const { success, error } = await env.starprinttalks_db
        .prepare('INSERT INTO tickets (id, title, description, priority, status, client_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(
          body.id,
          body.title,
          body.description || null,
          body.priority || 'medium',
          body.status || 'open',
          body.client_id,
          body.created_by || '00000000-0000-0000-0000-000000000000' // Usuário sistema
        )
        .run()
      
      if (!success) throw new Error(error)
      
      // Buscar o ticket criado com joins
      const { results } = await env.starprinttalks_db
        .prepare(`
          SELECT 
            t.*,
            c.name as client_name,
            c.email as client_email,
            c.company as client_company,
            u.full_name as assigned_user_name,
            u.email as assigned_user_email,
            creator.full_name as creator_name,
            creator.email as creator_email
          FROM tickets t
          LEFT JOIN clients c ON t.client_id = c.id
          LEFT JOIN users u ON t.assigned_to = u.id
          LEFT JOIN users creator ON t.created_by = creator.id
          WHERE t.id = ?
        `)
        .bind(body.id)
        .first()
      
      return new Response(JSON.stringify(results), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  // Conversations endpoints
  'GET /api/conversations': async (request, env) => {
    try {
      const url = new URL(request.url)
      const ticketId = url.searchParams.get('ticket_id')
      
      if (!ticketId) {
        return new Response(JSON.stringify({ error: 'ticket_id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { results } = await env.starprinttalks_db
        .prepare(`
          SELECT 
            c.*,
            u.full_name as sender_name,
            u.email as sender_email
          FROM conversations c
          LEFT JOIN users u ON c.sender_id = u.id
          WHERE c.ticket_id = ?
          ORDER BY c.created_at ASC
        `)
        .bind(ticketId)
        .all()
      
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  'POST /api/conversations': async (request, env) => {
    try {
      const body = await request.json()
      
      // Gerar UUID se não fornecido
      if (!body.id) {
        body.id = generateUUID()
      }
      
      const { success, error } = await env.starprinttalks_db
        .prepare('INSERT INTO conversations (id, ticket_id, sender_id, message, message_type) VALUES (?, ?, ?, ?, ?)')
        .bind(
          body.id,
          body.ticket_id,
          body.sender_id,
          body.message,
          body.message_type || 'text'
        )
        .run()
      
      if (!success) throw new Error(error)
      
      // Buscar a conversa criada
      const { results } = await env.starprinttalks_db
        .prepare('SELECT * FROM conversations WHERE id = ?')
        .bind(body.id)
        .first()
      
      return new Response(JSON.stringify(results), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  // Notifications endpoints
  'GET /api/notifications': async (request, env) => {
    try {
      const url = new URL(request.url)
      const userId = url.searchParams.get('user_id')
      
      if (!userId) {
        return new Response(JSON.stringify({ error: 'user_id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { results } = await env.starprinttalks_db
        .prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC')
        .bind(userId)
        .all()
      
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  // Update client
  'PUT /api/clients': async (request, env) => {
    try {
      const url = new URL(request.url)
      const id = url.searchParams.get('id')
      const body = await request.json()
      
      if (!id) {
        return new Response(JSON.stringify({ error: 'id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { success, error } = await env.starprinttalks_db
        .prepare('UPDATE clients SET name = ?, email = ?, phone = ?, company = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(body.name, body.email, body.phone || null, body.company || null, body.status || 'active', id)
        .run()
      
      if (!success) throw new Error(error)
      
      // Buscar o cliente atualizado
      const { results } = await env.starprinttalks_db
        .prepare('SELECT * FROM clients WHERE id = ?')
        .bind(id)
        .first()
      
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  // Delete client
  'DELETE /api/clients': async (request, env) => {
    try {
      const url = new URL(request.url)
      const id = url.searchParams.get('id')
      
      if (!id) {
        return new Response(JSON.stringify({ error: 'id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { success, error } = await env.starprinttalks_db
        .prepare('DELETE FROM clients WHERE id = ?')
        .bind(id)
        .run()
      
      if (!success) throw new Error(error)
      
      return new Response(JSON.stringify({ message: 'Client deleted successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  // Update ticket
  'PUT /api/tickets': async (request, env) => {
    try {
      const url = new URL(request.url)
      const id = url.searchParams.get('id')
      const body = await request.json()
      
      if (!id) {
        return new Response(JSON.stringify({ error: 'id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { success, error } = await env.starprinttalks_db
        .prepare('UPDATE tickets SET title = ?, description = ?, priority = ?, status = ?, assigned_to = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(body.title, body.description || null, body.priority || 'medium', body.status || 'open', body.assigned_to || null, id)
        .run()
      
      if (!success) throw new Error(error)
      
      // Buscar o ticket atualizado com joins
      const { results } = await env.starprinttalks_db
        .prepare(`
          SELECT 
            t.*,
            c.name as client_name,
            c.email as client_email,
            c.company as client_company,
            u.full_name as assigned_user_name,
            u.email as assigned_user_email,
            creator.full_name as creator_name,
            creator.email as creator_email
          FROM tickets t
          LEFT JOIN clients c ON t.client_id = c.id
          LEFT JOIN users u ON t.assigned_to = u.id
          LEFT JOIN users creator ON t.created_by = creator.id
          WHERE t.id = ?
        `)
        .bind(id)
        .first()
      
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  // Delete ticket
  'DELETE /api/tickets': async (request, env) => {
    try {
      const url = new URL(request.url)
      const id = url.searchParams.get('id')
      
      if (!id) {
        return new Response(JSON.stringify({ error: 'id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { success, error } = await env.starprinttalks_db
        .prepare('DELETE FROM tickets WHERE id = ?')
        .bind(id)
        .run()
      
      if (!success) throw new Error(error)
      
      return new Response(JSON.stringify({ message: 'Ticket deleted successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  // Dashboard stats endpoint
  'GET /api/dashboard/stats': async (request, env) => {
    try {
      // Get basic counts
      const [clients, tickets, conversations] = await Promise.all([
        env.starprinttalks_db.prepare('SELECT COUNT(*) as count FROM clients WHERE status = "active"').first(),
        env.starprinttalks_db.prepare('SELECT COUNT(*) as count FROM tickets WHERE status != "closed"').first(),
        env.starprinttalks_db.prepare('SELECT COUNT(*) as count FROM conversations').first()
      ])

      // Get ticket stats by status
      const ticketStats = await env.starprinttalks_db
        .prepare('SELECT status, COUNT(*) as count FROM tickets GROUP BY status')
        .all()

      const stats = {
        active_conversations: conversations.results?.count || 0,
        open_tickets: ticketStats.results?.find(s => s.status === 'open')?.count || 0,
        active_clients: clients.results?.count || 0,
        satisfaction: 94, // Mock for now
        ticket_stats: ticketStats.results || []
      }
      
      return new Response(JSON.stringify(stats), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  // AI Assistant endpoint
  'POST /api/ai/assist': async (request, env) => {
    try {
      const body = await request.json()
      const { message, context } = body
      
      if (!message) {
        return new Response(JSON.stringify({ error: 'message is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Use Cloudflare AI
      const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
        messages: [
          {
            role: 'system',
            content: `You are a helpful customer support assistant for Star Print Talks. 
            You help users with their tickets, provide information about services, 
            and assist with technical issues. Be friendly, professional, and helpful.
            Always respond in Portuguese.
            
            Context: ${context || 'No additional context provided'}`
          },
          {
            role: 'user',
            content: message
          }
        ]
      })

      return new Response(JSON.stringify({ 
        response: aiResponse.response,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  }
}

// Main worker handler
export default {
  async fetch(request, env, ctx) {
    // Handle CORS
    const corsResponse = handleCORS(request)
    if (corsResponse) return corsResponse

    const url = new URL(request.url)
    const method = request.method
    const path = `${method} ${url.pathname}`
    
    // Find matching route
    const route = routes[path]
    
    if (route) {
      return await route(request, env)
    }
    
    // 404 for unmatched routes
    return new Response(JSON.stringify({ 
      error: 'Route not found',
      path: path,
      availableRoutes: Object.keys(routes)
    }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}
