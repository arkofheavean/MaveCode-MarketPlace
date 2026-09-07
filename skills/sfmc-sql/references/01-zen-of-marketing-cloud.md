# Zen of Marketing Cloud for SFMC SQL

Source: "Zen of Marketing Cloud" — https://mateuszdabrowski.pl/docs/salesforce/marketing-cloud-engagement/zen-of-marketing-cloud/

Category: Marketing Cloud Engagement.

This reference adapts Salesforce Marketing Cloud implementation, development, and operations best practices to the `SFMC - SQL` skill. The source presents flexible recommendations, not strict rules. Apply them pragmatically to improve SQL readability, maintainability, testing, and long-term Marketing Cloud operations.

## Zen of Marketing Cloud

```sql
Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Naming conventions count twice.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
Even when certain, test.
Now is better than never.
Although never is often better than right now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Documentation is one honking great idea - let's do more of it!
```

## How to use this reference in SFMC SQL generation

When writing SQL for Query Studio or Query Activities, treat these lines as a quality checklist:

1. Make it simple.
2. Make it readable.
3. Make it understandable.
4. Make it maintainable.
5. Make it practical.

## Beautiful is better than ugly

Code in Salesforce Marketing Cloud can work even with random indentation, lack of new lines, cryptic variables, and inconsistent casing. That is not enough. Generated SQL should be readable, understandable to others, and easier to debug.

For SFMC SQL:

- Put each selected field on its own line for non-trivial queries.
- Use consistent indentation for `SELECT`, `FROM`, `JOIN`, `ON`, `WHERE`, `GROUP BY`, and `ORDER BY`.
- Use readable aliases based on the source, such as `sub` for `_Subscribers`, `sent` for `_Sent`, `openEvents` for `_Open`, or `clickEvents` for `_Click` when clarity matters.
- Use comments to describe business purpose, target Data Extension, schedule, assumptions, and update type.
- Prefer formatting that helps debugging over formatting that is merely short.

## Explicit is better than implicit

Implicit approaches are faster and easier; explicit approaches are sturdier and better. Marketing Cloud is a long-term commitment used by many people, so the extra effort spent on explicitness saves time later.

For SFMC SQL:

- Select explicit columns instead of `SELECT *`.
- Use explicit aliases and explicit `JOIN` conditions.
- Make the target Data Extension and update type explicit.
- Document whether a field comes from a Data Extension or System Data View.
- State assumptions about SubscriberKey, EmailAddress, BU scope, target sendable relationship, and date windows.
- Avoid relying on undocumented behavior.

### Explicit asset keys and names

The source recommends custom explicit keys for Marketing Cloud assets. Data Extension and Content Block keys are frequently used in code. A default pseudo-random ID works, but custom explicit keys improve maintainability.

For SQL and Query Activities:

- Keep Data Extension Name and Key in sync where possible. This reduces confusion about whether a lookup uses name or key.
- Use explicit Query Activity names that explain the business purpose.
- Use target DE names that are stable and readable.
- Include recommended names in the generated output.

## Simple is better than complex

