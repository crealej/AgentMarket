# Agent Market

Agent Market is a mock AI marketplace built with React Native, Expo, Expo Router, and TypeScript. It simulates agents browsing local listings, inspecting JSON-LD style product data, and running a simple negotiation flow.

## What It Includes

- A home screen that lists sample agent listings with price, distance, and condition metadata
- A raw data toggle for viewing the underlying JSON-LD listing payloads
- A distance filter for narrowing results to nearby listings
- A negotiation log that shows a deterministic buyer and seller back-and-forth
- An agent identity context with a default verified operator identity
- A placeholder details route for future listing expansion

## Project Structure

- `app/` Expo Router screens and layout
- `components/` Listing cards, distance badges, and the marketplace list
- `context/` Agent identity state and verification helpers
- `services/` Mock negotiation heuristics and simulation logic
- `scripts/` Example negotiation script for the services layer

## Getting Started

```bash
cd ~/AgentMarket
npm install
npm start
```

Then open the app with Expo Go or launch a platform-specific target:

```bash
npm run ios
npm run android
npm run web
```

## Notes

- The marketplace data is hardcoded and local only.
- Negotiation behavior is deterministic mock logic, not a live agent network.
- The details screen is currently a stub.
- Supabase is wired through `services/supabase.ts` and expects `EXPO_PUBLIC_SUPABASE_URL` plus `EXPO_PUBLIC_SUPABASE_KEY`.

## Supabase Setup

Copy `.env.example` to your local environment file and set the public Supabase values there.

```bash
cp .env.example .env
```

The shared client lives in `services/supabase.ts` and can be imported anywhere in the app:

```ts
import { supabase } from '../services/supabase'
```

## Optional Smoke Test

The negotiation example lives in `scripts/testNegotiator.ts`. Add a TypeScript runtime if you want to execute it locally.
