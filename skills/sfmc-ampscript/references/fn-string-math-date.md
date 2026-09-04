# String, Math, and Date/Time Functions

Text manipulation, arithmetic, and date/time functions. Alphabetized within each family.

- **Support** line: Engagement = Marketing Cloud Engagement, Next = Marketing Cloud Next. ✅ supported · ❌ not supported.

> Several source pages describe worked examples in prose but the fenced code blocks were not captured during scraping. Those cases are annotated `> Example code not captured in source.` Do not invent code for them.

---

## String Functions

### Char()

Support: Engagement ✅ · Next ❌

Returns the character specified by an ASCII character code (extended ASCII, codes 0-255). An optional second parameter repeats the character.

Parameters:

- `characterCode` (string): Required. An ASCII character code.
- `numRepetitions` (number): The number of times to repeat the character.

Commonly used to reference unprintable characters (for example, carriage return = 13, line feed = 10) in combination with `Replace()`.

> Example code not captured in source.

### Concat()

Support: Engagement ✅ · Next ✅ (Next from Summer '26, API 67.0)

Concatenates strings of text in order; include as many values as needed. To include spaces between strings, add explicit space characters.

Parameters:

- `string1` (string): Required. A string of text.
- `string2` (string): Required. A string of text to append to `string1`.

Append additional string parameters to concatenate more values.

> Example code not captured in source.

### Format()

Support: Engagement ✅ · Next ✅ (Next from Summer '26, API 67.0)

Formats a string, date, or number using a format pattern.

Parameters:

- `input` (datetime, number, or string): Required. The value to format.
- `outputFormat` (string): Required. A format string to apply to `input`.
- `dataFormat` (string): The data format of the input — `Date` or `Number`. Always specify this for best results; otherwise the function infers the type.
- `cultureCode` (string): A culture code to apply.

Numeric format codes: `C` (Currency), `D` (Decimal), `E` (Scientific), `F` (Fixed-point), `G` (General), `N` (Number), `P` (Percent). Date formatting supports predefined and custom date formats; output varies by locale.

> Example code not captured in source.

### IndexOf()

Support: Engagement ✅ · Next ✅

Returns the position of a substring within a string.

Parameters:

- `sourceString` (string): Required. The string to analyze.
- `substring` (string): Required. The character or substring to find the position of.

> Example code not captured in source.

### Length()

Support: Engagement ✅ · Next ✅

Returns the number of characters in a string.

Parameters:

- `sourceString` (string): Required. The string to measure.

> Example code not captured in source.

### Lowercase()

Support: Engagement ✅ · Next ✅

Converts a string to lowercase.

Parameters:

- `sourceString` (string): Required. The string to convert.

> Example code not captured in source.

### ProperCase()

Support: Engagement ✅ · Next ✅

Converts a string to proper (title) case.

Parameters:

- `sourceString` (string): Required. The string to convert.

> Example code not captured in source.

### RegExMatch()

Support: Engagement ✅ · Next ❌

Extracts a substring using a regular expression.

Parameters:

- `sourceString` (string): Required. The string to search.
- `regExPattern` (string): Required. The regular expression to use.
- `returnValue` (string): Required. The name or ordinal of the matching group to return.

An optional fourth parameter accepts regex option flags (for example, case-insensitivity).

> Example code not captured in source.

### Replace()

Support: Engagement ✅ · Next ✅

Replaces occurrences of a substring with another string.

Parameters:

- `sourceString` (string): Required. The string to search.
- `searchSubstring` (string): Required. The string to locate in `sourceString`.
- `replacementSubstring` (string): Required. The string to replace `searchSubstring` with.

> Example code not captured in source.

### ReplaceList()

Support: Engagement ✅ · Next ✅

Replaces multiple search strings with a single replacement value.

Parameters:

- `sourceString` (string): Required. The string to search.
- `replacementString` (string): Required. The replacement string.
- `searchString1` (string): Required. The string to find.

Append additional search strings to replace more values with the same replacement.

> Example code not captured in source.

### StringToHex()

Support: Engagement ✅ · Next ❌

Converts a string to its hexadecimal character-code representation.

Parameters:

- `sourceString` (string): Required. The string to convert to hexadecimal.

> Example code not captured in source.

### Substring()

Support: Engagement ✅ · Next ✅

Returns a portion of a string.

Parameters:

- `sourceString` (string): Required. The string containing the substring.
- `startPosition` (number): Required. The character position to begin at. If it exceeds the string length, an empty string is returned.

An optional third parameter specifies the length of the substring to return.

> Example code not captured in source.

### Trim()

Support: Engagement ✅ · Next ✅

Removes leading and trailing whitespace from a string.

Parameters:

- `sourceString` (string): Required. The string to trim.

> Example code not captured in source.

### Uppercase()

Support: Engagement ✅ · Next ✅

Converts a string to uppercase.

Parameters:

- `sourceString` (string): Required. The string to convert.

> Example code not captured in source.

---

## Math Functions

### Add()

Support: Engagement ✅ · Next ✅

Adds two numbers.

Parameters:

- `number1` (number): Required. The first number to add.
- `number2` (number): Required. The second number to add.

> Example code not captured in source.

### Divide()

Support: Engagement ✅ · Next ✅

Divides one number by another.

Parameters:

- `dividend` (number): Required. The initial number.
- `divisor` (number): Required. The number to divide the dividend by.

> Example code not captured in source.

### Mod()

Support: Engagement ✅ · Next ✅

Returns the remainder of a division.

Parameters:

- `dividend` (number): Required. The initial number.
- `divisor` (number): Required. The number to divide the dividend by.

> Example code not captured in source.

### Multiply()

Support: Engagement ✅ · Next ✅

Multiplies two numbers.

Parameters:

- `number1` (number): Required. The first number to multiply.
- `number2` (number): Required. The second number to multiply.

> Example code not captured in source.

### Subtract()

Support: Engagement ✅ · Next ✅

Subtracts one number from another.

Parameters:

- `minuend` (number): Required. The initial number.
- `subtrahend` (number): Required. The number to subtract from the minuend.

> Example code not captured in source.

---

## Date and Time Functions

### DateAdd()

Support: Engagement ✅ · Next ✅

Adds a time value to a date.

Parameters:

- `date` (date): Required. The date to add to.
- `amountToAdd` (number): Required. The time value to add.
- `unitToAdd` (string): Required. The unit — `Y` (years), `M` (months), `D` (days), `H` (hours), `MI` (minutes).

> Example code not captured in source.

### DateDiff()

Support: Engagement ✅ · Next ✅

Returns the difference between two dates (`endDate` minus `startDate`).

Parameters:

- `startDate` (date): Required. The starting date.
- `endDate` (date): Required. The end date.
- `unitOfDifference` (string): Required. The unit — `Y`, `M`, `D`, `H`, `MI`.

> Example code not captured in source.

### DateParse()

Support: Engagement ✅ · Next ✅

Parses a string into a date value.

Parameters:

- `dateString` (string): Required. A string containing a date or timestamp.

An optional second parameter controls UTC handling.

> Example code not captured in source.

### DatePart()

Support: Engagement ✅ · Next ✅

Returns a specific part of a date.

Parameters:

- `dateString` (string): Required. A string containing a date or timestamp.
- `datePart` (string): Required. The part to extract — `Y`, `M`, `D`, `H`, `MI`.

> Example code not captured in source.

### FormatDate()

Support: Engagement ✅ · Next ✅

Formats a date value (legacy formatting function; prefer `Format()` for new work).

Parameters:

- `dateString` (string): Required. The date string to format.

Additional optional parameters control the output date pattern, time pattern, and culture code.

> Example code not captured in source.

### GetSendTime()

Support: Engagement ✅ · Next ❌

Returns the send time of the message. When previewed or used with `HttpGet()`, returns the job publish time or job start time regardless of the `boolAllSubscribers` value.

Parameters:

- `boolAllSubscribers` (boolean): The first parameter controls whether the same send time is used for all subscribers.

> Example code not captured in source.

### LocalDateToSystemDate()

Support: Engagement ✅ · Next ❌

Converts a local datetime string to system time. System time is North American Central Standard Time (UTC-6) without daylight saving adjustment; local time is the Marketing Cloud Engagement user account's configured time.

Parameters:

- `timeToConvert` (string): Required. The time string to convert.

> Example code not captured in source.

### Now()

Support: Engagement ✅ · Next ✅

Returns the current date and time.

Parameters:

- The first (optional) parameter controls whether the returned time reflects the subscriber's local time zone.

> Example code not captured in source.

### StringToDate()

Support: Engagement ✅ · Next ✅ (with differences; Next from Summer '26, API 67.0)

Converts a date string to a different format. In Engagement, returns a dateTime object that other functions can reformat. In Next, returns a string formatted with the `G` standard format (short date + long time, e.g. `5/15/2026 1:23:45 PM`); because this is a locale-formatted string, it cannot be reliably passed to functions expecting a date-time string such as `FormatDate()` — use `FormatDate()` directly for parse-then-format use cases.

Parameters:

- `dateString` (string): Required. The date or timestamp to format.

Supported input formats include: ISO 8601 timestamp (`2023-08-05T13:41:23-06:00`), ISO 8601 date (`2023-08-05`), US date/time (`8/5/2023 1:41 PM`), long-form (`5 August 2023` / `August 5, 2023`), date and time (`2023-08-05 1:41:23 PM`), and time only (`1:41 PM`). Not supported: ordinal-suffix days (`August 5th, 2023`), little-endian numeric notation (`5/8/2023`), non-English month names, non-Western-Arabic numerals, and non-Gregorian calendars.

> Example code not captured in source.

### SystemDateToLocalDate()

Support: Engagement ✅ · Next ❌

Converts a system datetime string to the current Marketing Cloud Engagement user's local time. System time is UTC-6 without daylight saving; local time is the user account's configured time.

Parameters:

- `systemTime` (string): Required. The system time value to convert to local time.

> Example code not captured in source.
