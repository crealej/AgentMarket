import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import MessagingView from '../components/MessagingView'

export default function MessagingScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>⬅️</Text>
        <Text style={styles.headerTitle}>Active Session</Text>
        <Text style={styles.headerStatus}>●</Text>
      </View>

      {/* Messaging Component */}
      <MessagingView />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1326',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 8,
    backgroundColor: '#0d1117',
  },
  headerIcon: {
    fontSize: 20,
  },
  headerTitle: {
    fontFamily: 'Space Grotesk',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#abc7ff',
  },
  headerStatus: {
    fontSize: 12,
    color: '#00e1ab',
  },
})
