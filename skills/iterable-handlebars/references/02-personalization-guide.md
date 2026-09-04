# Personalization Guide

This reference folds three Iterable docs — **Personalizing Templates with Handlebars**, **Common Personalization Use Cases**, and **Generating Merge Tags with Dynamic Content Builder** — into a single personalization guide. Handlebars syntax basics (merge parameters, triple braces for HTML, commenting expressions in HTML source, quotes-in-HTML/JSON) are summarized in `instructions.md` and `01-overview-and-syntax.md`; this file focuses on personalization patterns and helpers in context. For the full per-helper reference, see `03-helpers-text-math-date.md` and `04-helpers-logic-loops-regex.md`.

## Personalizing Templates with Handlebars

To use dynamic content to personalize the messages you send with Iterable, use Handlebars. With Handlebars, you can display, format, reference and reason about user profile fields and event data in message templates.

### Getting started with Handlebars

This section provides an overview of using Handlebars expressions in Iterable to reference, manipulate, and reason about data stored on a user profile or an event.

#### Definition: merge parameter

Wrapping the name of a user profile or event field in double curly braces creates a *merge parameter*. When using merge parameter, data from the relevant user profile or event is *merged* at send time into the template or URL being modified, customizing and personalizing it as necessary.

#### Sample user profile data

To view a sample user profile, navigate to **Audience > Contact Lookup** and search for an existing Iterable user profile.

Projects that use `userId` as a unique identifier can also use this field to load data for a user—this includes userID-based projects and hybrid projects.

#### Sample event data

To view sample events saved by an Iterable project, navigate to **Insights > Logs > Events**.

#### Using Handlebars in HTML source

In an Iterable message template, you can add Handlebars expressions directly in the WYSIWYG editor or in its HTML source. When editing the HTML source, it is generally a good idea to comment out any Handlebars expressions that do not output a value.

In rare circumstances, the WYSIWYG editor can get confused by the presence of Handlebars expressions in the HTML source, which can lead to errors. Since the WYSIWYG editor ignores comments in the HTML source, commenting out Handlebars expressions can resolve this issue.

For example, do not enter this Handlebars expression in a message template's HTML source:

```
{{#if activeUser}}
    <div>Hi active user!</div>
{{else}}
    <div>Hi inactive user</div>
{{/if}}
```

Instead, enter:

```
<!--{{#if activeUser}}-->
    <div>Hi active user!</div>
<!--{{else}}-->
    <div>Hi inactive user</div>
<!--{{/if}}-->
```

If you're entering a Handlebars expression that outputs a value (for example, an expression like `{{email}}` that outputs the value of a user profile field), do not comment it out. Commenting out such an expression would prevent its value from rendering in the template.

It is safe to comment out Handlebars expressions such as conditionals, looping constructions, closing statements, etc., that do not output any value.

The rest of this document displays uncommented Handlebars expressions. That is, it displays them as they should be entered in the WYSIWYG editor, not the HTML source.

#### Referencing user profile and event fields with Handlebars

The most basic Handlebars expressions simply output the value of a field from a user's profile or the campaign's triggering event. To create this kind of simple Handlebars expression, wrap the name of your desired event or user profile field in double curly braces like this:

```
{{fieldName}}
```

For example, this Handlebars expression outputs a user's email address:

```
{{email}}
```

Event and user profile field names are case-sensitive.

At send time, if the campaign's triggering event or API call contains a field with the same name as a field on the user's profile, Iterable displays the value from the *event* field. However, you can tell Iterable to display the value from the user profile field instead using the following syntax:

```
{{profile.fieldName}}
```

**Example:**

Let's say `firstName` = "Christopher" in the campaign's triggering event and `firstName` = "Chris" on the user's profile. If you use the Handlebars expression `{{firstName}}` in your message template, it will evaluate to "Christopher" (because the value from the triggering event field takes precedence). If you use the Handlebars expression `{{profile.firstName}}` instead, the output in the message will be "Chris".

#### Fields containing spaces or a period, or starting with a number

To use Handlebars to reference a field that contains spaces or a period, or starts with a number, surround the field in square brackets (as well as double curly braces).

For example:

```
{{[First Name]}}
{{[1stName]}}
{{[User Signed Up.First Name]}}
```

**WARNING:** If possible, avoid using periods in field names, since they can cause difficulty when referencing data stored in nested objects on a user profile or event.

#### Fields containing HTML

To use Handlebars to display the HTML contained in a user profile or event field, wrap the field in triple curly braces (otherwise, the HTML will render as plain text). For example:

```
{{{customHTMLparameter}}}
```

**TIP:** If the HTML-containing parameter comes from a data feed (and you have not merged context for the data feed and the user profile), surround the parameter in double square brackets and single curly braces. For example:

```
[[{customHTMLparameter}]]
```

#### Handlebars helpers and block helpers

Handlebars uses *helpers* to manipulate, format, and loop through user profile and event data, to perform calculations, and to apply boolean and conditional logic. Helpers come in two varieties: *helpers* and *block helpers*.

Helpers and block helpers can work with user profile fields, event fields, and literals.

For example, consider the `capitalize` Handlebars helper, which capitalizes each word in a string:

```
{{capitalize "war and peace"}}
{{capitalize favoriteBook}}
```

Assuming the existence of a `favoriteBook` user profile or event field, these examples will output:

```
War And Peace
Animal Farm
```

#### Helpers

A Handlebars helper is a function that takes zero or more parameters and returns a value. For example:

```
{{capitalizeFirst firstName}}
```

This helper renders the `firstName` parameter with its first letter capitalized. The value stored in the `firstName` parameter is not changed.

To nest sequential calls to Handlebars helper methods, use parentheses. For example:

```
{{capitalizeFirst (lower firstName)}}
```

This example lowercases every letter in `firstName`, and then capitalizes its first letter, rendering the output in the message template.

#### Block helpers

Like helpers, block helpers are functions. They are generally used to perform conditional logic or to iterate over collections of items.

A block helper has an opening statement, a block of content, and a matching closing statement. The opening statement is always preceded by a `#` character. For example:

```
{{#each shoppingCartItems}}
    <div>Item name: {{name}}</div>
    <div>Item price: {{price}}</div>
{{/each}}
```

This example iterates over the items stored in the `shoppingCartItems`, displaying the name and price for each, like this:

```
Item name: shoes
Item price: 59.99

Item name: jacket
Item proice: 70.00
```

