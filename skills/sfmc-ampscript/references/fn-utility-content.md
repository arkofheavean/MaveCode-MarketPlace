# Utility, Content, Sites/URLs, and Impression Functions

Utility helpers, content retrieval, site/URL generation, and impression-tracking functions. Alphabetized within each group.

- **Support** line: Engagement = Marketing Cloud Engagement, Next = Marketing Cloud Next. ✅ supported · ❌ not supported.

> Several source pages describe worked examples in prose but the fenced code blocks were not captured during scraping. Those cases are annotated `> Example code not captured in source.` Do not invent code for them.

---

## Utility Functions

### AttributeValue()

Support: Engagement ✅ · Next ❌

Returns the value of an attribute or personalization string by name.

Parameters:

- `attribute` (string): Required. The name of the attribute to return the value of.

> Example code not captured in source.

### Domain()

Support: Engagement ✅ · Next ❌

Returns the domain portion of an email address. Returns `null` if the input has no `@` sign or is a non-string value. Examples: `Domain("salesforce@example.com")` → `example.com`; `Domain("salesforceexamplecom")` → `null`; `Domain(123)` → `null`.

Parameters:

- `emailAddress` (string): Required. An email address.

### Empty()

Support: Engagement ✅ · Next ✅ (Next from Summer '26, API 67.0)

Returns `true` if a variable is an empty string or null; otherwise `false`. In Engagement the parameter can be a variable, string literal, or number; in Next it must refer to a variable or the function errors. Often combined with `If` statements or `Iif()`.

Parameters:

- `variable` (string): Required. The variable to test.

> Example code not captured in source.

### FormatCurrency()

Support: Engagement ✅ · Next ✅

Formats a number as localized currency. Assumes a period as the decimal separator; when the input is a string, commas are treated as thousands separators.

Parameters:

- `number` (string or number): Required. The number to format.
- `cultureCode` (string): Required. The locale code (POSIX `es_MX` or BCP 47 `es-MX`).
- `decimalPlaces` (number): The number of decimal places (default 2). Required if `currencySymbol` is specified.
- `currencySymbol` (string): A currency symbol that overrides the locale default.

> Example code not captured in source.

### FormatNumber()

Support: Engagement ✅ · Next ✅

Formats a number using a format type/pattern. Assumes a period as the decimal separator.

Parameters:

- `number` (string or number): Required. The number to format.
- `formatType` (string): Required. The number type/pattern to convert to.

An optional third parameter specifies the culture code.

> Example code not captured in source.

### Guid()

Support: Engagement ✅ · Next ❌

Returns a globally unique identifier (GUID). Accepts no parameters.

> Example code not captured in source.

### Iif()

Support: Engagement ✅ · Next ✅ (Next from Summer '26, API 67.0)

Inline if: tests a condition and returns one of two values. The condition can be any function or expression returning `true`/`false`.

Parameters:

- `condition` (string): Required. The condition to test.
- `valueIfTrue` (string): Required. The value to return if the condition is true.
- `valueIfFalse` (string): Required. The value to return if the condition is false.

> Example code not captured in source.

### IsEmailAddress()

Support: Engagement ✅ · Next ❌

Returns `true` when a value is a valid email address.

Parameters:

- `emailAddress` (string): Required. An email address.

> Example code not captured in source.

### IsNull()

Support: Engagement ✅ · Next ✅ (Next from Summer '26, API 67.0)

Returns `true` when a value is null; otherwise `false`. Unlike `Empty()`, `IsNull()` does not return `true` for an empty string.

Parameters:

- `valueToTest` (string): Required. A variable or function to test for a null value.

> Example code not captured in source.

### IsPhoneNumber()

Support: Engagement ✅ · Next ❌

Returns `true` when a value is a valid phone number.

Parameters:

- `phoneNumber` (string): Required. The value to test.

> Example code not captured in source.

### Output()

Support: Engagement ✅ · Next ✅

Outputs the result of a function within a code block.

Parameters:

- `value` (AMPscript function): Required. The function that produces the results to output.

> Example code not captured in source.

### OutputLine()

Support: Engagement ✅ · Next ✅

Outputs the result of a function followed by a newline.

Parameters:

- `value` (AMPscript function): Required. The function that produces the results to output.

> Example code not captured in source.

### RaiseError()

Support: Engagement ✅ · Next ✅

Halts processing and raises a send-time error, optionally preserving data-extension writes and skipping the subscriber.

Parameters:

- `errorMessage` (string): Required. The error message to display.
- `boolSkipSubscriber` (boolean): Whether to skip the current subscriber.
- `boolPreserveDataExt` (boolean): If `true`, retains information written to data extensions before the error even if the subscriber is skipped; if `false`, discards it. Applies to inserts, updates, upserts, and deletes performed with AMPscript.

> Example code not captured in source.

### Random()

Support: Engagement ✅ · Next ✅ (Next from Summer '26, API 67.0)

Returns a random number in a range (inclusive of both bounds). Bounds can be positive or negative integers or decimals; parameter order does not matter.

Parameters:

- `lowerBound` (number): Required. The smallest number the function can return.
- `upperBound` (number): Required. The largest number the function can return.

> Example code not captured in source.

### v()

Support: Engagement ✅ · Next ✅

Outputs the value of a variable inline (within inline AMPscript).

Parameters:

- `variableName` (string): Required. The variable to output the value of.

> Example code not captured in source.

---

## Content Functions

### AttachFile()

Support: Engagement ✅ · Next ❌

Attaches a file to an email from HTTP, FTP, or Content Builder.

Parameters:

- `fileLocationType` (string): Required. The location type — `http`, `ftp`, or `contentbuilder`.
- `fileLocation` (string): Required. The location to pull the file from (max 2088 chars). For `http`, a URL; for `ftp`, a file name in the Import folder of Enhanced FTP; for `contentbuilder`, the external key of the file.
- `attachmentFileName` (string): The name for the attached file; defaults to the original name (or HTTP Content-Disposition / an auto-generated value for `http`).
- `boolViewOnWeb` (boolean): If `true`, includes a link to the file in "View as a Web Page" (only when the first parameter is `http`).
- `viewOnWebLocation` (string): The URL to link to in the "View as a Web Page" context (required when `boolViewOnWeb` is true; `http` only).
- `viewOnWebFileName` (string): The file name for the "View as a Web Page" link (`http` only).
- `viewOnWebDuration` (number): The number of days the link appears (`http` only).

> Example code not captured in source.

### BarcodeUrl()

Support: Engagement ✅ · Next ❌

Returns a URL that renders a barcode image.

Parameters:

- `valueToConvert` (string): Required. The value to convert into a barcode.
- `barcodeType` (string): Required. The barcode type to create (see supported barcode types).
- `width` (number): Required. The barcode width in pixels.
- `height` (number): Required. The barcode height in pixels.

> Example code not captured in source.

### BuildOptionList()

Support: Engagement ✅ · Next ❌

Builds an HTML `<option>` list, marking a default selection.

Parameters:

- `defaultSelection` (string or number): Required. The option selected by default.
- `option1Value` (string): Required. The `value` for the first `<option>` tag.
- `option1Text` (string): Required. The display text for the option.

Append additional value/text pairs for more options.

> Example code not captured in source.

### ContentArea()

Support: Engagement ✅ · Next ❌

Retrieves a content area by ID (Classic Content; legacy).

Parameters:

- `contentAreaId` (string or number): Required. The ID of the content area to retrieve.

Additional optional parameters cover impression region name, default content, and analytics flags.

> Example code not captured in source.

### ContentAreaByName()

Support: Engagement ✅ · Next ❌

Retrieves a content area by name (Classic Content; legacy).

Parameters:

- `contentAreaName` (string): Required. The name of the content area to retrieve.

Additional optional parameters cover impression region name, default content, and analytics flags.

> Example code not captured in source.

### ContentBlockById()

Support: Engagement ✅ · Next ✅

Retrieves a Content Builder content block by ID.

Parameters:

- `contentBlockId` (number): Required. The ID of the content block to retrieve.

Additional optional parameters cover impression region name, default content, and analytics flags.

> Example code not captured in source.

### ContentBlockByKey()

Support: Engagement ✅ · Next ✅

Retrieves a Content Builder content block by customer key.

Parameters:

- `contentBlockKey` (string): Required. The key of the content block to retrieve.

Additional optional parameters cover impression region name, default content, and analytics flags.

> Example code not captured in source.

### ContentBlockByName()

Support: Engagement ✅ · Next ✅

Retrieves a Content Builder content block by full path/name.

Parameters:

- `contentBlockName` (string): Required. The full path of the content block to retrieve.

Additional optional parameters cover impression region name, default content, and analytics flags.

> Example code not captured in source.

### ContentImageById()

Support: Engagement ✅ · Next ❌

Retrieves a Content Builder image by ID with a fallback image.

Parameters:

- `imageExternalId` (string): Required. The ID of an image in Content Builder.
- `defaultImageExternalId` (string): Required. The ID of a fallback image used when the primary image is not found.

> Example code not captured in source.

### ContentImageByKey()

Support: Engagement ✅ · Next ❌

Retrieves a Content Builder image by external key with a fallback image.

Parameters:

- `imageExternalKey` (string): Required. The external key of an image in Content Builder.
- `defaultImageExternalKey` (string): Required. The external key of a fallback image used when the primary image is not found.

> Example code not captured in source.

### GetPortfolioItem()

Support: Engagement ✅ · Next ❌

Retrieves an item from the Portfolio by external key.

Parameters:

- `itemExternalKey` (string): Required. The external key of a Portfolio item.

> Example code not captured in source.

### Image()

Support: Engagement ✅ · Next ❌

Returns an image tag/URL for a Portfolio image.

Parameters:

- `imageExternalKey` (string): Required. The external key of an image in your Portfolio.

An optional second parameter controls image attributes.

> Example code not captured in source.

### TransformXML()

Support: Engagement ✅ · Next ❌

Applies an XSL transformation to XML data. Designed for Classic Content; can throw exceptions with Content Builder. Workaround: Base64-encode the XML/XSL, store as content blocks, and decode with `Base64Decode()` — but prefer `BuildRowSetFromXml()` for XML handling. Wrap the result in `TreatAsContent()` to evaluate embedded AMPscript.

Parameters:

- `xmlDocument` (string): Required. The XML data to transform.
- `xslDocument` (string): Required. The XSL document to transform the XML with.

> Example code not captured in source.

### TreatAsContent()

Support: Engagement ✅ · Next ❌

Evaluates a string as AMPscript content (for example, content retrieved dynamically that itself contains AMPscript).

Parameters:

- `stringToReturn` (string): Required. The string to return as content.

> Example code not captured in source.

### TreatAsContentArea()

Support: Engagement ✅ · Next ❌

Evaluates a string as a content area, identified by a key.

Parameters:

- `contentKey` (string): Required. The key that identifies the content. Keys are case-insensitive; text and HTML contexts are treated as distinct.
- `contentValue` (string): Required. The content stored for an email send under the key (retrievable with `HttpGet()` or `Lookup()`).

An optional third parameter provides an impression region name.

> Example code not captured in source.

### WAT() / WATP()

Support: Engagement ✅ · Next ❌

Web analytics tracking helper functions. These are listed in the AMPscript content function category but do not have dedicated reference pages in the source documentation; treat them as advanced web-analytics tracking helpers.

> Example code not captured in source.

---

## Sites and URLs Functions

### CloudPagesURL()

Support: Engagement ✅ · Next ❌

Returns the URL of a CloudPage, optionally with encrypted query parameters.

Parameters:

- `pageId` (number): Required. The page identifier of a CloudPages landing page.
- `parameterName1` (string): Required. The name of an item to include as an encrypted query parameter.
- `parameterValue1` (string): Required. The value of that item.

Append additional name/value pairs for more encrypted parameters.

> Example code not captured in source.

### IsNullDefault()

Support: Engagement ✅ · Next ❌

Provides a default value for empty Smart Capture form fields (useful when inserting form data into data extensions).

Parameters:

- `nonNullValue` (string): Required. The value to return when the form field is not null.
- `nullValue` (string): Required. The value to return when the form field is null.

> Example code not captured in source.

### LiveContentMicrositeURL()

Support: Engagement ✅ · Next ❌

Returns a Live Content microsite URL.

Parameters:

- `contentType` (string): Required. The content type. The only accepted value is `coupon`.
- `externalKey` (string): Required. The external key of the live content.

> Example code not captured in source.

### MicrositeURL()

Support: Engagement ✅ · Next ❌

Returns a microsite/landing page URL, optionally with query parameters.

Parameters:

- `pageId` (number): Required. The page identifier of a CloudPages landing page.

Append additional parameter name/value pairs for query parameters.

> Example code not captured in source.

### QueryParameter()

Support: Engagement ✅ · Next ❌

Returns a query-string parameter value from the current request.

Parameters:

- `queryParameter` (string): Required. The name of the URL query parameter to retrieve.

> Example code not captured in source.

### Redirect()

Support: Engagement ✅ · Next ❌

Redirects landing page visitors to a different URL. Place the function on a landing page; the page returns an HTTP 302 response and the visitor is automatically redirected. A common pattern is to combine it with `Concat()` to append a query parameter such as the subscriber key.

Parameters:

- `redirectUrl` (string): Required. The URL to redirect to.

> Example code not captured in source.

### RequestParameter()

Support: Engagement ✅ · Next ❌

Returns an HTTP request parameter value.

Parameters:

- `queryParameter` (string): Required. The parameter to retrieve the value of.

> Example code not captured in source.

### UrlEncode()

Support: Engagement ✅ · Next ❌

URL-encodes a string so it is safe to include in URLs.

Parameters:

- `urlToEncode` (string): Required. The string to convert to a URL-safe format.

Additional optional parameters control encoding of reserved characters.

> Example code not captured in source.

---

## Impression Region Functions

### BeginImpressionRegion()

Support: Engagement ✅ · Next ❌

Marks the start of an impression-tracking region.

Parameters:

- `regionName` (string): Required. The name to assign to the impression region.

> Example code not captured in source.

### EndImpressionRegion()

Support: Engagement ✅ · Next ❌

Marks the end of an impression-tracking region.

Parameters:

- `regionName` (string): Required. The name of the impression region to close.

> Example code not captured in source.
