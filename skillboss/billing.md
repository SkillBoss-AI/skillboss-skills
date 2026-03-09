# Billing & Subscription

SkillBoss requires an active subscription or credits.

**Website:** https://www.skillboss.co/

## Monthly Costs

| Feature | Cost (Credits) | Cost (USD) | Notes |
|---------|---------------|------------|-------|
| Login Integration | 50/month | $2.50/month | Per project with authentication |
| Custom Domain | 200/month | $10/month | Per domain bound to a project |
| D1 Database Storage | 100/GB/month | $5/GB/month | Minimum 0.1 GB |

## When to Direct Users

- No API key -> `./scripts/skillboss auth trial` (instant) or `./scripts/skillboss auth login` (permanent)
- Credits exhausted -> "Visit https://www.skillboss.co/ to add credits or enable auto-topup"
- API key invalid -> `./scripts/skillboss auth login` to refresh credentials
