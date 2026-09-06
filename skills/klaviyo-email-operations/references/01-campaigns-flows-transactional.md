# Campaigns vs. Flows vs. Transactional

Klaviyo email sends fall into three operational categories. Choosing the right one determines how the message is triggered, what consent it requires, and how its content is populated.

## Campaign

A campaign is a marketing message sent once (immediately or on a manual schedule) to a chosen list or segment. Campaigns require marketing consent from every recipient. Use campaigns for newsletters, promotions, and announcements.

## Flow

A flow is an automated, trigger-based sequence. Flows are driven by events or list/segment membership, and each message renders from the triggering event and the profile.

Events that can trigger a flow include:

- Started Checkout
- Placed Order
- Viewed Product
- Subscribed to List
- Added to a Segment

Flow-driven email content can be enriched before it renders by placing a **webhook action** or a **custom action** earlier in the flow (see `03-flow-webhook-actions.md` and `04-flow-custom-actions.md`). Custom-action outputs are exposed to downstream email templates as Django variables using `{{outputs.<action_name>.<output_name>}}`.

Note: for event-based flows you cannot pass information about subsequent actions taken by the customer. For example, a flow triggered by a Viewed Product event that then sends an email cannot use a webhook to pass data about the sent email.

## Transactional

A transactional email is an essential, non-marketing message tied to a specific interaction — for example an order confirmation, shipping update, password reset, invoice, or account notification. Transactional messages are triggered server-side by sending an event to Klaviyo's Create Event API and then designing a flow/template that listens for that metric.

Key properties of transactional sends:

- They are **not** gated by marketing consent, because they are essential service messages rather than marketing.
- They must remain genuinely transactional; do not include marketing content in a message you send as transactional.
- They are triggered in real time or in batches via the API, using a metric name to distinguish each transactional type.

See `02-transactional-email-templates.md` for the full set of Create Event payloads that back common transactional emails.