Marketing Cloud is complex, but development should be as straightforward as possible. Apply KISS (Keep It Simple Stupid Salesforce) and YAGNI (You Aren't Gonna Need It): build only what is needed, and choose the simplest solution that satisfies the business requirement.

For SFMC SQL:

- Avoid extra joins and calculations not required by the user's purpose.
- Avoid over-general query frameworks when one clear query is enough.
- Use `IIF` for two opposite rules only when it improves clarity in the target SFMC context.
- Keep segmentation logic directly tied to the requested criteria.
- Do not add fields to the target schema just because they might be useful later.

Example principle from the source: when there are only two opposite `CASE` rules, a simpler shorthand can be better than a verbose `CASE`, provided it remains readable and supported in the user's context.

## Complex is better than complicated

There is a limit to simplification. A single asset that handles too many concerns becomes complicated rather than simple.

The source calls out two principles:

- **SOC (Separation of Concerns):** Split a solution into separate purpose-oriented elements when one asset has too many goals.
- **DRY (Don't Repeat Yourself):** Avoid repeating the same logic in many places; refactor repetitive spots.

For SFMC SQL:

- If one SQL query becomes difficult to explain, propose staged Query Activities and intermediate Data Extensions.
- Use one query for one clear purpose where possible.
- Split extraction, deduplication, enrichment, and final segmentation into separate steps when the combined query would be fragile.
- Avoid copying the same filtering logic into multiple unrelated queries without documenting the shared rule.

## Flat is better than nested; sparse is better than dense

Deeply nested logic and dense syntactic tricks can look advanced but are harder to read and modify. Good code does not need to be short; it must be readable, simple, and explicit.

For SFMC SQL:

- Avoid deeply nested `CASE` statements when a flatter predicate or staged transformation is clearer.
- Avoid dense one-line `WHERE` clauses for multi-condition segmentation.
- Prefer clear `AND` / `OR` grouping with parentheses and line breaks.
- Consider staged DEs if flattening a query reveals multiple separate business concerns.
- Keep Journey-entry queries focused on one concrete action or goal.

## Readability counts

Readability limits bugs, simplifies debugging, improves future development, and saves time. In Marketing Cloud content, readability drives the message to the recipient; in SQL, readability drives operational reliability.

For generated SQL:

- Use short but meaningful aliases.
- Use output field names that explain meaning.
- Use comments for non-obvious date windows, exclusions, and deduplication rules.
- Avoid clever tricks if a more obvious expression is easier to maintain.
- Include an explanation and target DE schema.

## Naming conventions count twice

Naming conventions are crucial to long-term success in marketing automation. They improve readability, maintainability, clarity, searchability, and reporting.

The source recommends:

1. Define business-oriented data points that bring value.
2. Create readable shortcuts to limit length.
3. Create a dedicated place for each element in the naming convention.
4. Split elements with an underscore (`_`).
5. Split parts of a single element with a hyphen (`-`).

Example source naming pattern:

`UK_DEV_C_WEL_brand-welcome-1_EML_21-10_01234`

Elements:

1. Country: `UK` = United Kingdom
2. Business Unit: `DEV` = Development
3. Segment: `C` = Customers
4. Campaign Type: `WEL` = Welcome
5. Asset Name: `brand-welcome-1`
6. Asset Type: `EML` = Email
7. Date: `21-10` = October 2021
8. Campaign Code: `01234`

For SFMC SQL, adapt this to Query Activities and target DEs. Examples:

- Query Activity: `UK_DEV_C_WEL_engaged-90d_QRY_26-09_01234`
- Target DE: `UK_DEV_C_WEL_engaged-90d_DE_26-09_01234`

When the user does not provide naming inputs, recommend a readable fallback and list assumptions.

## Special cases and practicality

Special cases should not break rules by default, but practicality can beat purity. Follow the rules as the default, break them only when there is no other option, and refactor later when possible.

For SFMC SQL:

- Prefer the skill rules and SFMC SQL quirks by default.
- If a business deadline requires a practical compromise, document it.
- If a query must use a less ideal pattern due to platform limits, explain why.
- Recommend a refactor path when a practical workaround should not become permanent.

## Errors should never pass silently unless explicitly silenced

Capturing and analyzing errors is essential. Marketing Cloud also has platform features that capture issues: Journey pre-launch validation, Verification Activity for Automation Studio and built-in error logging, Send Logs, and Audit Trail.

For SQL:

- Do not ignore duplicate SubscriberKeys or non-unique joins.
- Call out null join-key risks.
- Warn about missing target fields or mismatched data types.
- Warn about large Data View scans and timeout risk.
- For Automation Studio, recommend Verification Activity or equivalent validation when appropriate.
- Provide custom, clear error/risk messages instead of relying on vague platform failures.

Some cases may intentionally avoid raising/blocking errors. For example, personalized messaging with missing data may work better with non-personalized defaults. In SQL, document when rows are intentionally excluded, defaulted, or allowed through.

## Refuse the temptation to guess; even when certain, test

Marketing Cloud has complexity, cross-cloud integrations, frequent updates, technical debt, and multiple frameworks co-existing. Do not assume behavior will remain the same. Check during development and check again before go-live.

The source specifically notes that SQL is a **partial SQL Server 2016** implementation with different behavior in **Script Activity** and **Query Studio**.

For SFMC SQL:

- Do not invent DE schemas, field types, sendable relationships, or business definitions.
- State assumptions when the user has not provided details.
- Recommend test runs with narrow date windows.
- Validate row counts and sample SubscriberKeys.
- Test in the target execution context when possible, not only in a different SFMC context.
- Check large Data View queries before scheduling them.

## Now is better than never; never is often better than right now

Improvements are valuable, but hasty changes can break working processes. For SQL:

- Suggest incremental improvements rather than risky rewrites when a query is already in production.
- Recommend discovery and stakeholder alignment before introducing a broad naming convention.
- Do not rush refactors without testing.

## Hard to explain means risky

If implementation is hard to explain to a colleague or client, it can be too complex, too ambiguous, or not understood enough. This can cause non-optimized outcomes or business-breaking crashes.

For SQL:

- Include a plain-language explanation.
- If the query cannot be explained concisely, suggest staging or simplification.
- Prefer a query structure that makes the story obvious from the comments and aliases.

## Documentation is one honking great idea

Marketing Automation projects are long-term investments with change requests, new team members, mistakes, and bugs. Good documentation saves time.

For SFMC SQL output, always document:

- Purpose.
- Sources.
- Target Data Extension.
- Target schema.
- Query Activity name.
- Update type.
- Schedule.
- Assumptions.
- Risk areas.
- Test plan.

## SFMC SQL generation checklist

Before finalizing SQL, confirm:

- The query is readable and formatted.
- Aliases and output fields are explicit.
- The business purpose is documented.
- The target DE schema is provided.
- Large Data View scans are bounded or warned about.
- Ambiguities are stated instead of guessed.
- The implementation is easy to explain.
- A practical test plan is included.
- Query Activity and target DE names follow a clear convention when enough context exists.
