# AMPscript Function Index

Navigation surface for the full Salesforce Marketing Cloud AMPscript function library, grouped by family. Support columns indicate platform availability:

- **Engagement** = Marketing Cloud Engagement
- **Next** = Marketing Cloud Next
- ✅ supported · ❌ not supported

For full signatures, parameters, and worked examples, see the family reference files:

- String / Math / Date functions → `references/fn-string-math-date.md`
- Data Extension functions → `references/fn-data-extension.md`
- Utility / Content / Sites / Impression functions → `references/fn-utility-content.md`
- HTTP / Encryption & Hashing functions → `references/fn-http-crypto.md`
- Integration & niche families (API, Contact, SMS/MMS, Social, MSCRM, Sales/Service Cloud, personalization & system strings) → `references/fn-integrations-appendix.md`
- Language concepts, variables, loops, conditionals → `references/language-guide.md`

---

## String Functions

| Function | Description | Engagement | Next |
| --- | --- | --- | --- |
| Char() | Returns a character from its ASCII/decimal code. | ✅ | ❌ |
| Concat() | Concatenates two or more strings. | ✅ | ✅ |
| Format() | Formats a value using a format pattern. | ✅ | ✅ |
| IndexOf() | Returns the position of a substring within a string. | ✅ | ✅ |
| Length() | Returns the number of characters in a string. | ✅ | ✅ |
| Lowercase() | Converts a string to lowercase. | ✅ | ✅ |
| ProperCase() | Converts a string to proper (title) case. | ✅ | ✅ |
| RegExMatch() | Extracts a substring using a regular expression. | ✅ | ❌ |
| Replace() | Replaces occurrences of a substring with another. | ✅ | ✅ |
| ReplaceList() | Replaces multiple substrings with a single value. | ✅ | ✅ |
| StringToHex() | Converts a string to its hexadecimal representation. | ✅ | ❌ |
| Substring() | Returns a portion of a string. | ✅ | ✅ |
| Trim() | Removes leading and trailing whitespace. | ✅ | ✅ |
| Uppercase() | Converts a string to uppercase. | ✅ | ✅ |

## Math Functions

| Function | Description | Engagement | Next |
| --- | --- | --- | --- |
| Add() | Adds two numbers. | ✅ | ✅ |
| Divide() | Divides one number by another. | ✅ | ✅ |
| Mod() | Returns the remainder of a division. | ✅ | ✅ |
| Multiply() | Multiplies two numbers. | ✅ | ✅ |
| Subtract() | Subtracts one number from another. | ✅ | ✅ |

## Date and Time Functions

| Function | Description | Engagement | Next |
| --- | --- | --- | --- |
| DateAdd() | Adds an interval to a date. | ✅ | ✅ |
| DateDiff() | Returns the difference between two dates. | ✅ | ✅ |
| DateParse() | Parses a string into a date value. | ✅ | ✅ |
| DatePart() | Returns a specific part of a date. | ✅ | ✅ |
| FormatDate() | Formats a date value (legacy). | ✅ | ✅ |
| GetSendTime() | Returns the send time of the message. | ✅ | ❌ |
| LocalDateToSystemDate() | Converts a local date to system (CST) time. | ✅ | ❌ |
| Now() | Returns the current date and time. | ✅ | ✅ |
| StringToDate() | Converts a string to a date. | ✅ | ✅ |
| SystemDateToLocalDate() | Converts a system (CST) date to local time. | ✅ | ❌ |

---

## Data Extension Functions

