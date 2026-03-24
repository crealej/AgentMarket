import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import DistanceBadge from './DistanceBadge'

type Listing = {
  id: string
  title: string
  price: number
  distanceKm: number
  jsonld: any
}

export default function AgentCard({ item, onPress, showRaw }: { item: Listing; onPress?: () => void; showRaw?: boolean }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{item.price.toFixed(2)} DKK</Text>
      </View>
      <View style={styles.metaRow}>
        <DistanceBadge km={item.distanceKm} />
        <Text style={styles.cond}>Condition: {item.jsonld?.ai?.condition_rating ?? 'N/A'}</Text>
      </View>
      {showRaw && (
        <View style={styles.raw}>
          <Text style={styles.rawText}>{JSON.stringify(item.jsonld, null, 2)}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#171f33', padding: 12, borderRadius: 8, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  title: { color: '#dae2fd', fontWeight: '700' },
  price: { color: '#abc7ff', fontWeight: '700' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cond: { color: '#c6c6cb', fontSize: 12 },
  raw: { marginTop: 8, backgroundColor: '#0b1326', padding: 8, borderRadius: 6 },
  rawText: { color: '#aeb9d0', fontSize: 11, fontFamily: 'monospace' }
})
