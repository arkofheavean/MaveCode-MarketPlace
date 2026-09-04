# Encoding & Hashing, Built-In Merge Tags & Troubleshooting

This reference folds three Iterable Handlebars docs: **Encoding and Hashing Helpers**, **Built-In Merge Tags**, and **Troubleshooting Handlebars Code**. Syntax basics and the quotes-in-HTML/JSON rule are summarized in [`instructions.md`](../instructions.md); this file preserves each doc's Properties/Format/Example triads and result tables.

## Encoding and Hashing Helpers

You can use Handlebars to encode or hash values in your dynamic content. This section describes the various encoding and hashing helpers Iterable supports and how to use them.

### Hashing helpers

You can use hashing helpers to generate common hash-based message authentication codes (HMACs) that are useful for encrypting user data for security.

A great use case for this is if you want to automatically populate a web page (like your company's messaging preferences center) with a user's details when they click a link. You need to reference the user's data in order to personalize their experience, but it's best practice not to expose personal data in a URL. With these Handlebars helpers, you can reference a user's personal data while also keeping it secure.

The hashing Handlebars helpers Iterable supports are based on various Secure Hash Algorithms, which differ in terms of the levels of security they provide. The supported hashing helpers are listed in this section from most recent (and most secure) to oldest and least secure.

> **Warning:** Before using these hashing helpers, be sure that you understand the potential risks associated with doing so. These helpers must **not** be used as a substitute for a proper authentication system to your platform; authentication should always redirect to your organization's login pages.
>
> If you have any questions about using these Handlebars helpers, reach out to your Iterable customer success manager.

#### Generate a SHA-256 HMAC

The `hmacSHA256` helper generates a Secure Hash Algorithm 2 (SHA-2) HMAC hash for the value of the specified user or event data field using your project's HMAC secret.

Because this helper hashes the value of the specified data field using a more recent standard of the Secure Hashing Algorithm (SHA-256) *and* requires authentication with a secret key, it provides the highest level of security.

**Properties**

`fieldName` — The name of the user or event data field whose value you want to encrypt.

**Format**

```
{{hmacSHA256 fieldName}}
```

**Example**

| Code | Example `userId` value | Output |
| --- | --- | --- |
| hmacSHA256 helper example | 123456789 | 10ec54aa2d39e7ba838e3c485b46436d70c5f577f3df20f8ba8c5e7559d568dc |

#### Generate a SHA-256 hash

The `sha256` helper encrypts the value of the specified user or event data field as a SHA-256 hash.

Because this helper only hashes the value of a data field but does not require authentication with a secret key, it provides a lower level of security than the `hmacSHA256` helper.

**Properties**

`fieldName` — The name of the user or event data field whose value you want to encrypt.

**Format**

**Standard helper:**

```
{{sha256 fieldName}}
```

**Block helper:**

```
{{#sha256}}{{fieldName}}{{/sha256}}
```

**Example**

| Code | Example `email` value | Output |
| --- | --- | --- |
| Example sha256 helper | user@example.com | 3a86c6f084291fda367f24e885c74d2f1d50419eb4028d2b1bb2060d8f45ce0b |

#### Generate a SHA-1 HMAC

The `hmacSHA1` helper generates a Secure Hash Algorithm 1 (SHA-1) HMAC hash for the value of the specified user or event data field using your project's HMAC secret.

Because this helper hashes the value of the specified data field *and* requires authentication with a secret key, it provides a higher level of security than the `sha1` helper. However, it uses an older (and less secure) standard of the Secure Hash Algorithm. When possible, we recommend using SHA-256.

**Properties**

`fieldName` — The name of the user or event data field whose value you want to encrypt.

**Format**

```
{{hmacSHA1 fieldName}}
```

**Example**

| Code | Example `userId` value | Output |
| --- | --- | --- |
| Example hmacSHA1 helper | 123456789 | 310cf1d869f57ad61fc46d45fc9496fa1a628162 |

#### Generate a SHA-1 hash

The `sha1` helper generates a Secure Hash Algorithm 1 (SHA-1) hash for the value of the specified user or event data field.

> **Note:** Security experts regard the SHA-1 hashing algorithm as outdated and advise against using it due to vulnerabilities. (However, it is more secure when used with an HMAC.) Consider more secure, up-to-date alternatives like SHA-256.

**Properties**

`fieldName` — The name of the user or event data field whose value you want to encrypt.

**Format**

**Standard helper:**

```
{{sha1 fieldName}}
```

**Block helper:**

```
{{#sha1}}{{fieldName}}{{/sha1}}
```

**Example**

| Code | Example `email` value | Output |
| --- | --- | --- |
| sha1 helper example | user@example.com | 63a710569261a24b3766275b7000ce8d7b32e2f7 |

#### Generate an MD5 hash

The `md5` helper generates an MD5 hash.

> **Note:** Security experts regard the MD5 hashing algorithm as outdated and advise against using it due to vulnerabilities. (However, it is more secure when used with an HMAC.) Consider more secure, up-to-date alternatives like SHA-256.

**Properties**

`fieldName` — The name of the user or event data field whose value you want to encrypt.

**Format**

**Standard helper:**

```
{{md5 fieldName}}
```

**Block helper:**

```
{{#md5}}{{fieldName}}{{/md5}}
```

**Example**

| Code | Example `email` value | Output |
| --- | --- | --- |
| md5 helper example | user@example.com | b58996c504c5638798eb6b511e6f49af |

### Encoding helpers

You can use encoding helpers to change the representation of values in your dynamic content for use in different formats like Base64, JSON, and URLs.

#### Convert a value to Base64

The `#base64` helper converts a value to Base64.

**Properties**

`fieldName` — The name of the data field whose value should be converted to Base64.

**Format**

```
{{#base64}}{{fieldName}}{{/base64}}
```

**Example**

| Code | Example `email` value | Output |
| --- | --- | --- |
| Example base64 helper | user@example.com | ZG9jc0BpdGVyYWJsZS5jb20= |

#### Format a value as JSON

The `toJson` helper formats a value for use in a JSON field.

**Properties**

`fieldName` — The name of the data field whose value should be formatted as JSON.

**Format**

```
{{toJson fieldName}}
```

**Example**

| Code | Example `drink` value | Output |
| --- | --- | --- |
| Example toJson helper | piña colada | "piña colada" |

> **Note:** The output of the `toJson` helper depends on the data type of `fieldName`.
>
> | Value of `fieldName` | Data type | Output |
> | --- | --- | --- |
> | `Example string` | String | `"Example string"` |
> | `1234` | Long | `1234` |
> | `3.14` | Float | `3.14` |
> | `{"field1": "value"}` | Object | `{"field1": "value"}` |
> | `[1,2,3,4]` | Array | `[1,2,3,4]` |

#### Format a value as a URL-encoded JSON string

The `toUrlEncodedJson` helper formats a value for use in a JSON field. Special characters like quotes (`""`), curly braces (`{}`), and square brackets (`[]`) are encoded as they would be for use in a URL.

**Properties**

`fieldName` — The name of the data field whose value should be formatted as a URL-encoded JSON string.

**Format**

```
{{toUrlEncodedJson fieldName}}
```

**Example**

| Code | Example `drink` value | Output |
| --- | --- | --- |
| Example toUrlEncodedJson helper | piña colada | %22pi%C3%B1a+colada%22 |

> **Note:** With this helper, the output depends on the data type of `fieldName`.
>
> | Value of `fieldName` | Data type | Output |
> | --- | --- | --- |
> | `Example string` | String | `%22Example+string%22` |
> | `1234` | Long | `1234` |
> | `3.14` | Float | `3.14` |
> | `{"field1": "value"}` | Object | `%7B%22field1%22%3A%22value%22%7D` |
> | `[1,2,3,4]` | Array | `%5B1%2C2%2C3%2C4%5D` |

#### Format a value for use in a URL

The `#urlEncode` block helper converts a string (or the value of a data field containing a string) to standard URL formatting. Spaces are replaced with plus signs (`+`), and special characters (for example, `ñ`) are converted to their ASCII equivalent.

**Properties**

`fieldName` — The name of the data field whose value should be formatted for use in a URL.

**Format**

```
{{#urlEncode}}{{fieldName}}{{/urlEncode}}
```

**Example**

| Code | Example `drink` value | Output |
| --- | --- | --- |
| Example urlEncode helper | piña colada | pi%C3%B1a+colada |

#### Hex-encode a value

The `hexEncode` helper encodes the value of a user or event data field as a hexadecimal string.

**Properties**

`fieldName` — The name of the data field whose value should be hex-encoded.

**Format**

**Standard helper:**

```
{{hexEncode fieldName}}
```

**Block helper:**

```
{{#hexEncode}}{{fieldName}}{{/hexEncode}}
```

**Example**

| Code | Example `email` value | Output |
| --- | --- | --- |
| Example hexEncode helper | user@example.com | 75736572406578616d706c652e636f6d |

## Built-In Merge Tags

Iterable offers several built-in merge tags that you can use anywhere you want to insert dynamic content. No matter how you've set up your data in your project, these merge tags are supported in Iterable templates, snippets, and data feeds.

> **Note:** For help generating valid Handlebars syntax, ask Nova Agent to build it for you.

### Unsubscribe links

In order to comply with CAN-SPAM laws, you must include an easy way for message recipients to unsubscribe from any marketing message they receive from your brand. Iterable offers several merge tags that you can use to add unsubscribe links to your messages.

If the Auto-append Unsubscribe Block project setting is enabled, Iterable automatically inserts an unsubscribe block, which includes the `{{unsubscribeUrl}}` merge tag, in email marketing messages. If this setting is disabled, you must include either `{{unsubscribeUrl}}`, `{{unsubscribeMessageTypeUrl}}`, or `{{hostedUnsubscribeUrl}}` in email messages sent through a marketing channel.

To learn more about configuring your project's subscription settings, see Message Channels and Message Types Overview.

> **Note:** By default, any merge tags whose names include `Url` render as raw links when used in a message template. If you want them to render as hyperlinked text, either place the merge tag in an `href` along with your preferred display text, or use the **Insert Link** option in the Drag and Drop or WYSIWYG editor to set up your preferred display text and link options.

#### unsubscribeUrl

`{{unsubscribeUrl}}` inserts a string URL that recipients can click on to unsubscribe from the message channel associated with the message.

#### hostedUnsubscribeUrl

`{{hostedUnsubscribeUrl}}` inserts a string that contains your hosted unsubscribe URL. This merge tag is useful for hosting your own unsubscribe page. To do this, you can create a subscription preference center on your website, and then use the `{{hostedUnsubscribeUrl}}` merge tag to link to it from your messages.

> **Note:** If you want to add tags to the end of your hosted unsubscribe URL, it's best to set them up on your Project Settings page instead of in the body of a message template. However, if you do add the tags in the message template, use `&` as the first character instead of `?`.

To learn more about setting up your hosted unsubscribe URL, see Creating a Subscription Preference Center.

#### unsubscribeMessageTypeUrl

`{{unsubscribeMessageTypeUrl}}` inserts a link that recipients can click to unsubscribe from the message type associated with the message.

#### unsubscribeByPhoneUrl

When you use Iterable SMS to send internationally from an alphanumeric sender ID, Iterable includes an unsubscribe link (`{{unsubscribeByPhoneUrl}}`) in the opt-out instructions. This personalized link takes recipients to a webpage where they can opt out of receiving SMS messages.

You can set up your `{{unsubscribeByPhoneUrl}}` on your Global SMS Settings page.

To learn more, see SMS Unsubscribes and Resubscribes.

### Campaign metadata

#### campaignName

`{{campaignName}}` inserts the name of the campaign associated with the message.

#### campaignId

`{{campaignId}}` inserts the ID of the campaign associated with the message.

#### recurringCampaignId

If the template is associated with a recurring campaign, `{{recurringCampaignId}}` inserts the name of the parent campaign associated with the message.

#### templateName

`{{templateName}}` inserts the name of the template associated with the message.

#### templateId

`{{templateId}}` inserts the ID of the template associated with the campaign. Iterable automatically generates a unique ID for each template you create.

#### clientTemplateId

`{{clientTemplateId}}` inserts the client ID of the template associated with the campaign. The client ID is a custom identifier that you can set for one or more templates that you create using Iterable's API:

- `POST /api/templates/email/upsert`
- `POST /api/templates/push/upsert`
- `POST /api/templates/sms/upsert`
- `POST /api/templates/inapp/upsert`

When you update templates with these endpoints, all existing templates in your project with the specified `clientTemplateId` are updated.

#### channelId

`{{channelId}}` inserts the ID of the message's associated message channel.

#### messageTypeId

`{{messageTypeId}}` inserts the ID of the message's associated message type.

#### workflowId

`{{workflowId}}` inserts the ID of the journey from which the message send was triggered.

> **Note:** Journeys were previously called "Workflows" in Iterable. Be sure to use the correct parameter name (`{{workflowId}}`) to reference journey IDs wherever you use Handlebars in Iterable.

#### liveData

In message templates sent from journey campaigns, you can reference data that was fetched by an upstream Live Data journey tile using the following syntax:

`{{liveData.objectName.fieldName}}`

Replace `objectName` and `fieldName` with the actual field names returned by the journey webhook used in your Live Data tile. For example, if your webhook returns an object called `product` with a field called `name`, you can reference it as `{{liveData.product.name}}`.

If you reference `{{liveData}}` without specifying any subfields, the rendered output includes the entire webhook payload. Test your journey campaign to confirm the data appears as expected.

Before including a `{{liveData}}` reference in a template, make sure your journey includes a Live Data tile before the message tile. The Live Data tile provides the webhook data that the message can reference at send time—without a preceding Live Data tile, references will render as blank in the final rendered version.

For template testing, use representative sample data that mirrors the `liveData` structure your journey will provide at send time.

To learn more, see Using Live Data in Journeys.

#### sendListIds

`{{sendListIds}}` inserts the audience lists to which the campaign was sent.

> **Tip:** To make the output easier to read, consider using the Handlebars `join` helper to add a comma between each list ID like this:
>
> ```
> {{join sendListIds ","}}
> ```

### Your brand details

#### brandName

The merge tag `{{brandName}}` displays your brand's name in the confirmation and legal disclaimer messages for SMS double opt-in message types.

The value for this merge tag is configured in the settings for your SMS double opt-in message type, and can be up to 50 characters long.

Example confirmation message:

```
{{brandName}}: Reply Y to subscribe to text messages about:
{{messagingInitiative}}
```

Example legal disclaimer message:

```
{{brandName}}: Msg & data rates may apply. Msg frequency varies.
Reply HELP for help, STOP to cancel. Disclaimer: {{smsDisclaimerLink}}
```

To learn more about SMS Double Opt-In, see SMS Double Opt-In Overview.

#### companyName

The merge tag `{{companyName}}` inserts the name of your project to represent the name of your brand or company when messaging users.

The project's **Name** field is set in your Project Settings, and displays automatically in the following locations:

- In default subscription-related pages hosted by Iterable, such as subscribe and unsubscribe success pages.
- In the default unsubscribe block appended to your emails (if enabled).

#### physicalAddress

`{{physicalAddress}}` inserts your company's physical mailing address. You can set up or edit your company's physical address on your Project Settings page.

You must include a physical address in email messages in order to comply with CAN-SPAM laws. When the Auto-append Unsubscribe Block project setting is enabled, Iterable automatically appends an unsubscribe block in email messages, which includes the physical address from your Project Settings page. If the Auto-append Unsubscribe Block project setting is disabled, you must add `{{physicalAddress}}` to your unsubscribe code block.

### Recipient details

#### email

`{{email}}` inserts the recipient's email address.

To avoid blank spaces in rendered messages, it's a good idea to include a fallback option in case a recipient's `email` user profile field is blank or invalid.

#### userId

`{{userId}}` inserts the recipient's user ID.

To avoid blank spaces in rendered messages, it's a good idea to include a fallback option in case a recipient's `userId` user profile field is blank or invalid.

### Other

#### messagingInitiative

The messaging initiative describes the content associated with a SMS double opt-in message type. It tells your users what kind of content they're subscribing to.

The value for this merge tag is configured in the settings for the SMS double opt-in message type, and can be up to 100 characters long.

Iterable includes this field in the double opt-in confirmation message with the merge tag `{{messagingInitiative}}`.

Example confirmation message:

```
{{brandName}}: Reply Y to subscribe to text messages about:
{{messagingInitiative}}
```

To learn more about SMS Double Opt-In, see SMS Double Opt-In Overview.

#### now

`{{now}}` inserts the current date (generated at send time), in the following format: `MMM DD, YYYY` (example: Oct 24, 2024)

To learn more about how to use `{{now}}`, see Handlebars Reference: Date and Time Helpers.

#### smsDisclaimerLink

The SMS disclaimer link is a valid URL that begins with `https://` and should direct recipients to your brand's terms and conditions or privacy policy.

The value for this merge tag is configured in the settings for the SMS double opt-in message type, and can be up to 100 characters long.

Iterable includes this link in the legal disclaimer message for the SMS double opt-in message type with the merge tag `{{smsDisclaimerLink}}`.

Example legal disclaimer message:

```
{{brandName}}: Msg & data rates may apply. Msg frequency varies.
Reply HELP for help, STOP to cancel. Disclaimer: {{smsDisclaimerLink}}
```

To learn more about SMS Double Opt-In, see SMS Double Opt-In Overview.

#### viewInBrowserUrl

`{{viewInBrowserUrl}}` inserts a link to a web version of an email message. When you add this to a message template for an email, at send time, it renders as a link recipients can click to view the message in their web browser.

> **Note:** When you preview a template that uses locales, the `View this email in your browser` link in your message proof reflects the template's default locale.

#### sentAt

`{{sentAt}}` is an **email** merge tag for the message's **original send time**. This merge tag is only available in email templates—it is unavailable in SMS, push, or in-app message templates. When it is available, Iterable provides the sent time as an ISO 8601 datetime string in **UTC**. Format it with the `dateFormat` helper (and the `tz` option if you need a specific zone).

Helpers such as `now`, `timestamp`, `dateMath` with `"now"`, and other "current time" helpers resolve at **render time**. That is often what you want, but when someone opens the web version using `{{viewInBrowserUrl}}` days after delivery, those helpers reflect the time when the page is loaded and not when the message was sent. Use `{{sentAt}}` when you need the true send time on that page.

`{{sentAt}}` is only available when Iterable renders the browser (web) version of the email. It is not populated in the in-inbox email render.

**View in browser** — Iterable sets `sentAt` from the send event when the template is rendered for the browser link.

**Live sends, previews, proofs** — Iterable does not populate `sentAt` during live sends, previews, or proofs, so the value is absent. Use `{{#if sentAt}}` … `{{else}}` and fall back to your usual "now" helpers when you need a time parameter at render time or when you need a placeholder for drafts and proofs.

Referencing `sentAt` is **opt in**; templates that never use it behave as before.

If you already use the name `sentAt` for a merge field from campaign data, a user profile, or transactional/API payload, that field takes precedence over Iterable's send-time value.

**Example**

```
<p>now: {{now format="yyyy-MM-dd HH:mm:ss" tz="UTC"}}</p>
<p>Email sent at:
  {{#if sentAt}}
    {{dateFormat sentAt format="yyyy-MM-dd HH:mm:ss" tz="UTC"}}
  {{else}}
    {{now format="yyyy-MM-dd HH:mm:ss" tz="UTC"}}
  {{/if}}
</p>
<p><a href="{{viewInBrowserUrl}}">View in browser</a></p>
```

After you receive the message in your inbox, open the **View in browser** link. On that page, the second line should read **Email sent at:** followed by the original send date and time (formatted in UTC as shown). The first line still uses `now`, so it shows **when the page was rendered**, which can be later than the send time if you open the link days after delivery.

#### sendSkip

You can abort a template (and generate a send skip event) using `sendSkip`. Any send skips originating from this will have a reason of `SendAborted`. You can pass any additional data you want persisted with the send skip via named parameters.

For example, say your users have a field called `creditAvailable`, and you want to abort the send if a user doesn't have enough credit to buy some product they're considering. You might do something like:

```
{{#ifLt creditAvailable product.price}}
  {{sendSkip cause="insufficient credit" creditAvailable=creditAvailable creditRequired=product.price}}
{{/ifLt}}
```

## Troubleshooting Handlebars Code

Is your Handlebars code not working as expected? This section walks through a few of the most common issues and how to fix them.

### Tips and best practices

To avoid potential issues with Handlebars in your message templates, there are a few tips and best practices you should be aware of. Knowing how the Handlebars language and Iterable's settings work can help you prevent issues before they start.

#### How Iterable prioritizes data sources

If a merge tag references a field that exists in both a user's profile and the campaign's triggering event, Iterable uses the value from the *event* to render the merge tag at send time.

When the **Merge the data feed and user contexts** template setting is enabled, a template can use double curly braces (`{{}}`) instead of double square brackets (`[[]]`) to pull values from a data feed. You can still use double curly braces to reference data from user profiles, but if the same field exists in both the user's profile and the data feed, Iterable uses the value from the user's profile. This way, your merge tags prioritize values from user profiles but can fall back on values from a data feed if necessary.

#### Don't name fields with periods

Avoid using periods when naming user and event fields in your Iterable projects. Since the Handlebars language uses periods to reference fields within objects (for example, `{{objectName.fieldName}}`), field names that contain periods can cause errors.

To learn more about avoiding errors due to naming convention issues, see Best Practices for Field Names and Event Names.

#### Using Handlebars in the WYSIWYG editor

When building a template in Iterable's WYSIWYG editor, there are two ways to add Handlebars code: you can insert the code into the template's design, or click the `<>` button to view and edit the template's HTML source.

When editing the HTML source, it's a good idea to comment out any lines of Handlebars code that don't output a value. In rare circumstances, the WYSIWYG editor can get confused by the presence of Handlebars in the HTML source, which can lead to errors. The WYSIWYG editor ignores comments in the HTML source, so commenting out these lines of Handlebars code can resolve this issue.

**Before:**

```
{{#if firstName}}
    <div>Hey, {{firstName}}!</div>
{{else}}
    <div>Hey there!</div>
{{/if}}
```

**After:**

```
<!--{{#if firstName}}-->
    <div>Hey, {{firstName}}!</div>
<!--{{else}}-->
    <div>Hey there!</div>
<!--{{/if}}-->
```

> **Important:** Only comment out lines of Handlebars code that don't directly output a value (like conditionals, looping statements, and closing statements). Don't comment out lines that output a value (like `{{email}}` or `<div>` text). If you do, these lines will be ignored in the template's HTML and won't render in the message at send time.

#### Removing whitespace

It's important to be aware that whitespace characters such as spaces, tabs, and newlines are preserved by default in Iterable's template editors. This can cause formatting issues, especially in use cases involving URLs, deep links, or code fragments, where extra characters can break the rendered output (for example, when using Handlebars to generate a deep link for the Open URL input box of a push notification template).

To avoid this, add a tilde character (`~`) before and/or after each merge tag in your Handlebars code to trim unwanted whitespace from the rendered output:

| Action | Syntax |
| --- | --- |
| Remove leading whitespace before a merge tag | `{{~tag}}` |
| Remove trailing whitespace after a merge tag | `{{tag~}}` |
| Remove both trailing and leading whitespace from a merge tag | `{{~tag~}}` |

The following example demonstrates how to correctly trim whitespace to prevent rendering issues:

```
{{~#if isSummerCampaign~}}https://example.com/summer-offer?user={{~userId~}}
{{~else~}}https://example.com/winter-offer?user={{~userId~}}
{{~/if~}}
```

#### Use single quotes inside quoted HTML and JSON

When a Handlebars expression appears inside an HTML attribute or JSON value that is already wrapped in double quotes, use single quotes for any string literals inside the Handlebars expression. Otherwise, the inner quotes can break the surrounding syntax.

This commonly affects values used in `src="..."`, `href="..."`, `title="..."`, `data-*="..."`, and JSON payloads.

**Example:**

```
<img src="{{defaultIfEmpty user.profile_image 'https://cdn.example.com/default-avatar.png'}}" alt="Profile image">
```

To learn more, see Quotes Inside HTML and JSON.

### Common issues

Running into issues with Handlebars in a message template? Here are some of the most common issues and their solutions.

#### Can't save a template due to a Handlebars error

Handlebars blocks (which contain multiple lines of code) require both an opening statement *and* a closing statement. Each time you add an opening Handlebars statement, you must also include a corresponding closing statement. If one of your Handlebars blocks isn't rendering correctly, it might be missing one of these closing statements.

For example, the following block has two opening `#if` statements, but only one closing `/if` statement:

```
{{#if isActiveUser}}
    {{#if madePurchase}}
        <div>Thank you for your purchase!</div>
{{/if}}
```

In this example, you'd need to add another line containing a closing `/if` statement after the `<div>` line. The above code should look like this:

```
{{#if isActiveUser}}
    {{#if madePurchase}}
        <div>Thank you for your purchase!</div>
    {{/if}}
{{/if}}
```

#### Handlebars code renders as HTML

Sometimes, Iterable's template editor may render Handlebars code as HTML. To prevent this, comment out any lines of your Handlebars code that don't directly render content. To comment out a line of Handlebars code, add `<!--` to the beginning of the line and `-->` to the end.

**Example**

```
<!--{{#if [First Name]}}-->
    Hi, {{[First Name]}}!
<!--{{/if}}-->
```

The comments surrounding the first and last line of code tell the template editor to ignore the `#if` block when generating the template's HTML. The code still functions (checking to see if the user's `First Name` field is set), but the comment tells Iterable it shouldn't be part of the rendered HTML at send time.

