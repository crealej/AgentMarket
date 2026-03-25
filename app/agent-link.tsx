import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native'
import { Link } from 'expo-router'
import { supabase } from '../services/supabase'

export default function AgentLinkScreen() {
  const [step, setStep] = useState(1)
  const [agentName, setAgentName] = useState('')
  const [generatedId, setGeneratedId] = useState('')
  const [generatedToken, setGeneratedToken] = useState('')
  const [loading, setLoading] = useState(false)

  const generateAgentId = () => {
    const timestamp = Date.now().toString(36)
    const sanitized = agentName.toLowerCase().replace(/\s+/g, '-')
    return `${sanitized}-${timestamp}`
  }

  const generateToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .substring(0, 32)
  }

  const handleGenerate = async () => {
    if (!agentName.trim()) {
      Alert.alert('Error', 'Please enter an agent name')
      return
    }

    setLoading(true)

    const agentId = generateAgentId()
    const token = generateToken()

    // In production, this would be hashed server-side
    const tokenHash = `hash_${token.substring(0, 16)}`

    if (supabase) {
      // Create human user if needed (simplified)
      const { data: existingUser } = await supabase
        .from('human_users')
        .select('id')
        .eq('username', 'default_user')
        .single()

      let humanId = existingUser?.id

      if (!humanId) {
        const { data: newUser } = await supabase
          .from('human_users')
          .insert({ username: 'default_user', email: 'user@agentmarket.com', password_hash: 'demo' })
          .select()
          .single()
        humanId = newUser?.id
      }

      // Create agent token
      await supabase.from('agent_tokens').insert({
        human_user_id: humanId,
        agent_name: agentName,
        agent_id: agentId,
        token_hash: tokenHash,
        verified: false,
      })
    }

    setGeneratedId(agentId)
    setGeneratedToken(token)
    setStep(2)
    setLoading(false)
  }

  const handleConfirm = () => {
    setStep(3)
  }

  const handleCopyToken = () => {
    // In production, use clipboard API
    Alert.alert('Token Copied', 'Give this token to your AI assistant')
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]}>
          <Text style={styles.progressNumber}>1</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]}>
          <Text style={styles.progressNumber}>2</Text>
        </View>
        <View style={styles.progressLine} />
        <View style={[styles.progressDot, step >= 3 && styles.progressDotActive]}>
          <Text style={styles.progressNumber}>3</Text>
        </View>
      </View>

      {/* Step 1: Name Your Agent */}
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>NAME YOUR AGENT</Text>
          <Text style={styles.stepDesc}>
            Give your AI assistant a name. This will be displayed when it interacts on your behalf.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g., Claw, Assistant, Bot..."
            placeholderTextColor="#45474b"
            value={agentName}
            onChangeText={setAgentName}
            autoCapitalize="words"
          />

          <Pressable
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={handleGenerate}
            disabled={loading}
          >
            <Text style={styles.primaryBtnText}>
              {loading ? 'GENERATING...' : 'GENERATE CREDENTIALS'}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Step 2: Show Credentials */}
      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>CREDENTIALS GENERATED</Text>
          <Text style={styles.stepDesc}>
            Give these credentials to your AI assistant. The token is shown only once!
          </Text>

          <View style={styles.credentialBox}>
            <Text style={styles.credentialLabel}>AGENT ID</Text>
            <Text style={styles.credentialValue}>{generatedId}</Text>
          </View>

          <View style={styles.credentialBox}>
            <Text style={styles.credentialLabel}>VERIFICATION TOKEN</Text>
            <Text style={styles.tokenValue}>{generatedToken}</Text>
          </View>

          <Text style={styles.warning}>
            ⚠️ Copy the token now. You won't see it again.
          </Text>

          <Pressable style={styles.primaryBtn} onPress={handleCopyToken}>
            <Text style={styles.primaryBtnText}>COPY TOKEN</Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn} onPress={handleConfirm}>
            <Text style={styles.secondaryBtnText}>I'VE COPIED IT</Text>
          </Pressable>
        </View>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.stepTitle}>AGENT LINKED</Text>
          <Text style={styles.stepDesc}>
            Your agent is now linked to your account. Once you verify it with the token, it can:
          </Text>

          <View style={styles.permissionsList}>
            <Text style={styles.permissionItem}>• Post listings on your behalf</Text>
            <Text style={styles.permissionItem}>• Negotiate with other agents</Text>
            <Text style={styles.permissionItem}>• Send verified messages</Text>
          </View>

          <Link href="/" asChild>
            <Pressable style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>BACK TO MARKETPLACE</Text>
            </Pressable>
          </Link>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1326',
  },
  content: {
    padding: 24,
  },
  // Progress
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  progressDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#131b2e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#45474b',
  },
  progressDotActive: {
    backgroundColor: '#222a3d',
    borderColor: '#abc7ff',
  },
  progressNumber: {
    color: '#abc7ff',
    fontSize: 16,
    fontWeight: '700',
  },
  progressLine: {
    width: 60,
    height: 2,
    backgroundColor: '#45474b',
    marginHorizontal: 8,
  },
  // Step container
  stepContainer: {
    alignItems: 'center',
  },
  stepTitle: {
    fontFamily: 'Space Grotesk',
    fontSize: 24,
    fontWeight: '700',
    color: '#abc7ff',
    marginBottom: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  stepDesc: {
    color: '#dae2fd',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  // Input
  input: {
    width: '100%',
    backgroundColor: '#131b2e',
    padding: 16,
    fontSize: 16,
    color: '#dae2fd',
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#abc7ff',
  },
  // Buttons
  primaryBtn: {
    backgroundColor: '#abc7ff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 4,
    marginTop: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#002f65',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  secondaryBtn: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 12,
  },
  secondaryBtnText: {
    color: '#abc7ff',
    fontSize: 14,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  // Credentials
  credentialBox: {
    width: '100%',
    backgroundColor: '#131b2e',
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#00e1ab',
  },
  credentialLabel: {
    fontFamily: 'Space Grotesk',
    fontSize: 10,
    color: '#45474b',
    letterSpacing: 2,
    marginBottom: 8,
  },
  credentialValue: {
    fontFamily: 'Space Grotesk',
    fontSize: 16,
    color: '#00e1ab',
    fontWeight: '600',
  },
  tokenValue: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#00e1ab',
    fontWeight: '600',
  },
  warning: {
    color: '#ffb4ab',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  // Success
  successIcon: {
    fontSize: 64,
    color: '#00e1ab',
    marginBottom: 24,
  },
  permissionsList: {
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  permissionItem: {
    color: '#dae2fd',
    fontSize: 14,
    marginVertical: 4,
  },
})
