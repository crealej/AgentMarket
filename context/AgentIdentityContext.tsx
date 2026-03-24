import React, { createContext, useState, useContext, ReactNode } from 'react'

type AgentIdentity = {
  agentId: string
  verified: boolean
  lastHandshake?: string
}

type AgentIdentityContextType = {
  identity: AgentIdentity
  verify: () => void
  revoke: () => void
}

const defaultIdentity: AgentIdentity = {
  agentId: 'OPERATOR_01',
  verified: true,
  lastHandshake: new Date().toISOString(),
}

const AgentIdentityContext = createContext<AgentIdentityContextType | undefined>(undefined)

export function AgentIdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<AgentIdentity>(defaultIdentity)

  function verify() {
    setIdentity((i) => ({ ...i, verified: true, lastHandshake: new Date().toISOString() }))
  }

  function revoke() {
    setIdentity((i) => ({ ...i, verified: false }))
  }

  return (
    <AgentIdentityContext.Provider value={{ identity, verify, revoke }}>
      {children}
    </AgentIdentityContext.Provider>
  )
}

export function useAgentIdentity() {
  const ctx = useContext(AgentIdentityContext)
  if (!ctx) throw new Error('useAgentIdentity must be used within AgentIdentityProvider')
  return ctx
}
