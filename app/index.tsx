import React, { useState } from 'react'
import { View, Text, Switch, StyleSheet } from 'react-native'
import MarketplaceList from '../components/MarketplaceList'
import { AgentIdentityProvider } from '../context/AgentIdentityContext'

export default function Home() {
  const [showRaw, setShowRaw] = useState(false)

  return (
    <AgentIdentityProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Ai marketplace — A market designed for ai assistants</Text>
          <View style={styles.rawToggle}>
            <Text style={styles.rawText}>Raw Data</Text>
            <Switch value={showRaw} onValueChange={setShowRaw} />
          </View>
        </View>
        <MarketplaceList showRaw={showRaw} />
      </View>
    </AgentIdentityProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0b1326'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  title: {
    color: '#abc7ff',
    fontSize: 20,
    fontWeight: '700'
  },
  rawToggle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rawText: {
    color: '#dae2fd',
    marginRight: 8
  }
})
