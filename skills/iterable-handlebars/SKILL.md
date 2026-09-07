---
name: iterable-handlebars
description: "Writes, explains, and debugs Handlebars personalization for Iterable email, SMS, and push templates — merge tags, helpers (text, math, date, looping, conditional, regex, encoding/hashing), built-in merge tags, and troubleshooting."
---

# Iterable - Handlebars

Writes, explains, and debugs Handlebars personalization for Iterable email, SMS, and push templates.

## When To Use

Use this skill when a task involves Iterable template personalization, dynamic content, or merge-tag debugging across email, SMS, push, in-app, web push, and embedded channels. It covers writing merge tags and helper expressions, choosing the right helper family, building conditional and looping logic, formatting strings/numbers/dates, encoding/hashing values, using Iterable's built-in merge tags, and troubleshooting templates that fail or render incorrectly.

## Trigger Phrases

- "Iterable Handlebars"
- "merge tag"
- "personalize Iterable template"
- "handlebars helper"
- "ifMatchesRegexStr"
- "dateFormat"
- "defaultIfEmpty"
- "Iterable dynamic content"

## Instructions

### Step 1 — Identify the data source and channel

Determine where the value comes from and where it will render:

- **Data source:** user profile, triggering event, Catalog, or data feed. If a field exists in both the user profile and the triggering event, Iterable uses the **event** value at send time. For data feeds, `{{}}` works only when the template's **Merge the data feed and user contexts** setting is enabled; otherwise use `[[]]`.
- **Channel:** email, SMS, WhatsApp, in-app, push, web push, or embedded. Some built-in merge tags and content types are channel-specific (for example, `{{sentAt}}` is email-only; images are not supported in SMS).

### Step 2 — Pick the right helper family

Map the task to a helper family, then consult the matching reference file:

- Text formatting/manipulation → `upper`, `lower`, `capitalize`, `capitalizeFirst`, `replace`, `substring`, `cut`, `abbreviate`, `slugify`, `#breaklines`, `length`.
- Numbers/math → `numberFormat`, `math`, comparison helpers (`eq`/`gt`/`gte`/`lt`/`lte`).
- Dates/time → `dateFormat`, `dateMath`, `now`, `timestamp`, `#ifGte`/`#ifGt`/`#ifLte`/`#ifLt`.
- Conditional logic → `#if`, `#and`, `#or`, `#not`, `#unless`, `#ifEq`, `#ifContainsStr`, `#ifModEq`, `defaultIfEmpty`.
- Looping over arrays/objects → `#each`, `size`, `#sortBy`, `#groupBy`, `join`, `@key`, `@index`, `@first`, `@last`.
- Pattern matching → `#ifMatchesRegexStr`.
- Encoding/hashing → `sha256`, `hmacSHA256`, `md5`, `#base64`, `toJson`, `toUrlEncodedJson`, `#urlEncode`, `hexEncode`.

### Step 3 — Guard empty/missing fields and validate quoting

- Wrap references that may be empty with `defaultIfEmpty` (or a `#if` fallback) to avoid blank output.
- **Critical gotcha:** if a merge tag using the `eq` or `#eq` helper references an empty or missing field, the template fails and the message is **not sent** to that user. Guard those references.
- When a Handlebars expression appears inside double-quoted HTML/JSON (`src="..."`, `href="..."`, `data-*="..."`, JSON values), use **single quotes** for string literals inside the expression.
- Preview with a real user profile and triggering event before sending.

## Reference

Core helpers at a glance:

| Helper | Purpose |
|---|---|
| `upper` | Convert a string to uppercase. |
| `lower` | Convert a string to lowercase. |
| `capitalize` | Capitalize the first letter of every word. |
| `capitalizeFirst` | Capitalize only the first letter of the string. |
| `defaultIfEmpty` | Return a fallback value when a field is empty or missing. |
| `dateFormat` | Format a date/time value into a chosen pattern or style. |
| `numberFormat` | Format a number as currency, percent, or with fixed decimals. |
| `eq` | Test whether two values are equal (fails on empty/missing fields). |
| `if` | Render content when a value is truthy (`#if`). |
| `each` | Iterate over an array or object (`#each`). |
| `ifContains` | Render content when an array contains a value (`#ifContains`). |
| `length` | Return the length of a string or the size of a collection. |
| `replace` | Replace occurrences of a substring within a string. |
| `substring` | Extract part of a string by index range. |
| `ifMatchesRegexStr` | Render content when a field matches a regex pattern (`#ifMatchesRegexStr`). |

## Rules

- `{{}}` references user/event data (and data-feed data when contexts are merged); `[[]]` references data-feed data when contexts are **not** merged.
- Don't name user or event fields with periods — Handlebars uses `.` for path expressions (`{{object.field}}`), so periods in field names cause errors.
- Inside double-quoted HTML or JSON, use single quotes (`''`) for string literals within the Handlebars expression; nested double quotes break the syntax.
- Helpers never mutate stored values — they only affect how content renders at send time.
- Referencing an empty or missing field with `eq`/`#eq` fails the whole send for that user; guard with `defaultIfEmpty` or `#if`.
- Use triple curly braces (`{{{field}}}`) for values that contain HTML you want rendered, and to avoid entity encoding (for example, apostrophes rendering as `&#x27;`).
- Wrap merge tags with tildes (`{{~tag~}}`) to trim whitespace in URLs, deep links, and code fragments.

## Bundled Reference

This skill bundles a complete, normalized Iterable Handlebars reference consolidated from the official Iterable support documentation (13 pages). Consult these files when you need exact helper properties, formats, examples, syntax tables, or family-level navigation. Every Properties/Format/Example triad and example result table from the source docs is preserved.

- `references/01-overview-and-syntax.md` — What Handlebars is in Iterable, basics (merge tags, blocks, standard vs block helpers), the full Handlebars syntax table, the quotes-inside-HTML/JSON rule, data sources, what you can personalize, and terms to know.
- `references/02-personalization-guide.md` — End-to-end personalization guide (referencing fields, spaces/periods, HTML fields, strings, numbers, lists, objects, dates, conditional/boolean logic, snippets, whitespace, JSON-LD), common personalization use cases, and generating merge tags with Dynamic Content Builder.
- `references/03-helpers-text-math-date.md` — Text helpers, Math helpers, and Date and Time helpers, each with Properties/Format/Example triads in source order.
- `references/04-helpers-logic-loops-regex.md` — Conditional logic helpers, looping over objects and arrays, and regular expressions (`#ifMatchesRegexStr`), including the regex quick reference and common use cases.
- `references/05-encoding-mergetags-troubleshooting.md` — Encoding and hashing helpers, Iterable's built-in merge tags, and troubleshooting Handlebars code.
