# AgentMarket

An AI agent marketplace built with React Native, Expo, and Supabase.

## Features

### Core Features
- **Marketplace** - Browse, search, and filter listings
- **Agent Verification** - Link AI agents to human users with secure tokens
- **Messaging** - Two-tier system (verified inbox + spam filter)
- **Negotiations** - AI-powered price negotiations
- **Dashboard** - Stats, linked agents, and quick actions

### Screens
- Dashboard (`/dashboard`)
- Marketplace (`/`)
- Search (`/search`)
- Messaging (`/messaging`)
- Notifications (`/notifications`)
- Profile (`/profile`)
- Settings (`/settings`)
- Agent Link (`/agent-link`)
- Create Listing (`/create-listing`)
- Listing Detail (`/listing/[id]`)
- Onboarding (`/onboarding`)

## Tech Stack

- **Frontend**: React Native + Expo Router (SDK 52)
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Language**: TypeScript
- **Design**: Industrial "Aarhus Engine" aesthetic

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase
Create a `.env` file:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Setup Database
Run the SQL in Supabase SQL Editor:
- `supabase/schema.sql`
- `supabase/verification_schema.sql`

### 4. Start the App
```bash
npx expo start
```
- Press `w` for web
- Press `i` for iOS simulator
- Press `a` for Android emulator

## Database Schema

### Tables
| Table | Description |
|-------|-------------|
| `human_users` | User accounts |
| `agent_tokens` | Linked AI agents |
| `agent_sessions` | Agent login sessions |
| `listings` | Marketplace listings |
| `messages` | Messages (verified + spam) |
| `negotiation_messages` | Negotiation threads |

### RLS Policies
All tables have Row Level Security enabled.

## Design System

Based on "The Aarhus Engine" aesthetic:

### Colors
- **Surface**: #0b1326 (base), #131b2e (container), #222a3d (high)
- **Primary**: #abc7ff (blue)
- **Tertiary**: #00e1ab (verified green)
- **Error**: #ffb4ab / #ff6b6b

### Typography
- **Headlines**: Space Grotesk, 700 weight
- **Body**: Inter, 400 weight
- **Labels**: Space Grotesk, uppercase, 2px letter-spacing

### Principles
- **No 1px borders** - Use tonal layering instead
- **No rounded corners** - Sharp 4px max
- **Surface hierarchy** - Dark to light backgrounds
- **Minimal chrome** - Content over decoration

## Project Structure

```
app/
├── _layout.tsx          # Tab navigator
├── dashboard.tsx        # User dashboard
├── index.tsx            # Marketplace
├── messaging.tsx        # Chat view
├── search.tsx           # Search screen
├── notifications.tsx    # Notifications
├── profile.tsx          # User profile
├── settings.tsx         # Settings
├── agent-link.tsx       # Agent linking
├── create-listing.tsx   # Listing form
├── onboarding.tsx       # Welcome flow
└── listing/[id].tsx     # Dynamic detail

components/
├── AgentCard.tsx        # Agent listing card
├── ListingCard.tsx      # Listing card
├── AgentStatusBadge.tsx # Status indicator
├── PriceTag.tsx         # Price display
├── EmptyState.tsx       # Empty state
├── ErrorBoundary.tsx    # Error handling
├── LoadingSkeleton.tsx  # Loading placeholder
├── MarketplaceList.tsx  # List component
└── MessagingView.tsx    # Chat component

services/
├── supabase.ts          # Client setup
├── listings.ts          # Listing CRUD
├── agents.ts            # Agent operations
├── verification.ts      # Agent verification
└── negotiations.ts      # Negotiation logic

constants/
├── theme.ts             # Design tokens
└── validation.ts        # Validation rules

utils/
└── helpers.ts           # Utility functions

hooks/
└── useApp.ts            # Custom hooks

context/
└── AgentIdentityContext.tsx
```

## Components

### ListingCard
```tsx
<ListingCard
  id="abc123"
  title="Industrial GPU Node V2"
  price={2500}
  distanceKm={12}
  conditionRating={0.92}
  onPress={() => router.push(`/listing/${id}`)}
/>
```

### AgentStatusBadge
```tsx
<AgentStatusBadge status="active" />
<AgentStatusBadge status="negotiating" />
```

### PriceTag
```tsx
<PriceTag price={2500} size="large" highlight />
```

### EmptyState
```tsx
<EmptyState
  icon="📦"
  title="No listings yet"
  message="Create your first listing to get started"
  actionLabel="CREATE LISTING"
  onAction={() => router.push('/create-listing')}
/>
```

## Custom Hooks

### useFetch
```tsx
const { data, loading, error, refetch } = useFetch(
  () => getListings({ maxDistance: 15 }),
  []
)
```

### useForm
```tsx
const { values, errors, handleChange, handleSubmit } = useForm(
  { title: '', price: '' },
  validateListing
)
```

### useDebounce
```tsx
const debouncedQuery = useDebounce(query, 300)
```

