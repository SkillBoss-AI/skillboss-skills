---
name: skillboss
description: "Multi-AI gateway: call 100+ AI models (Claude, GPT, Gemini, DeepSeek, Flux, Veo, ElevenLabs) and build/deploy fullstack apps to Cloudflare Workers. Generate images, videos, music, speech, UI screens. Search/scrape the web. Send emails & SMS. Accept Stripe payments. Add OAuth/OTP auth. Store data in D1/KV/R2. Create presentations, parse documents, remove backgrounds, upscale images, and more — all through one unified API."
synonyms:
  - "call an AI model"
  - "generate an image"
  - "create a picture"
  - "make a video"
  - "text to speech"
  - "build a website"
  - "deploy a web app"
  - "scrape a webpage"
  - "search the web"
  - "send an email"
  - "send SMS"
  - "accept payments"
  - "create a landing page"
  - "generate music"
  - "transcribe audio"
  - "upscale an image"
  - "remove background from image"
  - "generate UI"
  - "make a presentation"
  - "parse a PDF"
  - "convert speech to text"
  - "build an ecommerce store"
  - "create slides"
  - "design a logo"
  - "animate an image"
  - "multi-model AI gateway"
  - "AI API aggregator"
  - "fullstack deployment"
  - "Claude API"
  - "GPT API"
  - "Gemini API"
  - "Flux image generation"
  - "ElevenLabs TTS"
  - "Cloudflare Workers deploy"
  - "AI content creation"
  - "web data extraction"
negative-use-cases:
  - "Spreadsheet or Excel manipulation — no pandas/Excel engine, use a data analysis tool instead"
  - "Machine learning model training — SkillBoss is inference-only, not a training platform"
  - "Desktop or mobile native app development — web-only (Cloudflare Workers); use platform-specific tools for native apps"
  - "Real-time video streaming or conferencing — generates video files, does not stream live"
  - "Social media posting or scheduling — no Twitter/Instagram/TikTok publish API; use a social media tool"
  - "Game development — not a game engine; use Unity, Godot, or similar"
  - "Blockchain or cryptocurrency operations — no Web3/smart contract support"
  - "Direct database administration — provisions and queries D1, but is not a general SQL client for external databases"
  - "Local file system management or OS-level operations — cloud-first; use system tools for local file ops"
allowed-tools: Bash, Read
---

## Instant Start (30 seconds)

```bash
# Install CLI
npm install -g @skillboss/cli

# Login (get key at skillboss.co/console)
skb login -k YOUR_API_KEY

# Generate an image
skb task image -b '{"prompt": "A red fox in a snowy forest"}' -o fox.png

# Chat with AI
skb api call deepseek-v3 -b '{"messages":[{"role":"user","content":"What is SkillBoss?"}]}'

# Search the web
skb api call linkup/search -b '{"query": "latest AI news"}'
```

# SkillBoss Skill

Call 100+ AI models and build/deploy fullstack apps — one unified gateway for chat (Claude, GPT, Gemini, DeepSeek), image generation (Flux, Gemini), video (Veo), TTS (ElevenLabs), music, web search, scraping, UI generation, Stripe payments, auth, email, SMS, and Cloudflare Workers deployment.

## Quick Execute

Run any AI task directly. `skb task` auto-selects the best model.

```bash
# Image generation
skb task image -b '{"prompt": "A sunset over mountains"}' -o out.png

# Video generation
skb task video -b '{"prompt": "A cat playing in snow"}' -o out.mp4

# Text-to-Speech
skb task tts -b '{"text": "Hello, world!"}' --prefer price -o out.mp3

# Speech-to-Text
skb task stt -f audio.m4a

# Or call a specific model directly
skb api call deepseek-v3 -b '{"messages":[{"role":"user","content":"Explain quantum computing"}]}' --stream
```

**`--prefer` options:** `price` (cheapest) / `quality` (best) / `balanced` (default)

---

## When to Use This Skill

Use this skill when the user wants to:
- **Chat with AI models**: Ask questions, summarize text, translate, write code — 30+ LLMs including Claude, GPT-5, Gemini 3, DeepSeek R1, Qwen 3, Kimi K2
- **Generate images**: Text-to-image with Flux Schnell/Dev, Gemini Flash/Pro; also upscale photos (FAL 2x/4x), transform images (img2img), or remove backgrounds
- **Generate videos**: Text-to-video or image-to-video with Google Veo 3.1; specify duration for longer clips
- **Text-to-speech**: Convert text to natural-sounding audio in 29 languages with ElevenLabs, OpenAI TTS, Minimax, or XTTS v2
- **Generate music**: Create songs, jingles, background tracks with ElevenLabs Music, Google Lyria 2, Meta MusicGen, or Stable Audio
- **Transcribe audio**: Speech-to-text with OpenAI Whisper — transcribe meetings, podcasts, voice memos
- **Search the web**: AI-powered search with Perplexity Sonar (citations included), Linkup (structured results), or ScrapingDog (Google/news/images)
- **Scrape websites**: Extract page content with Firecrawl (single page, AI extraction, sitemap), or ScrapingDog (Amazon, LinkedIn, YouTube, screenshots)
- **Generate UI screens**: Create landing pages, dashboards, mobile UIs from text descriptions with Google Stitch AI — then deploy instantly
- **Design direction**: Generate color palettes, typography, and visual identity from descriptions with Lokuma Design AI
- **Build & deploy websites**: Full-stack apps on Cloudflare Workers with D1 database, KV/R2 storage, SQL migrations — deploy in seconds
- **Accept payments**: Stripe subscriptions, one-time payments, e-commerce checkout via Stripe Connect
- **Add authentication**: Google OAuth or email OTP login/signup
- **Send emails**: Single or batch emails with HTML templates
- **Send SMS / verify phone**: OTP verification and transactional SMS via Prelude
- **Create presentations**: Slides, pitch decks, and visual reports with Gamma AI
- **Parse documents**: Extract text, structured data from PDFs/DOCX; split documents; fill PDF forms with Reducto
- **Generate embeddings**: Text embeddings with OpenAI text-embedding-3 (small/large) for search, clustering, RAG
- **CEO interviews & quotes**: Search verified CEO/executive transcripts and notable quotes via CEOinterviews
- **HuggingFace models**: Any model on huggingface.co works as `huggingface/{org}/{model}` — chat, image, video, STT, embedding