| Function | Description | Engagement | Next |
| --- | --- | --- | --- |
| ClaimRow() | Claims an available row from a data extension. | ✅ | ❌ |
| ClaimRowValue() | Claims a row and returns a specified column value. | ✅ | ❌ |
| DataExtensionRowCount() | Returns the number of rows in a data extension. | ✅ | ❌ |
| DeleteData() | Deletes rows from a data extension (variadic). | ✅ | ❌ |
| DeleteDE() | Deletes rows from a data extension (rowset). | ✅ | ❌ |
| ExecuteFilter() | Returns rows matching a saved filter. | ✅ | ❌ |
| ExecuteFilterOrderedRows() | Returns ordered rows matching a saved filter. | ✅ | ❌ |
| Field() | Returns the value of a column from a row. | ✅ | ✅ |
| InsertData() | Inserts a row into a data extension (variadic). | ✅ | ❌ |
| InsertDE() | Inserts a row into a data extension. | ✅ | ❌ |
| Lookup() | Returns a single column value from the first matching row. | ✅ | ✅ |
| LookupOrderedRows() | Returns a limited, ordered rowset. | ✅ | ❌ |
| LookupOrderedRowsCS() | Case-sensitive LookupOrderedRows(). | ✅ | ❌ |
| LookupRows() | Returns an unordered rowset (case-insensitive). | ✅ | ❌ |
| LookupRowsCS() | Case-sensitive LookupRows(). | ✅ | ❌ |
| Row() | Returns a specific row from a rowset. | ✅ | ✅ |
| RowCount() | Returns the number of rows in a rowset. | ✅ | ✅ |
| UpdateData() | Updates rows in a data extension (variadic). | ✅ | ❌ |
| UpdateDE() | Updates rows in a data extension. | ✅ | ❌ |
| UpsertData() | Inserts or updates rows in a data extension (variadic). | ✅ | ❌ |
| UpsertDE() | Inserts or updates rows in a data extension. | ✅ | ❌ |

## Rowset Builder Functions

| Function | Description | Engagement | Next |
| --- | --- | --- | --- |
| BuildRowSetFromJson() | Builds a rowset from JSON data using JSONPath. | ✅ | ✅ |
| BuildRowSetFromString() | Builds a single-column rowset from a delimited string. | ✅ | ❌ |
| BuildRowSetFromXml() | Builds a rowset from XML data using XPath. | ✅ | ❌ |

---

## Utility Functions

| Function | Description | Engagement | Next |
| --- | --- | --- | --- |
| AttributeValue() | Returns the value of an attribute/personalization string. | ✅ | ❌ |
| Domain() | Returns the domain portion of an email address. | ✅ | ❌ |
| Empty() | Returns true when a value is empty. | ✅ | ✅ |
| FormatCurrency() | Formats a number as localized currency. | ✅ | ✅ |
| FormatNumber() | Formats a number using a format pattern. | ✅ | ✅ |
| Guid() | Returns a globally unique identifier. | ✅ | ❌ |
| Iif() | Inline if: returns one of two values based on a condition. | ✅ | ✅ |
| IsEmailAddress() | Returns true when a value is a valid email address. | ✅ | ❌ |
| IsNull() | Returns true when a value is null. | ✅ | ✅ |
| IsPhoneNumber() | Returns true when a value is a valid phone number. | ✅ | ❌ |
| Output() | Outputs the result of a function. | ✅ | ✅ |
| OutputLine() | Outputs the result of a function followed by a newline. | ✅ | ✅ |
| RaiseError() | Halts processing and raises a send-time error. | ✅ | ✅ |
| Random() | Returns a random number in a range. | ✅ | ✅ |
| v() | Outputs the value of a variable inline. | ✅ | ✅ |

## Content Functions

| Function | Description | Engagement | Next |
| --- | --- | --- | --- |
| AttachFile() | Attaches a file to an email. | ✅ | ❌ |
| BarcodeUrl() | Returns a URL that renders a barcode image. | ✅ | ❌ |
| BeginImpressionRegion() | Marks the start of an impression tracking region. | ✅ | ❌ |
| BuildOptionList() | Builds an HTML option list. | ✅ | ❌ |
| ContentArea() | Retrieves a content area by ID (legacy). | ✅ | ❌ |
| ContentAreaByName() | Retrieves a content area by name (legacy). | ✅ | ❌ |
| ContentBlockById() | Retrieves a content block by ID. | ✅ | ✅ |
| ContentBlockByKey() | Retrieves a content block by customer key. | ✅ | ✅ |
| ContentBlockByName() | Retrieves a content block by name/path. | ✅ | ✅ |
| EndImpressionRegion() | Marks the end of an impression tracking region. | ✅ | ❌ |
| GetPortfolioItem() | Retrieves an item from the portfolio. | ✅ | ❌ |
| Image() | Returns an image tag/URL. | ✅ | ❌ |
| ImageById() | Retrieves a portfolio image by ID. | ✅ | ❌ |
| ImageByKey() | Retrieves a portfolio image by customer key. | ✅ | ❌ |
| TransformXml() | Transforms XML using XSLT. | ✅ | ❌ |
| TreatAsContent() | Evaluates a string as AMPscript content. | ✅ | ❌ |
| TreatAsContentArea() | Evaluates a string as a content area. | ✅ | ❌ |
| WAT() / WATP() | Web analytics tracking helper functions. | ✅ | ❌ |

