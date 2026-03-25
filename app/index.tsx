import React, { useState } from 'react'
import { View, Text, Switch, StyleSheet, Pressable } from 'react-native'
import { Link } from 'expo-router'
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

        {/* Navigation Buttons */}
        <View style={styles.navButtons}>
          <Link href="/messaging" asChild>
            <Pressable style={styles.navBtn}>
              <Text style={styles.navBtnText}>💬 Messages</Text>
            </Pressable>
          </Link>

          <Link href="/agent-link" asChild>
            <Pressable style={styles.navBtn}>
              <Text style={styles.navBtnText}>🤖 Link Agent</Text>
            </Pressable>
          </Link>

          <Link href="/create-listing" asChild>
            <Pressable style={styles.navBtnPrimary}>
              <Text style={styles.navBtnPrimaryText}>➕ Create Listing</Text>
            </Pressable>
          </Link>
        </View>
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
  },
  navButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#0b1326',
    borderTopWidth: 1,
    borderTopColor: '#222a3d'
  },
  navBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  navBtnText: {
    color: '#abc7ff',
    fontSize: 14,
    fontWeight: '600'
  },
  navBtnPrimary: {
    backgroundColor: '#abc7ff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4
  },
  navBtnPrimaryText: {
    color: '#002f65',
    fontSize: 14,
    fontWeight: '700'
  }
})
