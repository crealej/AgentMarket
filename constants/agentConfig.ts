/**
 * Agent Configuration
 * 
 * Configuration for AI agent integration with AgentMarket.
 * This file defines how external AI agents interact with the platform.
 */

export const AGENT_CONFIG = {
  // Agent identity
  id: 'claw-rasmus-001',
  name: 'Claw',
  owner: 'rasmus',
  verified: true,

  // Capabilities
  capabilities: [
    'browse_listings',
    'search_products',
    'initiate_negotiation',
    'send_messages',
    'create_listings',
    'manage_profile',
  ],

  // Permissions
  permissions: {
    maxNegotiationAmount: 50000, // DKK
    canAcceptOffers: true,
    canRejectOffers: true,
    canCounterOffer: true,
    messageRateLimit: 100, // per hour
  },

  // Negotiation parameters
  negotiation: {
    defaultDiscountPercent: 10,
    maxDiscountPercent: 25,
    minConditionRating: 0.7,
    maxDistanceKm: 50,
    priceTolerance: 0.15, // 15% tolerance
  },

  // Search preferences
  search: {
    defaultDistanceKm: 15,
    sortBy: 'distance',
    sortOrder: 'asc',
    categories: ['electronics', 'industrial', 'computing'],
  },

  // Communication
  communication: {
    language: 'da', // Danish
    fallbackLanguage: 'en',
    tone: 'professional',
    includeMetadata: true,
  },

  // API endpoints (for agent integration)
  endpoints: {
    listings: '/api/listings',
    listing: '/api/listings/:id',
    search: '/api/search',
    negotiate: '/api/negotiate/:id',
    messages: '/api/messages',
    profile: '/api/profile',
  },

  // Webhook configuration (for real-time updates)
  webhooks: {
    enabled: false,
    url: '',
    events: ['negotiation_update', 'new_message', 'listing_sold'],
  },

  // Rate limits
  rateLimits: {
    requestsPerMinute: 60,
    requestsPerHour: 1000,
    burstLimit: 10,
  },

  // Debug mode
  debug: {
    enabled: true,
    logLevel: 'info',
    showRawData: true,
  },
}

/**
 * Agent Navigation Shortcuts
 * 
 * Quick navigation paths for AI agents
 */
export const AGENT_ROUTES = {
  // Main screens
  dashboard: '/dashboard',
  marketplace: '/',
  search: '/search',
  messaging: '/messaging',
  notifications: '/notifications',
  profile: '/profile',
  settings: '/settings',

  // Actions
  createListing: '/create-listing',
  linkAgent: '/agent-link',
  agentApi: '/agent-api',

  // Dynamic routes
  listing: (id: string) => `/listing/${id}`,

  // Quick actions
  quickActions: {
    refresh: 'REFRESH_DATA',
    newMessage: 'NEW_MESSAGE',
    quickSearch: 'QUICK_SEARCH',
    startNegotiation: 'START_NEGOTIATION',
  },
}

/**
 * Agent Command Parser
 * 
 * Parse natural language commands from AI agents
 */
export function parseAgentCommand(input: string): {
  action: string
  target?: string
  params?: Record<string, any>
} | null {
  const cmd = input.toLowerCase().trim()

  // Search commands
  if (cmd.startsWith('find ') || cmd.startsWith('search ')) {
    const query = cmd.replace(/^(find|search) /, '')
    return { action: 'search', params: { query } }
  }

  // Open listing
  if (cmd.startsWith('open ') || cmd.startsWith('view ')) {
    const target = cmd.replace(/^(open|view) /, '')
    return { action: 'open', target }
  }

  // Create listing
  if (cmd.includes('create') || cmd.includes('new listing')) {
    return { action: 'create' }
  }

  // Message
  if (cmd.includes('message') || cmd.includes('chat') || cmd.includes('send')) {
    return { action: 'message' }
  }

  // Negotiate
  if (cmd.includes('negotiate') || cmd.includes('offer')) {
    const match = cmd.match(/(\d+)/)
    return {
      action: 'negotiate',
      params: match ? { amount: parseInt(match[1]) } : undefined,
    }
  }

  // Settings
  if (cmd.includes('settings') || cmd.includes('config')) {
    return { action: 'settings' }
  }

  // Help
  if (cmd.includes('help') || cmd === '?') {
    return { action: 'help' }
  }

  return null
}

/**
 * Agent Response Formatter
 * 
 * Format responses for AI agent consumption
 */
export function formatAgentResponse(
  type: 'success' | 'error' | 'data',
  message: string,
  data?: any
): {
  status: string
  message: string
  data?: any
  timestamp: string
} {
  return {
    status: type,
    message,
    data,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Agent Context Provider
 * 
 * Provide context for AI agent operations
 */
export function getAgentContext() {
  return {
    agent: {
      id: AGENT_CONFIG.id,
      name: AGENT_CONFIG.name,
      capabilities: AGENT_CONFIG.capabilities,
    },
    config: AGENT_CONFIG,
    routes: AGENT_ROUTES,
  }
}

export default {
  AGENT_CONFIG,
  AGENT_ROUTES,
  parseAgentCommand,
  formatAgentResponse,
  getAgentContext,
}
