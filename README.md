# ProphecyTracker AI — source observation prototype

The runnable product in this repository is now `frontend/`: a lightweight, static dashboard for timestamped USGS earthquake observations. It replaces the disconnected “custom brand color” placeholder with an actual source-backed workflow. It does not issue prophecies, predict a timeline, verify a religious interpretation, take payments, operate a betting market, or send alerts.

## What works

- Direct, unauthenticated reads of the official USGS M2.5+ past-day GeoJSON feed.
- Source-generated timestamps, explicit stale/clock warnings, magnitude/location filtering, review status, depth, and official event links.
- Ten-second fetch deadline, bounded two-MiB source response, strict normalization and official-host link validation.
- Honest failure and empty-filter states; previously loaded observations retain their source timestamp when a refresh fails.
- Static output for inexpensive hosting; no application server, database, API key, customer account, or billing setup is required for this dashboard.

USGS feed documentation: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php

A snapshot count is not a trend study. Source measurements can change. The source's `reviewed` status is attributed to USGS, not a claim that this app has independently verified the event. Religious or personal interpretations remain separate from the observed record. Local emergency authorities remain the appropriate source for local protective action.

## Reproduce and validate

Use Node 22 or later:

```bash
cd frontend
npm ci
npm run typecheck
npm run lint
npm test
npm audit
npm run build
node scripts/check-export.mjs
python -m http.server 8080 --directory out
```

Open `http://localhost:8080`. Only `frontend/out/` is a deployment artifact. Do not upload the repository root, reports, logs, keys, source credentials, or historical backend files into a web document root.

The Vercel configuration uses repository-root settings to install/build `frontend` and publish `frontend/out`. It does not deploy the old `dist/index.js` health scaffold or refer to unconfigured OpenAI/database secrets. If an existing Vercel project instead selects `frontend` as its Root Directory, use its equivalent build command `npm run build` and output `out`; do not combine the two layouts.

For cPanel, upload only the generated static output into a dedicated document root. A `.htaccess` file disables directory listings and adds basic response headers when Apache allows them. For a subdirectory deployment, set `NEXT_PUBLIC_BASE_PATH` to that exact path before building, for example `/prophecy`; asset paths are compiled into the build. Public project information points to https://bobsome1.com.

## Recovered source versus historical material

The large root-level React fragments and earlier “complete” reports are historical material, not the current routed application. Their claimed chat, markets, social publication, Web3, prophecy matching, and admin capabilities are not validated product features. The root TypeScript Express entry is a legacy health scaffold, not the observation dashboard. The separate legacy `server.js` and shell scripts are not the supported dashboard startup path.

## Credential incident

PR1 removed a public legacy operator key from `admin_access_info.txt` and added a private-configuration guard. Deleting the file does not revoke the key or erase old Git history. Any original backend that accepted that key must replace or disable it. The only related recovered caller is an unused `AdminRoute.tsx` posting to relative `/api/admin/verify`; neither available server implements the endpoint and no verified active administrator hostname is present. The key was not used and its value is intentionally omitted from reports. No public history rewrite or guessed account access was attempted.

## Validation recorded 2026-11-23

- Clean frontend dependency installation, TypeScript, ESLint, eight feed validation tests, and static production export passed.
- Next.js was patched to 15.5.29. The inherited PostCSS package is constrained to the patched direct version via the `$postcss` override. Dependency updates removed the recovered critical/high findings; the complete frontend npm audit returned zero reported vulnerabilities.
- A real request to the official source returned HTTP 200 with browser CORS enabled and 39 records at the time of validation. This is source reachability evidence, not a guarantee of future source availability.
- Export validation checks dashboard content, local asset references, and exclusion of known private files. CI repeats the checks and publishes the static artifact.
- Local Chromium could not launch because this execution environment denies its required process socket. Visual, keyboard, and screen-reader acceptance on actual browsers remain unverified. No live hosting configuration or external social publication was changed by this source repair.
