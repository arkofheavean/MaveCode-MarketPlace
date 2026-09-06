# Custom-Coded Blocks, Catalog Lookup, Product Feeds, and AMP

Sources:
- "Use custom catalog data in emails" (https://developers.klaviyo.com/en/docs/how_to_use_custom_catalog_data_in_emails)
- "Send AMP emails in Klaviyo" (https://developers.klaviyo.com/en/docs/send_amp_emails_in_klaviyo)

## Before you begin (catalog)

Before using the product feed feature and adding product recommendations, sync your custom catalog feed to Klaviyo. Use Klaviyo's custom catalog sync feature or the Catalogs API to bring your catalog into Klaviyo.

Product feeds are a type of data feed that pulls information from your custom catalog to display product recommendations in emails. They can be used in flow or campaign emails via the drag-and-drop **product block**.

> Note: Product blocks do NOT support any custom HTML. To custom-code a product block, build one manually using the **Source** option of a text block.

## Create a product feed

Once your custom catalog sync setup is finalized, you can use the product feed feature and add product blocks. Create a product feed using the custom catalog feed data (see "How to use product feeds and recommendations"). When setting up your feed, choose a feed setup that corresponds to one of the metrics you requested during your custom catalog setup; a custom metric will appear in the product feed builder.

Personalized recommendation options for each customer are based on:

- **Recently viewed products** — based on `Viewed Product`.
- **Products a customer may also like** — prompts a second setting dropdown; choose `Viewed Product`, `Ordered Product`, `Viewed Product and Ordered Product` (combined), or a non-native metric (custom metrics created in Klaviyo or API metrics).
- **Products added to cart** — based on either `Added to Cart` or `Checkout Started` (depending on whether Added to Cart is enabled) and `Ordered Product` (to exclude products the customer has ordered).

## Using a product block

Once a product feed is set up using custom catalog items, follow "How to insert a product block" to start using product blocks in emails.

## Using the catalog lookup tag

Catalog lookup tags reference specific product information from your catalog within emails using an item's unique ID (`$id`). This is useful for creating custom product recommendations or cross-referencing product information.

For example, if you use your own product recommendation engine, add recommended products to a person's profile by passing a list of product IDs as a custom profile property (e.g., `["a123","b456","c789"]`). Then iterate through that list and perform a catalog lookup on each ID to pull in product information to add to an email. (See "Overview of the catalog lookup tag.")

## AMP markup and the verbatim tag

AMP is a MIME type. If you use AMP, a plain text, HTML, and AMP MIME type are all sent within one email; the inbox provider chooses which to display.

### AMP-Mustache vs. Django curly braces

AMP-Mustache fills in content based on a dynamic endpoint each time the URL is opened, and uses curly-brace syntax that conflicts with Django variable curly braces (e.g., `{{ person.first_name }}`). To prevent Klaviyo from rendering AMP-Mustache braces as Django variables, wrap them in the `verbatim` Django tag.

Wrapping an entire AMP-Mustache template:

```
<body>
    Check out these latest deals from our store!
    <amp-list src="https://amp.dev/static/samples/json/cart.json" layout="fixed-height" height="80">
    {% verbatim %}
    <template type="amp-mustache">
        <div id="cart">
            <!-- These items (and their prices) can be updated dynamically. -->
            {{#cart_items}}
                <div class="cart-item">
                    <span>{{name}}</span>
                    <span>{{price}}</span>
                </div>
            {{/cart_items}}
            {{^cart_items}}
            There are no featured products available. Please check back again later.
            {{/cart_items}}
        </div>
    </template>
    {% end verbatim %}
    </amp-list>
</body>
```

Mixing Klaviyo variables and AMP-Mustache variables — add verbatim tags only around the specific tags that should be interpreted as AMP-Mustache:

```
<body>
    Check out these latest deals from our store!
    <amp-list src="https://amp.dev/static/samples/json/cart.json" layout="fixed-height" height="80">
    <template type="amp-mustache"> <div id="cart">
        <!-- These items (and their prices) can be updated dynamically. -->
        {% verbatim %}{{#cart_items}}{% end verbatim %} Hey {{ person.first_name }}, we saved these just for you!
        <div class="cart-item"> <span>{% verbatim %}{{name}}{% end verbatim %}</span>
            <span>{% verbatim %}{{price}}{% end verbatim %}</span>
        </div> {% verbatim %}{{/cart_items}}{% end verbatim %}
    {% verbatim %}{{^cart_items}}{% end verbatim %}
    There are no featured products available. Please check back again later.
    {% verbatim %}{{/cart_items}}{% end verbatim %} </div>
    </template>
    </amp-list>
</body>
```

### amp-bind

If your email uses `amp-bind` to bind data, use the alternate `data-amp-bind-property` syntax to be compatible with Klaviyo's system.

### AMP display troubleshooting

If AMP emails appear as regular HTML: confirm the domain is approved by inbox providers for bulk AMP sending, confirm an AMP version exists (in Gmail, open the email → three dots → **Show Original** → check for the AMP MIME type), use `data-amp-bind-property` instead of `amp-bind`, and ensure the AMP code has no syntax errors (providers will not render AMP with errors).
