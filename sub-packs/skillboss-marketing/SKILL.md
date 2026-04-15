---
name: skillboss-marketing
description: "B2B/B2C marketing operating system for AI startups. Covers onboarding, customer segmentation, competitor boards, X/Twitter growth, cold email, content planning, and weekly KPI review."
allowed-tools: Bash, Read
metadata:
  openclaw:
    always: false
    emoji: "📈"
    homepage: "https://skillboss.co"
    primaryEnv: "SKILLBOSS_API_KEY"
---

# SkillBoss Marketing Operating System

Run growth and GTM work for AI startups with one consistent operating model. This skill is optimized for AI-native products that need positioning, audience mapping, social content, cold outbound, and weekly operating cadence.

## Core Objective

Turn vague marketing asks into a repeatable system:

1. classify the customer correctly
2. identify market position and competitors
3. set up the operating stack
4. build a social + outbound motion
5. review metrics weekly and adjust

Do not jump straight to content production. Start with classification and operating constraints first.

## Customer Classification

Classify the company into one of four buckets before making any plan:

| Type | Definition | Primary Motion |
|------|------------|----------------|
| Outbound to C | China team selling to overseas consumers | X/Twitter + Reddit + Product Hunt |
| Outbound to B | China team selling to overseas businesses | Cold email + LinkedIn + case studies |
| Silicon Valley to C | Silicon Valley consumer AI startup | Social narrative + product demos + community |
| Silicon Valley to B | Silicon Valley B2B AI startup | Founder-led GTM + outbound + events + proof |

Then adjust by product type:

- `to C`: focus on community, product demos, creator distribution, launch velocity
- `to B`: focus on ICP clarity, proof, use cases, meetings, and sales assets
- `China outbound`: include infra setup, English profile quality, and credibility bootstrapping
- `Silicon Valley local`: assume some GTM basics already exist; move faster into execution

## Required Deliverables

For a new client or new project, produce these in order:

1. **Customer classification**
   - one sentence on who they sell to
   - one sentence on why buyers care
   - one sentence on what motion should dominate

2. **Competitor intelligence board**
   Track at least:
   - company name
   - website
   - founder or main account
   - X/Twitter followers
   - community size if relevant
   - Similarweb traffic estimate if available
   - content frequency
   - recent launches or product changes
   - your note on positioning

3. **Positioning**
   Output:
   - current positioning line
   - problems with it
   - 3 sharper alternatives
   - one recommended line

4. **Channel plan**
   Must choose primary, secondary, and optional channels.

5. **Weekly execution plan**
   A concrete plan for:
   - content
   - outreach
   - list building
   - KPI review

## Operating Stack

Standard tools:

- Notion for operating docs and competitor board
- X/Twitter for public narrative
- LinkedIn for B2B founder credibility
- Google Workspace for outbound email
- Calendly for meetings
- Typefully or equivalent for post drafting

When working through SkillBoss, prefer these APIs:

- **Search / market research**: `perplexity/sonar-pro`
- **Website and competitor scrape**: `firecrawl/scrape`
- **Contact enrichment**: `hunter/domain-search`, `hunter/email-finder`, `hunter/email-verifier`
- **Cold email execution**: `aws/send-email` or `skillboss-cold-email`
- **Asset generation**: `replicate/black-forest-labs/flux-1.1-pro`, `vertex/gemini-3-pro-image-preview`
- **Narrative drafting**: `openai/gpt-5`, `claude-4-6-sonnet`

## Twitter / X Strategy

Treat X/Twitter as an operating system, not a posting queue.

### Profile requirements

- clear founder photo
- one-line bio with exact product positioning
- link to primary product URL
- pinned post with best demo or narrative post
- location and identity should reduce trust friction

### Feed training

Before content planning:

- follow competitors, adjacent builders, target users, and distribution accounts
- build lists by:
  - competitors
  - potential customers
  - industry operators
- aggressively hide irrelevant content

### Content ratio

Default ratio:

- 4 parts personal insight
- 3 parts market or trend analysis
- 2 parts product or customer proof
- 1 part direct company promotion

Do not default to product ads. Founder trust comes first.

### Reply strategy

Focus on replies that create visibility:

- sharp joke or contrarian angle
- useful summary
- concrete question
- first-hand operator insight

Do not write generic AI-sounding compliments.

## Cold Email Strategy

Use for `to B` when buyer identification is clear.

### Rules

- find 3-5 contacts per target company
- write different angles, not repeated nudges
- keep emails short
- include one CTA
- do not overstuff links
- use domain and inbox hygiene seriously

### Sequence

1. email A: problem / positioning angle
2. email B: proof / customer case angle
3. email C: founder or strategic relevance angle

Then rotate to the next contact if no response.

### What good output looks like

For every outreach batch, produce:

- target company
- target persona
- reason this company fits
- personalization hooks
- subject line
- email body
- follow-up angle

## Weekly Review Cadence

Every week review:

- new followers from relevant people
- profile visits
- top content by reach and saves
- meetings booked
- email open and reply rate
- number of qualified targets added
- competitor moves worth reacting to

Output should end with:

- what worked
- what did not
- what to change next week

## Execution Rules

When using this skill:

1. Always start by classifying the customer.
2. Never recommend all channels equally.
3. Never generate content before the positioning is stated clearly.
4. Prefer proof, specificity, and audience fit over “viral” language.
5. If data is missing, call it out and request or gather it.

## Output Templates

### 1. GTM Snapshot

```md
## GTM Snapshot
- Customer type:
- Product category:
- Primary audience:
- Recommended primary channel:
- Recommended secondary channel:
- Main positioning risk:
- Recommended next action:
```

### 2. Competitor Board Summary

```md
## Competitor Board Summary
| Company | Positioning | Audience | Main channel | Signal worth copying | Signal worth avoiding |
|---|---|---|---|---|---|
```

### 3. Weekly Operating Plan

```md
## Weekly Marketing Plan
- Narrative theme:
- Posts to publish:
- Outbound batch:
- Companies to research:
- Assets to create:
- KPI review block:
```

## More Capabilities

- For full model, image, video, email, and deployment support, see `../skillboss/SKILL.md`
- For automated outreach execution, see `../skillboss-cold-email/SKILL.md`
