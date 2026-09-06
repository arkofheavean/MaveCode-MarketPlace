# Flow Custom Actions (Python / Node.js)

Custom actions run Python or Node.js code inside a flow. They let you enrich, normalize, or compute data before a downstream email renders — for example, currency normalization, coupon marking, weather personalization, event modification, or generating personalized text. Custom actions are a gated feature.

When you create a new code function, the first time you are asked to authenticate the **Code OAuth** application, granting the functions access to data in your Klaviyo account on your behalf. After granting access you are taken to the Code editor.

## Editor

The Editor tab contains sub-tabs:

- **Code** — write Python or JavaScript code.
- **Modules** — 3rd-party packages that add functionality to your functions.
- **Environment Variables** — key/value pairs your function accesses when it runs.
- **Output** — add up to 5 outputs referenced by downstream actions in your flow.

## Writing function code

For Klaviyo to execute your code, wrap it in a function named `handler` that accepts 3 parameters:

- `event` — the event data associated with the triggering event, in JSON:API format. For non-event-based triggers (e.g., Added To List), this is `None`/`null` depending on the language.
- `profile` — the JSON:API profile object for the current evaluation; its schema matches the profile object returned by the Klaviyo API.
- `context` — additional metadata about the function execution.

In Python, defining the handler is all that's needed. In Node.js you must also **export** the function so Klaviyo can access it, and it's good practice to declare `handler` as `async` so you can `await` Promises inside it.

## The klaviyo module

All functions come with a custom `klaviyo` package pre-installed. It lets your functions access data in your Klaviyo account without supplying credentials such as an API key.

### Python klaviyo module

The `klaviyo` module's API matches the klaviyo SDK object you would normally instantiate using the `klaviyo-api` Python module — think of it as a pre-instantiated client.

Traditional workflow (instantiate the client yourself):

```python
from klaviyo_api import KlaviyoAPI
import os
def handler(event, profile, context):
  klaviyo = KlaviyoAPI(api_key=os.getenv("KLAVIYO_API_KEY"))
  print(klaviyo.Metrics.get_metrics())
```

With Code, import the `klaviyo` object and authentication is handled for you:

```python
import klaviyo

def handler(event, profile, context):
  print(klaviyo.Metrics.get_metrics())
```

Available API objects and methods: https://pypi.org/project/klaviyo-api .

### JavaScript klaviyo module

Import the specific Klaviyo features you want using curly-brace syntax from the `klaviyo` module, then use them as you would an API object with the `klaviyo-api` JS module:

```javascript
import { Metrics } from 'klaviyo';
export default async (event, profile, context) => {
  console.log(await Metrics.getMetrics())
}
```

Available API objects and methods: https://www.npmjs.com/package/klaviyo-api .

## External modules

In the Modules tab, select from the most popular prebuilt 3rd-party packages. Click **Add module**, then search and select the module. Refer to each external module's native documentation for how to use it.

## Environment variables

The Environment Variables tab stores key/value pairs (e.g., credentials and secret keys) your code can reference at runtime. Click **Add a variable** to set a pair. Access them with `os.getenv("Key")` in Python or `process.env.Key` in Node.js.

## Test output

The Test tab lets you test your code with recent events. Click **Run Test**, select a profile or event (from the 10 most recent events captured in Klaviyo), and view the test output.

## Returning outputs from a custom action

Return data that downstream actions can reference to create dynamic, personalized experiences — passing custom data directly into email templates. Currently, outputs can be used in email actions (support for profile property updates, SMS, and conditional split actions is coming soon).

### 1. Configure your outputs

In the Outputs tab, add up to 5 outputs. Each must have:

- **Name** — any combination of characters `a-zA-Z0-9_`
- **Type** — one of `string`, `number`, or `boolean`
- **Default value** — used if your function fails to return an output as expected (throws, times out, or returns the wrong type)

### 2. Update your handler function

Return the configured outputs in a dictionary whose keys are the output names and whose values are the outputs.

Python example:

```python
def handler(event, profile, context):
  # do some logic here
  return {
    "forecast_description": "Sunny",
    "forecast_temp": 25
  }
```

Node.js example:

```javascript
export default async (event, profile, context) => {
  // do some logic here
  return {
    forecast_description: "Sunny",
    forecast_temp: 25
  }
}
```

### 3. Test your function outputs

Click **Test** in the upper right and choose a test event. You'll see output data and validity based on your output configurations, alongside function logs.

### 4. Use outputs in your email templates

When the flow evaluates, your function's outputs can be referenced by downstream email templates. Outputs are exposed as Django template variables using the syntax:

```
{{outputs.<action_name>.<output_name>}}
```

For example, if a custom action called `get_weather` returns an output `forecast_temp`, use it downstream via `{{outputs.get_weather.forecast_temp}}`.

### Output validation and failure behavior

If the handler fails to return all outputs as configured, the action fails and retries **3 times**. If a valid set of outputs is still not returned after 3 retries, the configured default value is used for any invalid outputs.

## Logs

The Logs tab shows the health of the current action: Profile (email address), Status (execution progress), Run ID (unique execution ID; opens a drawer with function logs), Response time, and Date.

## Needs review

If the custom action is set to manual status, profiles are queued in the Needs Review tab for manual approval before the code executes.

## Deploy the action and set it live

1. In the code editor, click **Deploy** to deploy local changes. Changes are preserved even if you leave the page, but only deployed changes affect subsequent flow evaluations. A prebuilt function with no changes is deployed automatically.
2. Click **Done**.
3. Click the custom action again in the flow builder.
4. Rename the action if desired.
5. Change the Status dropdown from Draft to Manual or Live.
6. Click **Save**.

## Limits

- Function timeout: 12 seconds
- Action rate limit: 10 evaluations per second
- Custom actions that fail due to a code error or timeout retry up to 3 times with exponential backoff. The profile does not proceed through the flow until the custom action succeeds or the retry limit is hit.
