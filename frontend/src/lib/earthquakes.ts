export const FEED_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson';
export type Observation = { id: string; magnitude: number; place: string; time: number; url: string; depth: number | null; review: string };
export type Snapshot = { generated: number; observations: Observation[]; skipped: number };
function record(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function timestamp(value: unknown): value is number { return typeof value === 'number' && Number.isSafeInteger(value) && value > 0 && Number.isFinite(new Date(value).getTime()); }
export function normalizeFeed(value: unknown): Snapshot {
  if (!record(value) || value.type !== 'FeatureCollection' || !record(value.metadata) || !timestamp(value.metadata.generated) || !Array.isArray(value.features) || value.features.length > 10000) throw new Error('The source did not return a valid observation feed.');
  const observations: Observation[] = [], seen = new Set<string>();
  let skipped = 0;
  for (const feature of value.features) {
    if (!record(feature) || typeof feature.id !== 'string' || !feature.id || feature.id.length > 100 || seen.has(feature.id) || !record(feature.properties)) { skipped++; continue; }
    const p = feature.properties;
    if (typeof p.mag !== 'number' || !Number.isFinite(p.mag) || p.mag < -2 || p.mag > 10 || typeof p.place !== 'string' || !timestamp(p.time) || typeof p.url !== 'string') { skipped++; continue; }
    let url: URL;
    try { url = new URL(p.url); } catch { skipped++; continue; }
    if (url.protocol !== 'https:' || url.hostname !== 'earthquake.usgs.gov' || url.username || url.password || url.port) { skipped++; continue; }
    const coordinates = record(feature.geometry) && Array.isArray(feature.geometry.coordinates) ? feature.geometry.coordinates : [];
    observations.push({ id: feature.id, magnitude: p.mag, place: p.place.slice(0, 300), time: p.time, url: url.href, depth: typeof coordinates[2] === 'number' && Number.isFinite(coordinates[2]) ? coordinates[2] : null, review: p.status === 'reviewed' ? 'USGS reviewed' : 'USGS automatic / unreviewed' });
    seen.add(feature.id);
  }
  if (value.features.length && !observations.length) throw new Error('No valid observations could be read from the source.');
  return { generated: value.metadata.generated, observations: observations.sort((a, b) => b.time - a.time), skipped };
}
export function isStale(snapshot: Snapshot, now = Date.now()) { return now - snapshot.generated > 15 * 60 * 1000 || snapshot.generated - now > 5 * 60 * 1000; }
export async function fetchObservations(signal: AbortSignal): Promise<Snapshot> {
  const response = await fetch(FEED_URL, { signal, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
  if (!response.ok || !response.body) throw new Error('USGS is unavailable. Try refreshing later.');
  const reader = response.body.getReader(); let bytes = 0; const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      bytes += value.byteLength;
      if (bytes > 2 * 1024 * 1024) { await reader.cancel(); throw new Error('The source response exceeded the allowed size.'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const buffer = new Uint8Array(bytes); let offset = 0;
  for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.byteLength; }
  return normalizeFeed(JSON.parse(new TextDecoder().decode(buffer)));
}
