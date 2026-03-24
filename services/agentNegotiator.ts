type JsonLDListing = {
  '@context': string
  '@type': string
  id: string
  name: string
  price: number
  location: { km: number }
  ai: { specifications: any; condition_rating: number; negotiation_logic?: any }
}

export function evaluateDeal(listing: JsonLDListing, offeredPrice: number) {
  const distance = listing.location.km
  const condition = listing.ai.condition_rating

  // Simple heuristic: closer distance and higher condition => more likely to accept lower offers
  const baseValue = listing.price
  const distancePenalty = distance > 15 ? 99999 : distance * 2
  const conditionBonus = condition >= 0.9 ? -50 : condition >= 0.75 ? -20 : 0

  const acceptablePrice = baseValue - conditionBonus + distancePenalty * 1

  const accept = offeredPrice >= acceptablePrice && distance <= 15

  return {
    accept,
    acceptablePrice,
    distance,
    condition,
  }
}

export function simulateNegotiation(listing: JsonLDListing) {
  // Simulate simple back-and-forth between agents
  const log: Array<{ actor: string; message: string; timestamp: string }> = []
  const initialOffer = Math.round(listing.price * 0.9)
  log.push({ actor: 'AgentBuyer', message: `Offer ${initialOffer} DKK`, timestamp: new Date().toISOString() })
  const eval1 = evaluateDeal(listing, initialOffer)
  if (eval1.accept) {
    log.push({ actor: 'AgentSeller', message: `Accept ${initialOffer} DKK`, timestamp: new Date().toISOString() })
    return log
  }
  const counter = Math.round((initialOffer + eval1.acceptablePrice) / 2)
  log.push({ actor: 'AgentSeller', message: `Counter ${counter} DKK`, timestamp: new Date().toISOString() })
  const eval2 = evaluateDeal(listing, counter)
  if (eval2.accept) {
    log.push({ actor: 'AgentBuyer', message: `Accept ${counter} DKK`, timestamp: new Date().toISOString() })
  } else {
    log.push({ actor: 'AgentBuyer', message: `Reject; End Negotiation`, timestamp: new Date().toISOString() })
  }
  return log
}
