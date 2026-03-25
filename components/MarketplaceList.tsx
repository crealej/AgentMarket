import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
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
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchListings = useCallback(async () => {
    try {
      const data = await getListings({ maxDistance: distanceFilterKm })
      setListings(data)
      setError(null)
    } catch (err) {
      setError('Failed to load listings')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [distanceFilterKm])

  useEffect(() => {
    setLoading(true)
    fetchListings()
  }, [distanceFilterKm])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchListings()
    setRefreshing(false)
  }, [fetchListings])

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
        <ActivityIndicator size="large" color="#abc7ff" />
        <Text style={styles.loadingText}>Scanning marketplace...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryBtn} onPress={() => fetchListings()}>
          <Text style={styles.retryBtnText}>RETRY</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Agent Identity */}
      <View style={styles.identityBar}>
        <View style={styles.statusDot} />
        <Text style={styles.identityText}>
          {identity.agentId} — {identity.verified ? 'VERIFIED' : 'UNVERIFIED'}
        </Text>
      </View>

      {/* Distance Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>DISTANCE</Text>
        <View style={styles.filterButtons}>
          {[10, 15, 50].map((km) => (
            <Pressable
              key={km}
              style={[styles.filterBtn, distanceFilterKm === km && styles.filterBtnActive]}
              onPress={() => setDistanceFilterKm(km)}
            >
              <Text style={[styles.filterBtnText, distanceFilterKm === km && styles.filterBtnTextActive]}>
                {km}km
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Listing Count */}
      <Text style={styles.countText}>{listings.length} listings found</Text>

      {/* Listings */}
      <FlatList
        data={listings.map(formatListingForCard)}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <AgentCard item={item} onPress={() => handleNegotiate(item)} showRaw={showRaw} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#abc7ff"
            colors={['#abc7ff']}
          />
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Negotiation Log */}
      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>NEGOTIATION LOG</Text>
        {negotiationLog.length === 0 ? (
          <Text style={styles.emptyLog}>Tap a listing to start negotiation</Text>
        ) : (
          negotiationLog.slice(0, 5).map((e, idx) => (
            <View key={idx} style={styles.logRow}>
              <Text style={styles.logActor}>{e.actor}:</Text>
              <Text style={styles.logMsg}>{e.message}</Text>
            </View>
          ))
        )}
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
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    color: '#ffb4ab',
    marginBottom: 16,
    fontSize: 14,
  },
  retryBtn: {
    backgroundColor: '#abc7ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  retryBtnText: {
    color: '#002f65',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  identityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00e1ab',
    marginRight: 8,
    shadowColor: '#00e1ab',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  identityText: {
    color: '#8f9095',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterLabel: {
    color: '#45474b',
    fontSize: 10,
    letterSpacing: 2,
    marginRight: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#131b2e',
    borderBottomWidth: 2,
    borderBottomColor: '#222a3d',
  },
  filterBtnActive: {
    borderBottomColor: '#abc7ff',
    backgroundColor: '#222a3d',
  },
  filterBtnText: {
    color: '#8f9095',
    fontSize: 12,
    fontWeight: '600',
  },
  filterBtnTextActive: {
    color: '#abc7ff',
  },
  countText: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  logContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#131b2e',
    borderTopWidth: 2,
    borderTopColor: '#222a3d',
    maxHeight: 160,
  },
  logTitle: {
    color: '#00e1ab',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  emptyLog: {
    color: '#45474b',
    fontSize: 12,
    fontStyle: 'italic',
  },
  logRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  logActor: {
    color: '#abc7ff',
    fontSize: 12,
    fontWeight: '600',
    width: 80,
  },
  logMsg: {
    color: '#dae2fd',
    fontSize: 12,
    flex: 1,
  },
})