### Working with strings

This section describes various helpers useful for working with strings in Handlebars. For full details on each string helper, see `03-helpers-text-math-date.md` (Text Helpers) and `04-helpers-logic-loops-regex.md` (Regular Expressions).

#### Regular expression matching (`#ifMatchesRegexStr`)

You can use regular expressions to compare strings. For example:

- To check whether a given string matches (exactly) another string:

  ```
  {{#ifMatchesRegexStr gender "male"}}
      <div>Buy this tie!</div>
  {{/ifMatchesRegexStr}}
  ```
- To check whether a string contains another string:

  ```
  {{#ifMatchesRegexStr catName ".*[Bb]ojangles.*"}}
      <div>Is your cat's name Mr. Bojangles?</div>
  {{/ifMatchesRegexStr}}
  ```

**NOTES:** Regular expression queries are case-sensitive, which is why this example uses `[Bb]` to search for both cases.

#### Contains a substring (`#ifContainsStr`)

Search a string for a particular substring. If the substring is found, render the block's content. For example:

```
{{#ifContainsStr haystack "needle"}}
    <div>Haystack contains needle!</div>
{{/ifContainsStr}}
```

#### Checking equality and alphabetical order (`#ifEq`, `#eq`, `#lt`, `#lte`, `#gt`, `#gte`)

To check whether two strings are in alphabetical order, use the various comparison helpers:

- `#ifEq`, `ifEq`: if equals
- `#eq`, `eq`: equals
- `#lt`, `lt`: less than
- `#lte`, `lte`: less than or equal
- `#gt`, `gt`: greater than
- `#gte`, `gte`: greater than or equal

**NOTES:**
- If an `#lt`, `lt`, `#lte`, `lte`, `#gt`, `gt`, `#gte`, or `gte` expression references a non-existent or null field, the template will fail and the message will not be sent to that user.
- Alphabetic order comparisons are case sensitive.
- These comparisons work for string literals as well as fields on user profiles and events.

For example, to check whether "cat" comes before "dog" in alphabetical order:

```
{{#lt "cat" "dog"}}
    cat comes before dog!
{{else}}
    dog comes before cat!
{{/lt}}
```

To perform a string comparison in a boolean expression, use the non-block versions of these helpers:

```
{{#if (gt "dog" "cat")}}
    dog comes after cat!
{{else}}
    dog comes before cat!
{{/if}}
```

#### String length (`length`)

```
{{myMergeParam.length}}
```

For a `myMergeParam` field with a value that's an 8-character string, this example outputs `8`.

#### Capitalize first letter of a string (`capitalizeFirst`)

```
{{capitalizeFirst myMergeParam}}
```

Assuming `myMergeParam` is set to `iterable`, this outputs `Iterable`.

#### Capitalize first letter of each word in a string (`capitalize`)

```
{{capitalize myMergeParam}}
```

Assuming `myMergeParam` is set to `iterable document`, this outputs `Iterable Document`.

#### Capitalize entire string (`upper`)

```
{{upper myMergeParam}}
```

Assuming `myMergeParam` is set to `ItErAbLe`, this outputs `ITERABLE`.

#### Lowercase entire string (`lower`)

```
{{lower myMergeParam}}
```

Assuming `myMergeParam` is set to `ItErAbLe`, this outputs `iterable`.

#### Display default value if no value exists for a parameter (`defaultIfEmpty`)

```
{{defaultIfEmpty myMergeParam "My default value"}}
```

Assuming `myMergeParam` is null, undefined, or an empty string, this outputs `My default value`.

#### Render HTML contained within a field

To render HTML contained in a field, wrap the field in triple curly braces:

```
{{{myMergeParam}}}
```

#### Remove all instances of a specified string (`cut`)

```
{{cut myMergeParam " "}}
```

Assuming `myMergeParam` is set to `The cat climbed the tree`, this outputs `Thecatclimbedthetree`.

#### Replace all instances of a string (`replace`)

```
{{replace myMergeParam " " "-"}}
```

Assuming `myMergeParam` is set to `The dog ran around the block`, this outputs `The-dog-ran-around-the-block`.

#### Get substring by index (`substring`)

The `substring` helper accepts three parameters: (required) the containing string, (required) the starting index, (optional) the index of the first character *past* the end of the substring. The first character has index 0.

```
{{substring myMergeParam 3 6}}
```

Assuming `myMergeParam` is set to `iterable document`, this outputs `rab`.

#### Abbreviate string to a specified length (`abbreviate`)

The `abbreviate` helper takes a single parameter: the final length of the string, *including* three characters for `...`.

```
{{abbreviate myMergeParam 7}}
```

Assuming `myMergeParam` is set to `Apples are red`, this outputs `Appl...` (four characters for `Appl` and three for `...`, making seven total).

#### Convert to lowercase, remove numbers and special characters, and convert spaces to hyphens (`slugify`)

```
{{slugify myMergeParam}}
```

Assuming `myMergeParam` is set to `It's time for our 2nd annual fall sale`, this outputs `its-time-for-our-nd-annual-fall-sale`.

#### Replace newlines (`#breaklines`)

To replace `\n` or `\r\n` with `<br>`, use the `#breaklines` block helper.

```
{{#breaklines}}{{myMergeParam}}{{/breaklines}}
```

For a `myMergeParam` containing two lines separated by a blank line, this outputs `Hi there!<br><br>How are you?`.

#### URL encoding (`#urlEncode`)

To URL encode a string, use the `#urlEncode` block helper. This helper uses `java.net.URLEncoder`:

- Alphanumeric characters "a" to "z", "A" to "Z" and "0" to "9" are unchanged.
- Special characters ".", "-", "*", and "_" remain the same.
- The space character " " is converted into a plus sign "+" (not "%20").
- All other characters are encoded using UTF-8 characters.

```
https://www.example.com/search?q={{#urlEncode}}{{myMergeParam}}{{/urlEncode}}
```

Assuming `myMergeParam` is set to `fall sale`, this outputs `https://www.example.com/search?q=fall+sale`.

#### Write the provided argument as a JSON string (`toJson`)

```
{{toJson myMergeParam}}
```

The output depends on the data type of `myMergeParam`:

| myMergeParam | Data type | Output |
| --- | --- | --- |
| `My string` | String | `"My string"` |
| `1234` | Long | `1234` |
| `3.14` | Float | `3.14` |
| `{"field1": "value"}` | Object | `{"field1": "value"}` |
| `[1,2,3,4]` | Array | `[1,2,3,4]` |