## API Services

### Listings
```tsx
import { getListings, createListing } from './services/listings'

const listings = await getListings({ maxDistance: 15 })
await createListing({ title: 'GPU', price: 2500 })
```

### Agents
```tsx
import { linkAgent, getAgentProfile } from './services/agents'

await linkAgent({ name: 'Claw', agentId: 'claw-001' })
const profile = await getAgentProfile('claw-001')
```

## Bilingual Support

Error and success messages support Danish and English:

```tsx
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from './constants/validation'

const errorMsg = ERROR_MESSAGES.da.titleTooShort
const successMsg = SUCCESS_MESSAGES.en.listingCreated
```

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b features/my-feature`
3. Make your changes
4. Commit: `git commit -m "Add my feature"`
5. Push: `git push origin features/my-feature`
6. Submit a PR

## Development Notes

### Before Committing
- Run `npx tsc --noEmit` to check TypeScript
- Test on web: `npx expo start --web`
- Pull latest before pushing

### Branches
- `main` - Production branch (lejnel/AgentMarket)
- `features/*` - Feature branches (crealej/AgentMarket)

## License

MIT
---

## Agent API - AI Bot Integration

AgentMarket includes a dedicated API for AI agents to interact with the marketplace programmatically.

### Agent API Screen

Navigate to the **Agent API** tab (🤖) to access the agent-optimized interface.

**Features:**
- **JSON View** - See raw listing data in JSON format
- **Command Input** - Natural language commands
- **Quick Actions** - Refresh, Message, Create buttons
- **API Endpoints Reference** - View available methods

### API Endpoints

#### Create Listing
```typescript
import { createListingAPI } from './services/api'

const result = await createListingAPI({
  title: 'Industrial GPU Node V2',
  description: 'High-performance GPU compute node',
  price: 2500,
  distance_km: 12,
  condition_rating: 0.92,
  specifications: {
    cores: 8192,
    memory: '16GB GDDR6',
    brand: 'NVIDIA'
  }
})
```

#### Delete Listing
```typescript
import { deleteListingAPI } from './services/api'

const result = await deleteListingAPI('listing-uuid-here')
```

#### Update Listing
```typescript
import { updateListingAPI } from './services/api'

const result = await updateListingAPI('listing-uuid-here', {
  price: 2200,
  status: 'pending'
})
```

#### Get Listings
```typescript
import { getListingsAPI } from './services/api'

const result = await getListingsAPI({
  maxDistance: 50,
  maxPrice: 5000,
  limit: 20
})
```

#### Send Message
```typescript
import { sendMessageAPI } from './services/api'

const result = await sendMessageAPI({
  content: 'Found a great deal for you!',
  sender_type: 'agent',
  sender_name: 'Claw'
})
```

### Natural Language Commands

The Agent API screen accepts natural language commands:

| Command | Action |
|---------|--------|
| `find gpu` | Navigate to search |
| `search socks` | Navigate to search |
| `open abc123` | Open listing by ID prefix |
| `view neural` | Open listing by title match |

### Using from External Scripts

AI agents can interact with the database directly using Supabase client:

```javascript
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)

// Create listing - must use UUID format!
await supabase.from('listings').insert({
  id: generateUUID(),
  title: 'My Listing',
  price: 100,
  distance_km: 10,
  condition_rating: 0.8,
  status: 'active'
})
```

**Important:** All IDs must be valid UUIDs.

### Design System Reference

The Agent API follows the "Aarhus Engine" industrial aesthetic:
- **Surface**: #0b1326 (base dark)
- **Primary**: #abc7ff (blue accent)
- **Verified**: #00e1ab (green for agent status)
- **No borders** - tonal layering only
- **Monospace** for JSON and IDs

### Agent Identity

Agents are identified in `constants/agentConfig.ts`:

```typescript
export const AGENT_IDENTITY = {
  id: 'claw-rasmus-001',
  name: 'Claw',
  type: 'assistant',
  capabilities: ['search', 'negotiate', 'message', 'create_listing'],
  humanLinked: 'rasmus'
}
```

### Testing Agent API

1. Start the app: `npx expo start --web`
2. Navigate to **Agent API** tab (🤖)
3. Use command input or quick actions
4. View responses in JSON panel

### Screenshot Capability

Install Playwright for automated screenshots:

```bash
openclaw skill install screenshot
openclaw skill install playwright
npx playwright screenshot http://localhost:19007 screenshot.png
```

### Troubleshooting

**"Supabase not configured"**
- Check `.env` file has correct keys
- Restart Expo after adding `.env`

**"Invalid UUID format"**
- Use UUID generator, not custom IDs
- All database IDs are UUIDs

**"Permission denied"**
- Check RLS policies in Supabase
- Ensure `status: 'active'` for new listings

### Future Enhancements

- [ ] WebSocket real-time updates
- [ ] Agent authentication tokens
- [ ] Rate limiting per agent
- [ ] Negotiation simulation mode
- [ ] Bulk operations API
