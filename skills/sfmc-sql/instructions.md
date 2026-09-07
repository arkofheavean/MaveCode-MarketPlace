# SFMC - SQL

Auto-writes SQL for SFMC Query Studio. Handles Data Extension queries, Data View joins, subscriber segmentation, engagement filtering, and scheduled query activities while applying Marketing Cloud Engagement best practices for readable, explicit, maintainable, practical, and tested SQL.

## When To Use

Use this skill when the user needs SQL for SFMC Query Studio — whether for ad-hoc analysis, building segments, joining Data Views, or creating query activities for Automation Studio. Also use it when the user needs the query to follow Salesforce Marketing Cloud Engagement implementation best practices: beautiful/readable formatting, explicit naming, simple maintainable logic, low ambiguity, documented assumptions, and testable output.

## Trigger Phrases

- "write SFMC SQL"
- "Query Studio SQL"
- "query activity SQL"
- "SQL for data extensions"
- "SFMC segment query"
- "data view query"
- "engagement query SFMC"
- "MCE SQL best practices"
- "Marketing Cloud SQL naming convention"
- "make SFMC SQL readable"

## Instructions

### Step 1 — Understand the Query Need

Clarify:

- Purpose: segmentation / reporting / data hygiene / migration
- Source: Data Extensions, System Data Views, or both
- Target: new DE, existing DE, or just results
- Filters: date ranges, engagement criteria, attribute conditions
- Schedule: one-time or recurring (query activity)
- Naming convention context: market, BU, segment, campaign type, human-readable asset name, date, campaign code, if available
- Ambiguities: missing DE schemas, join keys, BU scope, sendable relationship, date window, and target update type

### Step 2 — Apply Marketing Cloud Zen Quality Rules

Before and after writing SQL, apply the Marketing Cloud Engagement best-practice layer:

- **Beautiful is better than ugly.** Format queries consistently; use readable indentation, line breaks, aligned aliases, and comments. Code that merely works is not enough when other SFMC users must debug and maintain it.
- **Explicit is better than implicit.** Use clear aliases, explicit selected columns, clear `JOIN` conditions, documented target DE purpose, and explicit query activity setup. Prefer explicit Data Extension names/keys where the user provides them.
- **Simple is better than complex.** Apply KISS/YAGNI: solve the stated business need without unnecessary calculated fields, joins, nested logic, or universal abstractions.
- **Complex is better than complicated.** If one query becomes hard to explain, split work into multiple purpose-oriented Query Activities and staged Data Extensions. This is preferable to one dense query that is fragile or opaque.
- **Flat is better than nested; sparse is better than dense.** Avoid deeply nested `CASE` expressions and dense predicates when flatter predicates, intermediate staging, or clearer separate steps improve maintainability.
- **Readability counts.** Use short, meaningful names for aliases and output columns. Avoid cryptic aliases like `a` and `b` unless the query is trivial and there is no ambiguity.
- **Naming conventions count twice.** Recommend Query Activity, target DE, and output field names that encode useful business context where available. A compact pattern can use elements such as country, BU, segment, campaign type, asset name, asset type, date, and campaign code.
- **Errors should never pass silently unless explicitly silenced.** Identify risks such as duplicates, null keys, non-unique joins, missing sendable relationships, large Data View scans, and date-window truncation.
- **In the face of ambiguity, refuse the temptation to guess.** State assumptions or request missing details rather than inventing schemas or business rules.
- **Even when certain, test.** Recommend validation in the relevant SFMC context. SFMC SQL is partial SQL Server 2016, and behavior can differ between Query Studio and Automation Studio / Script Activity contexts.
- **Documentation is one honking great idea.** Include query comments, target DE schema, schedule, update type, assumptions, and a test plan.

See `references/01-zen-of-marketing-cloud.md`.

### Step 3 — Generate the SQL

Write SFMC-compatible SQL following platform constraints:

- SFMC uses a SQL Server dialect (T-SQL)
- No CREATE TABLE — output goes to a target DE
- Use TOP instead of LIMIT
- Data Views use underscore prefix: `_Subscribers`, `_Open`, `_Click`, `_Sent`, `_Bounce`
- JOINs between DEs and Data Views require SubscriberKey
- Prefer explicit joins and named output columns
- Keep large Data View scans bounded by a practical date window whenever possible

