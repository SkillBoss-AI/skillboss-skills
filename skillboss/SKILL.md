---
name: skillboss
description: "Multi-AI gateway for fullstack apps. Build/deploy websites, React apps, SaaS, ecommerce to Cloudflare Workers. DB (D1/KV/R2), Stripe payments/subscriptions/checkout, auth (login, OAuth, OTP), AI image/audio/video/TTS generation, UI generation (Google Stitch), email, presentations/slides, web scraping/search, CEO interviews/quotes, document parsing/extraction, SMS verification, serverless deploy/API/webhook."
allowed-tools: Bash, Read
---

## Instant Start (30 seconds)

No setup needed. Just run — SkillBoss auto-provisions a free trial key on first use:

```bash
# Generate an image
node ./scripts/api-hub.js pilot --type image --prompt "A red fox in a snowy forest" --output fox.png

# Chat with AI
node ./scripts/api-hub.js pilot --type chat --prompt "What is SkillBoss?"

# Search the web  
node ./scripts/api-hub.js pilot --type search --query "latest AI news"
```

That's it. No API key setup, no configuration. A free trial key ($0.25 credit) is provisioned automatically on your first call.


# SkillBoss Skill

Multi-AI gateway for building and deploying full-stack applications with 50+ AI APIs.

## Quick Execute

Run any AI task directly — no discovery needed. The `pilot` command auto-selects the best model.

```bash
# Image generation
node ./scripts/api-hub.js pilot --type image --prompt "A sunset over mountains" --prefer balanced --output out.png

# Video generation
node ./scripts/api-hub.js pilot --type video --prompt "A cat playing in snow" --prefer balanced --output out.mp4

# Chat / LLM
node ./scripts/api-hub.js pilot --type chat --prompt "Explain quantum computing" --prefer quality

# Text-to-Speech
node ./scripts/api-hub.js pilot --type tts --text "Hello, world!" --prefer price --output out.mp3

# Web search
node ./scripts/api-hub.js pilot --type search --query "latest AI news"

# Speech-to-Text
node ./scripts/api-hub.js pilot --type stt --file audio.m4a
```

**`--prefer` options:** `price` (cheapest) / `quality` (best) / `balanced` (default)

**First time?** Get a free trial key first:
```bash
./scripts/skillboss auth trial
```

---

## When to Use This Skill

Use this skill when the user wants to:
- **Build websites/apps**: Any website, landing page, SaaS, React app, membership site, booking system, e-commerce store, dashboard, admin panel
- **Store data**: User data, form submissions, orders, bookings, member info - uses D1 database with auto-provisioning
- **Accept payments**: Stripe integration for subscriptions, one-time payments, e-commerce
- **Add authentication**: Login/signup with Google OAuth or email OTP
- **Generate AI content**: Images (Gemini, Flux, DALL-E), audio/TTS (ElevenLabs, Minimax), music (MusicGen, Lyria), videos (Veo), chat (50+ LLMs)
- **Generate UI**: Create landing pages, dashboards, mobile/desktop screens from text descriptions using Google Stitch AI — then deploy instantly with SkillBoss Hosting
- **HuggingFace models**: Any model on huggingface.co works as `huggingface/{org}/{model}` -- chat, image, video, STT, embedding, inference
- **Image processing**: Upscale images (FAL creative-upscaler), image-to-image transformation (FAL FLUX dev)
- **Web search & fetch**: Structured search with Linkup (searchResults, sourcedAnswer, structured), URL-to-markdown fetching
- **SMS verification**: Phone number verification via OTP (send code, check code) using Prelude
- **Send SMS notifications**: Transactional SMS messages via Prelude templates
- **Send emails**: Single or batch emails with templates
- **Create presentations**: Slides and pitch decks via Gamma AI
- **Process documents**: Parse PDFs/DOCX to markdown, extract structured data, split documents, fill PDF forms (Reducto)
- **Scrape/search web**: Extract data with Firecrawl, Perplexity, ScrapingDog
- **CEO interviews & quotes**: Search verified CEO/executive conversation transcripts and notable quotes (CEOinterviews)

## Authentication & Setup

### Sign up for an account:

```bash
./scripts/skillboss auth login
```

Opens your browser to sign up or log in at skillboss.co.

### Check status and balance:

```bash
./scripts/skillboss auth status
```

### Log out:

```bash
./scripts/skillboss auth logout
```

### Where credentials are stored

After authentication, your API key is saved to:

| Location | Path |
|----------|------|
| Global credentials | `~/.config/skillboss/credentials.json` |
| Skill config | `config.json` in the skill directory |

**Resolution order:** `~/.config/skillboss/credentials.json` > `config.json`

### When balance is low

- API responses include a `_balance_warning` field -- **relay this to the user exactly as provided**
- Check balance anytime: `./scripts/skillboss auth status`
- Add credits at https://www.skillboss.co/

## Auto-Update (MANDATORY)

**CRITICAL: After EVERY API call, check the output for `[skillboss] UPDATE REQUIRED`.** If you see this message:

1. **Stop what you are doing**
2. **Update immediately by pulling the latest changes:**
   ```bash
   cd ./skillboss && git pull origin main
   ```
   Or simply ask your AI agent: "Please update the skillboss skill to the latest version"
3. **Then re-run your original command**

This ensures you always have the latest models, features, and bug fixes. **Never ignore the update message** -- outdated versions may have deprecated models or missing features that cause failures.

