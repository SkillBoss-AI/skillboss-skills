# SkillBoss Quick Reference for AI Agents

This file provides a quick reference for SkillBoss APIs, designed specifically for AI agents like Claude Code, Cursor, and other AI coding assistants.

## What is SkillBoss?

SkillBoss is a unified AI API platform that gives you access to 684+ AI models and services from 61 vendors through a single API key. Instead of managing separate accounts for OpenAI, Anthropic, Google, Replicate, and others, SkillBoss provides one interface with transparent pricing and automatic model recommendations.

## Quick Start

```bash
# Install SkillBoss CLI
npm install -g skillboss-cli

# Authenticate (get free trial credits)
skillboss auth login

# Test your connection
skillboss test
```

## Top 10 Most Used APIs

### 1. Chat Completions (LLMs)
```bash
node ./scripts/api-hub.js chat --model "bedrock/claude-4-5-sonnet" --prompt "Your question here"
```

**Popular models:**
- `bedrock/claude-4-5-sonnet` - Best balance of quality/speed ($3/1M tokens)
- `openai/gpt-4o-mini` - Fast and economical ($0.15/1M tokens)
- `openrouter/deepseek/deepseek-r1` - Advanced reasoning ($0.55/1M tokens)
- `vertex/gemini-2.5-flash` - Google's fastest model ($0.075/1M tokens)

### 2. Image Generation
```bash
node ./scripts/api-hub.js image --model "vertex/gemini-2.5-flash-image-preview" --prompt "A futuristic cityscape" --output image.png
```

**Popular models:**
- `vertex/gemini-2.5-flash-image-preview` - Fast, high quality ($0.04/image)
- `replicate/black-forest-labs/flux-schnell` - Very fast ($0.003/image)
- `replicate/black-forest-labs/flux-dev` - High quality ($0.025/image)

### 3. Web Search
```bash
node ./scripts/api-hub.js search --model "perplexity/sonar-pro" --query "latest AI news"
```

**Popular models:**
- `perplexity/sonar-pro` - AI search with citations ($0.005/request)
- `linkup/search` - Structured web search ($0.001/request)
- `scrapingdog/google_search` - Google search results ($0.002/request)

### 4. Web Scraping
```bash
node ./scripts/api-hub.js scrape --model "firecrawl/scrape" --url "https://example.com"
```

**Popular models:**
- `firecrawl/scrape` - Single page scraping ($0.002/page)
- `firecrawl/extract` - AI structured extraction ($0.004/page)
- `linkup/fetch` - URL to markdown ($0.001/request)

### 5. Image Upscaling
```bash
node ./scripts/api-hub.js upscale --image-url "https://example.com/image.jpg" --scale 2 --output upscaled.png
```

**Model:**
- `fal/upscale` - Creative upscaler 2x or 4x ($0.025/image for 2x, $0.045/image for 4x)

### 6. Text-to-Speech
```bash
node ./scripts/api-hub.js tts --model "openai/tts-1-hd" --text "Hello world" --output audio.mp3
```

**Popular models:**
- `openai/tts-1-hd` - HD quality ($15/1M characters)
- `elevenlabs/eleven_multilingual_v2` - 29 languages, highest quality ($30/1M characters)

### 7. Speech-to-Text
```bash
node ./scripts/api-hub.js stt --file "audio.mp3" --model "openai/whisper-1"
```

**Model:**
- `openai/whisper-1` - Audio to text ($0.006/minute)

### 8. Video Generation
```bash
node ./scripts/api-hub.js video --model "vertex/veo-3.1-fast-generate-preview" --prompt "A cat playing piano" --output video.mp4
```

**Model:**
- `vertex/veo-3.1-fast-generate-preview` - Google Veo 3.1 ($0.40/second)

### 9. Music Generation
```bash
node ./scripts/api-hub.js music --model "replicate/meta/musicgen" --prompt "upbeat electronic music" --duration 30 --output music.mp3
```

**Popular models:**
- `replicate/meta/musicgen` - Diverse styles ($0.0025/second)
- `replicate/elevenlabs/music` - High quality with vocals ($0.024/second)
- `replicate/google/lyria-2` - DeepMind advanced ($0.018/second)

