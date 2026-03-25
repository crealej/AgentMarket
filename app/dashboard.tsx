import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native'
import { Link } from 'expo-router'
import { supabase } from '../services/supabase'

interface LinkedAgent {
  id: string
  agent_name: string
  agent_id: string
  verified: boolean
  created_at: string
}

interface UserListing {
  id: string
  title: string
  status: string
  price: number
  created_at: string
}

interface MessageSummary {
  total: number
  unread: number
  spam: number
}

export default function DashboardScreen() {
  const [linkedAgents, setLinkedAgents] = useState<LinkedAgent[]>([])
  const [userListings, setUserListings] = useState<UserListing[]>([])
  const [messages, setMessages] = useState<MessageSummary>({ total: 0, unread: 0, spam: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    if (!supabase) {
      // Mock data for demo
      setLinkedAgents([
        { id: '1', agent_name: 'Claw', agent_id: 'claw-rasmus-001', verified: true, created_at: new Date().toISOString() },
      ])
      setUserListings([
        { id: '1', title: 'Industrial GPU Node V2', status: 'active', price: 2500, created_at: new Date().toISOString() },
        { id: '2', title: 'Neural Mesh Controller', status: 'pending', price: 1800, created_at: new Date().toISOString() },
      ])
      setMessages({ total: 12, unread: 3, spam: 2 })
      setLoading(false)
      return
    }

    try {
      // Fetch linked agents
      const { data: agents } = await supabase
        .from('agent_tokens')
        .select('id, agent_name, agent_id, verified, created_at')

      // Fetch user listings
      const { data: listings } = await supabase
        .from('listings')
        .select('id, title, status, price, created_at')
        .limit(5)

      // Fetch message counts
      const { data: msgData } = await supabase
        .from('messages')
        .select('spam_flag')

      setLinkedAgents(agents || [])
      setUserListings(listings || [])
      setMessages({
        total: msgData?.length || 0,
        unread: msgData?.filter(m => !m.spam_flag).length || 0,
        spam: msgData?.filter(m => m.spam_flag).length || 0,
      })
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>R</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>Rasmus</Text>
        </View>
        <View style={styles.statusIndicator}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>ONLINE</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{linkedAgents.length}</Text>
          <Text style={styles.statLabel}>LINKED AGENTS</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userListings.length}</Text>
          <Text style={styles.statLabel}>LISTINGS</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{messages.unread}</Text>
          <Text style={styles.statLabel}>UNREAD</Text>
        </View>
        <View style={[styles.statCard, messages.spam > 0 && styles.statCardWarning]}>
          <Text style={[styles.statNumber, messages.spam > 0 && styles.statNumberWarning]}>
            {messages.spam}
          </Text>
          <Text style={styles.statLabel}>SPAM</Text>
        </View>
      </View>

      {/* Linked Agents Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>LINKED AGENTS</Text>
          <Link href="/agent-link" asChild>
            <Pressable>
              <Text style={styles.sectionLink}>+ ADD</Text>
            </Pressable>
          </Link>
        </View>

        {linkedAgents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No agents linked yet</Text>
          </View>
        ) : (
          linkedAgents.map((agent) => (
            <View key={agent.id} style={styles.agentItem}>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{agent.agent_name}</Text>
                <Text style={styles.agentId}>{agent.agent_id}</Text>
              </View>
              {agent.verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓ VERIFIED</Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {/* Active Listings Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>YOUR LISTINGS</Text>
          <Link href="/create-listing" asChild>
            <Pressable>
              <Text style={styles.sectionLink}>+ NEW</Text>
            </Pressable>
          </Link>
        </View>

        {userListings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No listings yet</Text>
          </View>
        ) : (
          userListings.map((listing) => (
            <View key={listing.id} style={styles.listingItem}>
              <View style={styles.listingInfo}>
                <Text style={styles.listingTitle}>{listing.title}</Text>
                <Text style={styles.listingPrice}>${listing.price.toLocaleString()}</Text>
              </View>
              <View style={[
                styles.statusTag,
                listing.status === 'active' && styles.statusTagActive,
                listing.status === 'pending' && styles.statusTagPending,
              ]}>
                <Text style={[
                  styles.statusTagText,
                  listing.status === 'active' && styles.statusTagTextActive,
                ]}>
                  {listing.status.toUpperCase()}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Link href="/messaging" asChild>
          <Pressable style={styles.actionBtn}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>Messages</Text>
          </Pressable>
        </Link>

        <Link href="/" asChild>
          <Pressable style={styles.actionBtn}>
            <Text style={styles.actionIcon}>🏪</Text>
            <Text style={styles.actionText}>Marketplace</Text>
          </Pressable>
        </Link>

        <Link href="/create-listing" asChild>
          <Pressable style={styles.actionBtnPrimary}>
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionTextPrimary}>New Listing</Text>
          </Pressable>
        </Link>
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
    padding: 20,
    paddingBottom: 100,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#abc7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#002f65',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  greeting: {
    fontSize: 12,
    color: '#8f9095',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#dae2fd',
    marginTop: 2,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131b2e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
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
  statusText: {
    fontSize: 10,
    color: '#00e1ab',
    fontWeight: '600',
    letterSpacing: 1,
  },
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#131b2e',
    padding: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#222a3d',
  },
  statCardWarning: {
    borderLeftColor: '#ffb4ab',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#dae2fd',
  },
  statNumberWarning: {
    color: '#ffb4ab',
  },
  statLabel: {
    fontSize: 10,
    color: '#45474b',
    letterSpacing: 2,
    marginTop: 4,
  },
  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#45474b',
    letterSpacing: 2,
    fontWeight: '600',
  },
  sectionLink: {
    fontSize: 12,
    color: '#abc7ff',
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#131b2e',
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#8f9095',
    fontSize: 14,
  },
  // Agent Item
  agentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#131b2e',
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#00e1ab',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dae2fd',
  },
  agentId: {
    fontSize: 12,
    color: '#8f9095',
    marginTop: 4,
    fontFamily: 'monospace',
  },
  verifiedBadge: {
    backgroundColor: 'rgba(0, 225, 171, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 10,
    color: '#00e1ab',
    fontWeight: '600',
    letterSpacing: 1,
  },
  // Listing Item
  listingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#131b2e',
    padding: 16,
    marginBottom: 8,
  },
  listingInfo: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dae2fd',
  },
  listingPrice: {
    fontSize: 12,
    color: '#abc7ff',
    marginTop: 4,
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#222a3d',
    borderRadius: 4,
  },
  statusTagActive: {
    backgroundColor: 'rgba(0, 225, 171, 0.1)',
  },
  statusTagPending: {
    backgroundColor: 'rgba(171, 199, 255, 0.1)',
  },
  statusTagText: {
    fontSize: 10,
    color: '#8f9095',
    fontWeight: '600',
    letterSpacing: 1,
  },
  statusTagTextActive: {
    color: '#00e1ab',
  },
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#222a3d',
  },
  actionBtn: {
    alignItems: 'center',
    padding: 12,
  },
  actionBtnPrimary: {
    alignItems: 'center',
    backgroundColor: '#abc7ff',
    padding: 12,
    borderRadius: 4,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#abc7ff',
    fontWeight: '600',
  },
  actionTextPrimary: {
    fontSize: 12,
    color: '#002f65',
    fontWeight: '700',
  },
})
