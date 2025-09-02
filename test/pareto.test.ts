import { describe, it, expect } from 'vitest';
import { paretoFrontier } from '../lib/pareto';
import { Artifact } from '../types';

const a = (id: string, price: number, lat: number): Artifact => ({
  id,
  name: id,
  type: '',
  provider: '',
  capabilities: [],
  constraints: {},
  metrics: {
    priceUsd: price,
    latencyMs: lat,
    adoption: 0,
    credibility: 0,
    updatedAt: new Date().toISOString(),
  },
  links: {},
  events: [],
  rels: [],
});

describe('paretoFrontier', () => {
  it('finds non-dominated items', () => {
    const items = [a('a', 10, 100), a('b', 20, 50), a('c', 30, 200)];
    const frontier = paretoFrontier(items);
    expect(frontier.map((x) => x.id).sort()).toEqual(['a', 'b']);
  });
});
