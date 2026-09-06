# Consent and Compliance

Collecting email and SMS consent properly is crucial for complying with regulations and maintaining a positive customer relationship. Subscriptions can be created via API, sign-up forms, native or third-party integrations, manual CSV import, and more. This reference focuses on subscribing via API and the consent/suppression information you can get via API.

> This information is not legal advice. Consult your legal counsel to comply with applicable laws in connection with your marketing activities.

## Consent status

Consent status indicates whether someone requested to receive your SMS and/or email marketing. A profile can be:

- `SUBSCRIBED`
- `NEVER_SUBSCRIBED`
- `UNSUBSCRIBED`

## Relevant endpoints

- **Subscribe Profiles** — subscribe a profile to email and/or SMS marketing (server-based applications).
- **Create Client Subscription** — create subscriptions from publicly-browseable, client-side environments.
- **Unsubscribe Profiles** — unsubscribe a profile from email and/or SMS marketing.
- **Suppress Profiles** — suppress a profile to prevent it from receiving email marketing regardless of consent status.
- **Unsuppress Profiles** — unsuppress a profile to allow it to receive email marketing.
- **Add Profile to List** — add a profile to a list with a given list ID (without subscribing).

## Subscribe a profile via API

1. Create new profiles or use existing profiles you want to subscribe.
2. If the profile gave consent, use the subscription endpoints to subscribe them to the appropriate channels (email and/or SMS). Use **Create Client Subscription** for client-side environments; use **Subscribe Profiles** for server-based applications.
3. If a profile has not given explicit consent but you have implicit consent, use **Add Profile to List** to add them to a list without subscribing. The profile is added but keeps a consent status of `NEVER_SUBSCRIBED`.

### With a list

Request to the Subscribe Profiles endpoint updating email and SMS marketing consent and adding to the `Y6nRLr` list:

```bash
curl --request POST \
     --url https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/ \
     --header 'Authorization: Klaviyo-API-Key your-private-api-key' \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --header 'revision: {YYYY-MM-DD}' \
     --data '
{
  "data": {
    "type": "profile-subscription-bulk-create-job",
    "attributes": {
      "profiles": {
        "data": [
          {
            "type": "profile",
            "attributes": {
              "email":"[email protected]",
              "phone_number":"+15005550006",
              "subscriptions": {
                "email": {
                  "marketing": {
                    "consent": "SUBSCRIBED"
                  }
                },
                "sms": {
                  "marketing": {
                    "consent": "SUBSCRIBED"
                  }
                }
              }
            }
          }
        ]
      }
    },
    "relationships": {
      "list": {
        "data": {
          "type": "list",
          "id": "Y6nRLr"
        }
      }
    }
  }
}
'
```

Due to the asynchronous nature of the API call, it may take a short amount of time for the result to display in Klaviyo or in a GET Profile(s) API call.

### Without a list

As of the `2023-10-15` revision, the `list` relationship object is optional. If a list is not provided, Klaviyo uses the account's default opt-in settings (double opt-in unless explicitly changed).

```bash
curl --request POST \
     --url https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/ \
     --header 'Authorization: Klaviyo-API-Key your-private-api-key' \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --header 'revision: {YYYY-MM-DD}' \
     --data '
{
  "data": {
    "type": "profile-subscription-bulk-create-job",
    "attributes": {
      "profiles": {
        "data": [
          {
            "type": "profile",
            "attributes": {
              "email":"[email protected]",
              "phone_number":"+15005550006",
              "subscriptions": {
                "email": {
                  "marketing": {
                    "consent": "SUBSCRIBED"
                  }
                },
                "sms": {
                  "marketing": {
                    "consent": "SUBSCRIBED"
                  }
                }
              }
            }
          }
        ]
      }
    }
  }
}
'
```

## Single vs. double opt-in

### With a list

When subscribing via API with a list, the **list's** opt-in process determines the opt-in process. The account's default opt-in settings have no impact when a list is provided.

- **Single opt-in** — the profile does not need to confirm their subscription before consent status is updated.
- **Double opt-in** — the profile is asked to confirm. You won't see them marked consented in subsequent API requests, nor an update to the Channel box in the UI, until they finish opting in.

To avoid sending a double opt-in email/SMS, subscribe to a single opt-in list. If Subscribe Profiles calls are accepted but consent status isn't changing, check whether the list is double opt-in.

### Without a list

When subscribing without a list, the opt-in process depends on the account's default opt-in settings.

- **Single opt-in** — no confirmation needed before consent status updates.
- **Double opt-in** (the default) — the profile must confirm before consent status updates.

