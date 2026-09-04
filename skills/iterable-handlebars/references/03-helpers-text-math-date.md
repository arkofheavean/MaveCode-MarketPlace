# Helpers: Text, Math, Date & Time

This reference folds three Iterable Handlebars helper families:

- **Text Helpers** — measure, compare, transform, and format strings.
- **Math Helpers** — format and calculate numbers.
- **Date and Time Helpers** — compare, format, and calculate dates and times.

Examples use standalone Handlebars syntax with double quotes around literal strings. If you place the full Handlebars expression inside HTML or JSON that already uses double quotes, use single quotes for the inner string literals instead (see the syntax notes in `instructions.md`).

## Text Helpers

You can use text helpers to measure, compare, and transform strings.

### length

Returns the number of characters in a string.

#### Properties

`string` — The string whose length you want to measure.

#### Format

```
{{length string}}
```

#### Example

| Code | Example `firstName` value | Output |
| --- | --- | --- |
| Example length helper | Alethea | 7 |

### eq

Checks to see if two strings are equal. If they are, the associated content is displayed. Otherwise, the content is not displayed.

#### Properties

`string1` — The first string you want to compare.
`string2` — The second string you want to compare.
`content` — The content you want to display if the strings are equal.

#### Format

```
{{#eq string1 string2}}
    content
{{/eq}}
```

#### Example

| Code | Example `favoriteColor` value | Output |
| --- | --- | --- |
| Example eq helper | blue | Blue is a great color! |

### lt

Checks to see if the first string is less than (alphabetically before) the second string. If it is, the associated content is displayed. Otherwise, the content is not displayed.

#### Properties

`string1` — The first string you want to compare.
`string2` — The second string you want to compare.
`content` — The content you want to display if the first string is less than the second string.

#### Format

```
{{#lt string1 string2}}
    content
{{/lt}}
```

#### Example

| Code | Example `lastName` value | Output |
| --- | --- | --- |
| Example lt helper | Adams | You're near the front of the list! |

### gt

Checks to see if the first string is greater than (alphabetically after) the second string. If it is, the associated content is displayed. Otherwise, the content is not displayed.

#### Properties

`string1` — The first string you want to compare.
`string2` — The second string you want to compare.
`content` — The content you want to display if the first string is greater than the second string.

#### Format

```
{{#gt string1 string2}}
    content
{{/gt}}
```

#### Example

| Code | Example `lastName` value | Output |
| --- | --- | --- |
| Example gt helper | Zimmerman | You're near the back of the list! |

### capitalizeFirst

Capitalizes the first letter of a string.

#### Properties

`string` — The string whose first letter you want to capitalize.

#### Format

```
{{capitalizeFirst string}}
```

#### Example

| Code | Example `firstName` value | Output |
| --- | --- | --- |
| Example capitalizeFirst helper | alethea | Alethea |

### capitalize

Capitalizes the first letter of each word in a string.

#### Properties

`string` — The string whose words you want to capitalize.

#### Format

```
{{capitalize string}}
```

#### Example

| Code | Example `fullName` value | Output |
| --- | --- | --- |
| Example capitalize helper | alethea jones | Alethea Jones |

### upper

Converts all characters in a string to uppercase.

#### Properties

`string` — The string you want to convert to uppercase.

#### Format

```
{{upper string}}
```

#### Example

| Code | Example `firstName` value | Output |
| --- | --- | --- |
| Example upper helper | alethea | ALETHEA |

### lower

Converts all characters in a string to lowercase.

#### Properties

`string` — The string you want to convert to lowercase.

#### Format

```
{{lower string}}
```

#### Example

| Code | Example `firstName` value | Output |
| --- | --- | --- |
| Example lower helper | ALETHEA | alethea |

### cut

Removes the specified characters from a string.

#### Properties

`string` — The string you want to modify.
`characters` — The characters you want to remove from the string.

#### Format

```
{{cut string "characters"}}
```

#### Example

| Code | Example `phone` value | Output |
| --- | --- | --- |
| Example cut helper | 555-123-4567 | 5551234567 |

### replace

Replaces all instances of a substring within a string with another substring.

#### Properties

