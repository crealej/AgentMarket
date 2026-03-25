// Utility functions for AgentMarket

/**
 * Format price with currency
 */
export function formatPrice(amount: number, currency: string = 'DKK'): string {
  return `${amount.toLocaleString('da-DK')} ${currency}`
}

/**
 * Format distance with unit
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`
  }
  return `${km.toFixed(1)} km`
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const then = typeof date === 'string' ? new Date(date) : date
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return then.toLocaleDateString('da-DK')
}

/**
 * Format condition rating as percentage
 */
export function formatCondition(rating: number): string {
  return `${Math.round(rating * 100)}%`
}

/**
 * Get condition color based on rating
 */
export function getConditionColor(rating: number): string {
  if (rating >= 0.9) return '#00e1ab'
  if (rating >= 0.75) return '#abc7ff'
  if (rating >= 0.5) return '#ffb74d'
  return '#ff6b6b'
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Check if running in browser vs native
 */
export function isWeb(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined'
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('da-DK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format time for display
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('da-DK', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Calculate price after negotiation discount
 */
export function calculateNegotiatedPrice(
  originalPrice: number,
  discountPercent: number = 10
): number {
  return Math.round(originalPrice * (1 - discountPercent / 100))
}

/**
 * Parse query params from URL
 */
export function parseQueryParams(url: string): Record<string, string> {
  const params: Record<string, string> = {}
  const queryStart = url.indexOf('?')
  if (queryStart === -1) return params

  const queryString = url.slice(queryStart + 1)
  const pairs = queryString.split('&')

  for (const pair of pairs) {
    const [key, value] = pair.split('=')
    if (key) {
      params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : ''
    }
  }

  return params
}

/**
 * Slugify text for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}
