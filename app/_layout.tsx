import { Tabs } from 'expo-router'

export default function RootLayout() {
  return (
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
          tabBarIcon: ({ color }) => <Text style={{ color }}>📊</Text>
        }} 
      />
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Marketplace',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🏪</Text>
        }} 
      />
      <Tabs.Screen 
        name="messaging" 
        options={{ 
          title: 'Messages',
          tabBarIcon: ({ color }) => <Text style={{ color }}>💬</Text>
        }} 
      />
      <Tabs.Screen 
        name="agent-link" 
        options={{ 
          title: 'Link Agent',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🤖</Text>
        }} 
      />
      <Tabs.Screen 
        name="create-listing" 
        options={{ 
          title: 'Create',
          tabBarIcon: ({ color }) => <Text style={{ color }}>➕</Text>
        }} 
      />
    </Tabs>
  )
}
