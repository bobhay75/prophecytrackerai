# ProphecyTracker cPanel release

This package contains a real static USGS dashboard plus a PHP account, alert, analysis and PayPal service. It is intended for `https://bobsome1.com/prophecy/`. Keep the two package directories separate.

## Install the tested release

1. Back up the existing `/home/bobsome1/public_html/prophecy/` directory and any existing private account database before replacing code. Preserve all existing `data/`, `sessions/` and `config.local.php` files on upgrades. Never replace these with an empty package.
2. Confirm PHP **8.1 or newer**, `pdo_sqlite`, `curl`, `mbstring`, `openssl` and `session`. Use the same PHP version for the web application and cron. This backend does not require Node, a daemon, Firebase or a paid database.
3. Upload the **contents** of `public/` into `/home/bobsome1/public_html/prophecy/`. Only the single API entrypoint is public PHP. Do not upload the archive itself, private source, config, database, tests, repository or logs into `public_html`.
4. Upload the **contents** of `private/` into `/home/bobsome1/prophecy-private/`, outside `public_html`. Set that directory to `0700` and its files to `0600`. The runtime creates `data/` and `sessions/` privately. When the Apache document root is `/home/bobsome1/public_html`, this private location is found automatically. Otherwise configure the server-only environment variable `PROPHECY_PRIVATE_DIR=/home/bobsome1/prophecy-private` and verify the directory is outside every served document root.
5. Copy `config.example.php` to `config.local.php` **inside the private directory**. Confirm the origin `https://bobsome1.com` and base path `/prophecy`. Keep `development` unset/false in production. The public API refuses HTTP, foreign Origin/Host values and forged forwarded-scheme headers. If TLS is terminated upstream of Apache, configure verified native TLS at the actual trusted ingress before installation; do not weaken this check based on client-supplied headers.
6. Run the server's PHP executable against the private console:

   ```bash
   php /home/bobsome1/prophecy-private/console.php check
   php /home/bobsome1/prophecy-private/console.php poll
   ```

   `check` validates local storage/runtime capability. It does not establish provider or payment success. `poll` retrieves the real USGS feed and evaluates saved rules. No outgoing email, SMS or push service is configured by this command.

7. Add this cPanel cron entry using the verified absolute PHP executable path:

   ```text
   */5 * * * * /path/to/verified/php /home/bobsome1/prophecy-private/console.php poll >> /home/bobsome1/prophecy-private/poll.log 2>&1
   ```

   Use private log rotation. The UI reports the last successful background poll; lack of a recent poll remains visible. An open signed-in tab also evaluates once a minute. Closed-tab monitoring needs this cron. Browser notifications require a user click and an open page. This release does not claim background push, earthquake prediction or emergency-warning delivery.

8. Verify the live page and `/prophecy/api/index.php?action=health`, then exercise an owner-controlled account: signup and recovery-code storage, logout/login, saved rule, source evaluation, report export, password change/revocation, and account export/deletion. Verify `Secure; HttpOnly; SameSite=Lax` on the production session cookie and `no-store` on private responses. Check `/prophecy/` on Android and iPhone. Test a valid source failure and verify it does not create alerts or manufacture a successful analysis.

## Optional AI activation

Set `ai_enabled=true`, the server's own `openai_api_key`, and an available `openai_model` supporting Chat Completions structured outputs in the private configuration. Alternatively supply the key/model using `PROPHECY_OPENAI_API_KEY` and `PROPHECY_OPENAI_MODEL` server environment variables. Choose an owner-approved provider budget before activation. The default site-wide cap is 50 request attempts per UTC day; free accounts allow three and active Research Pass accounts 25, subject to the global cap. Failed attempts count toward the cap. Calls use `store:false`, bounded responses, fixed HTTPS destinations, no redirects and no environment proxy.

AI receives only the selected public USGS observations and the user's explicitly chosen location filter, never account credentials, payment records or private notebook data. It returns labeled interpretation and conditional scenarios with validated source IDs. The deterministic scenario remains available without any AI provider. Counts under half/equal/double the observed rate are sensitivity calculations, not validated forecasts, probabilities, predictions or religious claims. Verify one real configured-provider response before describing AI as active.

## PayPal activation and actual fulfillment

Accounts, three saved rules and source scenarios work free. A **one-time 30-day Research Pass** supports 20 saved rules and the higher AI attempt allowance when AI is configured. It has no automatic renewal. After expiry, only the three newest enabled rules are evaluated; other rules remain saved. A pass does not promise AI availability or warning delivery.

Set the exact positive `pass_price_usd`, merchant ID, client ID and client secret privately. Keep `paypal_mode='sandbox'` until real PayPal sandbox buyer/seller tests pass. Enable `paypal_enabled` only when configuration is complete. Empty credentials or price keep checkout unavailable; there is no fake success or PayPal.me substitute. Credentials never reach the browser.

The server fixes amount, currency, merchant, product and account binding. It verifies the order and current capture through PayPal before granting access. Returning from PayPal is not payment proof. “Check payment” only reads status; “Complete approved purchase” explicitly captures the displayed approved order. Existing pending orders are reused. Interrupted successful captures can be recovered without another charge. Repeated confirmation does not extend the pass. Current captures are rechecked at least daily before paid capability continues; refunded/reversed/partially refunded captures lose paid access. If PayPal cannot reverify, the three free rules remain available. This version has no webhook or background refund dashboard; use PayPal as the authoritative transaction record.

Before live configuration, verify sandbox approval, cancellation, capture, retry/reload recovery, incorrect-account denial, exact merchant/amount/currency, refund revocation and expired-order closure. Sandbox passes are labeled and do not become live passes when mode changes. Never change merchant or environment with unresolved orders. Live-money tests require explicit transaction authorization; the source tests never charge a real account. Payment support stays at [bobsome1.com](https://bobsome1.com).

## Privacy, backups and rollback

Account recovery uses a one-time random code shown at registration and each recovery. Only its hash is stored. There is no email reset and no assumed access to the owner's mailbox. Username/password/recovery attempt limits are stored privately. Password changes and recovery revoke earlier sessions. Sessions expire after 30 minutes idle or 12 hours total.

Rules, alert history, reports and payment identifiers are held in a private SQLite database. Alerts expire after 30 days; reports expire after 90 days and the latest 50 remain per account. The API shows the latest 100 alerts. Account deletion removes research records and detaches retained payment rows; it does not undo payments or request refunds. Back up the entire private directory securely. SQLite uses WAL: use SQLite's backup operation or stop writers and copy the database with its WAL state; do not copy only the `.sqlite` file during writes.

For a code rollback, restore the previous public and private **code** versions together while preserving database, local config and session directories. This first schema only adds its own tables; do not drop tables or delete private data as part of rollback. A rollback cannot reverse a PayPal payment. If checkout is uncertain, disable new checkout, retain the original merchant configuration and reconcile existing orders.

## Reproduce

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

For a non-default PHP executable set `PROPHECY_PHP` to its absolute path for the Python/browser tests. `manifest.json` records source revision and hashes of every packaged file. A package with `dirty_source=true` is a working verification artifact; the release uploaded for deployment must be rebuilt from the committed and pushed source.