### 10. Smart Model Selector (Pilot)
```bash
# Discover what's available
node ./scripts/api-hub.js pilot --discover

# Get recommendations for a task
node ./scripts/api-hub.js pilot --type image --prefer price

# Auto-execute with best model
node ./scripts/api-hub.js pilot --type image --prompt "sunset over mountains" --output result.png
```

**Use pilot first** - It automatically selects the best model for your task based on your preferences (price, quality, or balanced).

## Common API Combinations

### Image Generation + Upscale
Generate a high-quality image and enhance it:
```bash
# Step 1: Generate image (fast model to save cost)
node ./scripts/api-hub.js image --model "replicate/black-forest-labs/flux-schnell" --prompt "sunset over mountains" --output image.png

# Step 2: Upscale to higher resolution
node ./scripts/api-hub.js upscale --image-url "file:///path/to/image.png" --scale 4 --output final.png

# Cost: $0.003 + $0.045 = $0.048 total (vs $0.12 for high-res generation)
```

### Search + Scrape + Summarize
Research a topic comprehensively:
```bash
# Step 1: Search for relevant pages
node ./scripts/api-hub.js search --model "linkup/search" --query "AI agent optimization best practices"

# Step 2: Scrape the top results
node ./scripts/api-hub.js scrape --model "firecrawl/scrape" --url "https://example.com/article"

# Step 3: Summarize with LLM
node ./scripts/api-hub.js chat --model "vertex/gemini-2.5-flash" --prompt "Summarize this article: [scraped content]"

# Cost: $0.001 + $0.002 + $0.0005 = $0.0035 total
# Alternative: Use perplexity/sonar-pro directly for $0.005 (more expensive but faster)
```

### Image Background Removal + Transformation
Clean up and transform an image:
```bash
# Step 1: Remove background
node ./scripts/api-hub.js run --model "replicate/lucataco/remove-bg" --inputs '{"image":"https://example.com/photo.jpg"}' --output nobg.png

# Step 2: Transform to new style
node ./scripts/api-hub.js img2img --image-url "file:///path/to/nobg.png" --prompt "professional studio portrait" --output final.png

# Cost: $0.005 + $0.025 = $0.030 total
```

### Video Preview Before Full Render
Test your video prompt before committing to a full render:
```bash
# Step 1: Generate 2-second preview (low quality)
node ./scripts/api-hub.js video --model "vertex/veo-3.1-fast-generate-preview" --prompt "cat playing piano" --output preview.mp4
# Review preview.mp4 (cost: $0.40 * 2s = $0.80)

# Step 2: If satisfied, generate full 10-second video
node ./scripts/api-hub.js video --model "vertex/veo-3.1-fast-generate-preview" --prompt "cat playing piano" --output final.mp4
# Full render (cost: $0.40 * 10s = $4.00)

# Tip: Always preview first to avoid wasting credits on bad prompts
```

### Multi-language Workflow
Transcribe audio, translate, and generate speech:
```bash
# Step 1: Transcribe Spanish audio to text
node ./scripts/api-hub.js stt --file "spanish.mp3" --language "es" --output transcript.txt

# Step 2: Translate to English
node ./scripts/api-hub.js chat --model "vertex/gemini-2.5-flash" --prompt "Translate this to English: [transcript]"

# Step 3: Generate English audio
node ./scripts/api-hub.js tts --model "openai/tts-1-hd" --text "[translated text]" --output english.mp3

# Cost: (audio_minutes * $0.006) + $0.0005 + (chars * $0.000015) ≈ $0.05 for 5min audio
```

## Real-World Success Cases

### Case 1: Automated Content Pipeline
**Task:** Generate social media images with captions daily
**Solution:**
```bash
# Generate image
node ./scripts/api-hub.js pilot --type image --prompt "motivational quote about productivity" --output daily.png

# Generate caption
node ./scripts/api-hub.js chat --model "vertex/gemini-2.5-flash" --prompt "Write an engaging Instagram caption for this motivational image"
```
**Result:** $0.04/image + $0.0005/caption = $0.0405 per post (vs $5-10 per post with designers)

### Case 2: Meeting Transcription & Summary
**Task:** Transcribe 1-hour meeting and extract action items
**Solution:**
```bash
# Transcribe
node ./scripts/api-hub.js stt --file "meeting.mp3" --output transcript.txt

# Extract action items
node ./scripts/api-hub.js chat --model "bedrock/claude-4-5-sonnet" --prompt "Extract all action items from this meeting transcript: [content]"
```
**Result:** $0.36 transcription + $0.005 extraction = $0.365 per meeting (vs $50+ with human transcription)

