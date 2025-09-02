import fs from 'fs';
import path from 'path';
import seedrandom from 'seedrandom';
import { Artifact, Capability, Event, Relationship } from '../types';

const rng = seedrandom('constellation-seed');

function randInt(min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function randChoice<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

const types = ['model', 'tool', 'framework', 'API', 'service', 'dataset'];
const providers = Array.from({ length: 20 }, (_, i) => `Provider${i + 1}`);

const capabilityCats = ['infra', 'training', 'deployment', 'data', 'analytics'];
const capabilities: Capability[] = Array.from({ length: 25 }, (_, i) => ({
  id: `c${i + 1}`,
  name: `Capability ${i + 1}`,
  category: randChoice(capabilityCats),
}));

const artifacts: Artifact[] = Array.from({ length: 150 }, (_, i) => {
  const id = `a${i + 1}`;
  const updated = Date.now() - randInt(0, 180) * 24 * 60 * 60 * 1000;
  const events: Event[] = [
    { ts: new Date(updated).toISOString(), kind: 'update', notes: 'Initial release' },
  ];
  const artifact: Artifact = {
    id,
    name: `Artifact ${i + 1}`,
    type: randChoice(types),
    provider: randChoice(providers),
    capabilities: Array.from(
      new Set(Array.from({ length: randInt(1, 5) }, () => randChoice(capabilities).id))
    ),
    constraints: {},
    metrics: {
      priceUsd: randInt(10, 1000),
      latencyMs: randInt(10, 500),
      adoption: rng(),
      credibility: rng(),
      updatedAt: new Date(updated).toISOString(),
    },
    links: { homepage: 'https://example.com' },
    events,
    rels: [],
  };
  return artifact;
});

// relationships
for (const art of artifacts) {
  const relCount = randInt(5, 10);
  const relTypes: Relationship['type'][] = [
    'supersedes',
    'obsolete_by',
    'compatible_with',
    'requires',
    'alternative_to',
    'bundles_into',
    'part_of_stack',
  ];
  for (let i = 0; i < relCount; i++) {
    let target = randChoice(artifacts).id;
    if (target === art.id) target = randChoice(artifacts).id;
    art.rels.push({ type: randChoice(relTypes), target });
  }
}

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
fs.writeFileSync(path.join(dataDir, 'capabilities.json'), JSON.stringify(capabilities, null, 2));
fs.writeFileSync(path.join(dataDir, 'artifacts.json'), JSON.stringify(artifacts, null, 2));

console.log('Seed data generated');