**Output format:**

```
SFMC SQL
════════

PURPOSE: [what this query does]
SOURCE: [DE names and/or Data Views used]
TARGET DE: [where results land]
ESTIMATED ROWS: [if estimatable]
ASSUMPTIONS: [schema/date/key/update-type assumptions]

MCE ZEN CHECK:
- Readability: [formatting, aliases, comments]
- Explicitness: [join keys, target DE, update type]
- Simplicity: [why this is the simplest sufficient design]
- Maintainability: [staging/query-activity recommendation if needed]
- Testing: [how to validate before go-live]
```

```sql
/* ═══ [Query Name] ═══ */
/* Purpose: [description] */
/* Target DE: [name] */
/* Schedule: [one-time / daily / weekly] */
/* Update Type: [Overwrite / Append / Update] */
/* Assumptions: [key assumptions] */

SELECT
    s.SubscriberKey,
    s.EmailAddress,
    [additional fields]
FROM [DataExtensionName] s
LEFT JOIN _Open o ON s.SubscriberKey = o.SubscriberKey
WHERE [conditions]
```

```
EXPLANATION:
- [Line-by-line walkthrough]

TARGET DE SCHEMA:
| Field | Type | Notes |
|-------|------|-------|
| [field] | [type] | [from which source] |

QUERY ACTIVITY SETUP:
- Name: [recommended name]
- Target DE: [name — create if doesn't exist]
- Target update type: [Overwrite / Append / Update]

TEST PLAN:
- Run with a narrow date window first
- Validate sample SubscriberKeys against source DE/Data Views
- Compare expected vs actual row counts
- Check duplicates and null join keys
- Confirm target DE field names/types match SELECT output
```

### Step 4 — Common Query Patterns

- **Engaged subscribers:** Subscribers who opened or clicked in the last 90 days
- **Inactive subscribers:** Subscribers with no opens in 180+ days
- **Bounce cleanup:** Hard bounces to suppress from sends
- **DE deduplication:** Remove duplicate rows from a DE
- **Journey entry population:** Build an entry DE for Journey Builder
- **Staged segmentation:** Split complicated logic into purpose-oriented Query Activities and intermediate DEs when the implementation becomes hard to explain
- **Reporting extracts:** Use explicit naming conventions and documented target schemas to make downstream BI/reporting easier

## Reference

### Data Views

- `_Subscribers` — all subscribers
- `_Sent` — all sent emails
- `_Open` — all opens (includes multiple opens)
- `_Click` — all clicks
- `_Bounce` — all bounces
- `_Unsubscribe` — all unsubscribes
- `_Job` — send job metadata
- `_ListSubscribers` — list membership

### SFMC SQL Quirks

- No LIMIT — use TOP N instead
- No TRUNCATE — use Overwrite target update type
- No temp tables — chain query activities instead
- Date functions: `GETDATE()`, `DATEADD()`, `DATEDIFF()`, `CONVERT()`
- String: CONCAT not supported in older BUs — use `+` instead
- Case-insensitive by default
- SQL is partial SQL Server 2016, and behavior can differ by execution context (for example Query Studio vs Script Activity / Automation Studio contexts), so test in the target context

## Bundled Reference

| Topic | File |
| --- | --- |
| Marketing Cloud SQL quality and implementation best practices | `references/01-zen-of-marketing-cloud.md` |

## Rules

- Always include comments explaining purpose and target DE
- Warn about query timeout risk on large Data Views (>30 days of `_Open`/`_Click`)
- Recommend indexed fields for WHERE and JOIN conditions
- Include the target DE schema so the user can create it before running
- For recurring queries, recommend Overwrite vs Append based on use case
- Prefer explicit aliases and field names; avoid cryptic aliases like `a` and `b` unless the query is trivial
- Keep SQL readable, sparse, and flat; avoid dense/nested expressions when a staged or clearer design is better
- If the implementation is hard to explain, suggest a simpler or staged approach
- Do not silently ignore risks; document duplicates, null join keys, non-unique joins, large Data View scans, and target schema mismatches
- When requirements are ambiguous, do not guess; state assumptions or ask for missing details
- Always recommend testing, even for straightforward SQL
- Naming conventions count twice: recommend clear Query Activity names, target DE names, aliases, and output fields
