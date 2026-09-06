# Transactional Email Templates (Create Event API)

In Klaviyo you can trigger marketing content and transactional content off the same metrics; a transactional email is simply defined as an essential, non-marketing email, typically sent in response to a direct interaction with your brand where it is imperative the customer receives a response.

To send transactional emails, make a **Create Event** call to Klaviyo's **server-side** endpoint, then build a flow/template that listens for the metric. Sending transactional events via a Client endpoint can be blocked by a browser or device, so always prefer the server-side Create Event endpoint.

SDKs available for server-side requests:

- Python
- Ruby
- PHP
- Node.js

## Server-side request essentials

Send server-side data in one of two ways:

- **Real-time** — requests are made as soon as an action is taken.
- **Batch** — a script runs at least once an hour, sending all events from the past hour to your Klaviyo account.

Key things to be aware of:

- `unique_id` should be a unique identifier for the event (e.g., Order ID).
- If the same combination of **metric name** and **unique_id** is sent more than once, all subsequent events with that combination are **skipped**. This is what prevents retries from double-sending.
- `time` is a special property; use an acceptable date/timestamp format.
- Put information about the person (e.g., first name) as profile properties in the `profile` dictionary, and information specific to the event (e.g., a list of ordered items) in the `properties` dictionary.

> The snippets below use example data. Update the JSON property values so they dynamically pull the relevant information for each property.

This guide covers these common transactional emails:

- **Account notifications** — Created account, Updated account, Updated email, Reset password
- **Order notifications** — Invoice created, Order confirmation, Failed payment
- **Shipping notifications**
- **Lead tracking** — Became lead, New lead

## Account notifications

### Created account

Use a created account event to send confirmation and welcome emails thanking a new subscriber and/or reviewing what they can do now that they have an account.

```json
{
  "data": {
    "type": "event",
    "attributes": {
      "properties": {...},
      "metric": {
        "data": {
          "type": "metric",
          "attributes": {
            "name": "Created Account"
          }
        }
      },
      "profile": {
        "data": {
          "type": "profile",
          "id": "01H81WC034AKRMQJQARPEEBHJE",
          "attributes": {
            "email": "[email protected]",
            "phone_number": "+15551234567",
            "first_name": "John",
            "last_name": "Smith",
            "location": {
              "address1": "123 Abc St",
              "city": "Boston",
              "country": "United States",
              "region": "MA",
              ...
            }
          }
        }
      },
    "time": "2023-10-15T00:00:00",
    "unique_id": "1234"
    }
  }
}
```

### Updated account

Trigger an updated account event when someone updates account information such as their email address, name, or password. Use it to confirm updated account information or provide next steps.

Properties you could include in the `properties` dictionary:

| Property | Type | Description |
| --- | --- | --- |
| UpdateType | string | Description of the properties being updated |
| UpdatedProperties | array | Properties being updated |
| OldValues | dictionary | Current values of the properties in Klaviyo |
| NewValues | dictionary | New values for the properties |

```json
{
  "data": {
    "type": "event",
    "attributes": {
      "properties": {
        "UpdateType": "Property Update",
        "UpdatedProperties": ["Favorite colors", "Birthday"],
        "OldValues":{
          "Birthday": "",
          "FavoriteColors":["green", "yellow"]
        },
        "NewValues":{
          "Birthday": "1989-01-18 00:00:00",
          "FavoriteColors": ["green", "yellow", "black"]
        }
      },
      "metric": {
        "data": {
          "type": "metric",
          "attributes": {
            "name": "Updated Account"
          }
        }
      },
      "profile": {
        "data": {
          "type": "profile",
          "id": "01H81WC034AKRMQJQARPEEBHJE",
          "attributes": {
            "email": "[email protected]",
            "phone_number": "+15551234567",
            "first_name": "John",
            "last_name": "Smith",
            "location": {
              "address1": "123 Abc St",
              "city": "Boston",
              "country": "USA",
              "region": "MA",
              "zip": "02110"
            }
          },
          "properties": {
            "FavoriteColors": ["green", "yellow"],
            "Birthday": "1989-01-18 00:00:00"
          }
        }
      },
    "time": "2023-10-15T00:00:00",
    "unique_id": "1234"
    }
  }
}
```

### Updated email

To update a profile's email address, make an additional set of requests, because Klaviyo uses the email address as the primary identifier for a profile. The same process applies to updating the phone number for an SMS-only profile. When a profile is created, Klaviyo assigns an uneditable 26-character identifier (the Profile ID), present in the profile URL in the dashboard. Update a profile by making a request to the Update Profile endpoint using the Profile ID.

### Reset password

Set up a reset password event when a person requests to reset their password. Send a reset password payload with the reset link included in the `properties` dictionary. This event can trigger a flow email for the person to reset their password.

