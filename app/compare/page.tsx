'use client';
import { useEffect, useState } from 'react';
import { getArtifacts } from '../../lib/service';
import { Artifact } from '../../types';

export default function ComparePage() {
  const [arts, setArts] = useState<Artifact[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => {
    getArtifacts().then(setArts);
  }, []);

  const toggle = (id: string) => {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : s.length < 4 ? [...s, id] : s
    );
  };
  const items = arts.filter((a) => selected.includes(a.id));
  const bestCost = Math.min(...items.map((i) => i.metrics.priceUsd), Infinity);
  const bestLatency = Math.min(...items.map((i) => i.metrics.latencyMs), Infinity);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Compare</h1>
      <ul className="mb-4">
        {arts.map((a) => (
          <li key={a.id}>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(a.id)}
                onChange={() => toggle(a.id)}
                aria-label={`select ${a.name}`}
              />
              {a.name}
            </label>
          </li>
        ))}
      </ul>
      {items.length > 0 && (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border p-1">Artifact</th>
              <th className="border p-1">Price</th>
              <th className="border p-1">Latency</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td className="border p-1">{a.name}</td>
                <td className={`border p-1 ${a.metrics.priceUsd === bestCost ? 'bg-green-200' : ''}`}>${a.metrics.priceUsd.toFixed(2)}</td>
                <td className={`border p-1 ${a.metrics.latencyMs === bestLatency ? 'bg-green-200' : ''}`}>{a.metrics.latencyMs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
