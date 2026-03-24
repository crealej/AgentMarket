import React from 'react'
import { Slot } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AgentIdentityProvider } from '../context/AgentIdentityContext'
import { View, StatusBar } from 'react-native'

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AgentIdentityProvider>
        <StatusBar barStyle="light-content" />
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
      </AgentIdentityProvider>
    </SafeAreaProvider>
  )
}
