'use client';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { api, ApiError } from '../lib/account-api';

type User = { id: number; username: string; auth_version: number };
type Pass = { active: boolean; expires_at: number | null; mode: string | null; verification_pending?: boolean };
type Capabilities = { registration_open: boolean; ai_available: boolean; checkout_available: boolean; checkout_mode: string; pass_price_usd: string | null; free_rules: number; pass_rules: number; last_background_poll: number | null };
type Session = { user: User | null; csrf: string; capabilities: Capabilities; pass: Pass | null };
type Rule = { id: string; label: string; minimum: number; location: string; enabled: number; created_at: number };
type Alert = { id: number; label: string; created_at: number; read_at: number | null; event: { id: string; magnitude: number; place: string; time: number; url: string; review: string } };
type Brief = { summary: string; source_ids: string[]; conditional_scenarios: { condition: string; interpretation: string; uncertainty: string; source_ids: string[] }[]; questions_to_check: string[] };
type Report = { kind: string; generated_at: string; source_generated: number; minimum: number; location: string; observed_count: number; last_day_count: number; previous_six_days_count: number; daily_average: number; illustrative_next_24h: { half_rate: number; same_rate: number; double_rate: number }; limitations: string[]; sources: { id: string; url: string; label: string }[]; events: { id: string; url: string; place: string; magnitude: number }[]; ai: { label: string; model: string; generated_at: string; content: Brief } | null };
type SavedReport = { id: string; report: Report; created_at?: number };
type Order = { order_id: string | null; amount: string; mode: string; status: string; approval_url: string | null; created_at: number; expires_at: number | null };
type AccountExport = { alerts: Alert[]; through: number; next_cursor: number | null; [key: string]: unknown };
const button = 'rounded-lg bg-blue-800 px-4 py-3 font-semibold text-white disabled:cursor-wait disabled:opacity-50';
const secondary = 'rounded-lg border border-slate-400 bg-white px-4 py-3 font-semibold text-slate-900 disabled:opacity-50';
const field = 'mt-2 block w-full rounded-lg border border-slate-400 bg-white p-3 text-slate-900';
const panel = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7';
const stamp = (seconds: number) => new Date(seconds * 1000).toLocaleString();
function download(name: string, content: unknown) {
  const url = URL.createObjectURL(new Blob([typeof content === 'string' ? content : JSON.stringify(content, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ResearchWorkspace() {
  const [session, setSession] = useState<Session | null>(null), [backendError, setBackendError] = useState(''), [ready, setReady] = useState(false);
  const [message, setMessage] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recover'>('login'), [recovery, setRecovery] = useState('');
  const [rules, setRules] = useState<Rule[]>([]), [alerts, setAlerts] = useState<Alert[]>([]), [reports, setReports] = useState<SavedReport[]>([]), [orders, setOrders] = useState<Order[]>([]);
  const [ruleId, setRuleId] = useState(''), [label, setLabel] = useState(''), [minimum, setMinimum] = useState(4.5), [location, setLocation] = useState('');
  const [selected, setSelected] = useState<SavedReport | null>(null), [returnOrder, setReturnOrder] = useState('');
  const csrf = useRef(''), previousAlert = useRef<number | null>(null), notifications = useRef(false);
  const accountIdentity = useRef<string | null>(null), accountGeneration = useRef(0), sessionRequest = useRef(0);
  const userId = session?.user ? `${session.user.id}:${session.user.auth_version}` : null;
  const clearPrivateState = useCallback(() => {
    accountGeneration.current++; accountIdentity.current = null; notifications.current = false; previousAlert.current = null;
    setRules([]); setAlerts([]); setReports([]); setOrders([]); setSelected(null); setRecovery(''); setAuthMode('login');
    setRuleId(''); setLabel(''); setMinimum(4.5); setLocation('');
  }, []);
  const refreshSession = useCallback(async () => {
    const request = ++sessionRequest.current, generation = accountGeneration.current;
    const next = await api<Session>('session');
    if (request !== sessionRequest.current || generation !== accountGeneration.current) return next;
    const identity = next.user ? `${next.user.id}:${next.user.auth_version}` : null;
    if (identity !== accountIdentity.current) { clearPrivateState(); accountIdentity.current = identity; }
    csrf.current = next.csrf; setSession(next); setBackendError(''); return next;
  }, [clearPrivateState]);
  const refreshWorkspace = useCallback(async () => {
    const generation = accountGeneration.current, identity = accountIdentity.current;
    if (!identity) return;
    const results = await Promise.all([api<{ rules: Rule[] }>('rules'), api<{ alerts: Alert[] }>('alerts'), api<{ reports: SavedReport[] }>('reports'), api<{ orders: Order[] }>('orders')]);
    if (generation !== accountGeneration.current || identity !== accountIdentity.current) return;
    setRules(results[0].rules); setAlerts(results[1].alerts); setReports(results[2].reports); setOrders(results[3].orders);
    if (previousAlert.current !== null && notifications.current && 'Notification' in window && Notification.permission === 'granted') {
      for (const item of results[1].alerts.filter(a => a.id > previousAlert.current!).slice(0, 3)) new Notification(`Observation matched: ${item.label}`, { body: `M${item.event.magnitude.toFixed(1)} · ${item.event.place}`, tag: `prophecy-${item.id}` });
    }
    previousAlert.current = Math.max(0, ...results[1].alerts.map(a => a.id));
  }, []);
  useEffect(() => {
    let mounted = true;
    void refreshSession().catch(e => { if (mounted) setBackendError(e.message); }).finally(() => { if (mounted) setReady(true); });
    const query = new URLSearchParams(window.location.search);
    if (query.has('paypal_return')) { setReturnOrder(query.get('token') || ''); setMessage('PayPal returned you to the app. Check the order, then complete the approved purchase if it has not been captured. A return URL alone is not proof of payment.'); }
    if (query.has('paypal_cancel')) setMessage('PayPal approval was cancelled. No capture was requested by this page. Check an existing order if you are uncertain about its payment status.');
    if (query.has('paypal_return') || query.has('paypal_cancel')) window.history.replaceState({}, '', window.location.pathname + '#research-workspace');
    return () => { mounted = false; };
  }, [refreshSession]);
  useEffect(() => {
    if (!userId) { setRules([]); setAlerts([]); setReports([]); setOrders([]); setSelected(null); previousAlert.current = null; return; }
    let alive = true, polling = false;
    const tick = async (evaluate: boolean) => {
      if (polling || !alive) return; polling = true;
      try { if (evaluate) await api('evaluate', {}, csrf.current); if (alive) await refreshWorkspace(); }
      catch (e) { if (alive) setError(e instanceof Error ? e.message : 'Monitoring refresh failed.'); }
      finally { polling = false; }
    };
    void tick(false); const timer = setInterval(() => { if (!document.hidden) void tick(true); }, 60000);
    return () => { alive = false; clearInterval(timer); };
  }, [userId, refreshWorkspace]);
  async function act(operation: () => Promise<void>) {
    setBusy(true); setError(''); setMessage('');
    try { await operation(); }
    catch (e) { setError(e instanceof Error ? e.message : 'The request failed.'); if (e instanceof ApiError && (e.code === 'csrf' || e.status === 401)) await refreshSession().catch(() => undefined); }
    finally { setBusy(false); }
  }
  function authSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = Object.fromEntries(new FormData(form));
    void act(async () => {
      const result = await api<{ recovery_code?: string; csrf: string }>(authMode, data, csrf.current);
      csrf.current = result.csrf; await refreshSession(); setRecovery(result.recovery_code || ''); form.reset();
      setMessage(authMode === 'recover' ? 'Password changed. Earlier sessions and the old recovery code are revoked.' : 'Your private workspace is ready.');
    });
  }
  function saveRule(event: FormEvent) {
    event.preventDefault(); void act(async () => {
      await api('save-rule', { id: ruleId, label, minimum, location, enabled: true }, csrf.current); await refreshWorkspace(); setRuleId(''); setLabel(''); setLocation('');
      setMessage('Monitoring rule saved. It matches observations occurring from this point forward.');
    });
  }
  async function payment(orderId: string, capture: boolean) {
    const result = await api<{ confirmed: boolean; provider_status?: string; closed?: boolean }>(capture ? 'capture-order' : 'reconcile-order', { order_id: orderId }, csrf.current);
    const fresh = await refreshSession(); await refreshWorkspace(); setReturnOrder('');
    setMessage(result.confirmed ? fresh.pass?.active ? 'PayPal verified the payment. Your Research Pass is active.' : 'PayPal confirmed this existing payment, but it does not currently provide an active Research Pass. Checking an expired purchase does not renew or charge it.' : result.closed ? 'PayPal did not report a completed payment, and this order is closed. You can start a new checkout.' : `PayPal status: ${result.provider_status}. Checking status did not capture or charge the order.`);
  }
  async function exportAccount() {
    const first = (await api<{ export: AccountExport }>('export')).export;
    let next = first.next_cursor;
    while (next !== null) {
      const page = (await api<{ export: AccountExport }>('export', undefined, undefined, { after: String(next), through: String(first.through) })).export;
      first.alerts.push(...page.alerts);
      if (page.next_cursor !== null && page.next_cursor <= next) throw new Error('The export could not advance safely. Try again.');
      next = page.next_cursor;
    }
    const content: Record<string, unknown> = { ...first }; delete content.next_cursor; delete content.through;
    download('prophecy-account-export.json', content); setMessage('Your private account export is ready. Store it privately.');
  }
  const cap = session?.capabilities, pass = session?.pass;
  return <section id="research-workspace" aria-labelledby="workspace-heading" className="my-10 space-y-6 scroll-mt-4">
    <div><p className="text-sm font-bold uppercase tracking-widest text-blue-800">Your research workspace</p><h2 id="workspace-heading" className="mt-2 text-3xl font-black">Follow the record. Keep your own watch.</h2><p className="mt-3 max-w-3xl leading-relaxed text-slate-700">Save monitoring rules, review matched observations, compare conditional scenarios, and keep a private research history. Alerts follow recorded earthquakes; they are not early warnings.</p></div>
    {!ready && <p role="status">Connecting to the private workspace…</p>}
    {backendError && <div role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950"><strong>Workspace connection unavailable.</strong><p className="mt-2">{backendError}</p><button className={`${secondary} mt-3`} onClick={() => void act(async () => { await refreshSession(); })} disabled={busy}>Retry connection</button></div>}
    <div aria-live="polite" aria-atomic="true">{message && <p className="rounded-xl border border-green-300 bg-green-50 p-4 text-green-950">{message}</p>}</div>
    {error && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-950">{error}</p>}
    {session && !session.user && <div className={panel}>
      <div className="mb-5 flex flex-wrap gap-3"><button className={authMode === 'login' ? button : secondary} onClick={() => setAuthMode('login')}>Sign in</button>{cap?.registration_open && <button className={authMode === 'register' ? button : secondary} onClick={() => setAuthMode('register')}>Create free account</button>}<button className={authMode === 'recover' ? button : secondary} onClick={() => setAuthMode('recover')}>Recover account</button></div>
      <h3 className="text-xl font-bold">{authMode === 'register' ? 'Create your private account' : authMode === 'recover' ? 'Use your saved recovery code' : 'Welcome back'}</h3>
      <form onSubmit={authSubmit} className="mt-5 max-w-lg space-y-4">
        <label className="block font-semibold">Username<input name="username" required minLength={3} maxLength={32} pattern="[A-Za-z0-9][A-Za-z0-9._\-]{2,31}" autoComplete="username" autoCapitalize="none" className={field} /></label>
        {authMode === 'recover' && <label className="block font-semibold">Recovery code<input name="recovery_code" required pattern="[a-f0-9]{48}" maxLength={48} autoComplete="off" className={field} /></label>}
        <label className="block font-semibold">{authMode === 'recover' ? 'New password' : 'Password'}<input name="password" type="password" required minLength={authMode === 'login' ? 1 : 12} maxLength={72} autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} className={field} /></label>
        {authMode !== 'login' && <p className="text-sm text-slate-700">Use a unique passphrase of at least 12 characters. Save the recovery code shown after setup: there is no email reset, and lost credentials cannot be recovered without it.</p>}
        <button disabled={busy} className={button}>{busy ? 'Working…' : authMode === 'register' ? 'Create account' : authMode === 'recover' ? 'Reset password securely' : 'Sign in securely'}</button>
      </form>
      <p className="mt-5 text-sm text-slate-700">Free accounts include three saved monitoring rules and private scenario reports. No payment details or email address are required.</p>
    </div>}
    {session?.user && <>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-900 p-5 text-white"><div><strong>Signed in as {session.user.username}</strong><p className="mt-1 text-sm">{pass?.active ? `${pass.mode === 'sandbox' ? 'Sandbox test ' : ''}Research Pass · ends ${stamp(pass.expires_at!)}` : 'Free account · three saved rules'}</p></div><button className={secondary} disabled={busy} onClick={() => void act(async () => { clearPrivateState(); setSession(previous => previous ? { ...previous, user: null, pass: null } : null); await api('logout', {}, csrf.current); await refreshSession(); setMessage('Signed out. Your private records remain on the server.'); })}>Sign out</button></div>
      {recovery && <div role="status" className="rounded-xl border-2 border-amber-400 bg-amber-50 p-5 text-amber-950"><h3 className="text-lg font-bold">Save this recovery code now</h3><p className="mt-2">This code can reset your password. It is shown once. Keep it privately, away from your password.</p><code className="my-4 block break-all rounded-lg bg-white p-4 text-sm">{recovery}</code><div className="flex flex-wrap gap-3"><button className={secondary} onClick={() => download('prophecy-recovery.json', { username: session.user!.username, recovery_code: recovery })}>Download recovery code</button><button className={button} onClick={() => setRecovery('')}>I saved it privately</button></div></div>}
      <nav aria-label="Research workspace" className="flex flex-wrap gap-5 font-semibold text-blue-800 underline underline-offset-4"><a href="#monitoring-rules">Monitoring rules</a><a href="#observation-alerts">Alert inbox</a><a href="#source-analysis">Analysis</a><a href="#research-pass">Research Pass</a><a href="#account-settings">Account</a></nav>
      <div id="monitoring-rules" className={panel}><h3 className="text-2xl font-bold">Monitoring rules</h3><p className="mt-2 text-sm leading-relaxed text-slate-700">Match new USGS M2.5+ observations by magnitude and an optional phrase in the reported location. After a pass expires, the three newest enabled rules continue monitoring; older rules remain saved.</p>
        <form onSubmit={saveRule} className="my-6 grid gap-4 sm:grid-cols-2"><label className="font-semibold">Rule name<input value={label} onChange={e => setLabel(e.target.value)} required maxLength={80} placeholder="My regional watch" className={field} /></label><label className="font-semibold">Minimum magnitude<input type="number" min={2.5} max={9.9} step={0.1} required value={minimum} onChange={e => setMinimum(Number(e.target.value))} className={field} /></label><label className="font-semibold sm:col-span-2">Location phrase (optional)<input value={location} onChange={e => setLocation(e.target.value)} maxLength={100} placeholder="For example: Missouri — leave blank for worldwide" className={field} /></label><div className="flex flex-wrap gap-3 sm:col-span-2"><button className={button} disabled={busy}>{ruleId ? 'Update monitoring rule' : 'Save monitoring rule'}</button>{ruleId && <button className={secondary} type="button" onClick={() => { setRuleId(''); setLabel(''); setLocation(''); }}>Cancel editing</button>}</div></form>
        <ul className="space-y-3">{rules.map(rule => <li key={rule.id} className="rounded-xl border border-slate-300 p-4"><h4 className="font-bold">{rule.label} <span className="font-normal">· {rule.enabled ? 'Enabled' : 'Paused'}</span></h4><p className="my-2 text-sm">M{Number(rule.minimum).toFixed(1)}+ · {rule.location || 'Worldwide'}</p><div className="flex flex-wrap gap-3"><button className={secondary} disabled={busy} onClick={() => { setRuleId(rule.id); setLabel(rule.label); setMinimum(Number(rule.minimum)); setLocation(rule.location); }}>Edit {rule.label}</button><button className={secondary} disabled={busy} onClick={() => void act(async () => { await api('save-rule', { ...rule, enabled: !rule.enabled }, csrf.current); await refreshWorkspace(); })}>{rule.enabled ? 'Pause' : 'Resume'} {rule.label}</button><button className={secondary} disabled={busy} onClick={() => void act(async () => { await api('delete-rule', { id: rule.id }, csrf.current); await refreshWorkspace(); setMessage('Rule and its matched alerts deleted.'); })}>Delete {rule.label}</button></div></li>)}</ul>
        {!rules.length && <p className="text-slate-700">No saved rules yet. Add one to begin monitoring.</p>}
      </div>
      <div id="observation-alerts" className={panel}><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="text-2xl font-bold">Observation alert inbox</h3><p className="mt-2 text-sm text-slate-700">Matching observations are stored once per rule and event. Inbox history is retained for 30 days.</p></div><button className={button} disabled={busy} onClick={() => void act(async () => { const result = await api<{ new_alerts: number }>('evaluate', {}, csrf.current); await refreshWorkspace(); setMessage(`Checked a fresh USGS snapshot. ${result.new_alerts} new matched observation${result.new_alerts === 1 ? '' : 's'}.`); })}>Check observations now</button></div>
        <p className="my-4 rounded-lg bg-slate-100 p-4 text-sm leading-relaxed">This open tab checks once a minute. {cap?.last_background_poll ? `Last successful server background poll: ${stamp(cap.last_background_poll)}. A recent timestamp does not guarantee future polls.` : 'No successful server background poll has been recorded. Closed-tab monitoring requires the server cron job.'} Browser popups work only while this page is open; there is no background push or emergency-warning claim.</p>
        <button className={`${secondary} mb-5`} onClick={() => void act(async () => { if (!('Notification' in window)) throw new Error('This browser does not support notification popups. The inbox still works.'); const permission = await Notification.requestPermission(); notifications.current = permission === 'granted'; setMessage(permission === 'granted' ? 'New matched observations can show browser notifications while this page is open.' : 'Browser notifications were not enabled. Your inbox remains available.'); })}>Enable notifications for this open tab</button>
        <ul className="space-y-3">{alerts.map(alert => <li key={alert.id} className={`rounded-xl border p-4 ${alert.read_at ? 'border-slate-200' : 'border-blue-400 bg-blue-50'}`}><p className="text-sm font-semibold">{alert.label} · {alert.read_at ? 'Read' : 'Unread'}</p><h4 className="mt-1 font-bold">M{alert.event.magnitude.toFixed(1)} · {alert.event.place}</h4><p className="my-2 text-sm">Observed {new Date(alert.event.time).toLocaleString()} · {alert.event.review}</p><a href={alert.event.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-800 underline">Open USGS source</a>{!alert.read_at && <button className={`${secondary} ml-3`} disabled={busy} onClick={() => void act(async () => { await api('read-alert', { id: alert.id }, csrf.current); await refreshWorkspace(); })}>Mark as read</button>}</li>)}</ul>
        {!alerts.length && <p className="text-slate-700">No matching observations have been recorded since your rules started. This is not an assurance that no earthquakes occurred.</p>}
      </div>
      <div id="source-analysis" className={panel}><h3 className="text-2xl font-bold">Evidence and conditional scenarios</h3><p className="mt-3 leading-relaxed text-slate-700">Compare the latest seven days of USGS observations. A scenario shows what a stated assumption would imply. It cannot tell you the date, location or magnitude of a future earthquake.</p>
        <form className="my-5 grid gap-4 sm:grid-cols-2" onSubmit={event => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget)); const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null; void act(async () => { const result = await api<SavedReport>('analyze', { ...data, minimum: Number(data.minimum), mode: submitter?.value || 'scenario' }, csrf.current); setSelected(result); await refreshWorkspace(); setMessage('Source-backed report saved in your private research history.'); }); }}>
          <label className="font-semibold">Analysis minimum magnitude<input name="minimum" type="number" min={2.5} max={9.9} step={0.1} defaultValue={2.5} required className={field} /></label><label className="font-semibold">Analysis location phrase<input name="location" maxLength={100} placeholder="Optional reported place or region" className={field} /></label><div className="flex flex-wrap gap-3 sm:col-span-2"><button className={button} disabled={busy} name="mode" value="scenario">Build source scenario</button><button className={secondary} disabled={busy || !cap?.ai_available} name="mode" value="ai">Add AI evidence brief</button></div>
        </form><p className="text-sm leading-relaxed text-slate-700">{cap?.ai_available ? 'AI briefing sends only the selected public observations and your location filter to the configured provider. It is generated interpretation with source references, and can be wrong. Free accounts allow up to three AI request attempts per UTC day; a Research Pass allows up to 25, subject to the site-wide limit.' : 'AI briefing is not activated on this host. Source scenarios work without an AI subscription or API key.'}</p>
        {reports.length > 0 && <label className="mt-5 block font-semibold">Saved research reports<select className={field} value={selected?.id || ''} onChange={e => setSelected(reports.find(r => r.id === e.target.value) || null)}><option value="">Choose a saved report</option>{reports.map(r => <option key={r.id} value={r.id}>{r.report.generated_at} · M{r.report.minimum}+ · {r.report.location || 'Worldwide'}</option>)}</select></label>}
        {selected && <ReportView item={selected} />}
      </div>
      <div id="research-pass" className={panel}><h3 className="text-2xl font-bold">Research Pass</h3><p className="my-3 leading-relaxed text-slate-700">A one-time 30-day pass raises your saved-rule allowance from three to 20. It also raises the daily AI request cap when the provider is available. There is no automatic renewal. Free source observations and your account remain available after expiry.</p>
        {pass?.verification_pending && <p role="status" className="my-3 text-amber-950">Paid access is waiting for payment re-verification. Your three free monitoring rules remain available.</p>}
        {cap?.checkout_available ? <><p className="my-3 text-lg font-bold">{cap.checkout_mode === 'sandbox' ? 'Sandbox test checkout · ' : ''}${cap.pass_price_usd} USD · 30 days</p>{!pass?.active && <button className={button} disabled={busy} onClick={() => void act(async () => { const order = await api<{ approval_url: string }>('create-order', {}, csrf.current); window.location.assign(order.approval_url); })}>Continue to PayPal</button>}</> : <p className="rounded-lg bg-slate-100 p-4">Checkout is not activated on this host. No payment can be taken through this workspace yet.</p>}
        {returnOrder && !orders.some(o => o.order_id === returnOrder) && <p role="status" className="mt-4 text-sm">Sign in to the account that created the returned PayPal order to verify it. A returned token does not grant access.</p>}
        {orders.length > 0 && <div className="mt-6"><h4 className="font-bold">Purchase history and recovery</h4><p className="my-2 text-sm text-slate-700">“Check payment” reads PayPal’s current status without charging. “Complete approved purchase” requests capture of the displayed order after your PayPal approval.</p><ul className="space-y-3">{orders.map((o, i) => <li key={o.order_id || `creating-${i}`} className="rounded-lg border border-slate-300 p-4"><p className="font-semibold">${o.amount} USD · {o.mode} · {o.status}</p><p className="my-2 text-sm">Created {stamp(o.created_at)}</p><div className="flex flex-wrap gap-3">{o.approval_url && o.status === 'created' && cap?.checkout_available && <a className={secondary} href={o.approval_url}>Resume PayPal approval</a>}{o.order_id && <button className={secondary} disabled={busy} onClick={() => void act(() => payment(o.order_id!, false))}>Check payment</button>}{o.order_id && o.status === 'created' && cap?.checkout_available && !pass?.active && <button className={button} disabled={busy} onClick={() => void act(() => payment(o.order_id!, true))}>Complete approved ${o.amount} purchase</button>}</div></li>)}</ul></div>}
      </div>
      <details id="account-settings" className={panel}><summary className="cursor-pointer text-xl font-bold">Account, export and privacy</summary><p className="my-4 leading-relaxed text-slate-700">Your username, password hash, rules, matched observations and saved reports are held in private server storage. Recovery codes are stored as hashes. Payment identifiers and payment status are retained for support and reconciliation; card details remain with PayPal. Reports are retained for up to 90 days, with the latest 50 shown. Account deletion removes your research data and disconnects retained payment records.</p>
        <button className={secondary} disabled={busy} onClick={() => void act(exportAccount)}>Download my account data</button>
        <form className="my-6 max-w-lg space-y-4" onSubmit={e => { e.preventDefault(); const form = e.currentTarget; const data = Object.fromEntries(new FormData(form)); void act(async () => { const result = await api<{ csrf: string }>('change-password', data, csrf.current); csrf.current = result.csrf; await refreshSession(); form.reset(); setMessage('Password changed. Earlier sessions are revoked.'); }); }}><h4 className="font-bold">Change password</h4><label className="block font-semibold">Current password<input name="old_password" type="password" required autoComplete="current-password" className={field} /></label><label className="block font-semibold">New password<input name="password" type="password" required minLength={12} maxLength={72} autoComplete="new-password" className={field} /></label><button className={button} disabled={busy}>Change password</button></form>
        <form className="max-w-lg space-y-4 border-t border-slate-300 pt-6" onSubmit={e => { e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget)); void act(async () => { await api('delete-account', { password: data.password }, csrf.current); setRecovery(''); await refreshSession(); setMessage('Account and private research data deleted. Payment records retained for support no longer link to the account.'); }); }}><h4 className="font-bold">Delete account</h4><p className="text-sm">This permanently deletes saved rules, alerts and reports. Export your data first if you need it. It does not request a PayPal refund.</p><label className="block font-semibold">Password to confirm deletion<input name="password" type="password" required autoComplete="current-password" className={field} /></label><label className="flex items-start gap-3"><input type="checkbox" required className="mt-1 h-5 w-5" />I understand my account and research records will be permanently deleted.</label><button className="rounded-lg bg-red-800 px-4 py-3 font-semibold text-white disabled:opacity-50" disabled={busy}>Permanently delete my account</button></form>
      </details>
    </>}
  </section>;
}

function ReportView({ item }: { item: SavedReport }) {
  const r = item.report;
  const sources = new Map([...r.sources.map(s => [s.id, { url: s.url, label: s.label }] as const), ...r.events.map(e => [e.id, { url: e.url, label: `M${e.magnitude.toFixed(1)} · ${e.place}` }] as const)]);
  const refs = (ids: string[]) => <span className="mt-2 block text-sm">{ids.map(id => sources.has(id) && <a key={id} href={sources.get(id)!.url} target="_blank" rel="noopener noreferrer" className="mr-3 text-blue-800 underline">{id}</a>)}</span>;
  return <article className="mt-6 border-t border-slate-300 pt-6"><div className="flex flex-wrap items-center justify-between gap-4"><h4 className="text-xl font-bold">Your source scenario</h4><button className={secondary} onClick={() => download(`prophecy-report-${item.id}.json`, r)}>Download this report</button></div><p className="my-3 text-sm text-slate-700">Source generated {new Date(r.source_generated).toLocaleString()} · M{r.minimum}+ · {r.location || 'Worldwide'}</p><div className="grid gap-3 sm:grid-cols-3">{[['Seven-day observations', r.observed_count], ['Last 24 hours', r.last_day_count], ['Average per day', r.daily_average]].map(([name, count]) => <div key={name} className="rounded-lg bg-slate-100 p-4"><p className="text-sm">{name}</p><strong className="mt-2 block text-3xl">{count}</strong></div>)}</div><h5 className="mt-6 font-bold">If the observed rate changed</h5><p className="my-2 text-sm text-slate-700">Illustrative next-24-hour counts under three assumptions. These are not validated forecasts, event predictions or probabilities.</p><div className="overflow-x-auto"><table className="my-3 w-full text-left text-sm"><caption className="sr-only">Sensitivity of illustrative event counts to the assumed observation rate</caption><thead><tr><th className="border-b border-slate-300 p-3" scope="col">Assumption</th><th className="border-b border-slate-300 p-3" scope="col">Illustrative count</th></tr></thead><tbody>{[['Half the seven-day average', r.illustrative_next_24h.half_rate], ['Same seven-day average', r.illustrative_next_24h.same_rate], ['Double the seven-day average', r.illustrative_next_24h.double_rate]].map(([name, value]) => <tr key={name}><th scope="row" className="border-b border-slate-200 p-3 font-normal">{name}</th><td className="border-b border-slate-200 p-3">{value}</td></tr>)}</tbody></table></div><ul className="my-4 list-disc space-y-2 pl-5 text-sm text-slate-700">{r.limitations.map(text => <li key={text}>{text}</li>)}</ul><p>{r.sources.map(s => <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="mr-4 text-sm font-semibold text-blue-800 underline">{s.label}</a>)}</p>
    {r.ai && <section className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5"><h5 className="text-lg font-bold">{r.ai.label}</h5><p className="my-2 text-xs text-slate-700">{r.ai.model} · {r.ai.generated_at}</p><p className="leading-relaxed">{r.ai.content.summary}</p>{refs(r.ai.content.source_ids)}{r.ai.content.conditional_scenarios.map((scenario, i) => <div key={i} className="mt-5"><h6 className="font-bold">{scenario.condition}</h6><p className="mt-2">{scenario.interpretation}</p><p className="mt-2 text-sm"><strong>Uncertainty:</strong> {scenario.uncertainty}</p>{refs(scenario.source_ids)}</div>)}<h6 className="mt-5 font-bold">Questions to investigate</h6><ul className="mt-2 list-disc space-y-2 pl-5">{r.ai.content.questions_to_check.map(q => <li key={q}>{q}</li>)}</ul></section>}
  </article>;
}
