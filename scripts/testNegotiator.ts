import { simulateNegotiation, evaluateDeal } from '../services/agentNegotiator'

const listing = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  id: 'urn:agent:test',
  name: 'Test Node',
  price: 100,
  location: { km: 12 },
  ai: { specifications: { note: 'smoke-test' }, condition_rating: 0.9 },
}

console.log('--- evaluateDeal (offer 90 DKK) ---')
console.log(evaluateDeal(listing as any, 90))

console.log('\n--- simulateNegotiation ---')
console.log(JSON.stringify(simulateNegotiation(listing as any), null, 2))
