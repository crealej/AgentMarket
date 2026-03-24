import React, { useMemo, useState } from 'react'
import { View, FlatList, StyleSheet, Text, Button } from 'react-native'
import AgentCard from './AgentCard'
import { simulateNegotiation } from '../services/agentNegotiator'
import { useAgentIdentity } from '../context/AgentIdentityContext'

function sampleListings() {
  // JSON-LD style listings
  return [
    {
      id: '1',
      title: 'Industrial GPU Node V2',
      price: 1240,
      distanceKm: 2.4,
      jsonld: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        id: 'urn:agent:1',
        name: 'Industrial GPU Node V2',
        price: 1240,
        location: { km: 2.4 },
        ai: { specifications: { cores: 8192 }, condition_rating: 0.98, negotiation_logic: 'standard' },
      },
    },
    {
      id: '2',
      title: 'Neural Mesh Controller',
      price: 890,
      distanceKm: 8.1,
      jsonld: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        id: 'urn:agent:2',
        name: 'Neural Mesh Controller',
        price: 890,
        location: { km: 8.1 },
        ai: { specifications: { throughput: '100GB/s' }, condition_rating: 0.85, negotiation_logic: 'aggressive' },
      },
    },
    {
      id: '3',
      title: 'Quantum Latency Shield',
      price: 3150,
      distanceKm: 12.5,
      jsonld: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        id: 'urn:agent:3',
        name: 'Quantum Latency Shield',
        price: 3150,
        location: { km: 12.5 },
        ai: { specifications: { encryption: 'AES-Q512' }, condition_rating: 1.0, negotiation_logic: 'strict' },
      },
    },
    {
      id: '4',
      title: 'Remote Node (Far)',
      price: 150,
      distanceKm: 45.1,
      jsonld: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        id: 'urn:agent:4',
        name: 'Remote Node (Far)',
        price: 150,
        location: { km: 45.1 },
        ai: { specifications: { minimal: true }, condition_rating: 0.6, negotiation_logic: 'standard' },
      },
    },
  ]
}

export default function MarketplaceList({ showRaw }: { showRaw?: boolean }) {
  const { identity } = useAgentIdentity()
  const [distanceFilterKm, setDistanceFilterKm] = useState(15)
  const [negotiationLog, setNegotiationLog] = useState<any[]>([])

  const listings = useMemo(() => sampleListings(), [])
  const filtered = listings.filter((l) => l.distanceKm <= distanceFilterKm)

  function handleNegotiate(item: any) {
    const log = simulateNegotiation(item.jsonld)
    setNegotiationLog((s) => [...log, ...s])
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.controls}>
        <Text style={styles.identity}>Agent: {identity.agentId} — {identity.verified ? 'Verified' : 'Unverified'}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.filterText}>Distance filter: {distanceFilterKm} km</Text>
          <Button title="Set 15km" onPress={() => setDistanceFilterKm(15)} />
          <Button title="Set 10km" onPress={() => setDistanceFilterKm(10)} />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <AgentCard item={item} onPress={() => handleNegotiate(item)} showRaw={showRaw} />
        )}
      />

      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Negotiation Log</Text>
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
  controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  identity: { color: '#abc7ff', fontWeight: '700' },
  filterText: { color: '#c6c6cb', marginRight: 8 },
  logContainer: { marginTop: 12, padding: 8, backgroundColor: '#131b2e', borderRadius: 8, maxHeight: 200 },
  logTitle: { color: '#00e1ab', fontWeight: '700', marginBottom: 8 },
  logRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  logActor: { color: '#abc7ff', width: 100 },
  logMsg: { color: '#dae2fd', flex: 1 },
  logTime: { color: '#aeb9d0', marginLeft: 8 }
})