`string` — The string you want to modify.
`substring1` — The substring you want to replace.
`substring2` — The substring you want to replace it with.

#### Format

```
{{replace string "substring1" "substring2"}}
```

#### Example

| Code | Example `phone` value | Output |
| --- | --- | --- |
| Example replace helper | 555-123-4567 | 555.123.4567 |

### abbreviate

Truncates a string to the specified length, adding an ellipsis (…) if the string is longer than the specified length.

#### Properties

`string` — The string you want to truncate.
`length` — The maximum length of the string (including the ellipsis).

#### Format

```
{{abbreviate string length}}
```

#### Example

| Code | Example `description` value | Output |
| --- | --- | --- |
| Example abbreviate helper | The quick brown fox | The quick… |

### center

Centers a string within a field of the specified width, padding it with spaces.

#### Properties

`string` — The string you want to center.
`width` — The width of the field in which to center the string.

#### Format

```
{{center string width}}
```

#### Example

| Code | Example `firstName` value | Output |
| --- | --- | --- |
| Example center helper | Alethea | (spaces) Alethea (spaces) |

### slugify

Converts a string to a URL-friendly slug (lowercase, with spaces and special characters replaced by hyphens).

#### Properties

`string` — The string you want to convert to a slug.

#### Format

```
{{slugify string}}
```

#### Example

| Code | Example `title` value | Output |
| --- | --- | --- |
| Example slugify helper | My Great Article! | my-great-article |

### #breaklines

Converts newline characters in a string to HTML `<br>` tags.

#### Properties

`string` — The string whose newlines you want to convert.

#### Format

```
{{#breaklines}}{{string}}{{/breaklines}}
```

#### Example

| Code | Example `address` value | Output |
| --- | --- | --- |
| Example breaklines helper | 123 Main St\nAnytown | 123 Main St&lt;br&gt;Anytown |

### substring

Returns a portion of a string between the specified start and end indexes.

#### Properties

`string` — The string you want to extract a portion of.
`start` — The index at which to start the extraction (inclusive).
`end` — The index at which to end the extraction (exclusive).

#### Format

```
{{substring string start end}}
```

#### Example

| Code | Example `firstName` value | Output |
| --- | --- | --- |
| Example substring helper | Alethea | Ale |

## Math Helpers

You can use math helpers to format and calculate numbers.

### numberFormat

Formats a number according to the specified options (currency, percent, fractional digits, rounding, grouping, or a custom pattern).

#### Format a number as currency

Use the `currency` option to format a number as a currency value.

##### Properties

`number` — The number you want to format.
`currency` — The ISO 4217 currency code (for example, `USD`, `EUR`, `GBP`) you want to use.

##### Format

```
{{numberFormat number currency="currencyCode"}}
```

##### Example

| Code | Example `price` value | Output |
| --- | --- | --- |
| Example currency numberFormat helper | 1234.5 | $1,234.50 |

#### Format a number as a percentage

Use the `percent` option to format a number as a percentage.

##### Properties

`number` — The number you want to format.

##### Format

```
{{numberFormat number style="percent"}}
```

##### Example

| Code | Example `rate` value | Output |
| --- | --- | --- |
| Example percent numberFormat helper | 0.25 | 25% |

#### Set the maximum number of fractional digits

Use the `maximumFractionDigits` option to set the maximum number of digits after the decimal point.

##### Properties

`number` — The number you want to format.
`maximumFractionDigits` — The maximum number of digits to display after the decimal point.

##### Format

```
{{numberFormat number maximumFractionDigits=digits}}
```

##### Example

| Code | Example `value` value | Output |
| --- | --- | --- |
| Example maximumFractionDigits helper | 3.14159 | 3.14 |

#### Set the minimum number of fractional digits

Use the `minimumFractionDigits` option to set the minimum number of digits after the decimal point.

##### Properties

`number` — The number you want to format.
`minimumFractionDigits` — The minimum number of digits to display after the decimal point.

##### Format

```
{{numberFormat number minimumFractionDigits=digits}}
```

##### Example

| Code | Example `value` value | Output |
| --- | --- | --- |
| Example minimumFractionDigits helper | 3.1 | 3.100 |

#### Set the rounding mode