#### Write the provided argument as a URL encoded JSON string (`toUrlEncodedJson`)

```
{{toUrlEncodedJson myMergeParam}}
```

The output depends on the data type of `myMergeParam`:

| myMergeParam | Data type | Output |
| --- | --- | --- |
| `My string` | String | `%22My+string%22` |
| `1234` | Long | `1234` |
| `3.14` | Float | `3.14` |
| `{"field1": "value"}` | Object | `%7B%22field1%22%3A%22value%22%7D` |
| `[1,2,3,4]` | Array | `%5B1%2C2%2C3%2C4%5D` |

#### Base64-encode a merge parameter (`#base64`)

```
{{#base64}}{{myMergeParam}}{{/base64}}
{{#base64}}user@example.com{{/base64}}
```

Assuming `myMergeParam` is set to `user@example.com`, each outputs `ZG9jc0BpdGVyYWJsZS5jb20=`.

#### Generate a SHA1 HMAC (`hmacSHA1`)

The `hmacSHA1` helper concatenates the passed-in parameters, then uses the **HMAC Secret** specified in **Project > Settings** to generate an HMAC-SHA1.

```
{{hmacSHA1 field1 field2}}
```

#### Generate a SHA1 hash (`sha1`, `#sha1`)

```
{{sha1 field1}}
```

If `field1` is set to `user@example.com`, this outputs `e364ed2661a7b922e5bf670f2a0946977bf63ae7`.

Alternatively, use the `#sha1` block helper:

```
{{#sha1}}{{userName}}@{{host}}{{/sha1}}
```

#### Generate an MD5 hash (`md5`, `#md5`)

```
{{md5 field1}}
```

For `user@example.com`, this outputs `0e13848b1c7e27eb5d88c5d35b70783e`. Block helper form:

```
{{#md5}}{{userName}}@{{host}}{{/md5}}
```

#### Generate a SHA256 hash (`sha256`, `#sha256`)

```
{{sha256 field1}}
```

With `field1` set to `user@example.com`, this outputs `b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514`. Block helper form:

```
{{#sha256}}{{userName}}@{{host}}{{/sha256}}
```

#### Pad a parameter (`center`)

```
{{center myMergeParam size=20 pad="-"}}
```

If `myMergeParam` is `Hello`, this outputs `-------Hello--------` (total length 20).

### Working with numbers (longs and doubles)

This section describes various helpers useful for working with longs and doubles in Handlebars. For full details, see `03-helpers-text-math-date.md` (Math Helpers).

#### Equals (`#ifEq`, `eq`)

Use `#ifEq` to test if one number is equal to another and display a block if so. `#ifEq` can compare numbers represented as strings, longs, and doubles; arguments need not be of the same type.

```
{{#ifEq age 21}}
    <div>Equals</div>
{{else}}
    <div>Not equals</div>
{{/ifEq}}
```

The `{{else}}` block is optional. Use `eq` to test two numbers for equality as part of a boolean expression:

```
{{#or (eq 1 numberOfPurchases) (eq 3 numberOfVisits)}}
    Found a match
{{else}}
    No matches
{{/or}}
```

For numeric comparisons, both arguments passed to `eq` must be of the same type: double or long. To output a string based on the result, set values for `yes` and `no`:

```
{{eq 1 numberOfPurchases yes="Equal" no="Not equal"}}
```

#### Greater than (`#ifGt`, `gt`)

```
{{#ifGt age 21}}
    <div>Greater than</div>
{{else}}
    <div>Not greater than</div>
{{/ifGt}}
```

Use `gt` in a boolean expression:

```
{{#and (gt 5 numberOfPurchases) (gt 3 numberOfVisits)}}
    Both are greater than
{{else}}
    At least one is not greater than
{{/and}}
```

Output a string based on the result: `{{gt 1 numberOfPurchases yes="Greater than" no="Not greater than"}}`. If a `gt` expression references a non-existent or null field, the template will fail and the message will not be sent.

#### Greater than or equal (`#ifGte`, `gte`)

```
{{#ifGte age 21}}
    <div>Greater than or equal</div>
{{else}}
    <div>Not greater than or equal</div>
{{/ifGte}}
```

Boolean form:

```
{{#if (gte 5 numberOfPurchases)}}
    Greater than or equal
{{else}}
    Not greater than or equal
{{/if}}
```

`{{gte 1 numberOfPurchases yes="Greater than or equal" no="Not greater than or equal"}}`. If a `gte` expression references a non-existent field, the template will fail.

#### Less than (`#ifLt`, `lt`)

```
{{#ifLt age 21}}
    <div>Less than</div>
{{else}}
    <div>Not less than</div>
{{/ifLt}}
```

Boolean form:

```
{{#and (lt 5 numberOfPurchases) (lt 3 numberOfVisits)}}
    Both are less than
{{else}}
    At least one is not less than
{{/and}}
```

`{{lt 1 numberOfPurchases yes="Less than" no="Not less than"}}`. If an `lt` expression references a non-existent or null field, the template will fail.

#### Less than or equal (`#ifLte`, `lte`)

```
{{#ifLte age 21}}
    <div>Less than or equal</div>
{{else}}
    <div>Not less than or equal</div>
{{/ifLte}}
```

Boolean form:

```
{{#if (lte 5 numberOfPurchases)}}
    Less than or equal
{{else}}
    Not less than or equal
{{/if}}
```

`{{lte 1 numberOfPurchases yes="Less than or equal" no="Not less than or equal"}}`. If an `lte` expression references a non-existent or null field, the template will fail.

#### If remainder equals (`#ifModEq`)

If `age` divided by 21 has a remainder of 0, output the contents of the block.

```
{{#ifModEq age 21 0}}
    <div>Age % 21 == 0 (age is a multiple of 21)</div>
{{/ifModEq}}
```

#### Formatting and rounding (`numberFormat`)

Use the `numberFormat` helper to format and round numbers. (Examples use literal numbers, but `numberFormat` works with user profile and event data as well.)

