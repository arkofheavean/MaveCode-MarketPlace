# Conditionals, Loops, and Filters

Source: Klaviyo developer documentation — "Message design overview" (https://developers.klaviyo.com/en/docs/django_message_design).

## Conditional tags

Conditional tags conditionally include content in campaigns and Customer Hub (e.g., show or hide a content block based on whether a profile is part of your rewards program). They personalize campaigns per recipient and, for flows triggered by an action, can include information from that event.

### If-else blocks

If-else blocks control what content someone receives based on a variable's value.

| Template | Output |
| --- | --- |
| `{% if person|lookup:'Interested in Dogs?' %} Like dogs? Check out some great toys for your canine. {% else %} Like cats? Check out some great toys for your feline. {% endif %}.` | Like dogs? Check out some great toys for your canine. |

### For blocks

For blocks iterate over each item in a variable that stores a list and render them individually.

| Template | Output |
| --- | --- |
| `{% for item in event.shopping_cart_items %} {{ item.name }} × {{ item.quantity }} {% endfor %}.` | Oversized Beach Blanket × 1 Beach Chairs × 4 30 SPF Sunscreen × 2 20" Plastic Cooler × 1 |

## Basic filters

Filters modify how a variable is displayed and go directly after a variable, separated by a pipe character `|`. Some filters take an argument: after the filter, use a colon `:` and surround the argument with single quotes `' '`.

### Lookup

Used for looking up properties on people or events.

| Template | Output |
| --- | --- |
| `{{ person|lookup:'Birthday' }}.` | July 8th |
| `${{ event|lookup:'Total Spent' }}.` | $19.99 |

### Default

Specifies a default in case a variable doesn't have a value — useful as a placeholder when you don't always have the information (e.g., someone's name).

| Template | Output |
| --- | --- |
| `Hi {{ first_name|default:'friend' }}, ...` | Hi friend, ... |

### Floatformat and other Django filters

Klaviyo supports most of the filters used by the Django template language. For example, the `floatformat` filter formats numbers.

| Template | Output |
| --- | --- |
| `You earned {{ event|lookup:'Points Earned'|floatformat:1 }} points.` | You earned 25.5 points. |

## Additional resources (from source)

- Use filters to customize variables
- Glossary of variable filters
