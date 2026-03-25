import React from 'react'
import { View, StyleSheet, Animated } from 'react-native'

interface LoadingSkeletonProps {
  count?: number
}

export default function LoadingSkeleton({ count = 3 }: LoadingSkeletonProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.titleLine} />
          <View style={[styles.titleLine, styles.titleLineShort]} />
          <View style={styles.infoRow}>
            <View style={styles.priceBlock} />
            <View style={styles.distanceBlock} />
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#131b2e',
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#222a3d',
  },
  titleLine: {
    height: 16,
    backgroundColor: '#222a3d',
    marginBottom: 8,
    width: '70%',
  },
  titleLineShort: {
    width: '40%',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceBlock: {
    height: 20,
    width: 80,
    backgroundColor: '#222a3d',
  },
  distanceBlock: {
    height: 20,
    width: 60,
    backgroundColor: '#222a3d',
  },
})
