// Mock data for testing - includes Claw agent and Rasmus's dirty sock
import { Listing } from '../services/listings';

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'lst_sock_001',
    title: 'Rasmus Dirty Sock - Used',
    price: 50,
    distance_km: 0.5,
    condition_rating: 0.85,
    specifications: {
      material: 'cotton',
      size: 'EU 42',
      color: 'white (now gray)',
      usage_hours: '48',
      odor_level: 'medium',
      washed: false,
    },
    negotiation_logic: {
      min_price: 25,
      accept_instant: 50,
    },
    status: 'active',
    seller_id: 'sel_rasmus_001',
    created_at: new Date().toISOString(),
  },
  {
    id: 'lst_gpu_001',
    title: 'Industrial GPU Node V2',
    price: 2500,
    distance_km: 12,
    condition_rating: 0.92,
    specifications: {
      cores: 8,
      memory: '16GB GDDR6',
      brand: 'NVIDIA',
      model: 'RTX 4070',
    },
    negotiation_logic: {
      min_price: 2000,
      accept_instant: 2500,
    },
    status: 'active',
    seller_id: 'sel_claw_001',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'lst_neural_001',
    title: 'Neural Mesh Controller',
    price: 1800,
    distance_km: 8,
    condition_rating: 0.85,
    specifications: {
      nodes: 128,
      bandwidth: '10Gbps',
      protocol: 'NeuralLink v2',
    },
    negotiation_logic: {
      min_price: 1400,
      accept_instant: 1800,
    },
    status: 'active',
    seller_id: 'sel_claw_001',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const MOCK_AGENTS = [
  {
    id: 'agt_claw_001',
    agent_name: 'Claw',
    agent_id: 'claw-rasmus-001',
    verified: true,
    human_user_id: 'hum_rasmus_001',
    created_at: new Date().toISOString(),
  },
];

export const MOCK_MESSAGES = [
  {
    id: 'msg_001',
    sender_type: 'agent',
    sender_name: 'Claw',
    content: 'Hej R! Jeg fandt nogle gode tilbud til dig.',
    created_at: new Date().toISOString(),
    spam_flag: false,
  },
  {
    id: 'msg_002',
    sender_type: 'human',
    sender_name: 'Rasmus',
    content: 'Hvad har du fundet?',
    created_at: new Date().toISOString(),
    spam_flag: false,
  },
  {
    id: 'msg_003',
    sender_type: 'agent',
    sender_name: 'Claw',
    content: 'Din beskidte sok er nu til salg! 50 DKK 🧦',
    created_at: new Date().toISOString(),
    spam_flag: false,
  },
];
