# Handlebars Overview

Iterable uses the Handlebars language to support building personalized and dynamic message content.

NOTE

This documentation describes how to use Handlebars as implemented in Iterable. Please note that Iterable does not support every part of the Handlebars language, and our supported methods and syntax may differ from those described in the official Handlebars support docs.

## What is Handlebars?

Handlebars is a simple templating language that works by replacing variables with actual values from an input source. In Iterable, these input sources can be a user's profile, events, Catalog, or a data feed.

Using Handlebars syntax, you can insert placeholder variables (called **merge tags**) in the messages you build in Iterable. At send time, merge tags are replaced with actual values that are specific to each user. Handlebars provides a unified way to personalize content across all channels and campaign types, making it easy to create consistent, personalized experiences for your users.

## Handlebars basics

### Merge tags

A **merge tag** is a bit of code that allows you to insert dynamic content in message templates. At send time, Iterable replaces each merge tag in a message template with the relevant values from the user's profile or event history.

In Iterable, merge tags are denoted with double curly braces (`{{` `}}`). The simplest merge tags consist of the name of a single user or event data field, but you can also create more complex conditional statements.

For example, if your project stores users' first names in a field called `firstName`, you could use the merge tag `{{firstName}}` in a message template to display each recipient's first name in the message they receive.

### Blocks

Handlebars **blocks** are longer and more complex merge tags that can include multiple lines of code, functions, and conditional logic.

### Helpers

Handlebars **helpers** are functions that you can use to format, modify, or loop over variables in merge tags. You can apply Handlebars helpers to user or event data fields, or to literal values.

#### Standard helpers

Standard Handlebars helpers are generally applied to simple, single-line merge tags. To use a standard helper, include the helper name (without any additional formatting) before the data field or literal value you wish to apply it to.

**Example:**

```
{{upper firstName}}
```

#### Block helpers

Block helpers are functions that enable conditional logic or iterate over collections of items. A block helper has an opening statement, followed by one or more lines of code, followed by a matching closing statement. The opening statement must begin with the helper name preceded by a `#` character (for example: `#if`), and the closing statement must repeat the helper name preceded by the `/` character (for example: `/if`).

**Example:**

```
{{#if firstName}} <-- (Opening statement)
<div>Hello, {{firstName}}! <div> <-- (Content to be displayed)
{{/if}} <-- (Closing statement)
```

NOTE

Handlebars helpers don't change the values stored in user fields. They only determine how a merge tag's content is rendered in a message at send time.

## Handlebars syntax

