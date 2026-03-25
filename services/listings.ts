import { supabase, isSupabaseConfigured } from './supabase'

export interface Listing {
  id: string
  title: string
  description?: string
  price: number
  condition_rating: number
  distance_km: number
  specifications?: Record<string, any>
  negotiation_logic: 'standard' | 'aggressive' | 'strict'
  seller_id?: string
  status: 'active' | 'sold' | 'pending'
  created_at: string
  updated_at: string
}

export interface ListingFilters {
  maxDistance?: number
  maxPrice?: number
  minCondition?: number
  status?: 'active' | 'sold' | 'pending'
}

/**
 * Fetch all active listings with optional filters
 */
export async function getListings(filters?: ListingFilters): Promise<Listing[]> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase not configured, returning mock data')
    return getMockListings()
  }

  let query = supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  } else {
    query = query.eq('status', 'active')
  }

  if (filters?.maxDistance) {
    query = query.lte('distance_km', filters.maxDistance)
  }

  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice)
  }

  if (filters?.minCondition) {
    query = query.gte('condition_rating', filters.minCondition)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching listings:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch a single listing by ID
 */
export async function getListing(id: string): Promise<Listing | null> {
  if (!isSupabaseConfigured || !supabase) {
    return getMockListings().find(l => l.id === id) || null
  }

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching listing:', error)
    return null
  }

  return data
}

/**
 * Create a new listing
 */
export async function createListing(listing: Omit<Listing, 'id' | 'created_at' | 'updated_at'>): Promise<Listing> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase
    .from('listings')
    .insert(listing)
    .select()
    .single()

  if (error) {
    console.error('Error creating listing:', error)
    throw error
  }

  return data
}

/**
 * Update a listing
 */
export async function updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating listing:', error)
    throw error
  }

  return data
}

/**
 * Delete a listing
 */
export async function deleteListing(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured')
  }

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting listing:', error)
    throw error
  }
}

/**
 * Mock listings for development/fallback
 */
function getMockListings(): Listing[] {
  // No more mock data - using real Supabase data
  return []
}
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Quantum Latency Shield',
      description: 'Quantum encryption module',
      price: 3150,
      condition_rating: 1.0,
      distance_km: 12.5,
      specifications: { encryption: 'AES-Q512' },
      negotiation_logic: 'strict',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]
}
