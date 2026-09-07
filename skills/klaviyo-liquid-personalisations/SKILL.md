---
name: klaviyo-liquid-personalisations
description: "Authors Klaviyo message-template personalization using the Django-based template language — template variables (recipient, account, event), template tags (unsubscribe, web view, manage preferences, dates), conditionals and loops, filters (lookup, default, floatformat), custom-coded HTML blocks, catalog lookup tags for dynamic product recommendations, and AMP markup with verbatim tags."
---

# Klaviyo - Liquid Personalisations

Authors Klaviyo message-template personalization using Klaviyo's Django-based template language: template variables, template tags, conditionals and loops, filters, custom-coded HTML product blocks, catalog lookup tags for dynamic product recommendations, and AMP markup.

> Naming note: This skill is named "Liquid Personalisations" for catalog consistency, but Klaviyo's template language is **Django-based** (not Liquid). All markup below uses Klaviyo's actual Django syntax as documented.

## When To Use

Use this skill when a task involves writing or editing the **content and markup** of a Klaviyo email/message template rather than operating email programs. It covers inserting personalization variables (recipient name, email, account/organization info, event data), adding required tags (unsubscribe, web view, manage preferences, date tags), building conditional and looped content, applying filters (`lookup`, `default`, `floatformat`, and other Django filters), custom-coding an HTML product block, using the catalog lookup tag to render dynamic product recommendations from a synced catalog, and authoring AMP markup with `verbatim` tags.

For deciding between campaigns/flows/transactional, triggering transactional sends via API, webhooks/custom actions, consent, and deliverability setup, use the companion **Klaviyo - Email Operations** skill.

## Trigger Phrases

- "Klaviyo personalization" / "merge tags" / "template variables"
- "Klaviyo Django template" / "Klaviyo Liquid"
- "unsubscribe / manage preferences / web view tag"
- "conditional content in Klaviyo email" / "if else in template"
- "loop over cart items in Klaviyo"
- "lookup filter" / "default value" / "floatformat"
- "custom coded product block" / "catalog lookup tag"
- "dynamic product recommendations in email"
- "AMP-Mustache warning" / "verbatim tag"

## Instructions

### Step 1 — Insert personalization variables

Use `{{ variable }}` syntax to personalize content. Django template variables cannot include spaces or special characters such as hyphens; underscores are allowed but must not start the variable name.

- **Recipient:** `{{ first_name }}`, `{{ last_name }}`, `{{ full_name }}`, `{{ email }}`.
- **Custom properties:** `{{ person|lookup:'Favorite Color' }}` — use the `person` variable with the `lookup` filter; pair with `default` for missing values.
- **Account/organization:** `{{ organization.name }}`, `{{ organization.full_address }}`.
- **Event (metric-triggered flows):** `{{ event|lookup:'total_price' }}`, `{{ event|lookup:'Items Purchased' }}`; API event properties are available via the `event` variable and `lookup` filter.

See `references/01-template-variables.md`.

### Step 2 — Add template tags

Insert links and dates with `{% tag %}` syntax:

- **Required unsubscribe:** `{% unsubscribe %}`, optional custom text `{% unsubscribe 'click here' %}`, or URL-only `{% unsubscribe_link %}`. Klaviyo requires an unsubscribe link on all campaigns.
- **Web view:** `{% web_view %}`, `{% web_view 'Open in your browser' %}`, `{% web_view_link %}`.
- **Manage preferences:** `{% manage_preferences %}`, `{% manage_preferences 'Click here' %}`, `{% manage_preferences_link %}`.
- **Date tags:** `{% current_day %}`, `{% current_weekday %}`, `{% current_month %}`, `{% current_month_name %}`, `{% current_year %}` (account timezone; English names only).

See `references/02-template-tags.md`.

### Step 3 — Build conditional and looped content

- **If-else:** `{% if person|lookup:'Interested in Dogs?' %} ... {% else %} ... {% endif %}` to show/hide content per recipient or event value.
- **For loops:** `{% for item in event.shopping_cart_items %} {{ item.name }} × {{ item.quantity }} {% endfor %}` to iterate list variables.
- **Filters:** `lookup` (properties on people/events), `default` (placeholder for missing values), `floatformat` (number formatting, e.g. `|floatformat:1`), plus most Django template filters. Separate variable and filter with a pipe `|`; filter arguments follow a colon `:` wrapped in single quotes.

See `references/03-conditionals-loops-filters.md`.

### Step 4 — Custom-code HTML blocks and dynamic product recommendations

- **Custom-coded product block:** Drag-and-drop product blocks do NOT support custom HTML. To custom-code a product block, build it manually using the **Source** option of a text block.
- **Catalog lookup tag:** Reference specific product info from a synced catalog by an item's unique ID (`$id`). Store recommended product IDs as a custom profile property (e.g., `["a123","b456","c789"]`), iterate the list, and perform a catalog lookup on each ID to render product details.
- **Product feeds:** Sync a custom catalog first; product feeds pull catalog data into flow/campaign emails via the drag-and-drop product block, with recommendation logic based on Viewed Product / Ordered Product / Added to Cart / Checkout Started metrics.
- **AMP markup:** AMP-Mustache curly braces conflict with Django variables — wrap AMP-Mustache sections in `{% verbatim %} ... {% end verbatim %}`. Use `data-amp-bind-property` instead of `amp-bind`.

See `references/04-custom-blocks-and-catalog.md`.

## Reference

| Topic | File |
| --- | --- |
| Template variables (recipient, account, event, custom properties) | `references/01-template-variables.md` |
| Template tags (unsubscribe, web view, manage preferences, dates) | `references/02-template-tags.md` |
| Conditionals, loops, and filters | `references/03-conditionals-loops-filters.md` |
| Custom-coded blocks, catalog lookup, product feeds, AMP | `references/04-custom-blocks-and-catalog.md` |

## Rules

- Klaviyo's template language is Django-based; do not invent Liquid-only syntax. Use only the tags, filters, and variables documented in the reference files.
- Variable names cannot contain spaces or hyphens; underscores are allowed but must not start the name.
- Always include a working `{% unsubscribe %}` link on campaigns.
- Use the `default` filter alongside `lookup` so missing custom properties render a placeholder instead of blank.
- Product blocks do not support custom HTML; custom-code via the Source option of a text block.
- Catalog lookups require a synced custom catalog and reference items by their unique `$id`.
- In AMP emails, wrap AMP-Mustache curly-brace syntax in `{% verbatim %} ... {% end verbatim %}` and use `data-amp-bind-property`.

## Bundled Reference

- `references/01-template-variables.md` — Recipient, account/organization, event, and custom-property variables with output examples.
- `references/02-template-tags.md` — Unsubscribe, web view, manage-preferences, and date tags (with URL-only variants).
- `references/03-conditionals-loops-filters.md` — If-else blocks, for loops, and the lookup/default/floatformat filters.
- `references/04-custom-blocks-and-catalog.md` — Custom-coded product blocks, product feeds, the catalog lookup tag, and AMP verbatim markup.