| Name | Character | What it does | When to use it | Example |
| --- | --- | --- | --- | --- |
| Double curly braces | `{{}}` | Encloses a variable to create a merge tag (escapes HTML) | Default Handlebars enclosing character | {{fieldName}} |
| Triple curly braces | `{{{}}}` | Encloses a variable to create a merge tag (does **not** escape HTML) | For fields containing HTML (that you want rendered as HTML) | {{{fieldThatContainsHTML}}} |
| Single square brackets | `[]` | Encloses a variable or expression | 1. For field names that contain spaces, 2. Used to indicate an item's index location within an array | {{[fieldNameThatContainsSpaces].[1].itemName}} |
| Double square brackets | `[[]]` | Encloses a variable from a data feed to create a merge tag | For values pulled from a data feed | [[dataFeedName]] |
| Parentheses | `()` | Encloses a variable or expression | Nests sequential Handlebars operations | {{capitalizeFirst (lower firstName)}} |
| Hash mark | `#` | Denotes the beginning of a Handlebars block statement | Add to the beginning of a Handlebars helper to apply the helper to multiple lines of code | {{#ifContainsStr string "substring"}} <div>content</div> {{/#ifContainsStr}} |
| Forward slash | `/` | Denotes the end of a Handlebars block statement | To close a Handlebars block statement, type `/` before the name of the Handlebars helper you applied to the previous lines of code | {{#ifContainsStr string "substring"}} <div>content</div> {{/#ifContainsStr}} |
| Single quotes | `''` | Denote a mathematical operation or a string literal | Used with math helpers, and with string literals inside Handlebars expressions that are embedded in double-quoted HTML or JSON | {{math 2 '+' 3}} href="{{helper value 'string-literal'}}" |
| Double quotes | `""` | Denote a string | Enclose an actual value (instead of a field that contains a value) within a standalone Handlebars expression or block. If the full Handlebars expression is already inside double-quoted HTML or JSON, use single quotes for the inner literal instead. | {{upper "fiterable"}} |
| Period ("dot") | `.` | Denotes a field within another field or an array | Reference a field within an event or array by listing the top-level array name, followed by a `.` and the nested field name | {{fieldName.subfieldName}} |

## Quotes inside HTML and JSON

When a Handlebars expression appears inside an HTML attribute or JSON value that is already wrapped in double quotes (`""`), use single quotes (`''`) for any nested quoted items inside the Handlebars expression. Double nested quotes break Handlebars syntax. Apply single-quotes to nested items to keep the surrounding HTML or JSON valid.

**Invalid**

```
<img src="{{defaultIfEmpty product.imageUrl "https://cdn.example.com/fallback.png"}}">
```

**Valid**

```
<img src="{{defaultIfEmpty product.imageUrl 'https://cdn.example.com/fallback.png'}}">
```

This rule applies regardless of where the data comes from: user profiles, events, Catalog, data feeds, snippets, and other dynamic data sources all follow the same quoting pattern when they are rendered inside quoted HTML or JSON.

### Examples

#### HTML attribute

```
<a href="{{defaultIfEmpty user.cta_link 'https://www.example.com/default-offer'}}">View offer</a>
```

```
<div data-locale="{{defaultIfEmpty user.locale 'en-US'}}"></div>
```

#### JSON value

```
{
  "imageUrl": "{{defaultIfEmpty user.profile_image 'https://cdn.example.com/default-avatar.png'}}"
}
```

```
{
  "segment": "{{#if (eq user.plan 'premium')}}vip{{else}}standard{{/if}}"
}
```

#### Catalog data

```
{{#catalog 'Stores' user.favorite_store}}
  {{defaultIfEmpty address_line_1 'Address unavailable'}}
{{/catalog}}
```

If the output is used inside an HTML attribute or JSON string, keep the catalog and helper string arguments single quoted, as shown in the examples above.

## Data sources

You can reference data from the following sources using Handlebars:

- **User profiles:** Include user demographic information (such as their name, age, or geographic location).
- **Events:** Include data from a campaign's triggering event (such as a purchase).
- **Catalog:** Include information about your business's products and services.
- **Data feeds:** Include data from an external web service.

## What you can personalize

The key advantage of Handlebars in Iterable is that it provides a unified way to personalize content across all channels and campaign types, making it easy to create consistent, personalized experiences for your users. Here are all the places you can include Handlebars code in Iterable.

### Templates

Personalize viewable message elements, sending details, and CTA buttons and links for each recipient. Here are the message elements and sending details you can personalize in each of the different template types:

- **Email templates:** Subject, Preheader, Body, From email, Reply to email
- **SMS templates:** Message, Media URL, Contact cards, Links
- **WhatsApp templates:** Body, Header
- **In-App templates:** Mobile inbox title, Mobile inbox body
- **Push templates:** Title, Body, Badge count, Media URL, Open action, Action buttons, Custom sound
- **Web push templates:** Title, Body, Icon, Click location
- **Embedded templates:** Title, Body, Media URL, Open action, Action buttons

### Snippets

Create reusable content blocks for frequently used message content (like email headers and footers), which can be updated in one place and the changes are applied everywhere the snippet is used.

### Links and URLs

Include merge tags in query strings to personalize the interactive links and CTA buttons you include in message content.

### Catalog collections

Search your brand's catalog of products and services to find items that are tailored to each user's interests and preferences.

## Terms to know

Here are some of the most common terms used when working with Handlebars in Iterable.

### Handlebars block

A multi-line Handlebars construct with an opening statement, one or more lines of content, and a closing statement. Used for conditional logic or iteration. Opening statements begin with `#`; closing statements begin with `/`.

**Example:**

```
{{#if firstName}}
  Hello, {{firstName}}!
{{/if}}
```

For more detail, see [Blocks](#blocks) above.

### Handlebars expression

Any use of the `{{...}}` syntax, including simple merge tags as well as helpers, blocks, and multi-part expressions. "Handlebars expression" is the umbrella term for the full `{{...}}` syntax; use it when the context goes beyond a simple field reference.

**Example:**

```
{{#urlEncode}}{{email}}{{/urlEncode}}
```

### Handlebars helper

A function applied within a Handlebars expression to format, transform, or evaluate a value. There are two types:

#### Standard helpers

Standard helpers apply to a single value on one line.

**Example:**

```
{{upper firstName}}
```

#### Block helpers

Block helpers apply to multiple lines of content using opening and closing statements.

**Example:**

```
{{#if firstName}}
  Hello, {{firstName}}!
{{/if}}
```

For more detail, see [Helpers](#helpers) above.

### Merge tag

A `{{fieldName}}` placeholder that Iterable replaces with a real value at send time. Merge tags are Iterable's primary term for simple field references in templates, snippets, data feeds, and URLs. All merge tags are Handlebars expressions, but not all Handlebars expressions are merge tags.

**Example:**

```
{{firstName}}
```

For more detail, see [Merge tags](#merge-tags) above.

### Snippet variable

A named parameter declared in a snippet definition (via the **Add variable** button) that lets individual templates customize a snippet's output. Snippet variables are referenced inside snippet content using merge tags—for example, a variable named `color` is referenced as `{{color}}`. Values are passed to snippet variables using positional or named parameters in the snippet expression.

Snippet variables are a distinct concept from merge tags: they are declared parameters in the snippet, not syntax.

## Getting started

To start personalizing your content, familiarize yourself with Handlebars syntax and the various helpers Iterable supports. Then create a template or snippet, and add some merge tags or Handlebars blocks for the dynamic content you're interested in displaying to recipients.

NOTE

Want to skip the coding? Let Dynamic Content Builder generate and insert your Handlebars code for you.