Use the `roundingMode` option to specify how numbers are rounded. Supported modes include `up`, `ceiling`, `down`, `floor`, `half_even`, `half_up`, and `half_down`.

##### Properties

`number` — The number you want to format.
`roundingMode` — The rounding mode you want to use.

##### Format

```
{{numberFormat number roundingMode="mode" maximumFractionDigits=digits}}
```

##### Example

| Code | Example `value` value | Rounding mode | Output |
| --- | --- | --- | --- |
| Example roundingMode helper | 2.5 | up | 3 |
| Example roundingMode helper | 2.5 | down | 2 |
| Example roundingMode helper | 2.5 | half_even | 2 |

#### Control digit grouping

Use the `groupingUsed` option to control whether digit grouping (thousands separators) is used.

##### Properties

`number` — The number you want to format.
`groupingUsed` — `true` to use digit grouping, `false` to disable it.

##### Format

```
{{numberFormat number groupingUsed=false}}
```

##### Example

| Code | Example `value` value | Output |
| --- | --- | --- |
| Example groupingUsed helper | 1234567 | 1234567 |

#### Use a custom pattern

Use the `pattern` option to format a number according to a custom decimal pattern.

##### Properties

`number` — The number you want to format.
`pattern` — The custom decimal pattern you want to use.

##### Format

```
{{numberFormat number pattern="pattern"}}
```

##### Example

| Code | Example `value` value | Output |
| --- | --- | --- |
| Example pattern numberFormat helper | 1234.5 | 1,234.50 |

### math

Performs a mathematical operation on two numbers. Supported operations are add (`+`), subtract (`-`), multiply (`*`), divide (`/`), and modulo (`%`).

#### Properties

`number1` — The first operand.
`operation` — The operation to perform (`+`, `-`, `*`, `/`, or `%`).
`number2` — The second operand.

#### Format

```
{{math number1 "operation" number2}}
```

#### Example

| Code | Operation | Output |
| --- | --- | --- |
| Example math add helper | 5 + 3 | 8 |
| Example math subtract helper | 5 - 3 | 2 |
| Example math multiply helper | 5 * 3 | 15 |
| Example math divide helper | 6 / 3 | 2 |
| Example math modulo helper | 5 % 3 | 2 |

### eq (numeric)

Checks to see if two numbers are equal. If they are, the associated content is displayed. Otherwise, the content is not displayed.

#### Properties

`number1` — The first number you want to compare.
`number2` — The second number you want to compare.
`yes` — The content to display if the numbers are equal.
`no` — The content to display if the numbers are not equal.

#### Format

```
{{eq number1 number2 yes="yesContent" no="noContent"}}
```

#### Example

| Code | Example values | Output |
| --- | --- | --- |
| Example numeric eq helper | 5, 5 | yesContent |

### gt (numeric)

Checks to see if the first number is greater than the second number.

#### Properties

`number1` — The first number you want to compare.
`number2` — The second number you want to compare.
`yes` — The content to display if the first number is greater.
`no` — The content to display if the first number is not greater.

#### Format

```
{{gt number1 number2 yes="yesContent" no="noContent"}}
```

#### Example

| Code | Example values | Output |
| --- | --- | --- |
| Example numeric gt helper | 5, 3 | yesContent |

### gte (numeric)

Checks to see if the first number is greater than or equal to the second number.

#### Properties

`number1` — The first number you want to compare.
`number2` — The second number you want to compare.
`yes` — The content to display if the first number is greater than or equal.
`no` — The content to display otherwise.

#### Format

```
{{gte number1 number2 yes="yesContent" no="noContent"}}
```

#### Example

| Code | Example values | Output |
| --- | --- | --- |
| Example numeric gte helper | 5, 5 | yesContent |

### lt (numeric)

Checks to see if the first number is less than the second number.

#### Properties

`number1` — The first number you want to compare.
`number2` — The second number you want to compare.
`yes` — The content to display if the first number is less.
`no` — The content to display otherwise.

#### Format

```
{{lt number1 number2 yes="yesContent" no="noContent"}}
```

#### Example

| Code | Example values | Output |
| --- | --- | --- |
| Example numeric lt helper | 3, 5 | yesContent |

### lte (numeric)

