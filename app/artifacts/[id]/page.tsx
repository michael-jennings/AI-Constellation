'use client';
import { useEffect, useState } from 'react';
import { getArtifact, getArtifacts } from '../../../lib/service';
import { Artifact } from '../../../types';
import { useParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import * as d3 from 'd3-force';
import { useContextStore } from '../../../lib/store';
import { edgeScore } from '../../../lib/scoring';

export default function ArtifactDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [similar, setSimilar] = useState<Artifact[]>([]);
  const { context } = useContextStore();

  useEffect(() => {
    if (id) {
      getArtifact(id).then((a) => a && setArtifact(a));
      getArtifacts().then((all) => {
        const sims = all.filter((x) => x.type === artifact?.type && x.id !== id).slice(0, 3);
        setSimilar(sims);
      });
    }
  }, [id, artifact?.type]);

  if (!artifact) return <div>Loading...</div>;
  const score = edgeScore(artifact, context).toFixed(2);

  const timeline = artifact.events.map((e) => ({ ts: e.ts, value: artifact.metrics.priceUsd }));

  // simple d3 force layout for relationships
  const nodes = [{ id: artifact.id, main: true }, ...artifact.rels.map((r) => ({ id: r.target }))];
  const links = artifact.rels.map((r) => ({ source: artifact.id, target: r.target }));
  const sim = d3.forceSimulation(nodes as any)
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(150, 75))
    .force('link', d3.forceLink(links).distance(80))
    .stop();
  for (let i = 0; i < 80; i++) sim.tick();

  return (
  <div>
    <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
      {artifact.name}
      <span className="bg-blue-100 px-2 py-1 rounded text-sm">Score {score}</span>
    </h1>
    <p className="mb-2">Provider: {artifact.provider}</p>
    <div className="mb-4">Price: ${artifact.metrics.priceUsd.toFixed(2)} / Latency: {artifact.metrics.latencyMs}ms</div>
    <h2 className="font-semibold mb-1">Relationships</h2>
    <svg width={300} height={150} role="img" aria-label="relationship graph">
      {links.map((l, i) => (
        <line
          key={i}
          x1={(nodes.find((n) => n.id === l.source) as any)?.x}
          y1={(nodes.find((n) => n.id === l.source) as any)?.y}
          x2={(nodes.find((n) => n.id === l.target) as any)?.x}
          y2={(nodes.find((n) => n.id === l.target) as any)?.y}
          stroke="#999"
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={(n as any).x} cy={(n as any).y} r={n.main ? 10 : 6} fill={n.main ? 'orange' : 'steelblue'} />
      ))}
    </svg>
    <h2 className="font-semibold mt-4 mb-1">Timeline</h2>
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={timeline}>
          <XAxis dataKey="ts" hide />
          <YAxis hide />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <h2 className="font-semibold mt-4 mb-1">Similar</h2>
    <ul>
      {similar.map((s) => (
        <li key={s.id}>
          <Link href={`/artifacts/${s.id}`}>{s.name}</Link>
        </li>
      ))}
    </ul>
  </div>
  );
}
