import { supabase, isSupabaseConfigured } from './supabase'

export interface CreateListingRequest {
  title: string
  description?: string
  price: number
  distance_km: number
  condition_rating: number
  specifications?: Record<string, any>
  seller_id?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Create a new listing via API
 * Can be called by AI agents or the UI
 */
export async function createListingAPI(
  request: CreateListingRequest
): Promise<ApiResponse<{ id: string; title: string; price: number }>> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error: 'Supabase not configured',
    }
  }

  // Validate
  if (!request.title || request.title.length < 5) {
    return { success: false, error: 'Title must be at least 5 characters' }
  }
  if (request.price <= 0) {
    return { success: false, error: 'Price must be positive' }
  }
  if (request.condition_rating < 0 || request.condition_rating > 1) {
    return { success: false, error: 'Condition must be between 0 and 1' }
  }

  try {
    const { data, error } = await supabase
      .from('listings')
      .insert({
        id: generateUUID(),
        title: request.title,
        description: request.description || '',
        price: request.price,
        distance_km: request.distance_km,
        condition_rating: request.condition_rating,
        specifications: request.specifications || {},
        negotiation_logic: 'standard',
        status: 'active',
        seller_id: request.seller_id || null,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return {
      success: true,
      data: {
        id: data.id,
        title: data.title,
        price: data.price,
      },
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

/**
 * Send a message via API
 */
export async function sendMessageAPI(request: {
  recipient_id?: string
  content: string
  sender_type?: 'human' | 'agent'
  sender_name?: string
}): Promise<ApiResponse<{ id: string }>> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase not configured' }
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        id: generateUUID(),
        recipient_id: request.recipient_id || null,
        content: request.content,
        sender_type: request.sender_type || 'agent',
        sender_name: request.sender_name || 'Claw',
        spam_flag: false,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: { id: data.id } }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

/**
 * Get listings via API
 */
export async function getListingsAPI(filters?: {
  maxDistance?: number
  maxPrice?: number
  limit?: number
}): Promise<ApiResponse<any[]>> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase not configured' }
  }

  try {
    let query = supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (filters?.maxDistance) {
      query = query.lte('distance_km', filters.maxDistance)
    }
    if (filters?.maxPrice) {
      query = query.lte('price', filters.maxPrice)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

/**
 * Process natural language commands from AI agents
 */
export async function processAgentCommand(command: string): Promise<ApiResponse<any>> {
  const cmd = command.toLowerCase().trim()

  // Parse "create listing" commands
  const createMatch = cmd.match(/create\s+listing[:\s]+(.+)/i)
  if (createMatch) {
    // This would need more parsing for full details
    return {
      success: false,
      error: 'Use the form to create a listing with full details',
    }
  }

  // Parse "find" or "search" commands
  if (cmd.startsWith('find ') || cmd.startsWith('search ')) {
    return { success: true, data: { action: 'search', query: cmd.replace(/^(find|search)\s+/i, '') } }
  }

  // Parse "open" commands
  if (cmd.startsWith('open ') || cmd.startsWith('view ')) {
    return { success: true, data: { action: 'open', target: cmd.replace(/^(open|view)\s+/i, '') } }
  }

  return { success: false, error: 'Unknown command. Try: find, search, open, or use the quick actions.' }
}
