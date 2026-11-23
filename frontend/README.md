# ProphecyTracker source observation dashboard

This is the supported frontend described in the repository-root README. Install with `npm ci`; validate with `npm run typecheck`, `npm run lint`, `npm test`, and `npm audit`; build with `npm run build`.

The build writes static `out/` files. Serve those files with a static server (`python -m http.server 8080 --directory out`) or upload only `out/` to the configured document root. The old `next start` command is not a static-export server; use `npm run dev` during development.

Optional `NEXT_PUBLIC_BASE_PATH=/prophecy` produces asset paths for that exact subdirectory. Leave it empty for a dedicated domain/document root. It contains no secret.

Eight feed regression tests verify normalization, malformed data handling, official-source links, duplicate rejection, review labels, sorting, and stale-clock reporting. The UI fetches public USGS data in the browser without an application backend. No account, payment, posting, or AI generation endpoint exists in this frontend.
