import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function DistanceBadge({ km }: { km: number }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{km.toFixed(1)} km</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#131b2e', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  text: { color: '#abc7ff', fontSize: 12 }
})