- Format as currency: `{{numberFormat 5.2345 "currency" "en_US"}}` → `$5.23`; `{{numberFormat 5.2345 "currency" "de_DE"}}` → `€5,23`
- Format as percent: `{{numberFormat .23 "percent"}}` → `23%`
- Maximum fractional digits: `{{numberFormat 123.456789 maximumFractionDigits=3}}` → `123.457`
- Minimum fractional digits: `{{numberFormat 123.4 minimumFractionDigits=5}}` → `123.40000`
- Group digits: `{{numberFormat 1000000 groupingUsed=true}}` → `1,000,000`
- Custom format (`DecimalFormat`): `{{numberFormat 1234.5678 ",000.00"}}` → `1,234.57`; `{{numberFormat 3 "0.00"}}` → `3.00`
- Round:
  - Up (away from zero): `{{numberFormat 5.5 "integer" roundingMode="up"}}` → `6`
  - Down (towards zero): `{{numberFormat 5.5 "integer" roundingMode="down"}}` → `5`
  - Ceiling (towards positive infinity): `{{numberFormat -5.5 "integer" roundingMode="ceiling"}}` → `-5`
  - Floor (towards negative infinity): `{{numberFormat -5.5 "integer" roundingMode="floor"}}` → `-6`
  - Half even: `{{numberFormat 5.5 "integer" roundingMode="half_even"}}` → `6`
  - Half up: `{{numberFormat -5.5 "integer" roundingMode="half_up"}}` → `-6`
  - Half down: `{{numberFormat -5.5 "integer" roundingMode="half_down"}}` → `-5`

**NOTES:** When no `roundingMode` is specified, `half_even` is used.

#### Addition, subtraction, multiplication, division, modulo (`math`)

Use the `math` helper to perform calculations:

- Addition: `{{math 3 '+' 2}}` → `5`
- Subtraction: `{{math 3 '-' 2}}` → `1`
- Multiplication: `{{math 3 '*' 2}}` → `6`
- Division: `{{math 3 '/' 2}}` → `1.5`
- Modulo: `{{math 3 '%' 2}}` → `1`
- With merge parameters: `{{math numberOfCats '+' 2}}` → if the user had 3 cats, `5`

### Working with lists/arrays

This section describes various helpers for working with lists (such as `shoppingCartItems`). For full details, see `04-helpers-logic-loops-regex.md` (Looping Over Objects and Arrays).

#### Show item at index (square brackets)

Access the name of the second item (array index starts at 0):

```
<div>Item name: {{shoppingCartItems.[1].name}}</div
```

#### Iterating over all values (`#each`)

```
{{#each shoppingCartItems}}
    <div>Item name: {{name}}</div>
    <div>Item price: {{price}}</div>
{{/each}}
```

Output:

```
<div>Item name: Shoes</div>
<div>Item price: 59.99</div>

<div>Item name: Jacket</div>
<div>Item price: 70.00</div>
```

To inspect the index of the current item, use `@index` (first item has index 0):

```
{{#each shoppingCartItems}}
    <div>Item {{math @index '+' 1}} name: {{name}}</div>
{{/each}}
```

Output: `<div>Item 1 name: Shoes</div>` / `<div>Item 2 name: Jacket</div>`.

#### Concatenate values in an array into a single string (`join`)

```
{{join myMergeParam ", " prefix="Start - " suffix=" - End"}}
```

`prefix` and `suffix` are optional.

#### Check for an item (`#ifContains`)

```
{{#ifContains shoppingCartItems '{"productName":"chips"}'}}
   {{#ifContains shoppingCartItems '{"productName":"dip"}'}}
      <div>You have chips and dip in your cart!</div>
   {{else}}
      <div>You just have chips in your cart!</div>
   {{/ifContains}}
{{else}}
   {{#ifContains shoppingCartItems '{"productName":"dip"}'}}
      <div>You just have dip in your cart</div>
   {{else}}
      <div>You have neither chips nor dip in your cart!</div>
   {{/ifContains}}
{{/ifContains}}
```

Another example iterating over a user's `emailListIds` array to check static-list membership:

```
{{#ifContains emailListIds "1234567"}}
   {{email}} is a member of list 1234567
{{else}}
   {{email}} is not a member of list 1234567
{{/ifContains}}
```

#### Minimum value in list (`#minInList`)

```
{{#minInList shoppingCartItems "price"}}
    <div>The least expensive item in your cart is: {{price}}</div>
{{/minInList}}
```

#### Maximum value in list (`#maxInList`)

```
{{#maxInList shoppingCartItems "price"}}
    <div>The most expensive item in your cart is: {{price}}</div>
{{/maxInList}}
```

#### Size (`size`)

```
{{shoppingCartItems.size}}
```

Assuming the `shoppingCartItems` array has two items, this outputs `2`.

#### Comparing two arrays (`#eq`, `eq`, `#neq`, `neq`)

For two arrays to be considered equal, each array must have the same length and equal items, in the same order. Consider:

```
{
  "array1": [1,2,3,4,5],
  "array2": [1,2,3,4,5],
  "array3": [4,5]
}
```

Use `#eq` to output a block when two arrays are equal:

```
{{#eq array1 array2}}
    The arrays are equal
{{else}}
    The arrays are not equal
{{/eq}}
```

The `#neq` helper returns true when the two arrays are not equal. Use the non-block `eq` helper in a boolean expression:

```
{{#and (gt array1.size 2) (eq array1 array2)}}
    The arrays are equal and contain more than two items
{{else}}
    The arrays are not equal, or they don't contain more than two items.
{{/and}}
```

#### First and last items (`@first`, `@last`)

```
{{#each shoppingCartItems}}
    {{#if @first}}
        <div>The first item is {{name}}</div>
    {{/if}}
    {{#if @last}}
        <div>The last item is {{name}}</div>
    {{/if}}
{{/each}}
```

### Working with objects

#### Comparing two objects (`#eq`, `eq`, `#neq`, `neq`)

For two objects to be considered equal, each must have the exact same set of keys and values. Consider:

```
{
  "obj1": { "a": 1, "b": 2},
  "obj2": { "a": 1, "b": 2},
  "obj3": { "a": 1, "b": 3}
}
```

Use `#eq` to output a block when two objects are equal:

```
{{#eq obj1 obj2}}
    The objects are equal
{{else}}
    The objects are not equal
{{/eq}}
```

The `#neq` helper returns true when the two objects are not equal. Use the non-block `eq` helper in a boolean expression:

```
{{#and (eq obj1 obj2) (eq obj1.b 2)}}
    The objects are equal and b is 2
{{else}}
    The objects are not equal or b is not 2
{{/and}}
```

The `ne` helper works similarly, but returns true when the two objects are not equal.

