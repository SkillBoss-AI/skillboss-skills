# Email Campaign

Create and send professional email marketing campaigns.

## Workflow

### Step 1: Gather Campaign Details

Ask the user about:
- Campaign type (welcome, promotional, newsletter, announcement)
- Target audience
- Key message and CTA (call to action)
- Recipient list (emails and personalization data)

### Step 2: Prepare Email Content

As an AI assistant, YOU write the email content directly. No need to call chat API.

**Email structure:**
```html
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1>[Headline with {{name}} personalization]</h1>
  <p>[Opening paragraph - hook the reader]</p>
  <p>[Main message - key value proposition]</p>
  <a href="[CTA_LINK]" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">[CTA Button Text]</a>
  <p>[Closing]</p>
  <p>Best,<br>[Sender Name]</p>
</body>
</html>
```

### Step 3: Test with Single Email

Always test before batch sending:

```bash
node ./scripts/api-hub.js send-email \
  --to "your-test-email@example.com" \
  --subject "Test: [Your Subject Line]" \
  --body "<html><body>[YOUR_EMAIL_HTML]</body></html>"
```

### Step 4: Send Batch Campaign

Prepare receivers JSON with email and variables:

```bash
node ./scripts/api-hub.js send-batch \
  --subject "Hi {{name}}, [Subject Line]" \
  --body "<html><body><p>Hi {{name}},</p>[EMAIL_CONTENT]</body></html>" \
  --receivers '[
    {"email":"alice@example.com","variables":{"name":"Alice"}},
    {"email":"bob@example.com","variables":{"name":"Bob"}}
  ]'
```

## Input Format

### Receivers JSON Structure

```json
[
  {
    "email": "user@example.com",
    "variables": {
      "name": "John",
      "product_name": "SkillBoss",
      "discount": "20",
      "promo_code": "SAVE20",
      "cta_link": "https://example.com/offer"
    }
  }
]
```

### Template Variables

Use `{{variable_name}}` in subject and body. Each receiver must have matching variables.

**Available in templates:**
- `{{name}}` - Recipient name
- `{{email}}` - Recipient email
- Any custom variable defined in receivers JSON

## Error Handling & Fallback

### Request Failed (HTTP 500)
1. Check email addresses are valid format
2. Check HTML is well-formed
3. Retry once

### Insufficient Credits (HTTP 402)
Tell user: "Your SkillBoss credits have run out. Visit https://www.skillboss.co/ to add credits or subscribe."

### Invalid Recipients
If some emails fail:
- API returns partial success with failed emails listed
- Retry only the failed emails

## Email Templates

### Welcome Email
```html
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1>Welcome to {{product_name}}, {{name}}!</h1>
  <p>We're thrilled to have you on board.</p>
  <p>Here's what you can do next:</p>
  <ul>
    <li>Complete your profile</li>
    <li>Explore our features</li>
    <li>Join our community</li>
  </ul>
  <a href="{{cta_link}}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Get Started</a>
  <p>Best,<br>The {{product_name}} Team</p>
</body>
</html>
```

### Promotional Email
```html
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1>{{name}}, Don't Miss Out!</h1>
  <p>For a limited time, enjoy {{discount}}% off.</p>
  <p style="font-size: 24px; font-weight: bold; color: #e74c3c;">Use code: {{promo_code}}</p>
  <a href="{{shop_link}}" style="display: inline-block; background: #e74c3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Shop Now</a>
  <p><small>Offer expires {{expiry_date}}</small></p>
</body>
</html>
```

## Best Practices

- Always test with a single email first
- Keep subject lines under 50 characters
- Use personalization (`{{name}}`) for better engagement
- Include one clear CTA per email
- Ensure mobile-friendly HTML (max-width: 600px)
- Send at optimal times (Tue-Thu, 10am-2pm)

## Sender Configuration

Email sender is auto-configured as `username@username.skillboss.live` based on your account.
