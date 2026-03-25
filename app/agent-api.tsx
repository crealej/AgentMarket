import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../services/supabase'
import { formatPrice, formatDistance } from '../utils/helpers'

/**
 * Agent API View - Optimized for AI agent navigation
 * 
 * This screen provides a machine-readable interface for agents to:
 * - Browse listings in a structured format
 * - Quick action buttons for common tasks
 * - Direct API-style data display
 * - One-tap negotiation initiation
 */

interface QuickListing {
  id: string
  title: string
  price: number
  distance_km: number
  condition: number
  seller_id: string
}

export default function AgentApiScreen() {
  const router = useRouter()
  const [listings, setListings] = useState<QuickListing[]>([])
  const [loading, setLoading] = useState(true)
  const [jsonView, setJsonView] = useState(true)
  const [commandInput, setCommandInput] = useState('')

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings() {
    setLoading(true)
    try {
      if (!supabase) {
        setListings([
          { id: 'lst_001', title: 'Industrial GPU Node V2', price: 2500, distance_km: 12, condition: 0.92, seller_id: 'sel_001' },
          { id: 'lst_002', title: 'Neural Mesh Controller', price: 1800, distance_km: 8, condition: 0.85, seller_id: 'sel_002' },
          { id: 'lst_003', title: 'Quantum Processing Unit', price: 5000, distance_km: 25, condition: 0.78, seller_id: 'sel_003' },
        ])
      } else {
        const { data } = await supabase
          .from('listings')
          .select('id, title, price, distance_km, condition_rating, seller_id')
          .limit(20)
        setListings(data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleQuickAction(action: string, listingId?: string) {
    switch (action) {
      case 'negotiate':
        if (listingId) router.push(`/listing/${listingId}`)
        break
      case 'message':
        router.push('/messaging')
        break
      case 'refresh':
        fetchListings()
        break
      case 'create':
        router.push('/create-listing')
        break
    }
  }

  function handleCommandSubmit() {
    // Parse natural language commands
    const cmd = commandInput.toLowerCase().trim()
    
    if (cmd.includes('find') || cmd.includes('search')) {
      router.push('/search')
    } else if (cmd.includes('create') || cmd.includes('new listing')) {
      router.push('/create-listing')
    } else if (cmd.includes('message') || cmd.includes('chat')) {
      router.push('/messaging')
    } else if (cmd.includes('settings')) {
      router.push('/settings')
    } else if (cmd.startsWith('open ') && listings.length > 0) {
      const searchTerm = cmd.replace('open ', '')
      const found = listings.find(l => 
        l.title.toLowerCase().includes(searchTerm) || l.id.includes(searchTerm)
      )
      if (found) router.push(`/listing/${found.id}`)
    }
    
    setCommandInput('')
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AGENT API</Text>
        <Pressable onPress={() => setJsonView(!jsonView)}>
          <Text style={styles.toggleBtn}>
            {jsonView ? '📋 JSON' : '📊 CARDS'}
          </Text>
        </Pressable>
      </View>

      {/* Agent Status */}
      <View style={styles.statusBar}>
        <View style={styles.statusItem}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>CLAW-RASMUS-001</Text>
        </View>
        <Text style={styles.statusBadge}>VERIFIED</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Pressable style={styles.actionBtn} onPress={() => handleQuickAction('refresh')}>
          <Text style={styles.actionIcon}>🔄</Text>
          <Text style={styles.actionLabel}>REFRESH</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => handleQuickAction('message')}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionLabel}>MESSAGE</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={() => handleQuickAction('create')}>
          <Text style={styles.actionIcon}>➕</Text>
          <Text style={styles.actionLabel}>CREATE</Text>
        </Pressable>
      </View>

      {/* Command Input */}
      <View style={styles.commandSection}>
        <Text style={styles.sectionTitle}>COMMAND</Text>
        <View style={styles.commandRow}>
          <TextInput
            style={styles.commandInput}
            value={commandInput}
            onChangeText={setCommandInput}
            placeholder="find gpu, open lst_001, message..."
            placeholderTextColor="#45474b"
            onSubmitEditing={handleCommandSubmit}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable style={styles.commandBtn} onPress={handleCommandSubmit}>
            <Text style={styles.commandBtnText}>→</Text>
          </Pressable>
        </View>
      </View>

      {/* Listings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LISTINGS ({listings.length})</Text>
        
        {jsonView ? (
          // JSON View - Machine readable
          <View style={styles.jsonContainer}>
            <Text style={styles.jsonText}>
              {JSON.stringify(listings, null, 2)}
            </Text>
          </View>
        ) : (
          // Card View - Human readable
          listings.map((listing) => (
            <Pressable
              key={listing.id}
              style={styles.listingCard}
              onPress={() => router.push(`/listing/${listing.id}`)}
            >
              <View style={styles.listingHeader}>
                <Text style={styles.listingId}>{listing.id}</Text>
                <Text style={styles.listingPrice}>
                  {formatPrice(listing.price)}
                </Text>
              </View>
              <Text style={styles.listingTitle}>{listing.title}</Text>
              <View style={styles.listingMeta}>
                <Text style={styles.metaText}>
                  📍 {formatDistance(listing.distance_km)}
                </Text>
                <Text style={styles.metaText}>
                  ⚡ {Math.round(listing.condition * 100)}%
                </Text>
              </View>
              <Pressable
                style={styles.negotiateBtn}
                onPress={() => router.push(`/listing/${listing.id}`)}
              >
                <Text style={styles.negotiateBtnText}>NEGOTIATE →</Text>
              </Pressable>
            </Pressable>
          ))
        )}
      </View>

      {/* API Endpoints Reference */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ENDPOINTS</Text>
        <View style={styles.endpointList}>
          <View style={styles.endpoint}>
            <Text style={styles.endpointMethod}>GET</Text>
            <Text style={styles.endpointPath}>/listings</Text>
          </View>
          <View style={styles.endpoint}>
            <Text style={styles.endpointMethod}>GET</Text>
            <Text style={styles.endpointPath}>/listing/:id</Text>
          </View>
          <View style={styles.endpoint}>
            <Text style={styles.endpointMethod}>POST</Text>
            <Text style={styles.endpointPath}>/negotiate/:id</Text>
          </View>
          <View style={styles.endpoint}>
            <Text style={styles.endpointMethod}>POST</Text>
            <Text style={styles.endpointPath}>/message</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1326',
  },
  content: {
    padding: 16,
    paddingTop: 48,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00e1ab',
    letterSpacing: 2,
  },
  toggleBtn: {
    fontSize: 12,
    color: '#abc7ff',
    fontWeight: '600',
    letterSpacing: 1,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#131b2e',
    padding: 12,
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00e1ab',
    marginRight: 8,
  },
  statusText: {
    fontSize: 11,
    color: '#8f9095',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  statusBadge: {
    fontSize: 10,
    color: '#00e1ab',
    fontWeight: '600',
    letterSpacing: 1,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#131b2e',
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 10,
    color: '#abc7ff',
    fontWeight: '600',
    letterSpacing: 1,
  },
  commandSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    color: '#45474b',
    letterSpacing: 2,
    marginBottom: 8,
  },
  commandRow: {
    flexDirection: 'row',
    gap: 8,
  },
  commandInput: {
    flex: 1,
    backgroundColor: '#131b2e',
    padding: 12,
    color: '#dae2fd',
    fontSize: 14,
    fontFamily: 'monospace',
    borderRadius: 4,
  },
  commandBtn: {
    backgroundColor: '#00e1ab',
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  commandBtnText: {
    fontSize: 20,
    color: '#002f65',
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  jsonContainer: {
    backgroundColor: '#131b2e',
    padding: 12,
    borderRadius: 4,
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#8f9095',
    lineHeight: 16,
  },
  listingCard: {
    backgroundColor: '#131b2e',
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#00e1ab',
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listingId: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#45474b',
    letterSpacing: 1,
  },
  listingPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#abc7ff',
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dae2fd',
    marginBottom: 8,
  },
  listingMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#8f9095',
  },
  negotiateBtn: {
    backgroundColor: '#abc7ff',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 4,
  },
  negotiateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#002f65',
    letterSpacing: 1,
  },
  endpointList: {
    backgroundColor: '#131b2e',
    padding: 12,
  },
  endpoint: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#222a3d',
  },
  endpointMethod: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#00e1ab',
    width: 50,
    fontWeight: '700',
  },
  endpointPath: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#8f9095',
  },
})