Checks to see if the first number is less than or equal to the second number.

#### Properties

`number1` — The first number you want to compare.
`number2` — The second number you want to compare.
`yes` — The content to display if the first number is less than or equal.
`no` — The content to display otherwise.

#### Format

```
{{lte number1 number2 yes="yesContent" no="noContent"}}
```

#### Example

| Code | Example values | Output |
| --- | --- | --- |
| Example numeric lte helper | 5, 5 | yesContent |

## Date and Time Helpers

You can use date and time helpers to compare and modify numeric strings that are formatted as dates and times.

### Comparing dates

The `#ifGte`, `#ifGt`, `#ifLte`, and `#ifLt` helpers are generally used to compare numbers, but you can use them to compare dates if you format the dates as numbers (no hyphens, spaces, or slashes). To do this, use the `dateFormat` helper to format the values of date fields as numeric strings (for example, `yyyyMMddHHmmss`).

#### Check if a date is on or after another date

The `#ifGte` helper checks to see if a date is greater than or equal to the value of another date. If it is, the associated content is displayed. Otherwise, the content is not displayed.

##### Properties

`fieldName1` — The name of the user or event data field containing the date you want to compare to another.
`fieldName2` — The name of the user or event data field containing the date you want to compare the first date to.
`content` — The content you want to display if the first date is greater than (i.e., more recent) or equal to the second date.

> **Note:** Instead of `fieldName2`, you could use the `dateMath` helper to compare `fieldName1` to a relative date (for example, to check if the date in `fieldName1` occurred within the past month).

##### Format

```
{{#ifGte fieldName1 fieldName2}}
    <div>content</div>
{{/ifGte}}
```

##### Example

| Code | Example `trialStartDate` value | Output |
| --- | --- | --- |
| Example ifGte helper | 2025-02-12 | Your Fiterable free trial has ended |

#### Check if a date is after another date

The `#ifGt` helper checks to see if a date is greater than the value of another date. If it is, the associated content is displayed. Otherwise, the content is not displayed.

##### Properties

`fieldName1` — The name of the user or event data field containing the date you want to compare to another.
`fieldName2` — The name of the user or event data field containing the date you want to compare the first date to.
`content` — The content you want to display if the first date is greater than (i.e., more recent) the second date.

> **Note:** Instead of `fieldName2`, you could use the `dateMath` helper to compare `fieldName1` to a relative date (for example, to check if the date in `fieldName1` occurred within the past month).

##### Format

```
{{#ifGt fieldName1 fieldName2}}
    <div>content</div>
{{/ifGt}}
```

##### Example

| Code | Example `trialStartDate` value | Output |
| --- | --- | --- |
| Example ifGt helper | 2025-02-12 | Your Fiterable free trial has ended |

#### Check if a date is on or before another date

The `#ifLte` helper checks to see if a date is less than or equal to the value of another date. If it is, the associated content is displayed. Otherwise, the content is not displayed.

##### Properties

`fieldName1` — The name of the user or event data field containing the date you want to compare to another.
`fieldName2` — The name of the user or event data field containing the date you want to compare the first date to.
`content` — The content you want to display if the first date is less than (i.e., less recent) or equal to the second date.

> **Note:** Instead of `fieldName2`, you could use the `dateMath` helper to compare `fieldName1` to a relative date (for example, to check if the date in `fieldName1` occurred within the past month).

##### Format

```
{{#ifLte fieldName1 fieldName2}}
    <div>content</div>
{{/ifLte}}
```

##### Example

| Code | Example `signupDate` value | Output |
| --- | --- | --- |
| Example ifLte helper | 2025-02-12 | signupDate was before June 30, 2025 |

#### Check if a date is before another date

The `#ifLt` helper checks to see if a date is less than the value of another date. If it is, the associated content is displayed. Otherwise, the content is not displayed.

##### Properties

`fieldName1` — The name of the user or event data field containing the date you want to compare to another.
`fieldName2` — The name of the user or event data field containing the date you want to compare the first date to.
`content` — The content you want to display if the first date is less than (i.e., less recent) the second date.

> **Note:** Instead of `fieldName2`, you could use the `dateMath` helper to compare `fieldName1` to a relative date (for example, to check if the date in `fieldName1` occurred within the past month).