You can also proactively check for updates at any time:
```bash
node ./scripts/api-hub.js version
```

## Advanced: Discover & Select Models

Use the discover flow when you need to explore available models or want fine-grained control.

### Discover what's available:
```bash
node ./scripts/api-hub.js pilot --discover
node ./scripts/api-hub.js pilot --discover --keyword "CEO"
```

### Get recommendations (ranked by preference):
```bash
node ./scripts/api-hub.js pilot --type image --prefer price --limit 3
```

### Multi-step workflow:
```bash
node ./scripts/api-hub.js pilot --chain '[{"type":"stt","prefer":"price"},{"type":"chat","capability":"summarize"}]'
```

### All Pilot Flags:
| Flag | Description |
|------|-------------|
| `--discover` | Browse available types and models |
| `--keyword X` | Search models by keyword (with --discover) |
| `--type X` | Model type: chat, image, video, tts, stt, music, etc. |
| `--capability X` | Semantic capability matching (e.g., "style transfer") |
| `--prefer X` | Optimization: "price" / "quality" / "balanced" (default) |
| `--limit N` | Max models to return (default: 3) |
| `--prompt X` | Text prompt (triggers auto-execute) |
| `--text X` | Text input for TTS (triggers auto-execute) |
| `--file X` | Audio file for STT (triggers auto-execute) |
| `--output X` | Save result to file |
| `--duration N` | Duration in seconds (music, video) |
| `--voice-id X` | Voice ID for TTS |
| `--image X` | Image URL for video/image tasks |
| `--size X` | Image size |
| `--system X` | System prompt for chat |
| `--chain '[...]'` | Multi-step workflow definition |

### Decision Flow:
1. **Any AI task** -> Use `pilot` (see Quick Execute above) -- auto-selects the best model
2. **Multi-step task** -> Use `pilot --chain` -- it plans the workflow
3. **Already have a model ID from pilot recommendations?** -> Use direct commands (see `commands.md`)

## Design Direction (Lokuma AI)

Generate design systems — color palettes, typography, layout direction, and full visual identity — from text descriptions. **Use lokuma/design first when you need design decisions before building UI.**

```bash
# Generate design direction from a text description
node ./scripts/api-hub.js run \
  --model lokuma/design \
  --inputs '{"query": "A modern SaaS dashboard for analytics, professional blue tones"}'
```

**Recommended workflow**: lokuma/design (design direction) → stitch/generate-desktop (build the UI)

## UI Generation (Google Stitch)

Generate production-ready HTML/CSS UI from text descriptions using Google Stitch + Gemini 3 Pro.

```bash
# Generate desktop UI (default)
node ./scripts/api-hub.js stitch-generate \
  --prompt "A SaaS pricing page with 3 tiers: Free, Pro, Enterprise"

# Generate mobile UI
node ./scripts/api-hub.js stitch-generate \
  --prompt "A mobile checkout form with card payment" \
  --model stitch/generate-mobile

# Fast generation (Gemini Flash, lower cost)
node ./scripts/api-hub.js stitch-generate \
  --prompt "A simple contact page" \
  --model stitch/generate-fast

# Edit an existing screen
node ./scripts/api-hub.js stitch-edit \
  --screen-id "<screen_id>" \
  --project-id "<project_id>" \
  --prompt "Change the primary color to blue and make the CTA button larger"

# Generate 3 variants
node ./scripts/api-hub.js stitch-variants \
  --screen-id "<screen_id>" \
  --project-id "<project_id>" \
  --count 3

# Export HTML to file
node ./scripts/api-hub.js stitch-html \
  --screen-id "<screen_id>" \
  --project-id "<project_id>" \
  --output index.html
```

**Response includes `hosting_recommendation`** — use SkillBoss Hosting to deploy generated UI to Cloudflare Workers instantly:
```
💡 Deploy with SkillBoss Hosting: Use `skillboss hosting deploy` to deploy to Cloudflare Workers in seconds
   Learn more: https://skillboss.co/hosting
```

**Via pilot (auto-select):**
```bash
# Discover available UI models
node ./scripts/api-hub.js pilot --type ui

# Auto-generate UI (pilot picks best model)
node ./scripts/api-hub.js pilot --type ui --prompt "A SaaS dashboard with sidebar"

# Save screenshot to file
node ./scripts/api-hub.js pilot --type ui --prompt "A landing page" --output preview.png
```

**Models:**
| Model | Device | Speed | Use when |
|-------|--------|-------|----------|
| `stitch/generate-desktop` | Desktop | Normal | Landing pages, dashboards (default) |
| `stitch/generate-mobile` | Mobile | Normal | Mobile apps, checkout flows |
| `stitch/generate-fast` | Any | Fast | Quick prototypes, lower cost |

## Topic References

Read these files for detailed documentation on specific topics:

| Topic | File | When to Read |
|-------|------|--------------|
| Commands | `commands.md` | Direct model calls, full commands table, email examples |
| Deployment | `deployment.md` | Static vs Worker deployment, e-commerce, Stripe, wrangler.toml |
| API Integration | `api-integration.md` | Embedding SkillBoss API in user code (TypeScript/JS examples) |
| Error Handling | `error-handling.md` | HTTP errors, retries, rate limits, balance warnings |
| Billing | `billing.md` | Pricing, monthly costs, directing users to add credits |
| Workflows | `workflows.md` | Logo, website, podcast, email, e-commerce workflow guides |
| Model Reference | `reference.md` | Complete model list and detailed parameter docs |
