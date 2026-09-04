# AMPscript HTTP & Cryptography Functions

This reference covers AMPscript functions that make outbound HTTP requests and functions that hash, encrypt, decrypt, or sign data. Support is shown as `Support: Engagement <flag> · Next <flag>` where ✅ means supported and ❌ means not supported. All functions in this file are Engagement-only unless noted otherwise. See [`function-index.md`](function-index.md) for the full navigation surface.

> Note: Several source pages describe an example in prose ("This example shows…") without an accompanying fenced code block. Those are annotated below with `> Example code not captured in source.` Do not invent example code.

---

## HTTP Functions

### HttpGet

Support: Engagement ✅ · Next ❌

Retrieves the content hosted at a specified publicly available URL. Only ports HTTP:80 and HTTPS:443 are supported.

Parameters:
- `httpGetUrl` — Required. The publicly accessible URL whose content is retrieved.
- `boolContinueOnError` — Optional. When `true`, processing continues if the request fails; when `false` (default) a failure raises an error.
- `enumAllowEmptyContent` — Optional. Behavior when the response has no content: `0` = allow empty content (default), `1` = raise an error, `2` = skip the email.
- `functionStatusOutput` — Optional. A variable that receives the request status: `0` = success, `-1` = URL not found, `-2` = HTTP error, `-3` = success with no content.

> Example code not captured in source.

See also: HttpPost, HttpRequestHeader

### HttpPost

Support: Engagement ✅ · Next ❌

Posts content to a specified URL endpoint and captures the response. You cannot set the host or content-length headers; append additional header name/value pairs as extra argument pairs.

Parameters:
- `urlEndpoint` — Required. The URL endpoint to post to.
- `contentTypeHeader` — Required. The Content-Type header value for the posted content.
- `contentToPost` — Required. The content body to post.
- `response` — Required. A variable that receives the response body.
- `headerName1` — Optional. Name of an additional request header.
- `headerValue1` — Optional. Value for `headerName1`. Add more name/value pairs as needed.

> Example code not captured in source.

See also: HttpPost2, HTTPPostWithRetry, HttpGet

### HttpPost2

Support: Engagement ✅ · Next ❌

Posts content to a specified URL endpoint, capturing both the response and the response status code.

Parameters:
- `urlEndpoint` — Required. The URL endpoint to post to.
- `contentTypeHeader` — Required. The Content-Type header value for the posted content.
- `contentToPost` — Required. The content body to post.
- `response` — Required. A variable that receives the response body.
- `statusCode` — Optional. A variable that receives the HTTP status code.
- `headerName1` / `headerValue1` — Optional. Additional request header name/value pair(s).

> Example code not captured in source.

See also: HttpPost, HTTPPostWithRetry

### HTTPPostWithRetry

Support: Engagement ✅ · Next ❌

Posts content to a specified URL endpoint and automatically retries the request on failure.

Parameters:
- `urlEndpoint` — Required. The URL endpoint to post to.
- `contentTypeHeader` — Required. The Content-Type header value for the posted content.
- `content` — Required. The content body to post.
- `response` — Required. A variable that receives the response body.
- `headerName1` / `headerValue1` — Optional. Additional request header name/value pair(s).

> Example code not captured in source.

See also: HttpPost, HttpPost2

### HttpRequestHeader

Support: Engagement ✅ · Next ❌

Retrieves the value of a specified header from the current inbound HTTP request (for example, on a CloudPage or landing page).

Parameters:
- `headerToRetrieve` — Required. The name of the request header to retrieve.

> Example code not captured in source.

See also: RequestParameter, QueryParameter, IsCHTMLBrowser

### IsCHTMLBrowser

Support: Engagement ✅ · Next ❌

Returns a value indicating whether a device's user agent is a CHTML (Compact HTML) browser. CHTML targeted early feature phones and PDAs and is now rarely used; the function is maintained for historical purposes and was intended to select standard-HTML vs CHTML content on landing pages. Often combined with `HttpRequestHeader()` to read the current browser's user-agent.

Parameters:
- `userAgentHeader` — Required. An HTTP user-agent header string.

> Example code not captured in source.

See also: HttpRequestHeader

### RedirectTo

Support: Engagement ✅ · Next ❌

Redirects the request to a target URL. Used on CloudPages and landing pages to send the visitor to another location.

Parameters:
- `targetUrl` — Required. The URL to redirect to.

> Example code not captured in source.

See also: Redirect, CloudPagesURL

### WrapLongURL

Support: Engagement ✅ · Next ❌

Returns a shortened URL when given a URL longer than 975 characters, mitigating a known long-URL limitation in Microsoft Outlook 2007–2013. URLs shorter than 975 characters are returned unchanged. Shortened URLs redirect through the Marketing Cloud Engagement servers, are incompatible with Always On Clicks, and error if the Member DB is unavailable.