```json
{
  "data": {
    "type": "event",
    "attributes": {
      "properties": {...},
      "metric": {
        "data": {
          "type": "metric",
          "attributes": {
            "name": "Reset Password",
            "PasswordResetLink": "https://www.website.com/reset/1234567890987654321"
          }
        }
      },
      "profile": {
        "data": {
          "type": "profile",
          "id": "01H81WC034AKRMQJQARPEEBHJE",
          "attributes": {
            "email": "[email protected]"
          }
        }
      },
    "time": "2023-10-15T00:00:00",
    "unique_id": "1234"
    }
  }
}
```

## Order notifications

### Created invoice or created order notifications

Set up created invoice and created order events when there is an incomplete order that needs customer action (e.g., a signature, size selection, setting up billing frequency) before it can be processed.

A created invoice event is similar to a started checkout event. The type of notification depends on your business and the data you send:

- **Abandoned cart notification** — encourages a person to complete a purchase they left behind.
- **Invoice notification** — notifies a customer they need to provide more information before their order can be completed.

Include in the `properties` dictionary: all of the invoice information entered by the customer, and any missing information (under `MissingInformation`, formatted as an array).

```json
{
  "data": {
    "type": "event",
    "attributes": {
      "properties": {
        "OrderId": "1234",
        "Categories": [
          "Fiction",
          "Children"
        ],
        "ItemNames": [
          "Winnie the Pooh"
        ],
        "DiscountCode": "Free Shipping",
        "DiscountValue": 5,
        "Items": [
          {
            "ProductID": "1111",
            "SKU": "WINNIEPOOH",
            "ProductName": "Winnie the Pooh",
            "Quantity": 1,
            "ItemPrice": 9.99,
            "RowTotal": 9.99,
            "ProductURL": "http://www.example.com/path/to/product",
            "ImageURL": "http://www.example.com/path/to/product/image.png",
            "Categories": [
              "Fiction",
              "Children"
            ]
          }
        ],
        "BillingAddress": {
          "FirstName": "John",
          "LastName": "Smith",
          "Address1": "123 Abc St",
          "City": "Boston",
          "RegionCode": "MA",
          "CountryCode": "US",
          "Zip": "02110",
          "Phone": "+15551234567"
        },
        "ShippingAddress": {
          ...
        }
      },
      "time": "2023-10-31T00:00:00",
      "value": 9.99,
      "metric": {
        "data": {
          "type": "metric",
          "attributes": {
            "name": "Created Invoice"
          }
        }
      },
      "profile": {
        "data": {
          "type": "profile",
          "id": "01GDDKASAP8TKDDA2GRZDSVP4H",
          "attributes": {
            "email": "[email protected]",
            "phone_number": "+15551234567",
              ...
            }
          }
        }
      },
    "time": "2023-10-15T00:00:00",
    "unique_id": "1234"
    }
  }
}
```

### Placed Order (order confirmation) notifications

You can trigger an order confirmation off of a Placed Order event as long as the event contains all the information required for an order confirmation email. The format depends on your business, but order confirmations typically include:

- Customer's name
- Billing information
- Items purchased
- Payment method

Refer to Klaviyo's integration guides for Placed Order event examples (custom platform without a pre-built integration; subscription-based business without a pre-built integration).

### Failed payment notifications

Use a failed payment event to notify a customer of a failed payment and, optionally, the steps to complete it. Similar structure to the created invoice event. Include in the `properties` dictionary: the reason payment failed (string), next steps to complete payment (string), and all order information.

```json
{
  "data": {
    "type": "event",
    "attributes": {
      "properties": {
        "OrderId": "1234",
        "PaymentFailure": "Credit card not accepted",
        "PaymentNextSteps": "Please use a different payment method or contact your credit card provider.",
        "Categories": [
          "Fiction",
          "Children"
        ],
        "ItemNames": [
          "Winnie the Pooh"
        ],
        "DiscountCode": "Free Shipping",
        "DiscountValue": 5,
        "Items": [
          {
            "ProductID": "1111",
            "SKU": "WINNIEPOOH",
            "ProductName": "Winnie the Pooh",
            "Quantity": 1,
            "ItemPrice": 9.99,
            "RowTotal": 9.99,
            "ProductURL": "http://www.example.com/path/to/product",
            "ImageURL": "http://www.example.com/path/to/product/image.png",
            "Categories": [
              "Fiction",
              "Children"
            ]
          }
        ]
      },
      "time": "2023-10-31T00:00:00",
      "value": 9.99,
      "metric": {
        "data": {
          "type": "metric",
          "attributes": {
            "name": "Failed Payment"
          }
        }
      },
      "profile": {
        "data": {
          "type": "profile",
          "id": "01GDDKASAP8TKDDA2GRZDSVP4H",
          "attributes": {
            "email": "[email protected]"
            }
          }
        }
      },
    "time": "2023-10-15T00:00:00",
    "unique_id": "1234"
    }
  }
```