### Working with dates

This section describes various helpers useful for working with dates in Handlebars. For full details, see `03-helpers-text-math-date.md` (Date and Time Helpers).

#### Date comparison (`#ifGt`, `#ifGte`, `#ifLt`, `#ifLte`)

The numeric conditionals (`#ifGt`, `#ifGte`, `#ifLt`, `#ifLte`) work with appropriately formatted dates, since the date strings can be formatted as numeric strings.

Example using `#ifGte`:

```
{{#ifGte (dateFormat signupDate format="yyyyMMddHHmmss" tz="UTC") (dateMath "now" "-1M" format="yyyyMMddHHmmss" tz="UTC")}}
    <div>signupDate is within the last month</div>
{{else}}
    <div>signupDate was before the last month</div>
{{/ifGte}}
```

Example using `#ifLt`:

```
{{#ifLt (dateFormat signupDate format="yyyyMMddHHmmss" tz="UTC") "20170630000000"}}
    <div>signupDate is before 6/30/17</div>
{{else}}
    <div>signupDate after or on 6/30/17</div>
{{/ifLt}}
```

#### Date formatting (`dateFormat`)

`dateFormat` outputs a given date in the provided format.

Usage:

```
{{dateFormat inputDate format="formatString" tz="timeZoneString"}}
```

For example:

```
{{dateFormat "2018-06-22 14:00:00 +07:00" format="yyyy-MM-dd HH:mm:ss Z" tz="America/Denver"}}
```

Parameters:

- `inputDate` (required) — A string that represents a valid date (either a string literal or a variable that contains a date string). Valid input date formats:
  - *yyyy-MM-dd* (`2000-01-01`)
  - *yyyy-MM-dd HH:mm:ss* (`2000-01-01 00:00:00`)
  - *yyyy-MM-dd HH:mm:ss ZZ* (`2000-01-01 00:00:00 -04:00`)
  - *yyyy-MM-ddTHH:mm:ss.SSSZZ* (`2000-01-01T00:00:00.000-04:00`)
  - Input formats accepted by Joda-Time's `dateOptionalTimeParser`
- `format` (optional) — The format in which to output the date. Acceptable values defined by `java.text.SimpleDateFormat`. For example, this expression outputs a given date's day of the week (as a number):

  ```
  {{dateFormat date format="u"}}
  ```

  Additional formats include `short`, `medium`, `long`, and `full`.
- `tz` (optional) — The time zone in which to output the date. For example, this expression takes a date (defined in UTC) and outputs it in New York's time zone:

  ```
  {{dateFormat "2018-01-01 00:00:00" tz="America/New_York"}}
  ```

  Alternatively, use `tz=timeZone` to select the `timeZone` defined on the user's profile (if applicable).

**NOTE:** `dateFormat` supports an alternate syntax that uses positional parameters instead of named parameters:

```
{{dateFormat inputDate formatString localeString}}
```

For example:

```
{{dateFormat "2018-06-01 00:00:00" "full" "es_ES"}}
```

When using this syntax:

- `formatString` should be specified in the same way as the `format` parameter, above.
- If `formatString` is provided, a `localeString` can also be given. This string should have format `languageCode_countryCode`, where `languageCode` is lowercase, `countryCode` is uppercase, and they are separated by an underscore. For example: `en_ES`, `de_DE`, `fr_FR`, etc.
- It is not possible to pass a `localeString` without a `formatString`.

Format variants:

- full: `{{dateFormat myDateField format="full"}}` → `Tuesday, June 19, 2017`
- long: `{{dateFormat myDateField format="long"}}` → `June 19, 2017`
- medium: `{{dateFormat myDateField format="medium"}}` → `Jun 19, 2017`
- short: `{{dateFormat myDateField format="short"}}` → `6/19/17`
- With locale: `{{dateFormat myDateField "long" "de_DE"}}` → `21. Juni 2017`
- With time zone: `{{dateFormat myDateField tz="America/Los_Angeles"}}`

#### Date math (`dateMath`)

`dateMath` takes a given date and applies date math to it, as specified by a provided mathematical expression.

Usage:

```
{{dateMath inputDate dateMathExpression format="formatString" tz="timeZoneString"}}
```

For example:

```
{{dateMath dateParameter "-5h" format="yyyy-MM-dd HH:mm:ss Z" tz="America/New_York" locale="es_ES"}}
```

Parameters:

- `inputDate` (required) — A string that represents a valid date. Valid formats include:
  - *yyyy-MM-dd HH:mm:ss Z* — for example, `2018-01-01 00:00:00 -0800`, `2018-06-22 14:00:00 +07:00`
  - *yyyy-MM-dd HH:mm:ss*
  - Input formats accepted by Joda-Time's `dateOptionalTimeParser`
  - `now` — The current time (for the time zone defined by the `tz` parameter, if available)
  - `midnight` — Midnight for the current day (for the time zone defined by the `tz` parameter, if available)
- `dateMathExpression` (required) — A string that represents the date math to apply to `inputDate`. Time units:
  - `y`: Years
  - `M`: Months
  - `w`: Weeks
  - `d`: Days
  - `h` or `H`: Hours
  - `m`: Minutes
  - `s`: Seconds

  For example:

  ```
  {{dateMath dateParameter "+1y-1M+1w-1d+1h-1m+1s"}}
  ```

  This expression starts with `dateParameter`, adds one year, subtracts one month, adds one week, subtracts one day, adds one hour, subtracts one minute, and adds one second.
- `format` (optional) — The format in which to output the date. Acceptable values are defined by `org.joda.time.format.DateTimeFormat`. For example, this expression subtracts five hours from a given date and outputs the day of the week (as a number) associated with the result:

  ```
  {{dateMath date "-5h" format="e"}}
  ```

  Additional formats include `short`, `medium`, `long`, and `full`.
- `tz` (optional) — The time zone in which to output the date. For example, this expression takes an input date (defined in UTC), subtracts one hour, and outputs the result in New York's time zone:

  ```
  {{dateMath "2018-01-01 00:00:00" "-1h" tz="America/New_York}}
  ```

  Use `tz=timeZone` to select the `timeZone` defined on the user's profile (if applicable).
- `locale` (optional) — Localizes the output to the given language/locale combination. This string should have format `languageCode_countryCode`. For example, this expression takes an input date, adds two hours, and outputs the result for locale `es_ES`:

  ```
  {{dateMath "2018-01-01 00:00:00" "+2h" format="long" locale="es_ES"}}
  ```

  Output: `1 de enero de 2018`

