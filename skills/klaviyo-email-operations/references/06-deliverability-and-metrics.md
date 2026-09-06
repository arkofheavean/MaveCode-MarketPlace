# Deliverability and Metrics

Source: Klaviyo developer documentation — "Send AMP emails in Klaviyo" (https://developers.klaviyo.com/en/docs/send_amp_emails_in_klaviyo). This reference covers the sender authentication and reputation prerequisites, MIME-type behavior, and email metrics documented for advanced sending (AMP), which apply broadly to deliverability of Klaviyo email.

## MIME types

An email sent from Klaviyo is multi-MIME. When you create an email with Klaviyo's drag-and-drop editor, a plain-text version and an HTML version are generated. AMP is an additional MIME type. If you use AMP in your emails, a plain text, HTML, and AMP MIME type will all be sent within one email.

When your email hits a customer's inbox, the inbox provider chooses which MIME type to display. Only certain inbox clients support AMP.

## Deliverability and sender-authentication prerequisites

Before applying to use AMP and building AMP emails in Klaviyo, meet the following prerequisites. These are the sender-authentication and reputation requirements Klaviyo documents for advanced sending:

- You have your own **dedicated sending domain** and have authenticated your emails using **SPF, DKIM, and DMARC**.
- You are sending at a **high volume**, in the ballpark of around **100 emails a day or greater** for the last few weeks.
- You have a **good sender reputation** and a **low spam complaint rate** from your recipients.
- You are tech-savvy or have your own developer team to help build out AMP emails. Klaviyo does not offer this service.
- If you have a **dedicated click-tracking domain**, you must set up **SSL** for the domain before your AMP application can be approved. (Klaviyo's shared tracking domains include SSL automatically, so if you do not have a dedicated click-tracking domain, no action is required.)

In addition, when sending AMP you must follow the specific requirements and adhere to the policies of each inbox provider you send AMP emails to (e.g., Google's AMP security requirements and privacy policy/terms; Yahoo Mail AMP requirements and media privacy policies). Yahoo Mail provides support for AMP emails in Yahoo and AOL Mail and their mobile apps.

## Setting up AMP sending (per email address)

Registration for AMP works on a **per-email-address basis**. To send AMP from more than one email address, complete the process for each email.

1. Contact Klaviyo support to request AMP sending. Include the name of the account you want to send AMP emails through. This account must already have a dedicated sending domain to be approved.
2. Create an **Email Provider Approval list** in Klaviyo containing the approval email addresses of each vendor you'd like AMP approval from: `[email protected]` for Gmail and `[email protected]` for Yahoo. For other providers, see AMP's developer documentation. Create a new list from the **Lists & Segments** tab, click **Quick Add**, and add the two email addresses.
3. Once Klaviyo gives the okay, build your AMP email with **real content** (e.g., a newsletter), not a generic or demo message. The email cannot have any bugs. Test the AMP email and review AMP best practices and each inbox provider's guidelines.
4. Send the email to the list you created in step two.
5. Submit the **sender registration form** (managed by the inboxes that support AMP). It may take one to two weeks to receive a response, and you will receive a separate response from each inbox provider. Once approved, you can begin sending AMP emails in Klaviyo.

## Adding an AMP version in Klaviyo

After Klaviyo's support team enables AMP for your account:

- For a campaign built with the drag-and-drop editor: before sending, review the email; under the **Content** section, select **Add AMP Version**.
- For an email template: go to the **Email Templates** tab, click the three dots, and select **Create AMP Version**.
- On the AMP editor, paste in your code and preview the email.

## Email metrics (by MIME type)

Read email performance in **Analytics > Metrics**:

1. Go to the **Analytics** tab and click **Metrics**.
2. Select **Opened Email** or **Clicked Email**.
3. Click **Advanced Filters**, change the dropdown to **Where**, and select **Mimetype equals AMP** to isolate AMP performance.
4. Adjust the time frame to understand how AMP campaigns are performing over time.

**Important metric caveat:** The **Clicked Email** metric only tracks when people click *through* the email to your website. Clicks *within* the email (e.g., clicking through a carousel of images) are not currently tracked.

## Troubleshooting deliverability of AMP

If AMP emails appear as regular HTML in the inbox, common causes are:

- The setup steps above were not completed, so the domain is not approved by inbox providers for bulk AMP sending.
- The email has no AMP version. In Gmail, open the email, click the three dots, select **Show Original**, and check whether the AMP MIME type is present.
- The email uses `amp-bind`. Use the alternate `data-amp-bind-property` syntax to be compatible with Klaviyo's system.
- The email has syntax errors. Inbox providers will not render AMP with errors; test the code to verify it is error-free.

**AMP-Mustache vs. Django curly braces:** AMP-Mustache uses curly-brace syntax that conflicts with Django variable syntax (e.g., `{{ person.first_name }}`). Wrap AMP-Mustache sections in the Django `{% verbatim %} ... {% end verbatim %}` tag so Klaviyo does not try to render them as Django variables. (Full markup examples are authored in the companion **Klaviyo - Liquid Personalisations** skill.)
