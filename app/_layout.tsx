import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0b1326' },
        headerTintColor: '#abc7ff',
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: '#0b1326' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'AgentMarket' }} />
      <Stack.Screen name="messaging" options={{ title: 'Messages' }} />
      <Stack.Screen name="agent-link" options={{ title: 'Link Agent' }} />
      <Stack.Screen name="create-listing" options={{ title: 'Create Listing' }} />
    </Stack>
  )
}
