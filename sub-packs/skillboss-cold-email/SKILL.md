---
name: skillboss-cold-email
description: "Automated cold email pipeline. Finds target companies, enriches contacts, scrapes websites, and generates personalized cold emails using AI. One API call does it all: search → enrich → scrape → write."
allowed-tools: Bash, Read
metadata:
  openclaw:
    always: false
    emoji: "📧"
    homepage: "https://skillboss.co"
    primaryEnv: "SKILLBOSS_API_KEY"
---

# SkillBoss Cold Email Pipeline

End-to-end cold email automation: company search → contact enrichment → website scraping → AI-personalized email generation.

## Quick Execute

```bash
# Generate 10 cold emails for AI SaaS companies
curl -s https://api.skillboss.co/v1/pipelines/cold-email \
  -H "Authorization: Bearer $SKILLBOSS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "industry": "AI SaaS",
    "count": 10,
    "purpose": "partnership for API distribution",
    "sender_name": "John",
    "sender_company": "Acme"
  }'

# Use Gemini (cheaper) for email generation
curl -s https://api.skillboss.co/v1/pipelines/cold-email \
  -H "Authorization: Bearer $SKILLBOSS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "industry": "developer tools",
    "count": 5,
    "purpose": "invite to list their API on our marketplace",
    "sender_name": "Jane",
    "sender_company": "DevHub",
    "model": "gemini"
  }'

# Generate emails for pre-existing company list (skip search & scrape)
curl -s https://api.skillboss.co/v1/pipelines/cold-email \
  -H "Authorization: Bearer $SKILLBOSS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "purpose": "follow-up outreach for integration",
    "sender_name": "John",
    "sender_company": "Acme",
    "skip_search": true,
    "skip_scrape": true,
    "companies": [
      {"name": "Stripe", "domain": "stripe.com", "website": "https://stripe.com"},
      {"name": "OpenAI", "domain": "openai.com", "website": "https://openai.com"}
    ]
  }'
```

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `industry` | string | Yes (unless skip_search) | — | Target industry keywords |
| `count` | integer | No | 10 | Number of companies (1-50) |
| `purpose` | string | No | "cold outreach for business partnership" | Email purpose/goal |
| `sender_name` | string | Yes | — | Your name |
| `sender_company` | string | Yes | — | Your company name |
| `model` | string | No | "claude" | LLM for emails: "claude" or "gemini" |
| `skip_search` | boolean | No | false | Skip company search step |
| `skip_scrape` | boolean | No | false | Skip website scraping step |
| `skip_generate` | boolean | No | false | Skip email generation step |
| `companies` | array | No | null | Pre-existing company data |

## Response Format

```json
{
  "status": "success",
  "companies": [
    {
      "name": "Stripe",
      "domain": "stripe.com",
      "website": "https://stripe.com",
      "website_description": "Online payment processing for internet businesses",
      "contacts": [
        {
          "email": "partnerships@stripe.com",
          "first_name": "John",
          "last_name": "Doe",
          "position": "VP Partnerships",
          "confidence": 90,
          "source": "hunter"
        }
      ],
      "generated_email": {
        "subject": "API distribution partnership with Stripe",
        "body": "Hi John, ...",
        "recipient_name": "John Doe",
        "recipient_email": "partnerships@stripe.com"
      }
    }
  ],
  "summary": {
    "total": 10,
    "with_contacts": 7,
    "emails_generated": 10
  },
  "duration_ms": 45000
}
```

## Pipeline Steps

1. **Company Search** — Finds companies via Exa neural search, with Google Search and Linkup as fallbacks
2. **Contact Enrichment** — Finds email contacts via Hunter domain search, with Apify contact scraper as fallback
3. **Website Scraping** — Extracts main content from company websites via Firecrawl
4. **Email Generation** — Writes personalized cold emails using Claude or Gemini, referencing scraped company data

## Billing

Each pipeline step uses underlying SkillBoss APIs, billed individually:
- Search: ~1 credit per search
- Contact enrichment: ~1 credit per company
- Website scrape: ~1 credit per page
- Email generation: standard LLM token pricing

Estimated cost: **~$0.05-0.15 per company** (varies by model choice).

## Authentication & Setup

```bash
# Get a free trial key instantly (no sign-up)
node ../skillboss/scripts/skillboss auth trial

# Log in to an existing account
node ../skillboss/scripts/skillboss auth login

# Check balance
node ../skillboss/scripts/skillboss auth status
```

## Balance Warning

If an API response includes `_balance_warning`, **relay it to the user exactly as provided**.

Add credits at: https://www.skillboss.co/billing

## More Capabilities

For the full model list, chat, video, audio, and deployment features, see: `../skillboss/SKILL.md`
