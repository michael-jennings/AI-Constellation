'use client';
import { useEffect, useState } from 'react';
import { getArtifacts } from '../../lib/service';
import { Artifact, Event } from '../../types';

export default function ChangesPage() {
  const [events, setEvents] = useState<(Event & { artifact: string })[]>([]);
  const [filter, setFilter] = useState('');
  useEffect(() => {
    getArtifacts().then((arts) => {
      const evs = arts.flatMap((a) => a.events.map((e) => ({ ...e, artifact: a.name })));
      evs.sort((a, b) => (a.ts < b.ts ? 1 : -1));
      setEvents(evs);
    });
  }, []);

  const filtered = events.filter((e) => (filter ? e.kind === filter : true));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Changes</h1>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border mb-2"
        aria-label="filter events"
      >
        <option value="">All</option>
        <option value="update">Update</option>
        <option value="deprecated">Deprecated</option>
        <option value="obsolete">Obsolete</option>
      </select>
      <ul>
        {filtered.map((e, i) => (
          <li key={i} className="border-b py-1">
            <span className="font-medium">{e.artifact}</span> - {e.kind} -{' '}
            {new Date(e.ts).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
