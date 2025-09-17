/**
 * Cloudflare Worker para Star Print Talks
 * API Backend usando Cloudflare Workers
 */

import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase
const supabaseUrl = 'https://pzxqinijxqmiyvgkmohf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eHFpbmlqeHFtaXl2Z2ttb2hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODEyMDMzOSwiZXhwIjoyMDczNjk2MzM5fQ.Y5b9U-fJdoW7kAYeH_J7nKWxeZCnJNbMSWXCMfZTM3o'

const supabase = createClient(supabaseUrl, supabaseKey)

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

// API Routes
const routes = {
  // Health check
  'GET /health': async () => {
    return new Response(JSON.stringify({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'Star Print Talks API'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  },

  // Users endpoints
  'GET /api/users': async (request) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
      
      if (error) throw error
      
      return new Response(JSON.stringify(data), {
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
  'GET /api/clients': async (request) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  'POST /api/clients': async (request) => {
    try {
      const body = await request.json()
      const { data, error } = await supabase
        .from('clients')
        .insert([body])
        .select()
      
      if (error) throw error
      
      return new Response(JSON.stringify(data[0]), {
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
  'GET /api/tickets': async (request) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          clients(name, email, company),
          assigned_user:users!assigned_to(full_name, email)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  'POST /api/tickets': async (request) => {
    try {
      const body = await request.json()
      const { data, error } = await supabase
        .from('tickets')
        .insert([body])
        .select()
      
      if (error) throw error
      
      return new Response(JSON.stringify(data[0]), {
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
  'GET /api/conversations': async (request) => {
    try {
      const url = new URL(request.url)
      const ticketId = url.searchParams.get('ticket_id')
      
      if (!ticketId) {
        return new Response(JSON.stringify({ error: 'ticket_id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          sender:users!sender_id(full_name, email)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },

  'POST /api/conversations': async (request) => {
    try {
      const body = await request.json()
      const { data, error } = await supabase
        .from('conversations')
        .insert([body])
        .select()
      
      if (error) throw error
      
      return new Response(JSON.stringify(data[0]), {
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
  'GET /api/notifications': async (request) => {
    try {
      const url = new URL(request.url)
      const userId = url.searchParams.get('user_id')
      
      if (!userId) {
        return new Response(JSON.stringify({ error: 'user_id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      return new Response(JSON.stringify(data), {
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