## About subscriptions and consent

**Implicit consent** is when someone gives you their contact information but does not explicitly say they want marketing messages. These profiles have consent status `NEVER_SUBSCRIBED`. A common example is a customer providing their email at checkout. They can receive emails, but exercise caution — depending on local regulations you may or may not be permitted to email them.

> Klaviyo recommends only emailing profiles with express consent to protect deliverability and sender reputation. **Implied consent does not apply to SMS subscriptions. Consent must be explicit for SMS.**

## SMS-specific considerations

### Configuring SMS

Before collecting SMS consent you must have enabled SMS in Klaviyo and set up your sending number(s). If SMS setup is incomplete you may receive:

```
"SMS configuration is required to subscribe phone number only profiles."
```

When subscribing to SMS while age-gating is enabled, `age_gated_date_of_birth` is required; if missing or non-compliant with the region's requirements, the call returns a 400 error.

### Phone number validation

Ensure each phone number is a valid (real) number, that your account's sending number supports the country code, and that there are no spaces between numbers. If you include a valid email but an invalid phone number, the request succeeds but the invalid phone number is ignored, and the response includes a partial-failure header:

```
"X-Klaviyo-Partial-Failure: phone_number"
```

## Get subscription information via API

To retrieve the subscriptions object, use the `?additional-fields` query parameter. Subscriptions objects are always associated with a profile object.

```bash
curl --request GET \
     --url 'https://a.klaviyo.com/api/profiles/?additional-fields[profile]=subscriptions' \
     --header 'Authorization: Klaviyo-API-Key your-private-api-key' \
     --header 'accept: application/json' \
     --header 'revision: 2023-10-15'
```

Sample response (abridged):

```json
{
    "data": [
        {
            "type": "profile",
            "id": "01EFPSGTVXBGERQPGM3VQ734KS",
            "attributes": {
                "email": "str",
                "location": {...},
                "properties": {
                    "Shopify Tags": [],
                    "Accepts Marketing": true,
                    "$city__transformed": "Norwalk",
                    "$country__transformed": "United States",
                    "$first_name__transformed": "Theodore"
                },
                "subscriptions": {
                    "email": {
                        "marketing": {
                            "can_receive_email_marketing": true,
                            "consent": "NEVER_SUBSCRIBED",
                            "consent_timestamp": null,
                            "last_updated": null,
                            "method": null,
                            "method_detail": null,
                            "custom_method_detail": null,
                            "double_optin": null,
                            "suppression": [],
                            "list_suppressions": []
                        }
                    },
                    "sms": {
                        "marketing": {
                            "can_receive_sms_marketing": true,
                            "consent": "SUBSCRIBED",
                            "consent_timestamp": "2023-07-28T13:26:48.852051+00:00",
                            "method": "TEXT",
                            "method_detail": "JOIN",
                            "last_updated": "2023-07-28T13:26:48.852051+00:00"
                        }
                    }
                }
            }
        }
    ]
}
```

### Marketing fields

- `method_detail` may contain additional information depending on the subscription source.
- `custom_method_detail` contains any information passed into the optional `custom_source` field for Subscribe Profiles and Create Client Subscription (`custom_source` is equivalent to the `$source` parameter in the legacy v2 Subscribe API).
- `double_optin` is only `true` if the email recipient received a double opt-in message and confirmed it.

It is recommended to use the `channels` object to explicitly set which marketing channels you want the profile to subscribe to (related to the "Channel Status" box in the Klaviyo UI).

### Filtering rules

- You cannot mix-and-match list and global filters.
- You may only specify a single date filter.
- You may or may not specify a reason.
- You must specify a `list_id` to filter on any list suppression properties.

## Unsubscribing a profile via API

Use the **Unsubscribe Profiles** endpoint to unsubscribe one or more profiles from email marketing, SMS marketing, or both. To remove someone from a list without changing their subscription status, use the **Remove Profile from List** endpoint.

## Suppressing a profile via API

Suppression is a separate concept from consent. Suppression status tells you whether a profile is to receive your email marketing (suppression does not yet exist for SMS). You may want to suppress a consented profile if, for example, they are no longer engaged.

- Use **Suppress Profiles** to manually suppress. Such profiles have `USER_SUPPRESSED` as their suppression reason and will not receive email marketing.
- Use **Unsuppress Profiles** to remove manual suppressions (`USER_SUPPRESSED`). A profile may receive email marketing again after a manual suppression is removed, as long as they have not revoked consent (unsubscribed).

Currently, you can only suppress or unsuppress a profile via an email identifier.
