# Helpers: Conditional Logic, Looping & Regular Expressions

This reference folds three Iterable Handlebars helper families:

- **Conditional Logic Helpers** — display (or hide) content depending on whether conditions are met.
- **Looping Over Objects and Arrays** — reference and display data stored in objects and arrays.
- **Regular Expressions** — match string fields against regex patterns with `#ifMatchesRegexStr`.

When these helpers use literal strings, the examples show standalone Handlebars syntax with double quotes. If you place the full Handlebars expression inside HTML or JSON that already uses double quotes, use single quotes for the inner string literal instead (see the syntax notes in `instructions.md`).

## Conditional Logic Helpers

You can use conditional logic helpers to display (or not display) content depending on whether certain conditions are met.

### Display a fallback value if a field is empty

The `defaultIfEmpty` helper checks whether a field is undefined or empty, then displays a specified fallback value if it is.

#### Properties

`fieldName` — The name of the user or event field that you want to check.
`fallbackContent` — The content you want to display if `fieldName` is empty or missing on a user's profile.

#### Format

```
{{defaultIfEmpty fieldName "fallbackContent"}}
```

If this helper is used inside a double-quoted HTML attribute or JSON value, switch the fallback string to single quotes:

```
<img src="{{defaultIfEmpty fieldName 'https://cdn.example.com/fallback.png'}}">
```

#### Example

| Code | Example `firstName` value | Output |
| --- | --- | --- |
| Example defaultIfEmpty helper |  | Hi there |

### Display content if text is found within a string

The `#ifContainsStr` block helper searches a string for a substring and if the substring is found, renders the block's content.

> **Note:** If a merge tag using the `#ifContainsStr` helper references an empty or missing field, the template fails, and the message will not be sent to that user.

#### Properties

`string` — The name of the field containing the string you want to search.
`substring` — The name of the substring you want to search for within the first string.
`content` — The content that should be displayed if the substring is found within the first string.

#### Format

```
{{#ifContainsStr string "substring"}}
    <div>content</div>
{{/ifContainsStr}}
```

#### Example

| Code | Example `favoriteFoods` value | Output |
| --- | --- | --- |
| Example #ifContainsStr helper | blueberry scone | It's blueberry season! |

### Display content if the value of a field is `true`

The `if` helper checks to see if the value of a field is `true`. If it is, the helper displays the contents of the block. If the value of the field is `false`, the helper displays either nothing or, if an `else` block is included, some alternative content.

#### Properties

`fieldName` — The name of the field whose `true`/`false` value you want to check.
`content` — The content that should be displayed if the value of `fieldName` is `true`.
(Optional) `alternateContent` — The content that should be displayed if the value of `fieldName` is `false`.

#### Format

```
{{#if fieldName}}
    <div>content</div>
{{else}}
    <div>alternateContent</div>
{{/if}}
```

#### Example

| Code | Example `activeUser` value | Output |
| --- | --- | --- |
| Example #if helper | false | We miss you! |

### Display content if the values of multiple fields are `true`

The `and` helper checks to see if the values of multiple fields are `true`. If they are, the helper displays the contents of the block. If one or more values of the fields is `false`, the helper displays either nothing or, if an `else` block is included, some alternative content.

#### Properties

`fieldName1` — The name of the first field whose `true`/`false` value you want to check.
`fieldName2` — The name of the second field whose `true`/`false` value you want to check.
`...` — The names of the third, fourth, fifth (etc.) fields whose `true`/`false` values you want to check. (You can add as many fields as you like.)
`content` — The content Iterable should display if the values of all the fields are `true`.
`alternateContent` (optional) — The content Iterable should display if the value of any of the fields is `false`.

#### Format

```
{{#and fieldName1 fieldName2 ...}}
    <div>content</div>
{{else}}
    <div>alternateContent</div>
{{/and}}
```

#### Example

| Code | Example `optedIn` value | Example `completedSurvey` value | Output |
| --- | --- | --- | --- |
| and helper example | true | true | Thanks for completing the survey! Your feedback is so valuable to us. |

### Display content if the value of any of several fields is `true`

The `or` helper checks multiple fields to see if any of the values are `true`. If at least one is, it displays the associated block of content. If none of the fields has a value of `true`, it displays the alternate content associated with `else`.

#### Properties

`fieldName1` — The name of the first field whose `true`/`false` value you want to check.
`fieldName2` — The name of the second field whose `true`/`false` value you want to check.
`...` — The names of the third, fourth, fifth (etc.) fields whose `true`/`false` values you want to check. (You can add as many fields as you like.)
`content` — The content Iterable should display if the value of any of the specified fields is `true`.
`alternateContent` — The content Iterable should display if the values of all the specified fields are `false`.

