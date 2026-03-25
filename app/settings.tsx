import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'

export default function SettingsScreen() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [autoNegotiate, setAutoNegotiate] = useState(false)
  const [spamFilter, setSpamFilter] = useState(true)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SETTINGS</Text>
      </View>

      {/* Agent Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AGENT BEHAVIOR</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Auto-Negotiate</Text>
            <Text style={styles.settingDesc}>Let agents negotiate on your behalf</Text>
          </View>
          <Switch
            value={autoNegotiate}
            onValueChange={setAutoNegotiate}
            trackColor={{ false: '#222a3d', true: '#abc7ff' }}
            thumbColor={autoNegotiate ? '#002f65' : '#45474b'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Spam Filter</Text>
            <Text style={styles.settingDesc}>Block suspicious agent messages</Text>
          </View>
          <Switch
            value={spamFilter}
            onValueChange={setSpamFilter}
            trackColor={{ false: '#222a3d', true: '#abc7ff' }}
            thumbColor={spamFilter ? '#002f65' : '#45474b'}
          />
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>APP</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingDesc}>Push notifications for new messages</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#222a3d', true: '#abc7ff' }}
            thumbColor={notifications ? '#002f65' : '#45474b'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDesc}>Industrial dark theme</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#222a3d', true: '#abc7ff' }}
            thumbColor={darkMode ? '#002f65' : '#45474b'}
          />
        </View>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>

        <Pressable style={styles.menuItem}>
          <Text style={styles.menuLabel}>Profile</Text>
          <Text style={styles.menuArrow}>→</Text>
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Text style={styles.menuLabel}>Linked Agents</Text>
          <Text style={styles.menuArrow}>→</Text>
        </Pressable>

        <Pressable style={styles.menuItem}>
          <Text style={styles.menuLabel}>Transaction History</Text>
          <Text style={styles.menuArrow}>→</Text>
        </Pressable>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitleDanger}>DANGER ZONE</Text>

        <Pressable
          style={styles.dangerBtn}
          onPress={() => {
            Alert.alert(
              'Clear Data',
              'This will delete all local data. Continue?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive' },
              ]
            )
          }}
        >
          <Text style={styles.dangerBtnText}>CLEAR LOCAL DATA</Text>
        </Pressable>

        <Pressable
          style={styles.dangerBtn}
          onPress={() => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive' },
              ]
            )
          }}
        >
          <Text style={styles.dangerBtnText}>SIGN OUT</Text>
        </Pressable>
      </View>

      {/* Version */}
      <Text style={styles.version}>AgentMarket v0.1.0</Text>
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
  header: {
    marginBottom: 32,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#abc7ff',
    letterSpacing: 2,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 10,
    color: '#45474b',
    letterSpacing: 2,
    marginBottom: 12,
  },
  sectionTitleDanger: {
    fontSize: 10,
    color: '#ff6b6b',
    letterSpacing: 2,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#131b2e',
    padding: 16,
    marginBottom: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dae2fd',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 12,
    color: '#8f9095',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#131b2e',
    padding: 16,
    marginBottom: 8,
  },
  menuLabel: {
    fontSize: 14,
    color: '#dae2fd',
  },
  menuArrow: {
    fontSize: 18,
    color: '#abc7ff',
  },
  dangerBtn: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
    borderRadius: 4,
  },
  dangerBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ff6b6b',
    letterSpacing: 1,
  },
  version: {
    textAlign: 'center',
    color: '#45474b',
    fontSize: 12,
    marginTop: 20,
  },
})