Calculate a date from another date:

```
{{dateMath myDateField "+1y-1M+3w-17d+7h+1m-50s"}}
```

The following example adds 30 days to the value of `signUpDate` and outputs the results as a *long*:

```
{{dateMath signUpDate "+30d" format="long"}}
```

If the value of `signUpDate` is `2022-10-10 17:47:38 +00:00`, the output will be `November 9, 2022`.

Calculate a date from now:

```
{{dateMath "now" "-24h" format="yyyyMMddHHmmss"}}
```

Calculate the number of days away from a date — you can use `dateMath` to determine how many days there are between a date from a user or event field and `now` (the current date at send time):

```
{{dateMath myDateField (now format="-y'y'+1'y'-M'M'+1'M'-d'd'+1'd'-H'H'-m'm'-s's'" tz="UTC") format="D"}}
```

**NOTE:** The value of `myDateField` must be a date that is both in the future and in the same year as `now`. If not, the output may be inaccurate. Alternatively, you can use the `#assign` method, which may give more accurate results in certain situations. When using one or both of these methods, make sure to thoroughly test and preview with user data before sending a campaign to your users.

```
{{#assign "yearDifference"}}{{math (now format="yyyy" tz="UTC") '-' (dateFormat myDateParam format="yyyy" tz="UTC")}}{{/assign}}
{{#assign "yearToDays"}}{{math yearDifference '*' 365}}{{/assign}}
{{#assign "dayDifference"}}{{math (now format="D" tz="UTC") '-' (dateFormat myDateParam format="D" tz="UTC")}}{{/assign}}
{{math dayDifference '+' yearToDays}} days
```

Calculate a person's age:

```
{{dateMath birthDateField (now format="-y'y'+1'y'-M'M'+1'M'-d'd'+1'd'-H'H'-m'm'-s's'" tz="UTC") format="yy"}}
```

#### Current date and time (`now`)

`now` outputs the current date and time in the provided format.

Usage:

```
{{now format="formatString"}}
```

For example:

```
{{now format="yyyy"}}
```

Parameters:

- `format` (optional) — The format in which to output the date. Acceptable values are defined by `java.text.SimpleDateFormat`. For example, this expression outputs the day of the week (as a number) associated with the current time:

  ```
  {{now format="u"}}
  ```

  Additional formats include `short`, `medium`, `long`, and `full`.

Examples:

- Current year: `{{now format="yyyy"}}`
- Name of the current day of the week: `{{now format="EEEE"}}`

#### Current time in epoch milliseconds (`timestamp`)

`timestamp` outputs the current time in epoch milliseconds (number of milliseconds since 1970-01-01 00:00:00 UTC).

```
{{timestamp}}
```

### Conditional and boolean logic

This section describes various conditional and boolean logic helpers supported by Handlebars. For full details, see `04-helpers-logic-loops-regex.md` (Conditional Logic Helpers).

#### True and false

Handlebars evaluates these values as false:

- `null` values
- Empty strings (`""`)
- Empty arrays (`[]`)
- The boolean value `false`
- Any number with a value of zero (`0`, `0.0`)

Other values evaluate to true.

#### If statements (`#if`)

The `#if` helper evaluates a boolean expression. When true, the helper outputs the contents of a block. This example outputs `<div>Hi active user!</div>` when `activeUser` evaluates to true; otherwise, it outputs `<div>Hi inactive user</div>`:

```
{{#if activeUser}}
    <div>Hi active user!</div>
{{else}}
    <div>Hi inactive user</div>
{{/if}}
```

`#if` can test nested conditions as demonstrated by this example, which outputs `<div>You like pets!</div>` to users whose `likeCats` or `likesDogs` user profile field is set to true:

```
{{#if likesCats}}
    <div>You like pets!</div>
{{else if likesDogs}}
    <div>You like pets!</div>
{{/if}}
```

#### And (`#and`, `and`)

`#and` is similar to `#if`, except it evaluates any number of boolean expressions. If they all evaluate to true, `#and` outputs its associated block. For example:

```
{{#and likesCats likesDogs}}
    <div>You like cats and dogs!</div>
{{else}}
    <div>There are some pets you don't like!</div>
{{/and}}
```

`#and` expressions can make use of other Handlebars helpers:

```
{{#and likesCats (gte age 18)}}
    You're an adult who likes cats!
{{else}}
    You're not an adult, or you don't like cats, or both!
{{/and}}
```

There also exists a non-block `and` helper. This example uses this helper to look for any users who like cats, or adults who like dogs:

```
{{#or likesCats (and likesDogs (gte age 18))}}
    Either you like cats or you're an adult who likes dogs!
{{/or}}
```

`and` can output a value based on its evaluation. For example:

```
{{and likesCats likesDogs likesHamsters yes="Likes all the pets" no="Does not like all the pets"}}
```

#### Or (`#or`, `or`)

`#or` is similar to `#if`, except it evaluates any number of boolean expressions. If any of those expressions evaluates to true, `#or` outputs its associated block. For example:

```
{{#or likesCats likesDogs}}
    <div>You like cats or dogs!</div>
{{else}}
    <div>You do not like cats, and you do not like dogs!</div>
{{/or}}
```

`#or` expressions can make use of other Handlebars helpers:

```
{{#or likesCats (gte age 18)}}
    You like cats, or you're an adult!
{{else}}
    You don't like cats and you're not an adult!
{{/or}}
```

There also exists a non-block `or` helper. This example uses this helper to look for any users who like cats and either like dogs or are an adult:

```
{{#and likesCats (or likesDogs (gte age 18))}}
    You like cats, and you either like dogs or you're an adult.
{{/and}}
```

`or` can output a value based on its evaluation. For example:

```
{{or likesCats likesDogs likesHamsters yes="You like at least one kind of pet" no="You are not a pet person"}}
```

#### Not (`#not`, `not`)

`#not` negates the evaluation of a boolean expression. For example, if a user profile has a `likesCats` value of `true`, this will return `The user does like cats!`:

```
{{#not likesCats}}
    The user does not like cats!
{{else}}
    The user does like cats!
{{/not}}
```

`#not` expressions can make use of other Handlebars helpers:

```
{{#not (gte age 18)}}
    You are not an adult.
{{else}}
    You are an adult!
{{/not}}
```