---

## Sites and URLs Functions

| Function | Description | Engagement | Next |
| --- | --- | --- | --- |
| AuthenticatedEmployeeId() | Returns the authenticated employee ID. | ✅ | ❌ |
| AuthenticatedEmployeeNotificationAddress() | Returns the employee notification address. | ✅ | ❌ |
| AuthenticatedEmployeeUserName() | Returns the authenticated employee username. | ✅ | ❌ |
| AuthenticatedEnterpriseID() | Returns the authenticated enterprise ID. | ✅ | ❌ |
| AuthenticatedMemberID() | Returns the authenticated member ID. | ✅ | ❌ |
| AuthenticatedMemberName() | Returns the authenticated member name. | ✅ | ❌ |
| CloudPagesURL() | Returns the URL of a CloudPage. | ✅ | ❌ |
| IsNullDefault() | Returns a default value when input is null. | ✅ | ❌ |
| LiveContentMicrositeURL() | Returns a Live Content microsite URL. | ✅ | ❌ |
| MicrositeURL() | Returns a microsite/landing page URL. | ✅ | ❌ |
| QueryParameter() | Returns a query string parameter value. | ✅ | ❌ |
| Redirect() | Returns a tracked redirect URL. | ✅ | ❌ |
| RequestParameter() | Returns an HTTP request parameter value. | ✅ | ❌ |

## HTTP Functions

| Function | Description | Engagement | Next |
| --- | --- | --- | --- |
| HttpGet() | Retrieves content from a URL via GET. | ✅ | ❌ |
| HttpPost() | Posts content to a URL. | ✅ | ❌ |
| HttpPost2() | Posts content to a URL with extended options. | ✅ | ❌ |
| HTTPPostWithRetry() | Posts content with automatic retry. | ✅ | ❌ |
| HttpRequestHeader() | Retrieves the value of a request header from the incoming HTTP request. | ✅ | ❌ |
| IsCHTMLBrowser() | Returns true for a CHTML (mobile) browser. | ✅ | ❌ |
| RedirectTo() | Redirects the browser to a URL. | ✅ | ❌ |
| UrlEncode() | URL-encodes a string. | ✅ | ❌ |
| WrapLongURL() | Wraps a long URL for tracking. | ✅ | ❌ |

## Encryption and Hashing Functions

| Function | Description | Engagement | Next |
| --- | --- | --- | --- |
| Base64Decode() | Decodes a Base64-encoded string. | ✅ | ❌ |
| DecryptSymmetric() | Decrypts a symmetrically encrypted value. | ✅ | ❌ |
| EncryptSymmetric() | Symmetrically encrypts a value. | ✅ | ❌ |
| GetJWT() | Returns a signed JSON Web Token. | ✅ | ❌ |
| GetJWTByKeyName() | Returns a signed JWT using a named key. | ✅ | ❌ |
| MD5() | Returns the MD5 hash of a value. | ✅ | ❌ |
| SHA1() | Returns the SHA-1 hash of a value. | ✅ | ❌ |
| SHA256() | Returns the SHA-256 hash of a value. | ✅ | ❌ |
| SHA512() | Returns the SHA-512 hash of a value. | ✅ | ❌ |

---

## API Functions

