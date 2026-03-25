// Test script for Supabase connection
// Run with: npx ts-node scripts/testSupabase.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables')
  console.log('Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testing Supabase connection...')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseKey.substring(0, 20) + '...')
  console.log('')

  // Test 1: Fetch listings
  console.log('=== Test 1: Fetch all listings ===')
  const { data: listings, error: listingsError } = await supabase
    .from('listings')
    .select('id, title, price, status')
  
  if (listingsError) {
    console.error('Error fetching listings:', listingsError)
  } else {
    console.log(`✅ Found ${listings?.length || 0} listings:`)
    listings?.forEach(l => console.log(`   - ${l.title} ($${l.price}) [${l.status}]`))
  }
  console.log('')

  // Test 2: Fetch agent profiles
  console.log('=== Test 2: Fetch agent profiles ===')
  const { data: agents, error: agentsError } = await supabase
    .from('agent_profiles')
    .select('id, agent_id, name, verified')
  
  if (agentsError) {
    console.error('Error fetching agents:', agentsError)
  } else {
    console.log(`✅ Found ${agents?.length || 0} agents:`)
    agents?.forEach(a => console.log(`   - ${a.name} (${a.agent_id}) [${a.verified ? 'verified' : 'unverified'}]`))
  }
  console.log('')

  // Test 3: Filter listings by distance
  console.log('=== Test 3: Filter listings (distance < 15km) ===')
  const { data: nearby, error: nearbyError } = await supabase
    .from('listings')
    .select('id, title, price, distance_km')
    .lte('distance_km', 15)
  
  if (nearbyError) {
    console.error('Error filtering listings:', nearbyError)
  } else {
    console.log(`✅ Found ${nearby?.length || 0} nearby listings:`)
    nearby?.forEach(l => console.log(`   - ${l.title} (${l.distance_km}km away, $${l.price})`))
  }
  console.log('')

  // Test 4: Insert a test listing (if service role)
  console.log('=== Test 4: Database structure check ===')
  const { data: structure, error: structError } = await supabase
    .from('listings')
    .select('id, title, description, price, condition_rating, distance_km, specifications, negotiation_logic, status, created_at')
    .limit(1)
  
  if (structError) {
    console.error('Error checking structure:', structError)
  } else {
    console.log('✅ Table structure verified')
    if (structure && structure[0]) {
      console.log('   Sample record:', JSON.stringify(structure[0], null, 2))
    }
  }

  console.log('')
  console.log('=== All tests completed! ===')
}

testConnection().catch(console.error)
