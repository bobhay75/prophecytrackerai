# ProphecyTracker AI — observation and research workspace

ProphecyTracker combines a public USGS earthquake dashboard with an optional self-hosted PHP workspace for accounts, observation alerts, evidence-based scenarios, AI interpretation and PayPal Research Pass checkout. Public project information is at [bobsome1.com](https://bobsome1.com).

## Implemented product

| Area | Working source behavior |
| --- | --- |
| Observations | Timestamped USGS M2.5+ feed, magnitude/place filters, review status, depth, official event links, bounded reads, stale data and failure states. |
| Accounts | Username/password registration, sign-in/out, one-time recovery codes, password changes and session revocation; HttpOnly/Secure/SameSite sessions, CSRF/Origin/Host checks and rate limits. No email address is required. |
| Alerts | Persistent editable/pauseable rules, source freshness checks, magnitude/location matching, one alert per rule/event, private read/unread inbox, five-minute server cron and one-minute foreground evaluation. Optional browser popups require an open page and user permission. |
| Research | Seven-day source counts, conditional half/equal/double-rate scenarios, explicit uncertainty, private saved reports and JSON export. This is sensitivity arithmetic, not a validated earthquake forecast. |
| Optional AI | Server-only provider key/model, structured interpretation tied to supplied source IDs, refusal/truncation/source checks, bounded transport, per-account and site-wide daily attempt caps. Missing configuration is displayed honestly. |
| PayPal | Server-fixed amount/merchant/currency/product/account, order and current-capture verification, owned order history, explicit capture, read-only reconciliation, interrupted-payment recovery, duplicate protection, expiry and refund re-verification. No Stripe or browser-side secret. |
| Data control | Private SQLite, account/research export, account deletion, bounded report history and timed alert/report cleanup. Paid transaction records are detached from deleted accounts and retained for reconciliation. |

A one-time **30-day Research Pass** raises saved rules from three to 20 and the AI request-attempt limit from three to 25 per UTC day when AI is configured, subject to a site-wide cap. It has no automatic renewal. The actual USD price and PayPal settings must be configured privately before checkout can be offered; no price, payment or active live merchant is invented by this repository.

## Runtime and release boundaries

- `frontend/` is a Next.js static export. Its public observation dashboard still works without the PHP service.
- `backend/public/index.php` is the single public API entrypoint. All implementation, configuration, database and session files belong outside the web document root.
- `backend/src/` requires PHP 8.1+, PDO SQLite, cURL and mbstring. It needs no Node server, Firebase, daemon or paid database on the host.
- The cPanel release targets `/prophecy/`. Build with `NEXT_PUBLIC_BASE_PATH=/prophecy`. The package separates `public/` and `private/`; do not upload the whole ZIP or repository into `public_html`.
- Existing Netlify and Vercel integrations publish only `frontend/out` at their root URLs. `netlify.toml` explicitly selects the current frontend instead of the historical root server. These static previews do not execute PHP; the workspace connection accurately remains unavailable there until a supported backend host is used.
- Native source tests use synthetic provider responses and isolated temporary accounts. They do not establish real PayPal sandbox/live behavior, configured AI output, production cookie/TLS behavior, a running cron or physical-device acceptance.
- A configuration/health response is not proof of a successful source, AI or payment request. The UI reports when the backend, AI or checkout is unavailable.

Full setup, verification, privacy, backup and rollback instructions: [docs/CPANEL-INSTALL.md](docs/CPANEL-INSTALL.md).

## Verify and package

```bash
cd frontend
npm ci
npm run typecheck
npm run lint
npm test
npm audit --audit-level=high
NEXT_PUBLIC_BASE_PATH=/prophecy npm run build
node scripts/check-export.mjs
npx playwright install --with-deps chromium webkit
npm run test:browser
cd ..
php backend/test/contracts.php
php backend/test/concurrency.php
python3 backend/test/test_http.py
python3 scripts/package-cpanel.py
```

Use `PROPHECY_PHP=/absolute/path/to/php` when Python/browser tests need a specific PHP executable. The GitHub workflow runs these native checks and complete desktop Chromium, Android Chromium and iPhone WebKit journeys with axe accessibility checks. It uploads the static dashboard, split cPanel release and browser evidence. Current commit workflow results are the release evidence; do not count an earlier successful run for newer code.

## What the product does not claim

USGS observations do not establish future earthquake dates, locations, magnitudes, religious fulfillment or an approaching deadline. [USGS explains earthquake prediction limits](https://www.usgs.gov/faqs/can-you-predict-earthquakes). Seven days is not a long-term trend baseline; earthquake clustering, incomplete coverage and revisions limit comparisons. Optional AI output is interpretation to review against the source. Local authorities remain the appropriate source for emergency protective action.

This release does not provide Web Push while the browser is closed, SMS/email alerts, a certified emergency-warning service, betting markets, prophecy authentication, background payment webhooks, or automatic subscription renewal. The current source implements explicit in-app monitoring and one-time paid access; other historical claims are not silently reintroduced.

## Historical material and credential incident

Large root-level React fragments and earlier “complete” reports are historical material, not the routed application. Their chat, markets, social publication, Web3, prophecy matching and administrator claims are not validated features. The old Express entry is a health scaffold and is not needed by this cPanel release.

PR1 removed a public legacy operator key from `admin_access_info.txt`. Removal does not revoke that key or erase Git history. Any original backend accepting it must replace or disable it. The only recovered caller is unused `AdminRoute.tsx`; no verified active administrator hostname or functioning endpoint was established. This key was not used, and its value is omitted from code, reports and release artifacts. The new account service has independent credentials and does not accept the legacy operator key.
