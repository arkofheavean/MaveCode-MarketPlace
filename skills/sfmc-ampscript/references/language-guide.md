# AMPscript Language Guide

Consolidated language-basics reference folded from the Salesforce AMPscript guide pages. This file complements — and deliberately does not duplicate — the **Core Concepts** section in `instructions.md`, which already covers the execution model, variable declaration/assignment, lookup functions, and FOR loops over rowsets. Refer to `instructions.md` for those topics; this guide expands on syntax placement, variables, conditionals, operators, and MobileConnect message parsing.

> Many source guide pages describe worked examples in prose but the fenced code blocks were not captured during scraping. Where that is the case, the example is annotated below. Do not invent code for those cases.

---

## Adding AMPscript to Your Content

There are three ways to add AMPscript to content: inline code, code blocks, and tag-based scripting. When you close an AMPscript block, you must use the same type of closing delimiter you used to open it. For example, a block opened with tag-based scripting cannot be closed with a code-block delimiter.

- **Inline AMPscript** — Use the `%%=` and `=%%` delimiters to add code inline with your content. Inline AMPscript is frequently used within HTML tags to dynamically populate content. You can only execute a single function in a section of inline AMPscript, but you can nest functions within it (for example, `Iif()` wrapping a nested `Empty()` call).
- **Code blocks** — Use the `%%[` and `]%%` delimiters to begin and end a multi-line block. In a code block you can define multiple variables and execute multiple functions.
- **Tag-based scripting** — Delimit AMPscript with `<script runat="server" language="ampscript">` … `</script>` tags. This standardizes AMPscript block syntax with Server-Side JavaScript (SSJS), making it easier for developers to switch between the two.

> Example code not captured in source.

---

## Variables in AMPscript

AMPscript variable names always begin with the at sign (`@`).

- Declare a variable using the `Var` keyword. A newly declared variable has the value `null`. Variables can only be declared inside AMPscript blocks — not in inline AMPscript strings.
- You can declare multiple variables in a single line: `Var @firstName, @lastName, @contactCity`.
- Use the `Set` keyword to assign a value: `Set @contactCity = "Tokyo"`.
- You can set a variable to the result of a function. For example, setting `@currentDate` using `FormatDate()` and `Now()`; if the current date is August 5, 2023, `@currentDate` would have the value `"5 August 2023"`.

> Example code not captured in source.

See also: instructions.md → Core Concepts → Variables and Declaration.

---

## If Statements

Use the `If` statement to perform conditional processing. At a minimum, an `If` statement must include:

- The keyword `If` immediately preceding the condition to evaluate.
- The keyword `Then` immediately following the condition.
- The keyword `EndIf` to close the block.

These keywords are not case-sensitive (`IF`, `If`, and `if` all behave the same).

Evaluations in `If` statements can include any of these input types:

- Constants
- Variables
- Attributes and data extension values
- Function calls

Use the `ElseIf` statement to test additional conditions; you can include multiple `ElseIf` statements in an `If` block. Use a single `Else` statement to catch any condition not specifically handled by the `If` or `ElseIf` conditions.

> Example code not captured in source.

See also: Evaluating Conditions in AMPscript (below).

---

## Evaluating Conditions in AMPscript

AMPscript supports conditional logic so you can personalize each message and customer touchpoint.

### Comparison operators

| Operator | Description |
| --- | --- |
| `==` | Is equal to |
| `!=` | Is not equal to |
| `>` | Greater than |
| `<` | Less than |
| `>=` | Greater than or equal to |
| `<=` | Less than or equal to |

These operators are commonly used in `If` statements. For example, a statement can check whether the numeric value of `@age` is 30 or higher.

### Join operators

| Operator | Description |
| --- | --- |
| `and` | Both conditions must be true |
| `or` | Either condition must be true |

Use parentheses to control the order in which AMPscript evaluates complex expressions. For example, an `If` can match when `@age` is 30 or higher **and** `@predisposition` is `"High"`, **or** when `@age` is 55 or higher **and** `@predisposition` is `"Normal"`.

The `not` operator reverses the logic of an evaluation. For example, a statement matches when `@age` is 55 or higher and `@predisposition` is anything other than `"High"`.

> Example code not captured in source.

---

## For Loops

Use the `For` loop to repeat a block of code, typically to iterate over the rows of a rowset returned by a lookup function. The loop declares a counter variable, a start value, a direction (`to` for ascending, `downto` for descending), and an end value, and closes with `Next`.

Common use cases described in the source guide include iterating from `1` to `RowCount(@rows)`, retrieving each row with `Row()`, and reading column values with `Field()`.

> Example code not captured in source.

See also: instructions.md → Core Concepts → FOR Loops Over Rowsets, and `references/fn-data-extension.md` for `LookupRows()`, `Row()`, `RowCount()`, and `Field()`.

---

## Nouns, Noun(), Verb — MobileConnect Message Parsing

These functions parse mobile-originated (MO) messages — messages sent from a subscriber's mobile device to your SMS phone number — and can only be used in MobileConnect together with `Msg()`. They do not work in email, landing pages, or other content types. All are supported in Marketing Cloud Engagement only.

- **Verb** — Returns the keyword from an MO message. Accepts no parameters. If the keyword is `OFFER` and the MO message is `"OFFER John Smith"`, `Verb` returns `"OFFER"`.
- **Noun(position)** — Returns a single word that follows the keyword, by zero-based position. `position` (integer, required): the first word after the keyword has index 0. For `"OFFER John Smith"`, `Noun(1)` returns `"Smith"`.
- **Nouns** — Returns all words that follow the keyword in the MO message.

> Example code not captured in source.

See also: `references/fn-integrations-appendix.md` → SMS, MMS, and Social Functions.

---

## Tooling: AMPscript Core Extension for Visual Studio Code

Salesforce Labs publishes the community-supported **AMPscript Core** extension for VS Code (Apache License 2.0; not an official Salesforce product, so Salesforce Support can't assist with it). It provides:

- AMPscript syntax highlighting.
- A local server that renders a live preview of your HTML and AMPscript content in a browser.
- The ability to test data extension functions against local `.csv` files.

Supported syntax includes inline AMPscript (`%%=...=%%`), code blocks (`%%[...]%%`), tag syntax (`<script language="ampscript"> ... </script>`), variables (`@varName`), logical operators (`==`, `>=`, `<=`, `!=`), `For` loops, and `If` statements. It does NOT support system time/date strings (`xtlongdate`, `xtyear`, `xtmonth`) or sender/recipient personalization strings (`_emailaddr`, `_fullname`, `replyname`).

Function-category support (because the extension can't reach a live Marketing Cloud Engagement account):

- Full: Math functions.
- Partial: Content, Data extension, Date/Time, String (`StringToDate()` and `StringToHex()` are unavailable), and Utility functions (for example `RaiseError()` can't cancel a send locally). Content and Data extension functions read from local files instead of your account.
- Not supported: SOAP API, Contact, Encryption, HTTP, MSCRM, Sales/Service Cloud, Site, SMS, and Social functions.

> Example code not captured in source.
