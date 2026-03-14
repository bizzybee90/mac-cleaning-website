# MAC Cleaning Email Templates

## Templates

| File | Subject Line | When Sent |
|------|-------------|-----------|
| `quote-delivery.html` | Your MAC Cleaning Quote — {{frequency}} from {{price_per_clean}}/clean | Immediately after quote completion |
| `chase-1.html` | Still thinking it over, {{name}}? | 1 hour after quote |
| `chase-2.html` | 840 customers can't be wrong, {{name}} | 24 hours after quote |
| `chase-3.html` | Last chance for your quote, {{name}} | 3 days after quote |
| `signup-confirmation.html` | Welcome to MAC Cleaning, {{name}}! | After card/DD registration |
| `partial-recovery.html` | You started a quote for {{postcode}} — finish it in 60 seconds | 1 hour after partial lead |

## Template Variables

All templates use `{{variable}}` syntax. Replace these in n8n using expressions.

| Variable | Source | Example |
|----------|--------|---------|
| `{{name}}` | Lead name | Sarah |
| `{{email}}` | Lead email | sarah@example.com |
| `{{postcode}}` | Lead postcode | LU2 7AA |
| `{{property_type}}` | Property type | house |
| `{{build_type}}` | Build type | semi |
| `{{bedrooms}}` | Bedroom count | 3 |
| `{{frequency}}` | Cleaning frequency | 4-weekly |
| `{{price_per_clean}}` | Price per clean | 19 |
| `{{total}}` | Total first clean | 19 |
| `{{extras}}` | Extras list | conservatory, extension |
| `{{addons_display}}` | Add-on services | Gutter Clearing (£80) |
| `{{payment_link}}` | Stripe/GoCardless link | https://... |

## n8n Setup

1. In the **Send Email** node, set "Content Type" to **HTML**
2. Paste the template HTML into the body field
3. Replace `{{variable}}` with n8n expressions: `{{ $json.name }}`
4. Set From: `hello@maccleaning.uk`
5. Set Reply-To: `hello@maccleaning.uk`

## Email Client Compatibility

All templates use:
- Table-based layout (works in Outlook)
- Inline styles (works in Gmail)
- MSO conditional comments for Outlook button rendering
- Responsive breakpoint at 620px
- Safe web fonts (Helvetica Neue → Helvetica → Arial)
