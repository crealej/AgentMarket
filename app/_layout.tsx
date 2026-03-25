import { Tabs } from 'expo-router'
import { Text } from 'react-native'
import ErrorBoundary from '../components/ErrorBoundary'

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: '#0b1326' },
          headerTintColor: '#abc7ff',
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarStyle: {
            backgroundColor: '#0d1117',
            borderTopColor: '#222a3d',
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: '#abc7ff',
          tabBarInactiveTintColor: '#45474b',
          contentStyle: { backgroundColor: '#0b1326' },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: () => <Text>📊</Text>
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Marketplace',
            tabBarIcon: () => <Text>🏪</Text>
          }}
        />
        <Tabs.Screen
          name="messaging"
          options={{
            title: 'Messages',
            tabBarIcon: () => <Text>💬</Text>
          }}
        />
        <Tabs.Screen
          name="agent-link"
          options={{
            title: 'Link Agent',
            tabBarIcon: () => <Text>🤖</Text>
          }}
        />
        <Tabs.Screen
          name="create-listing"
          options={{
            title: 'Create',
            tabBarIcon: () => <Text>➕</Text>
          }}
        />
      </Tabs>
    </ErrorBoundary>
  )
}
