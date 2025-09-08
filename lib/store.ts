import { create } from 'zustand';
import type { Context } from '../types';

const defaultContext: Context = {
  use_case: '',
  platform: 'web',
  hardware: { cpu: 'x86', gpu: [], ram_gb: 16 },
  constraints: {
    max_budget_month_usd: 1000,
    latency_ms_p95: 100,
    offline_ok: false,
  },
  preferences: { openness: 'open', hosting: 'cloud' },
};

export const useContextStore = create<{ context: Context; setContext: (c: Context) => void }>(
  (set) => ({
    context: defaultContext,
    setContext: (context) => set({ context }),
  })
);
