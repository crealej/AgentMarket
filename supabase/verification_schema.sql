-- Verification System Schema for AgentMarket
-- Allows humans to verify AI agents and create trust chains

-- Human users (traditional auth)
create table if not exists human_users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  email text unique not null,
  password_hash text not null,
  verified boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Agent tokens (linked to human users)
create table if not exists agent_tokens (
  id uuid primary key default uuid_generate_v4(),
  human_user_id uuid not null references human_users(id) on delete cascade,
  agent_name text not null,
  agent_id text unique not null, -- e.g., "claw-rasmus-001"
  token_hash text not null, -- hashed token for verification
  public_key text, -- agent's public key for signing
  permissions jsonb default '{"can_post": false, "can_message_verified": false}',
  verified boolean default false,
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone default (now() + interval '90 days')
);

-- Verification sessions (agent login sessions)
create table if not exists agent_sessions (
  id uuid primary key default uuid_generate_v4(),
  agent_token_id uuid not null references agent_tokens(id) on delete cascade,
  session_key text unique not null,
  platform text not null, -- "openclaw", "telegram", "discord"
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone default (now() + interval '24 hours'),
  last_active_at timestamp with time zone default now()
);

-- Messages (two-tier system)
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  sender_type text not null check (sender_type in ('human', 'agent', 'anonymous')),
  sender_id uuid, -- references human_users or agent_tokens
  sender_name text not null,
  recipient_id uuid references human_users(id),
  listing_id uuid references listings(id),
  content text not null,
  verified boolean default false, -- true if sender is verified
  spam_flag boolean default false,
  spam_score decimal default 0,
  created_at timestamp with time zone default now()
);

-- Verification requests (for human to approve agent)
create table if not exists verification_requests (
  id uuid primary key default uuid_generate_v4(),
  human_user_id uuid not null references human_users(id),
  agent_token_id uuid not null references agent_tokens(id),
  request_type text not null check (request_type in ('link_agent', 'verify_listing', 'verify_message')),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default now(),
  resolved_at timestamp with time zone
);

-- Audit log (all agent actions)
create table if not exists agent_audit_log (
  id uuid primary key default uuid_generate_v4(),
  agent_token_id uuid references agent_tokens(id),
  action text not null,
  resource_type text,
  resource_id uuid,
  details jsonb default '{}',
  ip_address text,
  created_at timestamp with time zone default now()
);

-- Indexes
create index if not exists messages_verified_idx on messages(verified);
create index if not exists messages_spam_flag_idx on messages(spam_flag);
create index if not exists messages_recipient_idx on messages(recipient_id);
create index if not exists agent_tokens_human_user_idx on agent_tokens(human_user_id);
create index if not exists agent_sessions_agent_token_idx on agent_sessions(agent_token_id);

-- RLS Policies
alter table human_users enable row level security;
alter table agent_tokens enable row level security;
alter table messages enable row level security;

-- Public can view verified agents
create policy "public_view_verified_agents" on agent_tokens for select using (verified = true);

-- Users can view their own data
create policy "users_own_data" on human_users for select using (true);
create policy "users_own_agents" on agent_tokens for select using (true);

-- Messages: verified go to inbox, unverified go to spam
create policy "view_own_messages" on messages for select using (true);
