# Flow Webhook Actions

Webhook actions let a flow POST data to an external endpoint — useful for enriching or normalizing data in an external system before a downstream email renders. This is a developer feature; Klaviyo Support cannot configure or troubleshoot webhooks because each use case is unique to the third-party system.

## Before you begin

Two-step authentication is **required** to use Klaviyo webhooks. You must be a Manager, Admin, or Owner to enable two-step authentication and to add or edit webhooks.

The first time you add a webhook within a flow without two-step authentication enabled, a modal reminds you to set it up. This is required for each individual user editing or adding webhook actions.

## How to configure a webhook

1. In the flow builder's left sidebar, drag the **Webhook** action into your flow.
2. Input the endpoint URL. The URL must:
   - Be a valid URL format
   - Start with HTTPS://
   - Not have a self-signed SSL certificate
   - Not redirect to another URL
3. Add any header(s) you want (e.g., for authentication) via **+ Add Headers** as key/value pairs. In Klaviyo, all webhook header information is partially hashed for security.
4. Under **Body**, input your payload as a JSON block. Only JSON formatting is supported for webhooks.
5. To add profile or event data, click either:
   - **View profile properties** (for list-, segment-, and date property-triggered flows), or
   - **View profile and event variables** (for metric- and price drop-triggered flows).

   This opens a preview panel where you can copy/paste variables into the payload.
6. Click **Save** to set the webhook live. Klaviyo reports whether setup succeeded and, if it fails, a description of the issue.

## Klaviyo webhook capabilities

### Type of requests

Webhooks can only perform **POST** requests; you cannot use them for DELETE, GET, or any other HTTP request. Do **not** use webhooks to subscribe profiles to new lists.

### Triggers

Webhooks are limited to events that can trigger a flow, including:

- Started Checkout
- Placed Order
- Viewed Product
- Subscribed to List
- Added to a Segment

Events that don't trigger a flow, such as Unsubscribed from List, cannot be used for webhooks.

### Properties and event variables

- For list- and segment-triggered flows, you can pass profile properties.
- For metric- or price drop-triggered flows, you can pass profile properties and dynamic event data associated with the triggering event (e.g., for a Placed Order event: the items, their price, the cart total, and the customer's name and address).
- For event-based flows, you cannot pass information about subsequent actions taken by the customer. For example, a flow triggered by a Viewed Product event that then sends an email cannot use a webhook to pass data about the sent email.

### Django logic

Similar to conditional logic for templates, you can add Django logic into the webhook payload, allowing addition, subtraction, and sending only certain pieces of a value. For example, in a loyalty program you can trigger a webhook so that whenever a customer makes a purchase, it adds the same number of points to their profile in your program.

Currently, coupon codes, web feeds, and product feeds are **not** supported in webhook payloads.

### Success responses and retries

Klaviyo considers 2xx responses a successfully sent POST request. Anything that is not a 2xx response is handled based on whether it is a retry-able error:

- **Retry-able** — Klaviyo automatically retries with an exponential backoff interval, then places the request into a failed queue in the Webhook Analytics page after multiple retries.
- **Not retry-able** — the request is sent to the Skipped queue.

### Originating flow information

HTTP requests from flow webhook actions include a request header `X-Klaviyo-Flow-ID`. Its value equals the ID of the flow containing the webhook action responsible for the request. To retrieve information about that flow programmatically, use the Get Flow API.
