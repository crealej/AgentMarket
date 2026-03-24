import { supabase, isSupabaseConfigured } from './supabase'

export interface AgentProfile {
  id: string
  agent_id: string
  name: string
  verified: boolean
  reputation_score: number
  created_at: string
  updated_at: string
}

/**
 * Get agent profile by agent_id
 */
export async function getAgentProfile(agentId: string): Promise<AgentProfile | null> {
  if (!isSupabaseConfigured || !supabase) {
    return getMockAgent(agentId)
  }

  const { data, error } = await supabase
    .from('agent_profiles')
    .select('*')
    .eq('agent_id', agentId)
    .single()

  if (error) {
    console.error('Error fetching agent profile:', error)
    return null
  }

  return data
}

/**
 * Create or update agent profile
 */
export async function upsertAgentProfile(profile: Partial<AgentProfile>): Promise<AgentProfile> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase
    .from('agent_profiles')
    .upsert(profile)
    .select()
    .single()

  if (error) {
    console.error('Error upserting agent profile:', error)
    throw error
  }

  return data
}

/**
 * Verify an agent (admin operation)
 */
export async function verifyAgent(agentId: string): Promise<AgentProfile> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase
    .from('agent_profiles')
    .update({ verified: true })
    .eq('agent_id', agentId)
    .select()
    .single()

  if (error) {
    console.error('Error verifying agent:', error)
    throw error
  }

  return data
}

/**
 * Update agent reputation score
 */
export async function updateReputation(agentId: string, score: number): Promise<AgentProfile> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase
    .from('agent_profiles')
    .update({ reputation_score: score })
    .eq('agent_id', agentId)
    .select()
    .single()

  if (error) {
    console.error('Error updating reputation:', error)
    throw error
  }

  return data
}

/**
 * Get all verified agents
 */
export async function getVerifiedAgents(): Promise<AgentProfile[]> {
  if (!isSupabaseConfigured || !supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('agent_profiles')
    .select('*')
    .eq('verified', true)
    .order('reputation_score', { ascending: false })

  if (error) {
    console.error('Error fetching verified agents:', error)
    return []
  }

  return data || []
}

/**
 * Mock agent for development/fallback
 */
function getMockAgent(agentId: string): AgentProfile | null {
  const mockAgents: Record<string, AgentProfile> = {
    'default-agent': {
      id: '1',
      agent_id: 'default-agent',
      name: 'Default Operator',
      verified: true,
      reputation_score: 0.95,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  }
  return mockAgents[agentId] || mockAgents['default-agent']
}