##### Format

```
{{#ifLt fieldName1 fieldName2}}
    <div>content</div>
{{/ifLt}}
```

##### Example

| Code | Example `signupDate` value | Output |
| --- | --- | --- |
| Example ifLt helper | 2025-02-12 | signupDate was before June 30, 2025 |

### Formatting dates

The `dateFormat` Handlebars helper outputs a given date in the specified format. There are several options you can specify for displaying dates in different formats.

#### Display the full alphanumeric date (with day of the week)

Use the `format="full"` option to display the full, unabbreviated date, including the day of the week.

##### Properties

`fieldName` — The name of the user or event data field containing the date you want to format.

##### Format

```
{{dateFormat fieldName format="full"}}
```

##### Example

| Code | Example `signupDate` value | Output |
| --- | --- | --- |
| Example full dateFormat helper | 2025-02-12 | Wednesday, February 12, 2025 |

#### Display the full alphanumeric date (without day of the week)

Use the `format="long"` option to display the full, unabbreviated date without the day of the week.

##### Properties

`fieldName` — The name of the user or event data field containing the date you want to format.

##### Format

```
{{dateFormat fieldName format="long"}}
```

##### Example

| Code | Example `signupDate` value | Output |
| --- | --- | --- |
| Example full dateFormat helper | 2025-02-12 | February 12, 2025 |

#### Display the abbreviated alphanumeric date

Use the `format="medium"` option to display the abbreviated alphanumeric date without the day of the week.

##### Properties

`fieldName` — The name of the user or event data field containing the date you want to format.

##### Format

```
{{dateFormat fieldName format="medium"}}
```

##### Example

| Code | Example `signupDate` value | Output |
| --- | --- | --- |
| Example medium dateFormat helper | 2025-02-12 | Feb 12, 2025 |

#### Display the numeric date

Use the `format="short"` option to display the date in numeric DD/MM/YY format.

##### Properties

`fieldName` — The name of the user or event data field containing the date you want to format.

##### Format

```
{{dateFormat fieldName format="short"}}
```

##### Example

| Code | Example `signupDate` value | Output |
| --- | --- | --- |
| Example short dateFormat helper | 2025-02-12 | 02/12/25 |

> **Note:** This helper formats dates according to the American convention (listing the day of the week before the month). To change this, specify a locale code that corresponds to your preferred date convention.

#### Display a date according to a locale

Specify a locale code along with your preferred formatting option (`full`/`long`/`medium`/`short`) to display the date according to the norms of a region/language. This rearranges the order of day/month/year as needed, translates month names to the associated language, and adds the appropriate punctuation.

##### Properties

`fieldName` — The name of the user or event data field containing the date you want to format.
`format` — The formatting option (`full`/`long`/`medium`/`short`) you want to use to format the date.
`locale` — The locale code you want to use to format the date.

##### Format

```
{{dateFormat fieldName "format" "locale"}}
```

##### Example

| Code | Example `signupDate` value | Output |
| --- | --- | --- |
| Example locale dateFormat helper | 2025-02-12 | 12. Februar 2025 |

#### Display the date according to a time zone

Specify a time zone to display a date based on a time zone. This can be helpful if you have customers in different regions and time zones around the world and want to display dates and times correctly for each user.

> **Note:** The `tz` option of the `dateFormat` helper does *not* translate or rearrange dates according to the associated regional/language conventions for a time zone. To do this, include the `locale` helper.

##### Properties

`fieldName1` — The name of the user or event data field containing the date you want to format.
`fieldName2` — The name of the user or event data field containing the time zone you want to use to format your date. (Alternatively, you can include a TZ time zone code instead of referencing the value of a field.)

##### Format

```
{{dateFormat fieldName1 tz="fieldName2"}}
```

##### Example

| Code | Example `signupDate` value | Output |
| --- | --- | --- |
| Example tz dateFormat helper | 2018-01-01 00:00:00 | Dec 31, 2017 |

### Calculating dates

The `dateMath` helper uses a mathematical expression to calculate a new date before or after a specified date. Input date values must be in ISO 8601 format.

#### Calculate a date from another date