There also exists a non-block `not` helper. This example uses this helper to look for any users who like cats and are not adults:

```
{{#and likesCats (not (gte age 18))}}
    You like cats and you are not an adult.
{{/and}}
```

`not` can output a value based on its evaluation. For example:

```
{{not likesCats yes="You do not like cats" no="You do like cats"}}
```

#### Unless (`#unless`)

`#unless` outputs its associated block unless the boolean expression is true. This example outputs the text unless `activeUser` has a value that evaluates to true:

```
{{#unless activeUser}}
    <div>Hey inactive user, come on back!</div>
{{/unless}}
```

### Other Handlebars helpers

#### `@key` and `this`

When you store an object on a user profile, sometimes you may want to look at all of its keys and values (to output them, to find one that matches a particular criteria, etc.). To do this, you can use `@key` to reference the key, and `this` to reference the value.

For example, here's an object that contains English and Spanish translations for the same word:

```
{
   "translations": {
      "en_US": "Hello",
      "es_ES": "Hola"
   }
}
```

To search for the Spanish translation, you might use code like this:

```
{{#each translations}}
    {{#ifContainsStr @key "es"}}
        The translation for {{@key}} is {{this}}.
    {{/ifContainsStr}}
{{/each}}
```

For the above `translations` object, this Handlebars code will output:

```
The translation for es_ES is Hola.
```

This code:

- Iterates over each of the object's values (using `#each`).
- Checks the current value's `@key` for `es` (in this example, the key is either `en_US` or `es_ES`).
- If `es` is found in the `@key`, uses `{{this}}` to output the translation (`Hello` or `Hola`).

**Using `@key` and `this` with arrays:** When using `#each` to iterate over an array (instead of an object), `this` returns the item in the array, and `@key` returns the item's 0-based array index. For example, consider this array and Handlebars code:

```
{
   "favoriteColors": ["red", "blue", "green"]
}
```

```
{{#each favoriteColors}}
     Key: {{@key}}, Value: {{this}}
{{/each}}
```

For this scenario, the code will output:

```
Key: 0, Value: red
Key: 1, Value: blue
Key: 2, Value: green
```

#### Looking up a value (`#lookup`)

If you structure your data feed to resemble the example below, you can leverage the `#lookup` helper. The email body of this particular example consists of two paragraphs:

```
{{#lookup greetings language as |lang|}}{{lang.greeting_1}}{{/lookup}}
{{#lookup greetings language as |lang|}}{{lang.greeting_2}}{{/lookup}}
```

This takes the `language` value from the user's profile, and performs a lookup against the `greetings` array (in this case, matching on "en"). It then returns the values associated with `greeting_1` and `greeting_2` within that object.

**NOTE:** If using `#lookup` with the `email` field or any other field whose values contain periods ("."), you must set `resolveKey=false` in order for the lookup to succeed. For example:

```
{{#lookup greetings email resolveKey=false as |df_email|}}
```

#### Assigning a variable (`#assign`)

You can use `#assign` to set a variable that can be used at later points in a template.

```
{{#assign "myVar"}}Iterable{{/assign}}
Greetings from {{myVar}}
```

This example will output:

```
Greetings from Iterable!
```

**NOTE:** The assigned variable will be considered a string.

#### Inserting fields into snippets

You can pass fields from your template into your snippet. To do so, use this format:

```
{{snippet "snippetname" arg0=x arg1=y ...}}
```

#### Skipping/aborting a send (`sendSkip`)

You can abort (and generate a skip) at any point in a template by using `sendSkip`. Any send skips originating from this will have a reason of `SendAborted`. You can pass any additional data you want persisted with the send skip via named parameters.

For example, consider users have a field `creditAvailable`, and you want to abort the send if the user doesn't have enough credit to buy some `product` they're considering. You might do something like:

```
{{#ifLt creditAvailable product.price}}
  {{sendSkip cause="insufficient credit" creditAvailable=creditAvailable creditRequired=product.price}}
{{/ifLt}}
```

#### Removing whitespaces

When creating templates, it's important to be aware that whitespace characters such as spaces, tabs, and newlines are preserved by default in Iterable's template editors. This can cause formatting issues, especially in use cases involving URLs, deep links, or code fragments, where extra characters can break the rendered output (for example, when using Handlebars to generate a deep link for the **Open URL** input box of a push notification template).

To avoid this, add a tilde character (`~`) before and/or after each merge tag in your Handlebars code to trim unwanted whitespaces from the rendered output:

| Action | Syntax |
| --- | --- |
| Remove leading whitespace before a merge tag | `{{~tag}}` |
| Remove trailing whitespace after a merge tag | `{{tag~}}` |
| Remove both trailing and leading whitespaces from a merge tag | `{{~tag~}}` |

The following example demonstrates how to correctly trim whitespaces to prevent rendering issues:

```
{{~#if isSummerCampaign~}}https://example.com/summer-offer?user={{~userId~}}
{{~else~}}https://example.com/winter-offer?user={{~userId~}}
{{~/if~}}
```

### JSON-LD

If you are using JSON-LD in your email template, you can use normal Handlebars format to include merge parameters inside the structured data block.

## Common Personalization Use Cases

This section describes some common personalization use cases and how to write the Handlebars code to accomplish them.

### Create a CTA button with a dynamic link

It can be useful to create a CTA button that directs users to different places depending on their unique customer journey and/or preferences. To make the links in your CTAs dynamic, you can add merge tags to the CTA button code like this:

```
<a href = "{{YOUR_MERGE_TAG}}">YOUR_CTA_TEXT</a>
```

**Example:**

```
<a href = "{{shoppingCart_url}}">Shop now!</a>
```

At send time, this code displays a "Shop now!" button that links to the user's `shoppingCart_url`.

### Randomize an email subject line

You can use a Handlebars block to randomly display one of three subject line options, like this:

```
{{#ifEq (math (timestamp) '%' 3) 0}}
    Welcome to Fiterable!
{{else}}
    {{#ifEq (math (timestamp) '%' 3) 1}}
        Greetings from Fiterable!
    {{else}}
        Hi, {{firstName}}!
    {{/ifEq}}
{{/ifEq}}
```

This code displays one of three values for the subject line, depending on the send time (in seconds). Because send time will vary based on trigger time and processing time, this approach should lead to a nearly even distribution of subject line alternatives.

**NOTE:** If you want to measure differences in engagement across variations, use an experiment instead. The method described here does not record the variation used at send time.

