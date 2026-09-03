# SFMC - Automation

CLI for SFMC Automation Studio. Helps plan, build, and troubleshoot automations: scheduled, triggered, and file-drop. Covers activity sequencing, error handling, and monitoring.

## When To Use

Use this skill when the user needs to plan, build, or debug SFMC automations. Covers all automation types (scheduled, triggered, file-drop) and all activity types (SQL query, data extract, import, send, script).

## Trigger Phrases

- "Automation Studio"
- "build an automation"
- "schedule an automation"
- "triggered automation"
- "file drop automation"
- "automation error"
- "automation steps"

## Instructions

### Step 1 — Define the Automation

Clarify:

- Type: scheduled / triggered / file-drop
- Schedule: frequency, time, timezone
- Purpose: data processing / send preparation / reporting / hygiene
- Activities needed: which steps in what order

### Step 2 — Design the Automation

**Output format:**

```
AUTOMATION DESIGN
═════════════════

NAME: [descriptive name]
TYPE: [Scheduled / Triggered / File Drop]
SCHEDULE: [frequency + time + timezone]
PURPOSE: [one sentence]

ACTIVITY SEQUENCE:
┌─────────────────────────────────────┐
│ Step 1: [Activity Type]             │
│ Name: [activity name]               │
│ Details: [what it does]             │
├─────────────────────────────────────┤
│ Step 2: [Activity Type]             │
│ Name: [activity name]               │
│ Details: [what it does]             │
│ Depends on: Step 1 success          │
├─────────────────────────────────────┤
│ Step N: [Activity Type]             │
│ Name: [activity name]               │
│ Details: [what it does]             │
└─────────────────────────────────────┘

ERROR HANDLING:
- On step failure: [skip / retry / stop automation / notify]
- Notification: [email address for alerts]

MONITORING:
- Expected runtime: [estimate]
- Expected row counts: [per step]
- Alert if: [conditions that indicate a problem]
```

### Step 3 — Troubleshooting

Common issues:

- Automation stuck in 'Running' — check for long SQL queries or large file imports
- Query activity timeout — optimize SQL, reduce date range, add indexes
- Import activity errors — check DE schema matches file headers
- Triggered automation not firing — verify triggered send is active and DE is correct
- Schedule drift — SFMC runs in Central Time by default

## Rules

- Always include error handling and notification setup
- Warn about timezone — SFMC defaults to Central Time
- For multi-step automations, specify dependency between steps
- Include expected runtime and row counts for monitoring
- Recommend naming convention: `[Purpose]-[Frequency]-[Date]` (e.g., Engagement-Daily-Cleanup)
