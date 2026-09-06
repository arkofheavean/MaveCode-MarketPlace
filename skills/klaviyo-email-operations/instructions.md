# Klaviyo - Email Operations

Plans and builds Klaviyo email operations: the campaigns vs. flows vs. transactional distinction, API-based transactional email templates, flow-driven email content (webhooks and custom actions), email/SMS consent and compliance, deliverability and sender authentication, and email metrics/analytics.

## When To Use

Use this skill when a task involves operating Klaviyo email programs rather than writing template markup. It covers deciding between campaigns, flows, and transactional sends; triggering transactional emails through the server-side Create Event API (order confirmations, shipping updates, password resets, invoices, account and lead events); enriching or normalizing flow data before an email renders using webhook actions and Python/Node.js custom actions; collecting and managing email/SMS consent and suppressions to stay compliant; setting up deliverability prerequisites (dedicated sending domain, SPF/DKIM/DMARC, sender reputation); and reading email metrics such as opens and clicks by MIME type.

For template structure, Django variables, tags, conditionals, loops, filters, catalog lookups, and AMP markup authoring, use the companion **Klaviyo - Liquid Personalisations** skill.

## Trigger Phrases

- "Klaviyo transactional email"
- "Klaviyo campaign vs flow vs transactional"
- "trigger a transactional email via API"
- "order confirmation / shipping / password reset email in Klaviyo"
- "Klaviyo webhook action in a flow"
- "custom action to enrich flow data"
- "Klaviyo consent" / "subscribe profiles API" / "suppression"
- "SPF DKIM DMARC Klaviyo" / "dedicated sending domain"
- "AMP email metrics" / "opens and clicks by MIME type"

## Instructions

### Step 1 — Classify the send: campaign, flow, or transactional

Pick the right delivery mechanism before building anything:

- **Campaign** — a one-time or manually scheduled marketing message to a list or segment. Requires marketing consent.
- **Flow** — an automated, trigger-based sequence (e.g., Started Checkout, Placed Order, Viewed Product, Subscribed to List, Added to a Segment). Flow-driven emails render from the triggering event and profile data, and can be enriched by webhook or custom actions earlier in the flow.
- **Transactional** — an essential, non-marketing message tied to a specific interaction (order confirmation, shipping update, password reset, invoice, account notification). Transactional sends are triggered server-side via the Create Event API and are not gated by marketing consent, but they must remain genuinely transactional (no marketing content).

See `references/01-campaigns-flows-transactional.md`.

### Step 2 — Build transactional emails via the Create Event API

Trigger transactional messages by POSTing an event server-side, then design a flow/template that listens for that metric:

- POST to the server-side Create Event endpoint with `data.type = "event"` and `attributes.metric.data.attributes.name` naming the metric (e.g., `Created Account`, `Reset Password`, `Shipping Update`).
- Include the `profile` object, event `properties` (the dynamic values your template renders), `time`, and a `unique_id`.
- `unique_id` must be unique per event; duplicate `unique_id` values are skipped, which prevents double-sends on retries.
- Use the official SDKs (Python, Ruby, PHP, Node.js) or raw HTTP; sends can be real-time or batched.

Full payloads for Created Account, Updated Account, Reset Password, Created Invoice, Failed Payment, Shipping Update, Became Lead, and New Lead are in `references/02-transactional-email-templates.md`.

### Step 3 — Enrich flow-driven content with webhooks and custom actions

When an email needs data that isn't already on the event or profile, add an action earlier in the flow:

- **Webhook action** — POST-only, fires to an external HTTPS endpoint (valid URL, HTTPS, no self-signed SSL, no redirects). Supports headers, a JSON body, profile/event variables, and Django logic in the payload. Requires two-step authentication. See `references/03-flow-webhook-actions.md`.
- **Custom action** — runs Python or Node.js in the flow via a `handler(event, profile, context)` function, with a pre-installed `klaviyo` module (no API key needed). Configure up to 5 typed outputs with default values; reference them downstream in email templates as `{{outputs.<action_name>.<output_name>}}`. Gated feature. See `references/04-flow-custom-actions.md`.

### Step 4 — Handle consent and compliance

Marketing sends require proper consent; transactional sends still require lawful contact:

- Subscribe via the Subscribe Profiles endpoint (server-side) or Create Client Subscription (client-side), with or without a list. Consent status is `SUBSCRIBED`, `NEVER_SUBSCRIBED`, or `UNSUBSCRIBED`.
- Understand single vs. double opt-in behavior (list opt-in setting wins when a list is provided; otherwise the account default applies).
- Distinguish consent from suppression: suppress/unsuppress controls whether a profile receives email marketing regardless of consent (email identifier only).
- Only email profiles with express consent to protect deliverability; SMS consent must always be explicit.
- Every marketing email must include working `{% unsubscribe %}` and manage-preferences links (authored in the companion personalisation skill).

See `references/05-consent-and-compliance.md`.

### Step 5 — Set up deliverability and read metrics

- Authenticate a **dedicated sending domain** with **SPF, DKIM, and DMARC**; maintain a good sender reputation and low spam-complaint rate; a dedicated click-tracking domain needs SSL (shared tracking domains include SSL automatically).
- Emails are multi-MIME (plain text, HTML, and optionally AMP). Inbox providers choose which MIME type to display.
- Read email performance in Analytics > Metrics (Opened Email / Clicked Email); filter by MIME type (e.g., `Mimetype equals AMP`) to isolate AMP performance. The Clicked Email metric only tracks clicks through to your site, not in-email interactions.

See `references/06-deliverability-and-metrics.md`.

## Reference

| Topic | File |
| --- | --- |
| Campaigns vs. flows vs. transactional | `references/01-campaigns-flows-transactional.md` |
| Transactional email templates (API event payloads) | `references/02-transactional-email-templates.md` |
| Flow webhook actions | `references/03-flow-webhook-actions.md` |
| Flow custom actions (Python/Node.js) | `references/04-flow-custom-actions.md` |
| Consent and compliance | `references/05-consent-and-compliance.md` |
| Deliverability and metrics | `references/06-deliverability-and-metrics.md` |

## Rules

- Keep transactional messages genuinely transactional; do not add marketing content to API-triggered transactional sends.
- Always set a unique `unique_id` on transactional events so retries don't double-send.
- Never send marketing to profiles without express consent; treat implied consent cautiously and only where local law allows. SMS consent must always be explicit.
- Webhooks are POST-only and require two-step authentication; never use webhooks to subscribe profiles to lists.
- Do not fabricate API fields, metric names, endpoints, or limits — use only the values documented in the reference files.
- Custom-action outputs must be typed with a default value; downstream templates reference them as `{{outputs.<action_name>.<output_name>}}`.

## Bundled Reference

- `references/01-campaigns-flows-transactional.md` — When to use campaigns, flows, and transactional sends, and how transactional differs from marketing.
- `references/02-transactional-email-templates.md` — Full Create Event API payloads for the common transactional email triggers.
- `references/03-flow-webhook-actions.md` — Configuring and using webhook actions in flows.
- `references/04-flow-custom-actions.md` — Writing Python/Node.js custom actions and returning outputs to templates.
- `references/05-consent-and-compliance.md` — Subscribing, unsubscribing, suppressing, opt-in behavior, and consent rules.
- `references/06-deliverability-and-metrics.md` — Sender authentication prerequisites, MIME types, and email metrics.
