# Data Extension Functions

Retrieval, mutation, claim, filter, and rowset-builder functions for Marketing Cloud data extensions (and, where noted, Marketing Cloud Next marketing objects). Functions are grouped by purpose and alphabetized within each group.

- **Support** line: Engagement = Marketing Cloud Engagement, Next = Marketing Cloud Next. ✅ supported · ❌ not supported.
- `%%[ ... ]%%` denotes an AMPscript code block; `%%= ... =%%` denotes inline AMPscript.

> Several source pages describe worked examples in prose but the fenced code blocks were not captured during scraping. Those cases are annotated `> Example code not captured in source.` Do not invent code for them.

---

## Retrieval

### Lookup()

Support: Engagement ✅ · Next ✅

Returns the data in a specific column from a data extension (Engagement) or a marketing object (Next). Supply the column to search, the value to match, and the column to return. If the search criteria return more than one result, the first matching value is returned — so prefer unique identifiers. Available in Marketing Cloud Next from the Summer '26 release (API version 67.0).

Parameters:

- `dataObject` (string): Required. The data object containing the data to look up. In Engagement, the data extension name. In Next, the API Name of a marketing object.
- `returnColumn` (string): Required. The name of the column to return data from.
- `searchColumn1` (string): Required. The name of the column to search. Case-sensitive.
- `searchValue1` (string): Required. The value that identifies the rows to retrieve. Case-sensitive.

You can optionally append additional search column/value pairs. In Next, an odd number of search arguments returns an error, and all filter keys must fully specify the composite primary key of the target marketing object.

> Example code not captured in source.

See also: LookupOrderedRows(), LookupOrderedRowsCS(), LookupRows(), LookupRowsCS().

### LookupRows()

Support: Engagement ✅ · Next ❌

Returns an unordered rowset from a data extension (up to 2,000 rows). Case-insensitive.

Parameters:

- `dataExt` (string): Required. The name of the data extension that contains the data to retrieve.
- `searchColumn1` (string): Required. The name of the column to search. Case-insensitive.
- `searchValue1` (string): Required. The value in the specified column that identifies the rows to retrieve. Case-insensitive.

You can optionally append additional search column/value pairs.

> Example code not captured in source.

See also: LookupRowsCS(), LookupOrderedRows(), LookupOrderedRowsCS().

### LookupRowsCS()

Support: Engagement ✅ · Next ❌

Case-sensitive version of LookupRows(). Returns an unordered rowset from a data extension.

Parameters:

- `dataExt` (string): Required. The name of the data extension that contains the data to retrieve.
- `searchColumn1` (string): Required. The name of the column to search. Case-sensitive.
- `searchValue1` (string): Required. The value in the specified column that identifies the rows to retrieve. Case-sensitive.

> Example code not captured in source.

### LookupOrderedRows()

Support: Engagement ✅ · Next ❌

Returns a limited, ordered rowset from a data extension. Case-insensitive.

Parameters:

- `dataExt` (string): Required. The name of the data extension that contains the data to retrieve.
- `numRows` (number): Required. The number of rows to return. A value less than 1 returns all rows, up to 2,000.
- `sortColumn` (string): Required. The column to sort by, followed by a space and `ASC` or `DESC`. Case-insensitive. Separate multiple columns with commas, e.g. `"LastName ASC, FirstName ASC"`.
- `searchColumn1` (string): Required. The name of the column to search. Case-insensitive.
- `searchValue1` (string): Required. The value that identifies the rows to retrieve. Case-insensitive.

> Example code not captured in source.

### LookupOrderedRowsCS()

Support: Engagement ✅ · Next ❌

Case-sensitive version of LookupOrderedRows().

Parameters:

- `dataExt` (string): Required. The name of the data extension that contains the data to retrieve.
- `numRows` (number): Required. The number of rows to return. A value less than 1 returns all rows, up to 2,000.
- `sortColumn` (string): Required. The column to sort by, followed by a space and `ASC` or `DESC`. Case-sensitive. Separate multiple columns with commas.
- `searchColumn1` (string): Required. The name of the column to search. Case-sensitive.
- `searchValue1` (string): Required. The value that identifies the rows to retrieve. Case-sensitive.

> Example code not captured in source.

### Row()

Support: Engagement ✅ · Next ✅

Returns a specific row from a rowset, array, or object.

Parameters:

- `rowset` (string): Required. The rowset, array, or object to return a row from.
- `rowPosition` (string): Required. The row number to return. The first row is row 1.