| Function | Description | Engagement | Next |
| --- | --- | --- | --- |
| AddObjectArrayItem() | Adds an item to an object array property. | ✅ | ❌ |
| CreateObject() | Creates an API object instance. | ✅ | ❌ |
| InvokeCreate() | Invokes a create operation on an API object. | ✅ | ❌ |
| InvokeDelete() | Invokes a delete operation on an API object. | ✅ | ❌ |
| InvokeExecute() | Invokes an execute operation on an API object. | ✅ | ❌ |
| InvokePerform() | Invokes a perform operation on an API object. | ✅ | ❌ |
| InvokeRetrieve() | Invokes a retrieve operation on an API object. | ✅ | ❌ |
| InvokeUpdate() | Invokes an update operation on an API object. | ✅ | ❌ |
| SetObjectProperty() | Sets a property on an API object. | ✅ | ❌ |

## Contact Functions

| Function | Description | Engagement | Next |
| --- | --- | --- | --- |
| UpsertContact() | Inserts or updates a contact record. | ✅ | ❌ |

## SMS, MMS, and Social Functions

| Function | Description | Engagement | Next |
| --- | --- | --- | --- |
| CreateSmsConversation() | Starts an SMS conversation. | ✅ | ❌ |
| EndSmsConversation() | Ends an SMS conversation. | ✅ | ❌ |
| SetSmsConversationNextKeyword() | Sets the next expected SMS keyword. | ✅ | ❌ |
| Msg() | Returns the body of an MO message. | ✅ | ❌ |
| Noun() | Returns a positional word after the keyword in an MO message. | ✅ | ❌ |
| Nouns() | Returns all words after the keyword in an MO message. | ✅ | ❌ |
| Verb() | Returns the keyword from an MO message. | ✅ | ❌ |
| MMS_Content_URL() | Returns the URL of MMS content. | ✅ | ❌ |
| GetPublishedSocialContent() | Returns published social content. | ✅ | ❌ |
| GetSocialPublishUrl() | Returns a social publish URL by ID. | ✅ | ❌ |
| GetSocialPublishUrlByName() | Returns a social publish URL by name. | ✅ | ❌ |

## Microsoft Dynamics CRM (MSCRM) Functions

| Function | Description | Engagement | Next |
| --- | --- | --- | --- |
| AddMscrmListMember() | Adds a member to an MSCRM marketing list. | ✅ | ❌ |
| CreateMscrmRecord() | Creates an MSCRM record. | ✅ | ❌ |
| DescribeMscrmEntities() | Describes available MSCRM entities. | ✅ | ❌ |
| DescribeMscrmEntityAttributes() | Describes attributes of an MSCRM entity. | ✅ | ❌ |
| RetrieveMscrmRecords() | Retrieves MSCRM records. | ✅ | ❌ |
| RetrieveMscrmRecordsFetchXml() | Retrieves MSCRM records using FetchXML. | ✅ | ❌ |
| SetStateMscrmRecord() | Sets the state of an MSCRM record. | ✅ | ❌ |
| UpdateMscrmRecords() | Updates MSCRM records. | ✅ | ❌ |
| UpsertMscrmRecord() | Inserts or updates an MSCRM record. | ✅ | ❌ |

## Sales and Service Cloud Functions

| Function | Description | Engagement | Next |
| --- | --- | --- | --- |
| CreateSalesforceObject() | Creates a Sales/Service Cloud object. | ✅ | ❌ |
| LongSfid() | Converts a 15-character Salesforce ID to 18 characters. | ✅ | ❌ |
| RetrieveSalesforceJobSources() | Retrieves Salesforce job sources. | ✅ | ❌ |
| RetrieveSalesforceObjects() | Retrieves Sales/Service Cloud objects. | ✅ | ✅ |
| UpdateSingleSalesforceObject() | Updates a single Sales/Service Cloud object. | ✅ | ❌ |

---

## Personalization and System Strings

Recipient, sender, and system date/time personalization strings are documented in `references/fn-integrations-appendix.md`. These include recipient attributes (for example `_firstname`, `_lastname`, `_emailaddr`, `_mobileNumber`), sender attributes (for example `memberid`, `replyname`, `replyemailaddress`), and system date/time strings (`xtmonth`, `xtday`, `xtyear`, `xtshortdate`, `xtlongdate`).
