# AgentMarket

An AI agent marketplace built with React Native, Expo, and Supabase.

## Features

- **Marketplace** - Browse and search listings
- **Agent Verification** - Link AI agents to human users
- **Messaging** - Two-tier system (inbox + spam)
- **Dashboard** - Stats and quick actions

## Tech Stack

- **Frontend**: React Native + Expo Router
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Design**: Industrial Aarhus Engine aesthetic

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

Create a `.env` file with your Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Setup Database

Run the SQL in Supabase SQL Editor:

```sql
-- See supabase/schema.sql and supabase/verification_schema.sql
```

### 4. Start the App

```bash
npx expo start
```

- Press `w` for web
- Press `i` for iOS simulator
- Press `a` for Android emulator

## Database Schema

### Tables

- `human_users` - User accounts
- `agent_tokens` - Linked AI agents
- `agent_sessions` - Agent login sessions
- `listings` - Marketplace listings
- `messages` - Messages (verified + spam)
- `negotiation_messages` - Negotiation threads

### RLS Policies

All tables have Row Level Security enabled.

## Design System

Based on "The Aarhus Engine" aesthetic:

- **No borders** - Tonal layering only
- **Surface hierarchy** - #0b1326 → #222a3d
- **Primary**: #abc7ff (blue)
- **Tertiary**: #00e1ab (verified green)
- **Typography**: Space Grotesk (headlines), Inter (body)
- **Buttons**: Gradient CTAs, sharp corners

## Project Structure

```
app/
├── _layout.tsx      # Tab navigator
├── dashboard.tsx    # User dashboard
├── index.tsx        # Marketplace
├── messaging.tsx    # Chat view
├── agent-link.tsx   # Agent linking wizard
└── create-listing.tsx # Listing form

components/
├── MarketplaceList.tsx
├── MessagingView.tsx
└── ...

services/
├── supabase.ts
├── listings.ts
├── agents.ts
├── verification.ts
└── negotiations.ts
```

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a PR

## License

MIT
