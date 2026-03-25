import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

interface EmptyStateProps {
  icon?: string
  title: string
  message?: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  icon = '📦',
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && onAction && (
        <Pressable style={styles.actionBtn} onPress={onAction}>
          <Text style={styles.actionBtnText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dae2fd',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#8f9095',
    textAlign: 'center',
    marginBottom: 24,
  },
  actionBtn: {
    backgroundColor: '#abc7ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#002f65',
    letterSpacing: 1,
  },
})