#### Format

**Standard helper:**

```
{{or fieldName1 fieldName2 ... yes="content" no="alternateContent"}}
```

**Block helper:**

```
{{#or fieldName1 fieldName2 ...}}
    <div>content</div>
{{else}}
    <div>alternateContent</div>
{{/or}}
```

#### Example

| Code | Example `likesCoffee` value | Example `likesTea` value | Output |
| --- | --- | --- | --- |
| or helper example | true | false | Craving a hot drink? |

### Display content if the value of a field is `false`

The `not` helper checks to see if the value of a field is `false`. If it is, it displays the block's content. If the value of the field is `true`, the block displays the alternate content associated with `else`.

#### Properties

`fieldName` — The name of the field whose `true`/`false` value you want to check.
`content` — The content Iterable should display if the value of the specified field is `false`.
`alternateContent` — The content Iterable should display if the value of the specified field is `true`.

#### Format

**Standard helper:**

```
{{not fieldName yes="content" no="alternateContent"}}
```

**Block helper:**

```
{{#not fieldName1 fieldName2 ...}}
    <div>content</div>
{{else}}
    <div>alternateContent</div>
{{/not}}
```

#### Example

| Code | Example `age` value | Output |
| --- | --- | --- |
| not helper example | 17 | Sorry, this sweepstakes is only open to adults 18 and over. |

### Display content unless the value of a field is `true`

The `unless` helper checks to see if the value of a field is `true`. If it is, the helper displays the contents of the block. If the value of the field is `false`, the helper displays the alternative content associated with `else`.

#### Properties

`fieldName` — The name of the field whose `true`/`false` value you want to check.
`content` — The content Iterable should display if the value of `fieldName` is `true`.

#### Format

```
{{#unless fieldName}}
    <div>content</div>
{{/unless}}
```

#### Example

| Code | Example `activeUser` value | Output |
| --- | --- | --- |
| unless helper example | false | We miss you! Come back for 10% off. |

### Display content if one value is equal to another

The `#ifEq` helper checks whether one value (numerical or text/string) is equal to another value. If the two values are equal, the associated content is displayed. If the values are not equal, the helper displays either nothing or, if an `else` block is included, some alternate content.

You can use `#ifEq` to compare values represented as strings, longs, and doubles. The two values do not need to have the same data type, but they must represent the same value for the helper to evaluate to `true`.

For example, if a `string` field contains `"100"`:

- Comparing it to `100` evaluates to `true`.
- Comparing it to `101` evaluates to `false`.

#### Properties

`value1` — The first value to compare. This can be a user/event field or a literal value.
`value2` — The second value to compare. This can be a user/event field or a literal value.
`content` — The content that should be displayed if the two values are equal.
`alternateContent` (optional) — The content that should be displayed if the two values are not equal.

#### Format

```
{{#ifEq value1 value2}}
    <div>content</div>
{{else}}
    <div>alternateContent</div>
{{/ifEq}}
```

#### Example

| Code | Example `firstName` value | Example `preferredName` value | Output |
| --- | --- | --- | --- |
| Example ifEq helper | Elizabeth | Ellie | Hi, Ellie! |

### Display content if a value is greater than another

The `#ifGt` checks whether one value is greater than another value. If the first value is greater than the second value, the associated content is displayed. If the first value is less than the second value (or the two values are equal), the helper displays either nothing or, if an `else` block is included, some alternate content.

