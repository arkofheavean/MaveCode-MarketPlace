---
name: sfmc-sql
description: "Generates SFMC Query Studio SQL for Data Extension queries, Data View joins, subscriber segmentation, engagement filtering, and scheduled query activities."
---

# SFMC - SQL

Auto-writes SQL for SFMC Query Studio. Handles Data Extension queries, Data View joins, subscriber segmentation, engagement filtering, and scheduled query activities.

## When To Use

Use this skill when the user needs SQL for SFMC Query Studio — whether for ad-hoc analysis, building segments, joining Data Views, or creating query activities for Automation Studio.

## Trigger Phrases

- "write SFMC SQL"
- "Query Studio SQL"
- "query activity SQL"
- "SQL for data extensions"
- "SFMC segment query"
- "data view query"
- "engagement query SFMC"

## Instructions

### Step 1 — Understand the Query Need

Clarify:

- Purpose: segmentation / reporting / data hygiene / migration
- Source: Data Extensions, System Data Views, or both
- Target: new DE, existing DE, or just results
- Filters: date ranges, engagement criteria, attribute conditions
- Schedule: one-time or recurring (query activity)

### Step 2 — Generate the SQL

Write SFMC-compatible SQL following platform constraints:

- SFMC uses a SQL Server dialect (T-SQL)
- No CREATE TABLE — output goes to a target DE
- Use TOP instead of LIMIT
- Data Views use underscore prefix: `_Subscribers`, `_Open`, `_Click`, `_Sent`, `_Bounce`
- JOINs between DEs and Data Views require SubscriberKey

**Output format:**

```
SFMC SQL
════════

PURPOSE: [what this query does]
SOURCE: [DE names and/or Data Views used]
TARGET DE: [where results land]
ESTIMATED ROWS: [if estimatable]
```

```sql
/* ═══ [Query Name] ═══ */
/* Purpose: [description] */
/* Target DE: [name] */
/* Schedule: [one-time / daily / weekly] */

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
```

### Step 3 — Common Query Patterns

- **Engaged subscribers:** Subscribers who opened or clicked in the last 90 days
- **Inactive subscribers:** Subscribers with no opens in 180+ days
- **Bounce cleanup:** Hard bounces to suppress from sends
- **DE deduplication:** Remove duplicate rows from a DE
- **Journey entry population:** Build an entry DE for Journey Builder

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

## Rules

- Always include comments explaining purpose and target DE
- Warn about query timeout risk on large Data Views (>30 days of `_Open`/`_Click`)
- Recommend indexed fields for WHERE and JOIN conditions
- Include the target DE schema so the user can create it before running
- For recurring queries, recommend Overwrite vs Append based on use case
