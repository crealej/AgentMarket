import React, { useEffect, useState, useCallback } from 'react'
import { View, FlatList, StyleSheet, Text, Button, ActivityIndicator } from 'react-native'
import AgentCard from './AgentCard'
import { simulateNegotiation } from '../services/agentNegotiator'
import { getListings, Listing } from '../services/listings'
import { useAgentIdentity } from '../context/AgentIdentityContext'

export default function MarketplaceList({ showRaw }: { showRaw?: boolean }) {
  const { identity } = useAgentIdentity()
  const [distanceFilterKm, setDistanceFilterKm] = useState(15)
  const [negotiationLog, setNegotiationLog] = useState<any[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch listings from Supabase (with mock fallback)
  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true)
        const data = await getListings({ maxDistance: distanceFilterKm })
        setListings(data)
        setError(null)
      } catch (err) {
        setError('Failed to load listings')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [distanceFilterKm])

  // Convert Listing to the format expected by AgentCard
  const formatListingForCard = (listing: Listing) => ({
    id: listing.id,
    title: listing.title,
    price: listing.price,
    distanceKm: listing.distance_km,
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      id: `urn:agent:${listing.id}`,
      name: listing.title,
      price: listing.price,
      location: { km: listing.distance_km },
      ai: {
        specifications: listing.specifications || {},
        condition_rating: listing.condition_rating,
        negotiation_logic: listing.negotiation_logic,
      },
    },
  })

  function handleNegotiate(item: any) {
    const log = simulateNegotiation(item.jsonld)
    setNegotiationLog((s) => [...log, ...s])
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00e1ab" />
        <Text style={styles.loadingText}>Loading marketplace...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={() => setLoading(true)} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.controls}>
        <Text style={styles.identity}>
          Agent: {identity.agentId} — {identity.verified ? 'Verified' : 'Unverified'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.filterText}>Distance: {distanceFilterKm}km</Text>
          <Button title="15km" onPress={() => setDistanceFilterKm(15)} />
          <Button title="10km" onPress={() => setDistanceFilterKm(10)} />
          <Button title="50km" onPress={() => setDistanceFilterKm(50)} />
        </View>
      </View>

      <Text style={styles.countText}>{listings.length} listings found</Text>

      <FlatList
        data={listings.map(formatListingForCard)}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <AgentCard item={item} onPress={() => handleNegotiate(item)} showRaw={showRaw} />
        )}
      />

      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Negotiation Log</Text>
        {negotiationLog.length === 0 && (
          <Text style={styles.emptyLog}>Tap a listing to start negotiation</Text>
        )}
        {negotiationLog.map((e, idx) => (
          <View key={idx} style={styles.logRow}>
            <Text style={styles.logActor}>{e.actor}:</Text>
            <Text style={styles.logMsg}>{e.message}</Text>
            <Text style={styles.logTime}>{new Date(e.timestamp).toLocaleTimeString()}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#abc7ff',
    marginTop: 12,
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 12,
  },
  controls: {
    marginBottom: 12,
  },
  identity: {
    color: '#abc7ff',
    fontWeight: '700',
    marginBottom: 8,
  },
  filterText: {
    color: '#c6c6cb',
    marginRight: 8,
  },
  countText: {
    color: '#aeb9d0',
    marginBottom: 8,
  },
  logContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#131b2e',
    borderRadius: 8,
    maxHeight: 200,
  },
  logTitle: {
    color: '#00e1ab',
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyLog: {
    color: '#666',
    fontStyle: 'italic',
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logActor: {
    color: '#abc7ff',
    width: 100,
  },
  logMsg: {
    color: '#dae2fd',
    flex: 1,
  },
  logTime: {
    color: '#aeb9d0',
    marginLeft: 8,
  },
})
