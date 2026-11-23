'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FEED_URL, fetchObservations, isStale, type Snapshot } from '../lib/earthquakes';
import ResearchWorkspace from './ResearchWorkspace';

const date = (time: number) => new Date(time).toUTCString();
export default function ObservationDashboard() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [threshold, setThreshold] = useState(2.5);
  const [search, setSearch] = useState('');
  const [clock, setClock] = useState(Date.now());
  const pending = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    pending.current?.abort();
    const controller = new AbortController(); pending.current = controller;
    const timer = setTimeout(() => controller.abort(), 10000);
    setLoading(true); setError('');
    try { const next = await fetchObservations(controller.signal); if (pending.current === controller) { setSnapshot(next); setClock(Date.now()); } }
    catch { if (pending.current === controller) setError('The USGS feed could not be refreshed. Any previously loaded observations remain labeled by their source timestamp.'); }
    finally { clearTimeout(timer); if (pending.current === controller) { setLoading(false); pending.current = null; } }
  }, []);
  useEffect(() => { void refresh(); const timer = setInterval(() => setClock(Date.now()), 60000); return () => { pending.current?.abort(); pending.current = null; clearInterval(timer); }; }, [refresh]);
  const visible = snapshot?.observations.filter(item => item.magnitude >= threshold && item.place.toLowerCase().includes(search.toLowerCase())) ?? [];
  const stale = snapshot ? isStale(snapshot, clock) : false;
  return <main id="main-content" className="mx-auto max-w-6xl px-5 py-10 text-slate-900">
    <header className="mb-10 flex flex-wrap items-center justify-between gap-5"><a className="text-xl font-black tracking-tight" href="https://bobsome1.com">ProphecyTracker AI</a><a href="#research-workspace" className="rounded-full border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900 underline underline-offset-4">Open your research workspace</a></header>
    <section className="mb-10 max-w-3xl"><p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-800">Observe • Check the source • Separate interpretation</p><h1 className="text-4xl font-black leading-tight sm:text-5xl">Start with what the record supports.</h1><p className="mt-5 text-lg leading-relaxed text-slate-600">Review recent earthquake observations from the USGS. Measurements and source review status appear with each record. These observations do not establish a theological interpretation, an approaching deadline, or a prediction.</p></section>
    <section aria-labelledby="feed-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-5"><div><h2 id="feed-heading" className="text-2xl font-bold">Earthquake observations</h2><p className="mt-2 text-sm text-slate-600">USGS M2.5+ past-day feed • Worldwide reporting coverage varies</p></div><button type="button" disabled={loading} onClick={() => void refresh()} className="rounded-lg bg-blue-800 px-5 py-3 font-semibold text-white disabled:opacity-50">{loading ? 'Refreshing…' : 'Refresh source'}</button></div>
      <div role="status" aria-live="polite" className="my-5 rounded-lg bg-slate-50 p-4 text-sm leading-relaxed">
        {!snapshot ? loading ? 'Loading the official source…' : 'No observations have been loaded.' : <><strong>{stale ? 'Source snapshot is stale or its clock needs checking.' : 'Source snapshot loaded.'}</strong><br />Source generated: {date(snapshot.generated)}. {snapshot.observations.length} valid records received.{snapshot.skipped > 0 && ` ${snapshot.skipped} malformed records were omitted.`}</>}
        {error && <p className="mt-2 font-semibold text-amber-900">{error}</p>}
      </div>
      <div className="mb-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Minimum magnitude<select value={threshold} onChange={event => setThreshold(Number(event.target.value))} className="mt-2 block w-full rounded-lg border border-slate-300 bg-white p-3"><option value={2.5}>M2.5+</option><option value={4.5}>M4.5+</option><option value={6}>M6.0+</option></select></label><label className="text-sm font-semibold">Filter location<input value={search} maxLength={100} onChange={event => setSearch(event.target.value)} placeholder="Country, region, or place" className="mt-2 block w-full rounded-lg border border-slate-300 p-3" /></label></div>
      {snapshot && <p className="mb-4 text-sm text-slate-600">Showing {Math.min(60, visible.length)} of {visible.length} matching records. Counts in one snapshot are not evidence of a long-term trend.</p>}
      <ul className="grid gap-4 md:grid-cols-2">{visible.slice(0, 60).map(item => <li key={item.id} className="rounded-xl border border-slate-200 p-5"><div className="mb-3 flex items-center justify-between gap-3"><strong className="text-2xl text-blue-900">M{item.magnitude.toFixed(1)}</strong><span className="text-xs text-slate-600">{item.review}</span></div><h3 className="text-lg font-bold">{item.place}</h3><p className="my-3 text-sm leading-relaxed text-slate-600">{date(item.time)}<br />Depth: {item.depth === null ? 'not reported' : item.depth.toFixed(1) + ' km'}</p><a href={item.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-800 underline underline-offset-4">Read the USGS event record</a></li>)}</ul>
      {snapshot && !visible.length && <p className="py-6 text-slate-600">No source records match these filters. This does not mean no earthquakes occurred.</p>}
      <p className="mt-6 text-sm"><a className="text-blue-800 underline" href={FEED_URL} target="_blank" rel="noopener noreferrer">Open the exact source feed</a> · <a className="text-blue-800 underline" href="https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php" target="_blank" rel="noopener noreferrer">USGS field definitions</a></p>
    </section>
    <section className="my-8 grid gap-5 md:grid-cols-3"><article className="rounded-xl bg-slate-100 p-5"><h2 className="font-bold">Observation</h2><p className="mt-2 text-sm leading-relaxed">The source reports an event, time, location, and magnitude. Values may change as the source reviews data.</p></article><article className="rounded-xl bg-slate-100 p-5"><h2 className="font-bold">Interpretation</h2><p className="mt-2 text-sm leading-relaxed">Religious or personal interpretations are separate claims. This dashboard does not label an event as a fulfilled prophecy.</p></article><article className="rounded-xl bg-slate-100 p-5"><h2 className="font-bold">Practical context</h2><p className="mt-2 text-sm leading-relaxed">For local warnings and protective action, consult your local emergency authority. Monitoring matches recorded observations after an event; it does not predict or provide emergency warnings.</p></article></section>
    <ResearchWorkspace />
    <footer className="border-t border-slate-200 pt-6 text-sm leading-relaxed text-slate-600">Public observations load from USGS. Optional accounts store private monitoring and research records. AI interpretation is clearly labeled and available only when the server provider is configured. No future earthquake time, place or magnitude is predicted. <a className="font-semibold text-blue-800 underline" href="https://bobsome1.com">Project information at Bobsome1</a>.</footer>
  </main>;
}