### Display content if one of two fields contains a value

If you want to show some content based on a value that could exist in more than one user or event data field, you can use Handlebars to check both fields and display the content if the value is found in either field.

**Example:**

```
{{#ifEq (defaultIfEmpty selected_city city) "New York"}}
    I <3 New York
{{/ifEq}}
```

This code checks a user's profile to see if either the `selected_city` or `city` field is set. If `selected_city` has a value, `defaultIfEmpty` returns it; otherwise, it returns the value of `city`. This value is then compared to the string `"New York"`. If it matches, the block displays the text "I ❤️ New York". If both `selected_city` and `city` are empty (or if either is set to a value other than `New York`), no content is displayed.

### Create dynamic HTML styles

You can incorporate Handlebars code in your HTML styles to create personalized message elements like tables.

**Example:**

```
<table cellpadding="4" cellspacing="1" width="150px">
    <thead>
        <tr>
            <th scope="col" style="background-color:#000099; color:#FFFFFF">Cat Names</th>
        </tr>
    </thead>
    <tbody>
        {{#ifGt cats.size 1}}
            {{#each cats}}
                {{#ifModEq @index 2 0}}
                    <tr style="background-color:#0099CC; color:#FFFFFF">
                        <td>
                            {{name}}
                        </td>
                    </tr>
                {{else}}
                    <tr style="background-color:#FFFFFF; color:#000000">
                        <td>
                            {{name}}
                        </td>
                    </tr>
                {{/ifModEq}}
            {{/each}}
        {{else}}
            {{#ifEq cats.size 1}}
                <tr style="background-color:#FFFFFF; color:#000000">
                    <td>
                        {{cats.[0].name}}
                    </td>
                </tr>
            {{/ifEq}}
        {{/ifGt}}
    </tbody>
</table>
```

When rendered, this block displays a table of a user's cat names (as pulled from a `cats` array on their user profile) with rotating background colors.

If you need to sort an array before rendering it, or split it into grouped sections with counts, wrap `#each` inside the `sortBy` or `groupBy` block helpers.

## Generating Merge Tags with Dynamic Content Builder

Iterable's **Dynamic Content Builder** makes it easy to display different message content to each recipient based on their individual attributes and behavior — no coding required. Dynamic Content Builder's simple visual interface lets you set up complex conditional logic in just a few clicks: display a different image, text, or snippet to each audience segment, and set up fallback content to show to recipients who don't match any of your criteria. Then save your block to use it over and over again in your templates.

Prefer to create dynamic content manually? That works too. You have the option of either writing the Handlebars code yourself or letting Dynamic Content Builder generate it for you.

### Creating a dynamic content block

You can create dynamic content blocks in Email, SMS, Push, In-App, and Web App templates and snippets.

To add a dynamic content block in a message template, click the **Dynamic Content** button or drag and drop a **Dynamic Content** tile into the template. You can choose to create dynamic content manually (as described here) or to generate it from the description, in which case Nova Agent walks you through the process.

This opens the Dynamic Content Builder menu, where you can set up your criteria for displaying dynamic content in your message.

#### Define your content block criteria

Setting up a content block involves two steps. First, you'll set up an `if` statement that specifies the content to show to users who have a given set of characteristics. Then, you'll set up at least one `else if` statement that specifies alternative content to display to users who meet a different set of criteria.

For example, you might want to advertise a new adult drama to users who like dramatic programming and are at least 21 years of age. For users who are 20 or younger, you might want to display alternative content that advertises a new teen drama.

**Set up an `if` statement:** First, set up the criteria for your first audience segment. Select whether you want to display dynamic content based on a **user property** or the occurrence of an **event**. Then, select a comparator and your desired value for the property or event you selected. For example, to create a content block that will be shown to users if they've added "drama" to their Favorites list, you could set up an `if` statement with an event `addedToFavorites` that contains a value called `drama`.

**NOTE:** If you choose to display dynamic content based on the occurrence of an **event**, the event you select must be the event that triggered the message send.

Then, if you want to add more conditions to your `if` statement, click **AND** or **OR**:

- Choose **AND** to send content to users who satisfy both conditions. This is a good option to reach a pretty specific audience (fans of drama who are 21 or older).
- Choose an **OR** statement to send content to anyone 21 or older. With this approach, you might reach a broader audience who hasn't yet favorited dramatic programming.

**NOTE:** You can add up to four `AND` / `OR` clauses to each statement, and you can add multiple `AND` clauses or multiple `OR` clauses, but not both.

After choosing the criteria users must meet, select what type of content you want to display. You can choose:

- An image (maximum file size 20 MB and dimensions 1920 px width or height)
- Text (plain or formatted)
- A snippet

Not all message channels support every content option (for example, images are not supported in SMS templates). Only buttons for supported content types appear in your selected editor.

**NOTE:** You can display snippets with both the **Snippet** and **Text** options. When you select **Snippet**, only the snippet you select will be displayed. When you select **Text**, you can include a combination of text and snippets.

**Set up at least one `else if` statement:** After you've added an initial `if` statement, click **Add Variant** to set up your first `else if` statement. Then, set up the criteria for your second audience segment, following the steps outlined above. Repeat these steps until you've defined all the audience segments you want to show dynamic content to in your message block.

**NOTE:** You can add a maximum of one `if` statement and five `else if` statements in each dynamic content block.

#### (Optional) Add fallback content

Some users may not match any of the criteria you set up in your `if`/`else if` statements. To avoid displaying blank content to these users, you can add fallback content, following the steps outlined above.

### Inserting a dynamic content block

When you're finished setting up your content variants, click **Insert Handlebars**. Dynamic Content Builder generates the Handlebars code for your dynamic content block and inserts it in your template or snippet. Save the template to apply your changes, and then schedule or send the campaign when you're ready.

### Example use case

**Promote new fitness classes:** Let's say you work for a fitness company, and you want to promote different exercise classes to different audiences based on their individual workout preferences. Using Dynamic Content Builder, you can send a single message that displays the right content to each group of fitness class fans.

### Current feature limitations

There are a few limitations for the initial release of Dynamic Content Builder in September 2023:

- Dynamic Content Builder is not currently available in Iterable's Drag and Drop template editor.
- It isn't possible to create a set of Catalog items within a template.
- Data feeds are not supported in Dynamic Content Builder.
- You can't use Dynamic Content Builder to reorder content stored as arrays in user profile or event fields.
