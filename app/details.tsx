import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function Details() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listing Details</Text>
      <Text style={styles.body}>Draft details view for an Ai marketplace item.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0b1326' },
  title: { color: '#abc7ff', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  body: { color: '#dae2fd' }
})