You can use the `dateMath` helper to add or subtract some period of time from an input date and display the resulting date. The `dateMath` helper supports the following mathematical operations:

- `-` — Subtract
- `+` — Add
- `/` — Round

To learn more about adding, subtracting, multiplying, and dividing by date and time values, see the Math Helpers reference above and "Using Relative Dates in Segments and Journeys."

##### Properties

`inputDate` — The name of the user or event data field containing the date value you wish to calculate another date from (alternatively, this property can be a literal string value). For guidance on when to use single or double quotes, see the syntax notes in `instructions.md`.
`dateCalculation` — The amount of time you wish to add or subtract from your input date.

##### Format

```
{{dateMath (inputDate "dateCalculation")}}
```

##### Example

| Code | Example `signupDate` value | Output |
| --- | --- | --- |
| dateMath helper example | 2025-01-01 00:00:00 | Jan 8, 2025 |

#### Calculate a date from now

You can use `dateMath` to add or subtract a certain amount of time from `now` (the current moment at send time).

##### Properties

`now` — The current moment in time, which functions as the input date.
`dateCalculation` — The amount of time you wish to add or subtract from the current date/time.

##### Format

```
{{dateMath "now" "dateCalculation"}}
```

##### Example

| Code | Example `signupDate` value | Output |
| --- | --- | --- |
| dateMath now helper example | 2025-04-04 | Apr 3, 2025 |

#### Calculate the number of days away from a date

You can use the `dateMath` helper to determine how many days there are between a date from a user or event data field and `now` (the current date at send time).

```
{{dateMath myDateField (now format="-y'y'+1'y'-M'M'+1'M'-d'd'+1'd'-H'H'-m'm'-s's'" tz="UTC") format="D"}}
```

#### Calculate a person's age

```
{{dateMath fieldName (now format="-y'y'+1'y'-M'M'+1'M'-d'd'+1'd'-H'H'-m'm'-s's'" tz="UTC") format="yy"}}
```

#### Display the current date and time

`now` displays the current date and time. By default, `now` displays the date in "medium" format (for example, "Apr 7, 2025"), but you can change this by specifying a different formatting option (see Formatting dates above).

##### Format

```
{{now format="formatString"}}
```

For example:

```
{{now format="yyyy"}}
```

#### Display the current year

```
{{now format="yyyy"}}
```

#### Display the current day of the week

```
{{now format="EEEE"}}
```

#### Display the current time

`timestamp` displays the current time in epoch milliseconds (the number of milliseconds since 1970-01-01 00:00:00 UTC).

##### Format

```
{{timestamp}}
```

##### Example

| Code | Example current time value | Output |
| --- | --- | --- |
| timestamp example | Tuesday, April 8, 2025 5:11:00.210 PM | 1744132260210 |

### Time units reference

When working with dates and times using Handlebars, you can use the following date and time units to specify your preferred formatting and display options.

| Code | Meaning | Output | Examples |
| --- | --- | --- | --- |
| y, yy, yyyy | Year | Number | 2025, 25, 2025 |
| M, MM, MMM, MMMM | Month | Number/Text | 4, 04, Apr, April |
| d, dd | Day of month | Number | 8, 08 |
| D, DD, DDD | Day of year | Number | 98 |
| e | Day of week (Monday = 1) | Number | 2 |
| E, EEEE | Day of week | Text | Tue, Tuesday |
| a | Halfday of day | Text | PM |
| w | Week of year | Number | 27 |
| h | Clock hour of halfday (1-12) | Number | 12 |
| H | Hour of day (0-23) | Number | 0 |
| k | Clock hour of day (1-24) | Number | 16 |
| K | Hour of halfday (0-11) | Number | 4 |
| m | Minute of hour | Number | 30 |
| s | Second of minute | Number | 55 |
| S | Milliseconds | Number | 978 |
| z | Time zone | Text | Pacific Standard Time, PST |
| Z | Time zone offset/ID | Number/Text | -0800, -08:00, America/Los_Angeles |
| C | Century | Number | 20 |
| G | Era | Text | AD |
| now | Current date/time (standard) | Text/number | Apr 8, 2025 |
| timestamp | Current UNIX time | Number | 1744310391343 |