Since the second line hasn't been commented out, its content is eligible to be displayed in the rendered HTML at send time. If the user's `First Name` field is set, the content will be displayed.

#### Unexpected characters in rendered content

Iterable renders certain characters with their HTML encoding. For example, apostrophes (`'`) are rendered with the following: `&#x27;`

Let's say you're using the merge tag `{{productName}}` in an Iterable template. If any of your product names contain apostrophes, the names will render with the `&#x27;` character encoding.

**Example**

| Code | Example `productName` value | Output |
| --- | --- | --- |
|  | Jenna's Elixir | Jenna's Elixir |

To prevent this from happening, use triple curly braces in your merge tag like this:

```
{{{productName}}}
```

#### Data feed in Handlebars code doesn't render

To reference a data feed in Handlebars code, you can use either square brackets (`[]`) or curly braces (`{}`) — which one you should use depends on the template's settings.

Once data feeds have been enabled for the template, you'll see an additional option called **Merge the Data Feed and User Contexts**. When this option is enabled, you can use either curly braces or square brackets to reference values from a data feed in Handlebars code. At send time, Iterable pulls data from both the user profile and the data feed to populate the dynamic content in the final template. If there are any conflicts (for example, if a `firstName` field exists in both the user profile and the data feed), Iterable prioritizes values from the user profile.

When the **Merge the Data Feed and User Contexts** option is disabled, you *must* use square brackets (`[]`) to reference a value from a data feed in a Handlebars block. For example:

```
[[#if firstName]]
    Hi [[firstName]],
{{else}}
    Hi friend,
[[/if]]
```

#### Blank or missing values in rendered content

If one of your referenced values isn't rendering in a template, it might be due to a formatting issue with its field name. If any of your field names contain spaces, you'll need to surround them with square brackets (`[]`) when you include them in a merge tag.

**Example**

| Code | Example `First Name` value | Output |
| --- | --- | --- |
| Example field name containing a space | Marishka | Hi, Marishka! |

> **Note:** To learn more about when to use each kind of enclosing character, see Handlebars Syntax.
