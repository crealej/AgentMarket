import 'react-native-url-polyfill/auto'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY in your environment.',
  )
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY.')
  }

  return supabase
}