You can use `#ifGt` to compare values represented as strings, longs, and doubles. (The values don't need to be the same data type.)

#### Properties

`fieldName1` — The name of the first user or event data field whose value you want to compare.
`fieldName2` — The name of the second user or event data field whose value you want to compare. (Alternatively, you can include a literal value here.)
`content` — The content that should be displayed if the value of `fieldName1` is greater than `fieldName2`.
`alternateContent` — The content that should be displayed if the value of `fieldName1` is less than `fieldName2`.

#### Format

```
{{#ifGt fieldName1 fieldName2}}
    <div>content</div>
{{else}}
    <div>alternateContent</div>
{{/ifGt}}
```

#### Example

| Code | Example `loyaltyPoints` value | Output |
| --- | --- | --- |
| ifGt helper example | 105 | You've reached VIP status! |

### Display content if a number is greater than or equal to another number

The `#ifGte` helper compares two numbers to see if the first number is greater than or equal to the second number. If it is, the helper displays the contents of the block. If the first number is less than the second number, it displays the alternate content associated with `else`.

You can use `#ifGte` to compare values represented as strings, longs, or doubles. (Values don't need to be the same data type.)

#### Properties

`fieldName1` — The name of the field whose value you want to compare to `#`.
`fieldName2` — The name of the second field whose value you want to compare. (Alternatively, you could enter a literal numerical value here.)
`content` — The content that should be displayed if the value of `fieldName1` is greater than or equal to `fieldName2`.
`alternateContent` — The content that should be displayed if the value of `fieldName1` is less than `fieldName2`.

#### Format

```
{{#ifGte fieldName1 fieldName2}}
    <div>content</div>
{{else}}
    <div>alternateContent</div>
{{/ifGte}}
```

#### Example

| Code | Example `age` value | Output |
| --- | --- | --- |
| ifGte helper example | 21 | Check out our new French wines! |

### Display content if one value is less than another

The `#ifLt` helper checks whether one number is less than another number. If "true", the block displays some content. If "false", no content is displayed. (Optionally, you can include an `else` block in order to display some content if the expression is "false".)

You can use `#ifLt` to compare values represented as strings, longs, and doubles. (The values don't need to be the same data type.)

#### Properties

`fieldName1` — The name of the first field whose value you want to compare.
`fieldName2` — The name of the second field whose value you want to compare. (Alternatively, you could enter a literal numerical value here.)
`content` — The content that should be displayed if the value of `fieldName1` is less than to `fieldName2`.
`alternateContent` — The content that should be displayed if the value of `fieldName1` is not less than `fieldName2`.

#### Format

```
{{#ifLt fieldName1 fieldName2}}
    <div>content</div>
{{else}}
    <div>alternateContent</div>
{{/ifLt}}
```

#### Example

| Code | Example `purchases` value | Output |
| --- | --- | --- |
| Example ifLt helper | 2 | Keep shopping to reach VIP status. |

### Display content if a value is less than or equal to another

The `#ifLte` helper compares two numbers to see if the first number is less than or equal to the second number. If it is, the helper displays the contents of the block. If the first number is greater than the second number, it displays the alternate content associated with `else`.

You can use `#ifLte` to compare values represented as strings, longs, and doubles. (The values don't need to be the same data type.)

#### Properties

`fieldName1` — The name of the first field whose value you want to compare.
`fieldName2` — The name of the second field whose value you want to compare. (Alternatively, you could enter a literal numerical value here.)
`content` — The content that should be displayed if the value of `fieldName1` is less than or equal to `fieldName2`.
`alternateContent` — The content that should be displayed if the value of `fieldName1` is not less than or equal to `fieldName2`.

#### Format

```
{{#ifLte fieldName1 fieldName2}}
    <div>content</div>
{{else}}
    <div>alternateContent</div>
{{/ifLte}}
```

#### Example

| Code | Example `age` value | Output |
| --- | --- | --- |
| Example ifLte helper | 17 | Check out this summer's coolest kids' movies! |

### Display content if the remainder of an equation is a certain value

The `#ifModEq` helper displays a block of content if the remainder of an equation is equal to a certain value.

#### Properties

`fieldName` — The name of the field whose value you want to divide by `divisor`.
`divisor` — The field containing the value you want to divide `fieldName` by. (Alternatively, you could enter a literal numerical value here.)
`#` — The remainder value you wish to check for.
`content` — The content that should be displayed if the remainder of `fieldName` divided by `divisor` is equal to `#`.

#### Format

```
{{#ifModEq fieldName divisor remainder}}
    <div>content</div>
{{/ifModEq}}
```

#### Example

| Code | Example `daysSinceLastSend` value | Output |
| --- | --- | --- |
| ifModEq helper example | 60 | New month, new featured recipe! |

### Display content if a string matches a regex pattern

The `#ifMatchesRegexStr` helper checks whether a string matches a regex pattern.

```
{{#ifMatchesRegexStr fieldName "pattern"}}
  content when matched
{{/ifMatchesRegexStr}}
```

For full syntax details, behavior notes, and common use cases, see the **Regular Expressions** section below.

## Looping Over Objects and Arrays

If you store user data in objects and arrays on user profiles, sometimes you may want to reference or display specific information from those objects or arrays in your dynamic content. Iterable supports several Handlebars helpers that let you do that.

### Working with arrays

#### Check whether two arrays are equal

The `#eq` block helper compares the size and content of two arrays. For two arrays to be considered equal, each array must have the same length and equal items, in the same order.

If the two arrays are equal, the block's content is displayed. If the two arrays are not equal, the block's content is not displayed.

> **Note:** You can also use the `eq` non-block helper to compare the size of two arrays as part of a Boolean expression.

##### Properties

`arrayName1` — The first array whose size/content you want to compare.
`arrayName2` — The second array whose size/content you want to compare.
`content` — The content you want to display if the two arrays are equal.

##### Format

```
{{#eq arrayName1 arrayName2}}
    content
{{/eq}}
```

##### Example

| Code | Example arrays | Output |
| --- | --- | --- |
| helper example | Example arrays | It's a match! |

#### Check whether two arrays are not equal

The `#neq` block helper compares the size and content of two arrays. For two arrays to be considered equal, each array must have the same length and equal items, in the same order.

If the two arrays are *not* equal, the block's content is displayed. If the two arrays are equal, the block's content is not displayed.

> **Note:** You can also use the `neq` non-block helper to compare the size of two arrays as part of a Boolean expression.

##### Properties

`arrayName1` — The first array whose size/content you want to compare.
`arrayName2` — The second array whose size/content you want to compare.
`content` — The content you want to display if the two arrays are equal.

##### Format

```
{{#neq arrayName1 arrayName2}}
    content
{{/neq}}
```

##### Example

| Code | Example arrays | Output |
| --- | --- | --- |
| helper example | Example arrays | Sorry... it's not a match. |

#### Check for an item in an array

The `#ifContains` block helper checks whether a specified word, character, or phrase exists within an array. If it does, the block's content is displayed. Otherwise, the content is not displayed.

##### Properties

`arrayName` — The name of the array that contains the value(s) you want to check for.
`fieldName` — The name of the field that contains the value(s) you want to check for within the array.
`value` — The value of the field that you're interested in.

##### Format

```
{{#ifContains arrayName `{"fieldName":"value"}`}}
<div>content</div>
{{/ifContains}}
```

##### Example

| Code | Example array | Output |
| --- | --- | --- |
| helper example | Example array | Cool shirt and jacket combo. Add some pants to complete the look! |

#### Display the size of an array

The `size` helper displays the total number of items in an array.

##### Properties

`arrayName` — The name of the array whose size you want to display.

##### Format

```
{{arrayName.size}}
```

##### Example

| Code | Example `shoppingCartItems` array | Output |
| --- | --- | --- |
| helper example | Example array | Take another look at these 3 items! |

#### Display all items in an array

The `#each` block helper lists all of the specified values in an array.

##### Properties

`arrayName` — The name of the array that contains the values you want to display.
`fieldName` — The name of a field within the array whose value you want to display.
`@index` (optional) — Displays the index value of an item in the array.

##### Format

```
{{#each arrayName}}
    <div>{{fieldName1}}</div>
    <div>{{fieldName2}}</div>
{{/each}}
```

##### Example

| Code | Example array | Output |
| --- | --- | --- |
| helper example | Example array | Item 1: shoes Price: 29.99 Item 2: shirt Price: 14.99 Item 3: jacket Price: 55.99 |

> **Note:** The syntax `{{math @index '+' 1}}` adds 1 to the index value of each item so that items are numbered "1, 2, 3..." in the output instead of "0, 1, 2...". To learn more about the different math Handlebars helpers, see the Math Helpers reference.

#### Display the first item in an array

When using `#each` to loop over an array, you can optionally include the `@first` variable to find and display the first item in the array.

##### Properties

`arrayName` — The name of the array whose first value you want to display.
`content` — The content you want to display based on the first item in the array.

##### Format

```
{{#each arrayName}}
    {{#if @first}}
        <div>content</div>
    {{/if}}
{{/each}}
```

##### Example

| Code | Example array | Output |
| --- | --- | --- |
| variable example | Example array | Nice shoes you picked out! Ready to check out? |

#### Display the last item in an array

When using `#each` to loop over an array, you can optionally include the `@last` variable to find and display the last item in the array.

##### Properties

`arrayName` — The name of the array whose last value you want to display.
`content` — The content you want to display based on the last item in the array.

##### Format

```
{{#each arrayName}}
    {{#if @last}}
        <div>content</div>
    {{/if}}
{{/each}}
```

##### Example

| Code | Example array | Output |
| --- | --- | --- |
| variable example | Example array | Nice jacket you picked out! Ready to check out? |

#### Display a specific item within an array

You can use dot notation and index values to display a specific item within an array.

##### Properties

`arrayName` — The name of the array that contains the item you want to display.
`#` — The position within the array of the item you want to display. (NOTE: The first value within an array has the index `0`.)
`fieldName` — The name of the field within the array whose value you want to display.

##### Format

```
{{arrayName.[#].fieldName}}
```

##### Example

| Code | Example object | Output |
| --- | --- | --- |
| Indexing example | Example array | jacket |

#### Sort items in an array

The `#sortBy` block helper sorts an array by one or more field values and returns the sorted array through a block parameter. Use dot notation to sort by nested fields, and separate multiple sort fields with commas. Iterable compares string, number, and date values automatically based on the data being sorted.

##### Properties

`arrayName` — The name of the array you want to sort.
`field` — The field you want to sort by. To sort by multiple fields, provide a comma-separated list such as `"price,name"`.
`order` (optional) — The sort order. Use `"asc"` for ascending order or `"desc"` for descending order. If omitted, the default is `"asc"`.
`sortedItems` — The block parameter that stores the sorted array within the helper block.

##### Format

```
{{#sortBy arrayName field="fieldName" order="asc" as |sortedItems|}}
    {{#each sortedItems}}
        <div>{{fieldName}}</div>
    {{/each}}
{{/sortBy}}
```

> **Note:** The `sortedItems` block parameter is only available inside the `#sortBy` block.

##### Example

This example sorts the `shoppingCartItems` array by `price` from lowest to highest before displaying each item.

```
{{#sortBy shoppingCartItems field="price" order="asc" as |sortedItems|}}
    {{#each sortedItems}}
        <div>{{name}}: ${{price}}</div>
    {{/each}}
{{/sortBy}}
```

When rendered, the output lists the user's cart items in price order without changing the original `shoppingCartItems` array.

#### Group items in an array

The `#groupBy` block helper groups array items that share the same field value or combination of field values, then returns those groups through a block parameter. Use dot notation to group by nested fields, and separate multiple grouping fields with commas. Each group includes a `key`, an `items` array, and a `count`.

To maintain performance, the `groupBy` block helper groups a maximum of 100 items. When an array has more than 100 items, only the first 100 are included in the grouped array. Items beyond the first 100 are not included in the grouped output.

##### Properties

The first three properties configure the helper. The last three describe the group object returned inside the block.

`arrayName` — The name of the array you want to group.
`field` — The field you want to group by. To group by multiple fields, provide a comma-separated list such as `"date,method"`.
`groups` — The block parameter that stores the grouped results within the helper block.
`group.key` — The grouped value for the current group. When you group by multiple fields, `group.key` is an object whose properties can be referenced individually.
`group.items` — The array items that belong to the current group.
`group.count` — The number of items in the current group.

##### Format

```
{{#groupBy arrayName field="fieldName" as |groups|}}
   {{#each groups as |group|}}
     {{group.key.fieldName}} ({{group.count}})
       {{#each group.items as |product|}}
         {{product.name}}
       {{/each}}
   {{/each}}
{{/groupBy}}
```

> **Note:** The `groups` block parameter is only available inside the `#groupBy` block.

##### Example

To display grouped sections in a predictable order, sort the array first and then group the sorted results.

This example uses an XML data feed (`xmldata`) that contains shipping data.

```
{{#sortBy xmldata.ShipTos.ShipTo field="LineItems.ItemFirstPromisedDate,LineItems.ItemShippingMethod" order="asc" as |sortedItems|}}
    {{#groupBy sortedItems field="LineItems.ItemFirstPromisedDate,LineItems.ItemShippingMethod" as |groups|}}
        {{#each groups as |group|}}
            <div class="shipment-group">
                <h2>Delivery Date: {{dateFormat group.key.ItemFirstPromisedDate format="MMM dd, yyyy"}}</h2>
                <h3>Shipping Method: {{group.key.ItemShippingMethod}}</h3>
                <p>Total Items: {{group.count}}</p>

                <table>
                    {{#each group.items}}
                        <tr>
                            <td><strong>{{LineItems.ItemName}}</strong></td>
                            <td>Quantity: {{LineItems.ItemQuantity}}</td>
                            <td>Price: ${{LineItems.ItemPrice}}</td>
                        </tr>
                    {{/each}}
                </table>
            </div>
        {{/each}}
    {{/groupBy}}
{{/sortBy}}
```

This pattern keeps shipment groups in chronological order, groups ShipTo items that share the same delivery date and shipping method, and displays the item count for each section.

#### Find the smallest value in an array

The `#minInList` searches within a list of items in an array and finds the smallest value for a specified field.

##### Properties

`arrayName` — The name of the array that contains the field whose smallest value you want to find.
`fieldName` — The name of the field whose values you want to check to identify the smallest.
`content` — The content you want to display when the Handlebars code is rendered.

##### Format

```
{{#minInList arrayName "fieldName"}}
    <div>content</div>
{{/minInList}}
```

##### Example

| Code | Example `shoppingCartItems` array | Output |
| --- | --- | --- |
| helper example | Example array | The least expensive item in your cart is only $14.99! |

#### Find the largest value in an array

The `#maxInList` searches within a list of items in an array and finds the largest value for a specified field.

##### Properties

`arrayName` — The name of the array that contains the field whose largest value you want to find.
`fieldName` — The name of the specific field within the array that contains values whose sizes you want to compare.
`content` — The content you want to display when the Handlebars code is rendered.

##### Format

```
{{#maxInList arrayName "fieldName"}}
    <div>content</div>
{{/maxInList}}
```

##### Example

| Code | Example `shoppingCartItems` array | Output |
| --- | --- | --- |
| helper example | Example array | The most expensive item in your cart is $55.99 — treat yourself! |

> **Note:** You can also use the non-block `eq` helper to compare arrays as part of a boolean expression.

#### Combine array values into a single string

The `join` helper lists all of the items in an array, connected by a specified character.

##### Properties

`arrayName` — The name of the array that contains the values you want to display.
`character` — The character you want to use to connect the values of the array.
`prefix` (optional) — The starting character, word, or phrase you want to append to the beginning of the output.
`suffix` (optional) — The ending character, word, or phrase you want to append to the end of the output.

##### Format

```
{{join arrayName "character" prefix="prefix" suffix="suffix"}}
```

##### Example

| Code | Example array | Output |
| --- | --- | --- |
| helper example | Example array | (Beginning) 816023, 969945, 1150980, 1991861, 2014924, 2049888, 2183381, 2199681, 2402054 (End) |

### Working with objects

This section describes Handlebars helpers that can be used when working with objects.

#### Check whether two objects are equal

The `#eq` helper checks whether two objects are equal. For two objects to be considered equal, they must have exactly the same set of keys and values, in the same order.

If the two objects are equal, the block's content is displayed. If the two objects are not equal, the block's content is not displayed.

> **Note:** You can also use the `eq` non-block helper to compare the size of two objects as part of a Boolean expression.

##### Properties

`objectName1` — The name of the first object whose size/content you want to compare.
`objectName2` — The name of the second object whose size/content you want to compare.
`content` — The content that should be displayed in the rendered output if the two objects are equal.

##### Format

```
{{#eq objectName1 objectName2}}
    content
{{/eq}}
```

##### Example

| Code | Example objects | Output |
| --- | --- | --- |
| helper example | Example objects | It's a match! |

#### Check whether two objects are not equal

The `#neq` block helper checks whether two objects are not equal. For two objects to be considered equal, they must have exactly the same set of keys and values, in the same order.

If the two objects are not equal, the block's content is displayed. If the two objects are equal, the block's content is not displayed.

> **Note:** You can also use the `neq` non-block helper to compare the size of two objects as part of a Boolean expression.

##### Properties

`objectName1` — The name of the first object whose size/content you want to compare.
`objectName2` — The name of the second object whose size/content you want to compare.
`content` — The content that should be displayed in the rendered output if the two objects are not equal.

##### Format

```
{{#neq objectName1 objectName2}}
    content
{{/neq}}
```

##### Example

| Code | Example objects | Output |
| --- | --- | --- |
| helper example | Example objects | Sorry... it's not a match. |

#### Display a specific item within an object

You can use dot notation and index values to display a specific item within an object.

##### Properties

`objectName` — The name of the object that contains the item you want to display.
`#` — The position within the object of the item you want to display. (NOTE: The first value within an object has the index `0`.)
`fieldName` — The name of the field within the object whose value you want to display.

##### Format

```
{{objectName.[#].fieldName}}
```

##### Example

| Code | Example object | Output |
| --- | --- | --- |
| Indexing example | Example object | jacket |

#### Reference key/value pairs in an object

When using the `each` helper to loop over items in an object, you can optionally use the `@key` and `this` expressions to reference key/value pairs within the object.

##### Properties

`@key` — The "key" component of the key/value pair you're interested in.
`this` — The "value" component of the key/value pair you're interested in.

##### Format

```
{{#each objectName}}
    {{#ifContainsStr @key "keyName"}}
        {{@key}} {{this}}
    {{/ifContainsStr}}
{{/each}}
```

##### Example

| Code | Example `translations` object | Output |
| --- | --- | --- |
| Referencing key/value pairs example | Example object | The translation for es_ES is Hola. |

## Regular Expressions

Use `#ifMatchesRegexStr` to display content when a string field matches a regex pattern.

If regex is new to you, start simple. Build your pattern in small steps, test in template preview, then add complexity only if you need it.

### When to use regular expressions in Handlebars

Not sure when to use regular expressions in Handlebars? Here are some guidelines:

- Use `#ifMatchesRegexStr` along with regular expressions when you need to match against a pattern of characters.
- Use `#ifEq` when you need to check if two values are equal.
- Use `#ifContainsStr` when you need to check if a string contains a substring.

### `#ifMatchesRegexStr` helper syntax

When you use `#ifMatchesRegexStr` in a Handlebars expression, Iterable evaluates a regex pattern against the value specified. If the pattern matches, the helper displays the block's content. If the pattern does not match, the helper either displays nothing or, if an `else` statement is included, displays the provided alternative fallback content.

For examples, see Common use cases below.

#### Properties

- `fieldName` — User profile or triggering event field to evaluate.
- `pattern` — Regex pattern used for matching.
- `content` — Content shown when the field matches the pattern.
- `else content` (optional) — Content shown when there is no match.

#### Format

When used without fallback content, the helper displays nothing if the field doesn't match the pattern.

```
{{#ifMatchesRegexStr fieldName "pattern"}}
  <div>content when matched</div>
{{/ifMatchesRegexStr}}
```

To display alternative content when the field doesn't match the pattern, use the `else` block. The `else` block is optional.

```
{{#ifMatchesRegexStr fieldName "pattern"}}
  <div>Content that displays when the field value matches the pattern</div>
{{else}}
  <div>Fallback content that displays when the field value does not match the pattern</div>
{{/ifMatchesRegexStr}}
```

### Creating a regex pattern

You can use regular expressions in Iterable in the following ways:

- In Handlebars helpers, such as `#ifMatchesRegexStr`.
- In journey Attribute Split tiles.

For examples of how to use regular expressions in Iterable, see the Common use cases below.

Use this workflow to build your regex pattern:

1. Start with the exact value you expect.
2. Add regex symbols only if the data has multiple potential formats to match against.
3. Test the pattern in template preview.

For more help, try a third-party regex tester such as regex101.com to build and validate patterns.

Regardless of how you create your regex pattern, always test it in template preview before sending.

#### Iterable-specific regex behavior and limitations

These rules are specific to how Iterable evaluates regex:

1. Matching is case-sensitive.
2. Matching is against the full string by default.
3. To match part of a value, add `.*` where needed.
4. Regex modifiers at the end of a pattern are not supported (for example, `/i`).
5. Inverse-block syntax for `ifMatchesRegexStr` is not supported. Use `else` or `#unless` instead.

   For example, the following syntax will not work:

   ```
   {{^ifMatchesRegexStr fieldName "pattern"}}
     <div>fallback content</div>
   {{/ifMatchesRegexStr}}
   ```

#### Regex quick reference

| Character | What it does | Example pattern | What it matches |
| --- | --- | --- | --- |
| Period (`.`) | Matches any single character | `man.` | `many`, `mane` |
| Star (`*`) | Matches the previous character/group zero or more times | `yay*` | `yay`, `yayyyy`, `ya` |
| Plus (`+`) | Matches the previous character/group one or more times | `loo+k` | `look`, `loooook` |
| Question mark (`?`) | Makes the previous character/group optional | `colou?r` | `color`, `colour` |
| Parentheses (`()`) | Groups characters together | `(ab)+` | `ab`, `abab`, `ababab` |
| Square brackets (`[]`) | Matches one character from a set | `[Cc]alifornia` | `California`, `california` |
| Curly braces (`{}`) | Sets how many times something appears | `A{2,4}` | `AA`, `AAA`, `AAAA` |
| Caret (`^`) | Anchors the match to the start of a string | `^gold` | `gold`, `gold-tier` |
| Dollar sign (`$`) | Anchors the match to the end of a string | `gold$` | `gold`, `tier-gold` |
| Pipe (`|`) | OR operator between alternatives | `yoga\|cycling` | `yoga` or `cycling` |
| Backslash (`\`) | Escapes regex symbols so they are literal | `1\+1` | `1+1` |
| Wildcard (`.*`) | Matches any number of any characters | `.*yoga` | `yoga`, `beginner-yoga`, `hot-yoga` |

##### Wildcards

`.*` is a wildcard pattern that means "any number of any characters," including zero characters.

Examples:

- `.*yoga` matches any string that ends with `yoga`.
  - Matches: `yoga`, `beginner-yoga`, `hot-yoga`
  - Does not match: `yoga-mat`, `yoga-flow`, `cycling`
- `yoga.*` matches any string that starts with `yoga`.
  - Matches: `yoga`, `yoga-mat`, `yoga-flow`
  - Does not match: `beginner-yoga`, `hot-yoga`, `cycling`
- `.*yoga.*` matches any string that contains `yoga` anywhere.
  - Matches: `yoga`, `yoga-mat`, `beginner-yoga`, `hot-yoga`
  - Does not match: `cycling`, `running`, `strength`

##### Character sets

Use inside square brackets with operators to define a character set:

- Caret (`^`) defines a character set to match characters *outside of the set* ("not" operator).
- Hyphen (`-`) defines a range to match characters within the set.

Examples:

- `[0-9]` matches any digit (0-9).
- `[A-Z]` matches any uppercase letter (A-Z).
- `[^0-9]` matches any character that is not a digit (anything except 0-9).

##### OR operator

With the OR operator (`|`), you do not need to wrap alternatives in parentheses unless you are grouping part of a larger pattern.

Examples:

- `silver|gold` matches either `silver` or `gold`.
- `gold-(monthly|annual)` groups alternatives that follow `gold-`.

##### Escaping regex symbols

Use `\` to match regex symbols literally:

- `\|` matches a literal pipe.
- `\?` matches a literal question mark.
- `\\` matches a literal backslash.
- `\+` matches a literal plus sign.

Examples:

- `.+ \| Fiterable Fitness` matches `Carly Cardio | Fiterable Fitness`.
- `Still interested\?` matches `Still interested?`.
- `CORP\\NorthAmerica` matches `CORP\NorthAmerica`.
- `Loyalty\+` matches `Loyalty+`.

### Common use cases for regular expressions in Handlebars

These are some common use cases for regular expressions in Handlebars.

#### Display content based on a regex pattern match

This example checks whether `membershipTier` follows the pattern `gold-monthly` or `gold-annual`.

Regex pattern: `gold-(monthly|annual)`

```
{{#ifMatchesRegexStr membershipTier "gold-(monthly|annual)"}}
  <div>Thanks for being a Gold member!</div>
{{/ifMatchesRegexStr}}
```

#### Display content based on a substring match

This pattern checks whether `productName` contains the substring "camera".

Regex pattern: `.*camera.*`

```
{{#ifMatchesRegexStr productName ".*camera.*"}}
  <div>Recommended accessories for your camera</div>
{{/ifMatchesRegexStr}}
```

#### Display content based on a multiple value match

This pattern checks whether `country` is one of the following values:

- United States
- Canada
- Australia

Regex pattern: `United States|Canada|Australia`

```
{{#ifMatchesRegexStr country "United States|Canada|Australia"}}
  <div>Choose your mega deal</div>
{{/ifMatchesRegexStr}}
```

#### Display content based on a locale match with fallback

This example has two pattern checks for `locale` and displays the appropriate content based on the user's language:

- If the locale is Spanish (`es-ES` or `es-MX`), it displays Spanish content.
- If the locale is French (`fr-FR` or `fr-CA`), it displays French content.
- If the locale is not one of those values, it displays English fallback content.

This use case helps create snippets of content that can be reused in templates that have many locales.

Regex pattern: `es-ES|es-MX|fr-FR|fr-CA`

```
{{#ifMatchesRegexStr locale "es-ES|es-MX"}}
  <div>Buenas noticias: el artículo que viste todavía está disponible.</div>
{{else ifMatchesRegexStr locale "fr-FR|fr-CA"}}
  <div>Bonne nouvelle : l’article que vous avez consulté est toujours disponible.</div>
{{else}}
  <div>Good news: the item you viewed is still available.</div>
{{/ifMatchesRegexStr}}
```

#### Display content based on a date suffix match (st, nd, rd, th)

This pattern checks the value for `dateDay` and displays the appropriate suffix for the day.

- If the day is 1, 21, or 31, it displays the suffix "st". Example: "1st", "21st", "31st"
- If the day is 2, 22, it displays the suffix "nd". Example: "2nd", "22nd"
- If the day is 3, 23, it displays the suffix "rd". Example: "3rd", "23rd"
- If the day is any other number, it displays the suffix "th". Example: "4th", "18th", "30th", etc.

Regex pattern: `01|21|31`

```
{{#assign "dateDay"}}{{dateMath "now" "+7d" format="dd"}}{{/assign}}
{{#ifMatchesRegexStr dateDay "01|21|31"}}{{dateDay}}st
{{else ifMatchesRegexStr dateDay "02|22"}}{{dateDay}}nd
{{else ifMatchesRegexStr dateDay "03|23"}}{{dateDay}}rd
{{else}}{{dateDay}}th
{{/ifMatchesRegexStr}}
```

### Troubleshooting regular expressions in Handlebars

If your regular expression is not working as expected, here are some tips to help you troubleshoot:

1. Preview with a real user profile and triggering event.
2. Check case sensitivity in both field value and pattern.
3. Confirm whether you need exact matching or partial matching (`.*`).
4. Escape literal regex symbols with `\` when needed.
5. If a message fails for only some users, check for null or missing fields in the user profile or triggering event.
6. If you used inverse-block syntax with `ifMatchesRegexStr`, note that this is not supported. Use `else` or `#unless` instead.