> Example code not captured in source.

### RowCount()

Support: Engagement ✅ · Next ✅

Returns the number of rows in a rowset or array.

Parameters:

- `rowset` (string): Required. The rowset or array to find the number of rows for.

> Example code not captured in source.

### Field()

Support: Engagement ✅ · Next ✅

Returns a specific field from a data row (Engagement) or record (Next).

Parameters:

- `row` (string): Required. The row object that contains the field to return.
- `fieldName` (string): Required. The name of the field to return from the row.

An optional third parameter controls whether the function raises an error when the field is missing.

> Example code not captured in source.

---

## Claim (Coupon / Unique-Row Allocation)

### ClaimRow()

Support: Engagement ✅ · Next ❌

Claims an available row from a data extension so it becomes unavailable to other subscribers (commonly used to allocate unique coupon codes).

Parameters:

- `dataExt` (string): Required. The data extension containing the value to return. Must be hard-coded; passing a variable returns an exception.
- `claimColumn` (string): Required. The column used to track whether a row is claimed. Must be configured a specific way in the data extension.
- `claimantColumn` (string): Required. The column used to track the subscriber who claimed the row.
- `claimantValue` (string): Required. The value written to `claimantColumn` when a row is claimed.

> Example code not captured in source.

### ClaimRowValue()

Support: Engagement ✅ · Next ❌

Claims a row and returns the value of a specified column, with a fallback when no unclaimed rows remain.

Parameters:

- `dataExt` (string): Required. The data extension containing the value to return. Must be hard-coded.
- `returnValueColumn` (string): Required. The column whose value the function returns.
- `claimColumn` (string): Required. The column used to track whether a row is claimed.
- `valueIfClaimed` (string): Required. A fallback value returned when there are no unclaimed rows.
- `claimantColumn` (string): Required. The column used to track the claiming subscriber.
- `claimantValue` (string): Required. The value written to `claimantColumn` when a row is claimed.

> Example code not captured in source.

---

## Mutation

### InsertData()

Support: Engagement ✅ · Next ❌

Inserts a row into a data extension and returns the identity of the inserted row where applicable.

Parameters:

- `dataExt` (string): Required. The name of the data extension to insert into.
- `columnName1` (string): Required. The name of the column to insert into.
- `valueToInsert1` (string): Required. The value to insert into the specified column.

Append additional column/value pairs to populate more columns.

> Example code not captured in source.

### InsertDE()

Support: Engagement ✅ · Next ❌

Inserts a row into a data extension (no return value). Parameters match InsertData().

Parameters:

- `dataExt` (string): Required. The name of the data extension to insert into.
- `columnName1` (string): Required. The name of the column to insert into.
- `valueToInsert1` (string): Required. The value to insert into the specified column.

> Example code not captured in source.

### UpdateData()

Support: Engagement ✅ · Next ❌

Updates rows in a data extension and returns the number of rows updated.

Parameters:

- `dataExt` (string): Required. The data extension containing the data to update.
- `columnValuePairs` (number): Required. The number of search column/value pairs to match against.
- `searchColumnName1` (string): Required. A column to search for the data to update.
- `searchValue1` (string): Required. The value determining which row(s) to update.
- `columnToUpdate1` (string): Required. The column to update.
- `updatedValue1` (string): Required. The data to write to the specified column.

Append additional search and update pairs. If the number of search pairs does not equal the number of update pairs, only the update columns matched by search pairs are applied.

> Example code not captured in source.

### UpdateDE()

Support: Engagement ✅ · Next ❌

Updates rows in a data extension (no return value). Parameters match UpdateData().

Parameters:

- `dataExt` (string): Required. The data extension containing the data to update.
- `columnValuePairs` (number): Required. The number of search column/value pairs to match against.
- `searchColumnName1` (string): Required. The column to search.
- `searchValue1` (string): Required. The value determining which row(s) to update.
- `columnToUpdate1` (string): Required. The column to update.
- `updatedValue1` (string): Required. The data to write to the specified column.

> Example code not captured in source.

### UpsertData()

Support: Engagement ✅ · Next ❌

Inserts a row, or updates it if a matching row already exists, and returns the number of rows affected.

Parameters:

