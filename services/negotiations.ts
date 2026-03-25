import { supabase, isSupabaseConfigured } from './supabase'
import { simulateNegotiation } from './agentNegotiator'

export interface NegotiationLogEntry {
  actor: string
  message: string
  timestamp: string
}

export interface NegotiationMessage {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  actor: 'buyer' | 'seller'
  message: string
  timestamp: string
}

export interface NegotiationSession {
  listingId: string
  buyerId: string
  sellerId: string
  messages: NegotiationMessage[]
  status: 'active' | 'accepted' | 'rejected' | 'expired'
  finalPrice?: number
}

/**
 * Start a negotiation session for a listing
 */
export async function startNegotiation(
  listingId: string,
  buyerId: string,
  sellerId: string
): Promise<NegotiationSession> {
  const session: NegotiationSession = {
    listingId,
    buyerId,
    sellerId,
    messages: [],
    status: 'active',
  }

  return session
}

/**
 * Add a message to a negotiation
 */
export async function addNegotiationMessage(
  listingId: string,
  buyerId: string,
  sellerId: string,
  actor: 'buyer' | 'seller',
  message: string
): Promise<NegotiationMessage> {
  if (!isSupabaseConfigured || !supabase) {
    // Return mock message
    return {
      id: Math.random().toString(36).substr(2, 9),
      listing_id: listingId,
      buyer_id: buyerId,
      seller_id: sellerId,
      actor,
      message,
      timestamp: new Date().toISOString(),
    }
  }

  const { data, error } = await supabase
    .from('negotiation_messages')
    .insert({
      listing_id: listingId,
      buyer_id: buyerId,
      seller_id: sellerId,
      actor,
      message,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding negotiation message:', error)
    throw error
  }

  return data
}

/**
 * Get all messages for a negotiation
 */
export async function getNegotiationMessages(listingId: string): Promise<NegotiationMessage[]> {
  if (!isSupabaseConfigured || !supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('negotiation_messages')
    .select('*')
    .eq('listing_id', listingId)
    .order('timestamp', { ascending: true })

  if (error) {
    console.error('Error fetching negotiation messages:', error)
    return []
  }

  return data || []
}

/**
 * Run simulated negotiation for a listing
 * This uses the existing mock negotiation logic
 */
export function runSimulatedNegotiation(listingJsonLd: any): NegotiationLogEntry[] {
  return simulateNegotiation(listingJsonLd)
}

/**
 * Complete a negotiation (accept or reject)
 */
export async function completeNegotiation(
  listingId: string,
  status: 'accepted' | 'rejected',
  finalPrice?: number
): Promise<void> {
  // This would update the listing status and any related records
  // For now, it's a placeholder for future implementation
  console.log(`Negotiation ${listingId} ${status} at price ${finalPrice}`)
}

/**
 * Calculate a counter-offer based on negotiation logic
 */
export function calculateCounterOffer(
  originalPrice: number,
  offerPrice: number,
  negotiationLogic: 'standard' | 'aggressive' | 'strict'
): number {
  const midpoint = (originalPrice + offerPrice) / 2

  switch (negotiationLogic) {
    case 'aggressive':
      // Seller stands firm, only moves 20% toward offer
      return originalPrice - (originalPrice - offerPrice) * 0.2
    case 'strict':
      // Seller doesn't budge
      return originalPrice
    case 'standard':
    default:
      // Standard negotiation, meet halfway
      return midpoint
  }
}
