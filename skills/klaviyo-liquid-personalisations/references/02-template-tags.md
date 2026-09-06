# Template Tags

Source: Klaviyo developer documentation — "Message design overview" (https://developers.klaviyo.com/en/docs/django_message_design).

Template tags use `{% tag %}` syntax and output important links or information (unsubscribe links, share links, dates, and more). Some tags create content shown only when conditions are met, or loops to iterate over content.

## List and campaign tags

List and campaign tags allow recipients to manage their subscription preferences and view your campaign in their browser.

### Unsubscribe

Klaviyo requires an unsubscribe link on all campaigns. By default the link text is "Unsubscribe." An optional parameter customizes the text; a separate tag provides just the URL. When a recipient clicks unsubscribe, they're taken to a confirmation page; unsubscribes appear in the People section.

| Template | Output |
| --- | --- |
| `{% unsubscribe %}` | Unsubscribe |
| `No longer want to receive these emails? {% unsubscribe 'click here' %}.` | If you'd no longer like to receive emails, click here. |
| `This is a fancy <a href="{% unsubscribe_link %}" style="color:red;">unsubscribe</a> link.` | This is a fancy unsubscribe link. |

### Web view

Gives recipients a link to a web page hosting your campaign. A URL-only version is available.

| Template | Output |
| --- | --- |
| `{% web_view %}` | View in Your Browser |
| `Can't see this email? {% web_view 'Open in your browser' %}.` | Can't see this email? Open in your browser. |
| `This is a fancy <a href="{% web_view_link %}" style="color:blue;">web view</a> link.` | This is a fancy web view link. |

### Manage preferences

For standard lists, you can create a customizable preferences page. A URL-only version is available.

| Template | Output |
| --- | --- |
| `{% manage_preferences %}` | Manage Preferences |
| `Want to update your preferences? {% manage_preferences 'Click here' %}.` | Want to update your preferences? Click here. |
| `This is a fancy <a href="{% manage_preferences_link %}" style="color:orange;">manage preferences</a> link.` | This is a fancy manage preferences link. |

## Date tags

Date tags insert the time of a campaign into an email. The date is in the timezone of your account.

### Current day

Inserts the current day of the month (e.g., the first day of the month is `1`).

| Template | Output |
| --- | --- |
| `The current day of the month is {% current_day %}.` | The current day of the month is 1. |

### Current day of the week

Inserts the current day of the week (English names only).

| Template | Output |
| --- | --- |
| `Today is {% current_weekday %}.` | Today is Sunday |

### Current month

Inserts the current month as a number (e.g., January is `1`).

| Template | Output |
| --- | --- |
| `The current month is {% current_month %}.` | The current month is 1. |

### Current month name

Inserts the name of the current month (English names only).

| Template | Output |
| --- | --- |
| `The current month is {% current_month_name %}.` | The current month is January. |

### Current year

Inserts the current year.

| Template | Output |
| --- | --- |
| `The current year is {% current_year %}.` | The current year is 2021. |