## Shipping notifications

If you have the relevant information, send shipping notifications. To create a trigger, add an `UpdateType` to the `properties` dictionary and track shipping statuses:

- Delivered
- Out for delivery
- Shipped

```json
{
  "data": {
    "type": "event",
    "attributes": {
      "properties": {
        "OrderId": "1234",
        "UpdateType": "Out for delivery",
        "Categories": [
          "Fiction",
          "Children"
        ],
        "ItemNames": [
          "Winnie the Pooh"
        ],
        "DiscountCode": "Free Shipping",
        "DiscountValue": 5,
        "Items": [
          {
            "ProductID": "1111",
            "SKU": "WINNIEPOOH",
            "ProductName": "Winnie the Pooh",
            "Quantity": 1,
            "ItemPrice": 9.99,
            "RowTotal": 9.99,
            "ProductURL": "http://www.example.com/path/to/product",
            "ImageURL": "http://www.example.com/path/to/product/image.png",
            "Categories": [
              "Fiction",
              "Children"
            ]
          }
        ],
        "ShippingAddress": {
          "FirstName": "John",
          "LastName": "Smith",
          "Address1": "123 Abc St",
          "City": "Boston",
          "RegionCode": "MA",
          "CountryCode": "US",
          "Zip": "02110",
          "Phone": "+15551234567"
        }
      },
      "time": "2023-10-31T00:00:00",
      "value": 9.99,
      "metric": {
        "data": {
          "type": "metric",
          "attributes": {
            "name": "Shipping Update"
          }
        }
      },
      "profile": {
        "data": {
          "type": "profile",
          "id": "01GDDKASAP8TKDDA2GRZDSVP4H",
          "attributes": {
            "email": "[email protected]"
            }
          }
        }
      },
    "time": "2023-10-15T00:00:00",
    "unique_id": "1234"
    }
  }
```

## Lead tracking

Transactional emails are sometimes used for internal lead tracking, on a prospective customer's profile or a customer representative's profile.

| Event | Location | Description |
| --- | --- | --- |
| Became Lead | Prospective customer's profile | When someone becomes a lead or takes a specific action which qualifies them for a personal reach-out. |
| New Lead | Customer representative's profile | Notify the customer representative who will take ownership of the new lead. |

Add customer information to the `profile` dictionary and any lead-status triggering actions (e.g., filling out a request form) to the `properties` dictionary.

### Became lead

Use this action to filter and report on new lead activity as a whole, or to send confirmation emails around the action the lead took.

```json
{
  "data": {
    "type": "event",
    "attributes": {
      "properties": {
        "Action": "Filled out whitepaper request form"
      },
      "metric": {
        "data": {
          "type": "metric",
          "attributes": {
            "name": "Became Lead"
          }
        }
      },
      "profile": {
        "data": {
          "type": "profile",
          "id": "01H81WC034AKRMQJQARPEEBHJE",
          "attributes": {
            "email": "[email protected]",
            "phone_number": "+15551234567",
            "first_name": "John",
            "last_name": "Smith",
            "location": {
              "address1": "123 Abc St",
              "city": "Boston",
              ...
            }
          },
          "properties": {
            "MostRecentLeadSource": "Whitepaper request form"
          }
        }
      },
    "time": "2023-10-15T00:00:00",
    "unique_id": "1234"
    }
  }
}
```

### New lead

Use this event to trigger a transactional email to your representative so they can take further action on the new lead.

```json
{
  "data": {
    "type": "event",
    "attributes": {
      "properties": {
        "LeadFirstName": "John",
        "LeadLastName": "Smith",
        "LeadPhoneNumber": "5551234567",
        "LeadEmailAddress": "[email protected]",
        "LeadAction": "Filled out whitepaper request form"
      },
      "metric": {
        "data": {
          "type": "metric",
          "attributes": {
            "name": "New Lead"
          }
        }
      },
      "profile": {
        "data": {
          "type": "profile",
          "id": "01H81WC034AKRMQJQARPEEBHJE",
          "attributes": {
            "email": "[email protected]",
            "phone_number": "+15551234567",
            "first_name": "John",
            "last_name": "Smith",
            "location": {
              "address1": "123 Abc St",
              "city": "Boston",
              ...
            }
          },
          "properties": {
            "MostRecentLeadSource": "Whitepaper request form"
          }
        }
      },
    "time": "2023-10-15T00:00:00",
    "unique_id": "1234"
    }
  }
}
```