## When NOT to Use This Skill

Do **not** use this skill for:
- **Spreadsheet/Excel operations** — no data analysis engine; use a pandas/Excel tool instead
- **ML model training** — SkillBoss is inference-only (call pre-trained models), not a training platform
- **Native mobile/desktop apps** — web-only deployment (Cloudflare Workers); use platform-specific tools for iOS/Android/Electron
- **Live video streaming or conferencing** — generates video files, does not support real-time streaming
- **Social media posting/scheduling** — no Twitter/Instagram/TikTok publish API; use a social media management tool
- **Game development** — not a game engine; use Unity, Godot, or Unreal
- **Blockchain/crypto operations** — no Web3 or smart contract support
- **Connecting to external databases** — manages its own D1/KV/R2 stores, but cannot connect to your external Postgres/MySQL/MongoDB
- **OS-level file management** — cloud-first; use system tools for local file operations

## Authentication & Setup

### Login:

```bash
skb login -k YOUR_API_KEY
```

Get your key at https://skillboss.co/console

### Check status:

```bash
skb account
```

### Log out:

```bash
skb logout
```

### Where credentials are stored

After authentication, your API key is saved to `~/.config/skillboss/credentials.json`.

You can also set `SKILLBOSS_API_KEY` environment variable, or pass `-k <key>` per command.

### When balance is low

- API responses include a `_balance_warning` field -- **relay this to the user exactly as provided**
- Check balance anytime: `skb account`
- Add credits at https://www.skillboss.co/

## Advanced: Discover & Select Models

Use the discover flow when you need to explore available models or want fine-grained control.

### Browse available types:
```bash
skb task
skb api types
```

### Search by keyword:
```bash
skb task search "CEO interviews"
skb task search "web scraping"
```

### Get recommendations (ranked by preference):
```bash
skb task image --prefer price --limit 3
```

### View model details + params:
```bash
skb api show flux-1.1-pro
skb api show deepseek-v3
```

### Multi-step workflow:
```bash
skb task chain '[{"type":"stt","prefer":"price"},{"type":"chat","capability":"summarize"}]'
```

### All Task Flags:
| Flag | Description |
|------|-------------|
| `-b, --body <json>` | JSON inputs (triggers execute mode) |
| `-f, --file <path>` | File input for STT (triggers execute mode) |
| `-o, --output <path>` | Save result to file |
| `-s, --stream` | Stream response (chat) |
| `--prefer X` | Optimization: "price" / "quality" / "balanced" (default) |
| `--capability X` | Semantic capability matching (e.g., "style transfer") |
| `--limit N` | Max models to return (default: 3) |
| `--include-docs` | Include API docs in recommendations |
| `--raw` | Output raw JSON |
| `-k, --key <key>` | API key override |

### Decision Flow:
1. **Any AI task** -> Use `skb task <type>` -- auto-selects the best model
2. **Multi-step task** -> Use `skb task chain` -- it plans the workflow
3. **Already know the model?** -> Use `skb api call <model> -b '...'`
4. **Need params?** -> Use `skb api show <model>`

## Design Direction (Lokuma AI)

Generate design systems — color palettes, typography, layout direction, and full visual identity — from text descriptions. **Use lokuma/design first when you need design decisions before building UI.**

```bash
skb api call lokuma/design -b '{"query": "A modern SaaS dashboard for analytics, professional blue tones"}'
```

**Recommended workflow**: lokuma/design (design direction) → stitch/generate-desktop (build the UI)

## UI Generation (Google Stitch)

Generate production-ready HTML/CSS UI from text descriptions using Google Stitch + Gemini 3 Pro.

```bash
# Generate desktop UI (default)
skb api call stitch/generate-desktop -b '{"prompt": "A SaaS pricing page with 3 tiers: Free, Pro, Enterprise"}'

# Generate mobile UI
skb api call stitch/generate-mobile -b '{"prompt": "A mobile checkout form with card payment"}'

# Fast generation (Gemini Flash, lower cost)
skb api call stitch/generate-fast -b '{"prompt": "A simple contact page"}'

# Edit an existing screen
skb api call stitch/edit -b '{"screen_id": "<id>", "project_id": "<id>", "prompt": "Change the primary color to blue"}'

# Export HTML to file
skb api call stitch/html -b '{"screen_id": "<id>", "project_id": "<id>"}' -o index.html
```

**Via task (auto-select):**
```bash
# Discover available UI models
skb task ui_generation

# Auto-generate UI
skb task ui_generation -b '{"prompt": "A SaaS dashboard with sidebar"}'
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