Parameters:
- `urlToShorten` — Required. The URL to shorten.

> Example code not captured in source.

See also: UrlEncode, CloudPagesURL

---

## Encryption & Hashing Functions

### Base64Decode

Support: Engagement ✅ · Next ❌

Decodes a Base64-encoded string.

Parameters:
- `stringToDecode` — Required. The Base64-encoded string to decode.
- `abortSendOnFail` — Optional. `1` = abort the send if decoding fails (default); `0` = continue on failure.

> Example code not captured in source.

See also: EncryptSymmetric, DecryptSymmetric

### EncryptSymmetric

Support: Engagement ✅ · Next ❌

Encrypts a string using a symmetric encryption algorithm with a password/key, salt, and initialization vector (IV). Key material can be supplied inline or referenced by external key.

Parameters:
- `data` — Required. The string to encrypt.
- `encryptionAlgoritm` — Required. The symmetric algorithm to use.
- `passwordExternalKey` — Optional. External key name that references the password/key.
- `passwordValue` — Optional. Inline password/key value.
- `saltExternalKey` — Optional. External key name that references the salt.
- `saltValue` — Optional. Inline salt value (8-byte hexadecimal).
- `ivExternalKey` — Optional. External key name that references the IV.
- `ivValue` — Optional. Inline IV value (16-byte hexadecimal).

> Example code not captured in source.

See also: DecryptSymmetric, Base64Decode

### DecryptSymmetric

Support: Engagement ✅ · Next ❌

Decrypts a string that was encrypted with a symmetric algorithm, using the matching password/key, salt, and IV.

Parameters:
- `encryptedData` — Required. The encrypted string to decrypt.
- `encryptionAlgoritm` — Required. The symmetric algorithm used to encrypt the data. Accepts `aes`, `des`, or `tripledes`.
- `passwordExternalKey` — Optional. External key name that references the password/key.
- `passwordValue` — Optional. Inline password/key value.
- `saltExternalKey` — Optional. External key name that references the salt.
- `saltValue` — Optional. Inline salt value (8-byte hexadecimal).
- `ivExternalKey` — Optional. External key name that references the IV.
- `ivValue` — Optional. Inline IV value (16-byte hexadecimal).

> Example code not captured in source.

See also: EncryptSymmetric, Base64Decode

### MD5

Support: Engagement ✅ · Next ❌

Returns the MD5 hash of a string.

Parameters:
- `stringToConvert` — Required. The string to hash.
- `encoding` — Optional. The character encoding/charset used when hashing.

> Example code not captured in source.

See also: SHA1, SHA256, SHA512

### SHA1

Support: Engagement ✅ · Next ❌

Returns the SHA-1 hash of a string.

Parameters:
- `stringToConvert` — Required. The string to hash.
- `encoding` — Optional. The character encoding/charset used when hashing.

> Example code not captured in source.

See also: MD5, SHA256, SHA512

### SHA256

Support: Engagement ✅ · Next ❌

Returns the SHA-256 hash of a string.

Parameters:
- `stringToConvert` — Required. The string to hash.
- `encoding` — Optional. The character encoding/charset used when hashing.

> Example code not captured in source.

See also: MD5, SHA1, SHA512

### SHA512

Support: Engagement ✅ · Next ❌

Returns the SHA-512 hash of a string.

Parameters:
- `stringToConvert` — Required. The string to hash.
- `encoding` — Optional. The character encoding/charset used when hashing.

> Example code not captured in source.

See also: MD5, SHA1, SHA256

### GetJWT

Support: Engagement ✅ · Next ❌

Generates a signed JSON Web Token (JWT) from a plaintext secret, algorithm, and JSON payload. `GetJWTByKeyName()` is recommended instead because it references a managed key rather than embedding a plaintext secret.

Parameters:
- `secret` — Required. The plaintext signing secret.
- `algorithm` — Required. The signing algorithm: `HS256`, `HS384`, or `HS512`.
- `jsonPayload` — Required. The JSON payload to encode into the token.

> Example code not captured in source.

See also: GetJWTByKeyName

### GetJWTByKeyName

Support: Engagement ✅ · Next ❌

Generates a signed JSON Web Token (JWT) using a signing key stored in Key Management, referenced by external key name. Recommended over `GetJWT()` because the secret is not embedded in plaintext.

Parameters:
- `keyName` — Required. The external key of the signing key in Key Management.
- `algorithm` — Required. The signing algorithm: `HS256`, `HS384`, `HS512`, `RS256`, `RS384`, or `RS512`.
- `jsonPayload` — Required. The JSON payload to encode into the token.

> Example code not captured in source.

See also: GetJWT
