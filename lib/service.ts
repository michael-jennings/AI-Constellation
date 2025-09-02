import { Artifact, Capability } from '../types';

async function loadJson<T>(path: string): Promise<T> {
  const data = await import(`../data/${path}`, { assert: { type: 'json' } });
  return data.default as T;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getArtifacts(): Promise<Artifact[]> {
  await delay(200);
  return loadJson<Artifact[]>('artifacts.json');
}

export async function getArtifact(id: string): Promise<Artifact | undefined> {
  const list = await getArtifacts();
  return list.find((a) => a.id === id);
}

export async function getCapabilities(): Promise<Capability[]> {
  await delay(200);
  return loadJson<Capability[]>('capabilities.json');
}
