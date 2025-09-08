'use client';
import { useEffect, useState } from 'react';
import { getArtifacts } from '../lib/service';
import { Artifact } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function HomePage() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  useEffect(() => {
    getArtifacts().then(setArtifacts);
  }, []);

  const counts = Array.from({ length: 30 }, (_, i) => {
    const day = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
    const iso = day.toISOString().slice(0, 10);
    const events = artifacts.flatMap((a) => a.events);
    return {
      date: iso,
      new: events.filter((e) => e.kind === 'update' && e.ts.slice(0, 10) === iso).length,
    };
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={counts}>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip />
            <Line type="monotone" dataKey="new" stroke="#8884d8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
