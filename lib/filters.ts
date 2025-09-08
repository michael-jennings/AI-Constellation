import { Artifact, Context } from '../types';
import { edgeScore } from './scoring';

export function filterArtifacts(
  artifacts: Artifact[],
  query: string,
  type: string,
  provider: string,
  context: Context
): { item: Artifact; score: number }[] {
  return artifacts
    .filter((a) =>
      [a.name, a.type, a.provider].some((f) => f.toLowerCase().includes(query.toLowerCase()))
    )
    .filter((a) => (type ? a.type === type : true))
    .filter((a) => (provider ? a.provider === provider : true))
    .map((a) => ({ item: a, score: edgeScore(a, context) }))
    .sort((a, b) => b.score - a.score);
}