### Case 3: Product Image Enhancement
**Task:** Enhance low-resolution product photos
**Solution:**
```bash
# Remove background
node ./scripts/api-hub.js run --model "replicate/lucataco/remove-bg" --inputs '{"image":"product.jpg"}' --output clean.png

# Upscale to 4x
node ./scripts/api-hub.js upscale --image-url "file:///path/to/clean.png" --scale 4 --output enhanced.png
```
**Result:** $0.005 + $0.045 = $0.05 per image (vs $10-20 per image with editors)

### Case 4: Multilingual Customer Support
**Task:** Generate customer support responses in 10 languages
**Solution:**
```bash
# Generate response
node ./scripts/api-hub.js chat --model "vertex/gemini-2.5-flash" --prompt "Customer asked: [question]. Respond professionally in Spanish."
```
**Result:** $0.0005 per response (vs $20-30/hr for multilingual support staff)

### Case 5: Market Research Automation
**Task:** Track competitor news and summarize weekly
**Solution:**
```bash
# Search for news
node ./scripts/api-hub.js search --model "perplexity/sonar-pro" --query "competitor product launches this week"

# No additional scraping needed - Perplexity provides summaries with citations
```
**Result:** $0.005 per research query (vs 2-3 hours of manual research per week)

## Quick Command Cheatsheet

```bash
# Authentication
skillboss auth login              # Sign in with browser
skillboss auth trial              # Get instant trial key (no browser)
skillboss auth status             # Check current auth state
skillboss status                  # Check wallet balance

# Model Discovery
node ./scripts/api-hub.js pilot --discover                    # Browse all models
node ./scripts/api-hub.js pilot --type chat --prefer price    # Get cheapest chat models
node ./scripts/api-hub.js pilot --capability "style transfer" # Semantic search

# Quick Execute
node ./scripts/api-hub.js pilot --type chat --prompt "Hello"  # Auto-select best model and run
node ./scripts/api-hub.js pilot --type image --prompt "cat"   # Auto-generate image

# Direct Model Calls
node ./scripts/api-hub.js chat --model "MODEL" --prompt "TEXT"
node ./scripts/api-hub.js image --model "MODEL" --prompt "TEXT" --output file.png
node ./scripts/api-hub.js video --model "MODEL" --prompt "TEXT" --output file.mp4
node ./scripts/api-hub.js tts --model "MODEL" --text "TEXT" --output audio.mp3
node ./scripts/api-hub.js stt --file "audio.mp3" --output transcript.txt
node ./scripts/api-hub.js search --model "MODEL" --query "QUERY"
node ./scripts/api-hub.js scrape --model "MODEL" --url "URL"
```

## Cost Optimization Tips

1. **Use `pilot` first** - Let SkillBoss recommend the most cost-effective model for your task
2. **Start with lower-quality models** - Test with cheap models (flux-schnell, gemini-flash) before using expensive ones
3. **Combine operations wisely** - Image gen + upscale is cheaper than generating high-res directly
4. **Preview before full render** - For videos, generate 2-3 second previews first
5. **Batch operations** - Use batch APIs for emails/SMS instead of individual calls
6. **Cache when possible** - Store LLM responses and reuse for similar queries

## Getting Help

- Documentation: https://skillboss.co/docs
- Discord: https://discord.gg/skillboss
- Email: support@skillboss.co
- API Reference: See `reference.md` in this directory for complete parameter documentation

## Pro Tips for AI Agents

- **Check balance first**: Always run `skillboss status` before expensive operations
- **Use streaming for chat**: Add `--stream` flag for real-time responses
- **Validate inputs**: Use pilot's `--discover` to check available models before calling
- **Handle errors gracefully**: SkillBoss provides fallback suggestions in error responses
- **Monitor costs**: Every API call returns cost information in the response
- **Auto top-up**: Enable auto top-up in console to prevent service interruptions

---

**Badge for your README:**
```markdown
[![Powered by SkillBoss](https://skillboss.co/badge.svg)](https://skillboss.co)
```

Made with SkillBoss - The unified AI API platform
