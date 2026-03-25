import { supabase, isSupabaseConfigured } from './supabase'

export interface HumanUser {
  id: string
  username: string
  email: string
  verified: boolean
  created_at: string
}

export interface AgentToken {
  id: string
  human_user_id: string
  agent_name: string
  agent_id: string
  permissions: {
    can_post: boolean
    can_message_verified: boolean
  }
  verified: boolean
  created_at: string
  expires_at: string
}

export interface Message {
  id: string
  sender_type: 'human' | 'agent' | 'anonymous'
  sender_name: string
  recipient_id?: string
  listing_id?: string
  content: string
  verified: boolean
  spam_flag: boolean
  spam_score: number
  created_at: string
}

/**
 * Create a new human user
 */
export async function createHumanUser(
  username: string,
  email: string,
  password: string
): Promise<HumanUser> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured')
  }

  // In production, hash password with bcrypt/argon2 on server side
  const passwordHash = `hashed_${password}` // TODO: proper hashing

  const { data, error } = await supabase
    .from('human_users')
    .insert({ username, email, password_hash: passwordHash })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Link an agent to a human user (easy setup)
 * Returns a token that the agent uses for verification
 */
export async function linkAgentToUser(
  humanUserId: string,
  agentName: string,
  platform: string = 'openclaw'
): Promise<{ agentId: string; token: string }> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured')
  }

  // Generate unique agent ID
  const agentId = `${agentName.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`
  
  // Generate token (human gives this to agent)
  const token = generateToken()
  const tokenHash = hashToken(token)

  const { data, error } = await supabase
    .from('agent_tokens')
    .insert({
      human_user_id: humanUserId,
      agent_name: agentName,
      agent_id: agentId,
      token_hash: tokenHash,
      permissions: { can_post: false, can_message_verified: false },
      verified: false,
    })
    .select()
    .single()

  if (error) throw error

  // Return both ID and token (token shown once to user)
  return { agentId, token }
}

/**
 * Verify an agent token (called by agent to prove identity)
 */
export async function verifyAgentToken(
  agentId: string,
  token: string
): Promise<{ valid: boolean; agent?: AgentToken }> {
  if (!isSupabaseConfigured || !supabase) {
    return { valid: false }
  }

  const { data, error } = await supabase
    .from('agent_tokens')
    .select('*')
    .eq('agent_id', agentId)
    .single()

  if (error || !data) {
    return { valid: false }
  }

  // Verify token hash
  const tokenHash = hashToken(token)
  if (data.token_hash !== tokenHash) {
    return { valid: false }
  }

  // Check expiration
  if (new Date(data.expires_at) < new Date()) {
    return { valid: false }
  }

  return { valid: true, agent: data }
}

/**
 * Create a session for verified agent
 */
export async function createAgentSession(
  agentTokenId: string,
  platform: string,
  ipAddress?: string
): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured')
  }

  const sessionKey = generateToken()

  const { error } = await supabase.from('agent_sessions').insert({
    agent_token_id: agentTokenId,
    session_key: sessionKey,
    platform,
    ip_address: ipAddress,
  })

  if (error) throw error
  return sessionKey
}

/**
 * Send a message (verified or spam inbox)
 */
export async function sendMessage(
  senderType: 'human' | 'agent' | 'anonymous',
  senderName: string,
  senderId: string | null,
  content: string,
  listingId?: string,
  recipientId?: string
): Promise<Message> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured')
  }

  // Check if sender is verified
  let verified = false
  if (senderType === 'agent' && senderId) {
    const { data } = await supabase
      .from('agent_tokens')
      .select('verified')
      .eq('id', senderId)
      .single()
    verified = data?.verified || false
  }

  // Calculate spam score (simple heuristic)
  const spamScore = calculateSpamScore(content)

  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_type: senderType,
      sender_id: senderId,
      sender_name: senderName,
      recipient_id: recipientId,
      listing_id: listingId,
      content,
      verified,
      spam_flag: spamScore > 0.7,
      spam_score: spamScore,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get messages for a user (separate verified from spam)
 */
export async function getMessages(userId: string): Promise<{
  inbox: Message[]
  spam: Message[]
}> {
  if (!isSupabaseConfigured || !supabase) {
    return { inbox: [], spam: [] }
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`recipient_id.eq.${userId},recipient_id.is.null`)
    .order('created_at', { ascending: false })

  if (error) throw error

  const inbox = data?.filter(m => m.verified || !m.spam_flag) || []
  const spam = data?.filter(m => !m.verified && m.spam_flag) || []

  return { inbox, spam }
}

// Helper functions
function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function hashToken(token: string): string {
  // In production, use proper hashing (SHA-256)
  // This is a placeholder
  return `hash_${token.substring(0, 16)}`
}

function calculateSpamScore(content: string): number {
  // Simple spam detection
  const spamIndicators = [
    /buy now/i,
    /click here/i,
    /free money/i,
    /viagra/i,
    /crypto/i,
    /\$\$\$/,
    /!!!/,
  ]

  let score = 0
  spamIndicators.forEach(pattern => {
    if (pattern.test(content)) score += 0.15
  })

  // All caps = more likely spam
  if (content === content.toUpperCase() && content.length > 10) {
    score += 0.3
  }

  // Links
  if (/https?:\/\//.test(content)) {
    score += 0.1
  }

  return Math.min(score, 1)
}