- `dataExt` (string): Required. The data extension to update or insert into.
- `columnValuePairs` (number): Required. The number of search column/value pairs to match against.
- `searchColumnName` (string): Required. The column to search for the row to update or insert.
- `searchValue` (string): Required. The value determining which row to update or insert.
- `columnToUpsert` (string): Required. The column to update or insert into.
- `upsertedValue` (string): Required. The value to update or insert.

Append additional search and upsert pairs. If the number of search pairs does not equal the number of upsert pairs, only the upsert columns matched by search pairs are applied.

> Example code not captured in source.

### UpsertDE()

Support: Engagement ✅ · Next ❌

Inserts or updates a row in a data extension (no return value). Parameters match UpsertData().

Parameters:

- `dataExt` (string): Required. The data extension to update or insert into.
- `columnValuePairs` (number): Required. The number of search column/value pairs to match against.
- `searchColumnName1` (string): Required. The column to search.
- `searchValue1` (string): Required. The value determining which row to update or insert.
- `columnToUpsert1` (string): Required. The column to update or insert into.
- `upsertedValue1` (string): Required. The value to update or insert.

> Example code not captured in source.

### DeleteData()

Support: Engagement ✅ · Next ❌

Deletes rows from a data extension and returns the number of rows deleted.

Parameters:

- `dataExt` (string): Required. The data extension containing the data to delete.
- `columnName1` (string): Required. The column to search for the data to delete.
- `valueToDelete1` (string): Required. The value determining which row(s) to delete.

Append additional column/value pairs to narrow the match.

> Example code not captured in source.

### DeleteDE()

Support: Engagement ✅ · Next ❌

Deletes rows from a data extension (no return value). Parameters match DeleteData().

Parameters:

- `dataExt` (string): Required. The data extension containing the data to delete.
- `columnName1` (string): Required. The column to search.
- `valueToDelete1` (string): Required. The value determining which row(s) to delete.

> Example code not captured in source.

### DataExtensionRowCount()

Support: Engagement ✅ · Next ❌

Returns the total number of rows in a data extension.

Parameters:

- `dataExtensionName` (string): Required. The name of the data extension to count rows for.

> Example code not captured in source.

---

## Data Filters

### ExecuteFilter()

Support: Engagement ✅ · Next ❌

Returns the rows that match a saved data filter (data-extension-based filters only).

Parameters:

- `dataFilterExternalId` (string): Required. The external ID of the data filter to execute.

> Example code not captured in source.

### ExecuteFilterOrderedRows()

Support: Engagement ✅ · Next ❌

Returns an ordered, limited set of rows matching a saved data filter (data-extension-based filters only).

Parameters:

- `dataFilterExternalId` (string): Required. The external ID of the data filter to execute.
- `numRows` (number): Required. The number of rows to return. `0` returns all results (no maximum).
- `sortColumn` (string): Required. The column to sort by, followed by a space and `ASC` or `DESC`.

> Example code not captured in source.

---

## Rowset Builders

### BuildRowSetFromJson()

Support: Engagement ✅ · Next ✅

Builds a rowset by parsing JSON with a JSONPath expression. Use `RowCount()` to detect empty results and provide a fallback.

Parameters:

- `jsonData` (string): Required. The JSON data to parse.
- `jsonPathExpression` (string): Required. The JSONPath expression that parses the source data.
- `boolReturnEmptyOnError` (boolean): Required. If `false`, returns an empty rowset on a syntax error; if `true`, returns an exception on error.

> Example code not captured in source.

### BuildRowSetFromString()

Support: Engagement ✅ · Next ❌

Creates a single-column rowset by splitting a string at a delimiter. Because the single column is unnamed, refer to it by ordinal number within functions.

Parameters:

- `sourceData` (string): Required. The string containing the data to load into a rowset.
- `delimiter` (string): Required. The delimiter character (such as a comma).

> Example code not captured in source.

### BuildRowSetFromXml()

Support: Engagement ✅ · Next ❌

Loads XML data into a rowset using an XPath expression. Executes at send time for outgoing messages and at load time for CloudPages. Certain node types (CDATA, comments, document/document-fragment/document-type nodes, entities, entity references, notation, processing instructions, whitespace, XML declarations) do not return a value; a column is provided for each attribute found on any node.

Parameters:

- `xmlData` (string): Required. The XML data to parse.
- `xpathExpression` (string): Required. The XPath expression that parses the source data.
- `boolReturnEmptyOnError` (boolean): Required. If `false`, returns an empty rowset on a syntax error; if `true`, returns an exception on error.

> Example code not captured in source.
