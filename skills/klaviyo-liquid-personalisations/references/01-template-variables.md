# Template Variables

Source: Klaviyo developer documentation — "Message design overview" (https://developers.klaviyo.com/en/docs/django_message_design).

Klaviyo supports a large number of message template tags (sometimes called merge tags) usable in marketing messages and Customer Hub. Klaviyo supports most of the filters used by the **Django template language**, along with some custom ones. There are three ways to customize content: **template variables**, **template tags**, and **template filters**.

| Type | Template | Output |
| --- | --- | --- |
| Template Variable | `Hi {{ first_name }} {{ last_name }}, your email is {{ email }}...` | Hi George Washington, your email is [email protected]... |
| Template Tag | `{% manage_preferences %}` / `{% web_view %}` | Update preferences / View in your browser |
| Template Filter | `Hey {{ first_name|default:'friend' }}, any interest in some {{ person|lookup:'Favorite Food' }}?` | Hey friend, any interest in some hawaiian pizza with extra anchovies? |

> Note: Django template variables cannot include spaces or special characters such as hyphens. Underscores are allowed but must not start the variable name.

## Personalization variables

Personalization is at the heart of Klaviyo. There are a number of built-in variables plus an unlimited number of custom properties, and you can choose a default value to fill in for missing values.

### First name

| Template | Output |
| --- | --- |
| `Hi {{ first_name }}, ...` | Hi George, ... |
| `Hi {{ first_name|default:'there' }}, ...` | Hi there, ... |

### Last name

| Template | Output |
| --- | --- |
| `Your last name is {{ last_name }}.` | Your last name is Washington. |

### Full name

| Template | Output |
| --- | --- |
| `Your full name is {{ full_name }}.` | Your full name is George Washington. |

### Email address

| Template | Output |
| --- | --- |
| `Your email address is {{ email }}.` | Your email address is [email protected]. |

## Custom properties

If you've added extra properties to individuals, use them with the `person` variable and the `lookup` filter. Provide a `default` value in case someone doesn't have the property.

| Template | Output |
| --- | --- |
| `Your favorite color is {{ person|lookup:'Favorite Color' }}.` | Your favorite color is blue. |
| `Your favorite TV show is {{ person|lookup:'Favorite TV Show'|default:'unknown' }}.` | Your favorite TV show is unknown. |

## Account variables

Account variables include information about your company or organization, managed on your account page.

| Template | Output |
| --- | --- |
| `You received this message from {{ organization.name }}.` | You received this message from the United States of America. |
| `Our address is {{ organization.full_address }}.` | Our address is 1600 Pennsylvania Avenue Washington D.C. 20500. |

## Event variables

For flows based on metrics, templates have a variable that represents the event that triggered the email, letting you use information about that event.

- If you send events to Klaviyo via the API, all properties for those events are available through the `event` variable and `lookup` filter.
- For integrations with other services, Klaviyo automatically stores detailed information specific to each service and metric. View available properties while creating a flow email by clicking **Preview**.

| Template | Output |
| --- | --- |
| `Thanks for your purchase of ${{ event|lookup:'total_price' }}.` | Thanks for your purchase of $29.00. |
| `How do you like your new {{ event|lookup:'Items Purchased' }}?` | How do you like your new blue suede shoes? |
