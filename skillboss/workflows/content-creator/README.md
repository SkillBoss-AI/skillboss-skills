# Content Creator

Create comprehensive multimedia content using AI-powered generation.

## Workflow

### Step 1: Define Content Needs

Ask the user about:
- Platform (website, Instagram, Twitter, LinkedIn, YouTube, TikTok)
- Content type (images, video, audio, mixed)
- Target audience and tone
- Key message and CTA

### Step 2: Plan Content Package

As an AI assistant, YOU plan and create the content directly. No need to call chat API.

Determine what assets are needed:
- Hero images / thumbnails
- Supporting graphics
- Video (if applicable)
- Audio/voiceover (if applicable)
- Copy/captions

### Step 3: Generate Visual Assets

```bash
# Hero image
node ./scripts/api-hub.js image \
  --model "vertex/gemini-2.5-flash-image-preview" \
  --prompt "[YOUR_VISUAL_CONCEPT]" \
  --output /tmp/hero-image.png

# Feature/supporting images
node ./scripts/api-hub.js image \
  --model "vertex/gemini-2.5-flash-image-preview" \
  --prompt "[SUPPORTING_VISUAL]" \
  --output /tmp/feature-1.png
```

### Step 4: Generate Audio (Optional)

For voiceovers or narration:

```bash
node ./scripts/api-hub.js tts \
  --model "elevenlabs/eleven_multilingual_v2" \
  --text "[SCRIPT_TEXT]" \
  --output /tmp/voiceover.mp3
```

### Step 5: Generate Video (Optional)

For short promotional videos:

```bash
node ./scripts/api-hub.js video \
  --model "vertex/veo-3.1-fast-generate-preview" \
  --prompt "[VIDEO_DESCRIPTION]" \
  --output /tmp/promo-video.mp4
```

## Error Handling & Fallback

### Image Generation (Rate Limit 429)
1. Wait 30 seconds and retry
2. Switch to: `vertex/gemini-3-pro-image-preview`
3. Last resort: `replicate/black-forest-labs/flux-schnell`

### TTS (Rate Limit 429)
1. Wait 30 seconds and retry
2. Switch to: `openai/tts-1-hd`
3. Last resort: `minimax/speech-01-turbo`

### Video (Rate Limit 429)
No fallback available - wait and retry.

### Insufficient Credits (HTTP 402)
Tell user: "Your SkillBoss credits have run out. Visit https://www.skillboss.co/ to add credits or subscribe."

## Content Packages

### Social Media Package
1. Write copy for each platform
2. Generate images in platform-specific sizes
3. (Optional) Create short video clip

### Product Launch Package
- Hero image (main product visual)
- Feature graphics (3-4 highlights)
- Voiceover script + audio
- Social media posts

### Blog + Audio Combo
- Featured image for blog header
- Audio version of article (TTS)
- Social snippet graphics

## Platform Specifications

### Image Sizes

| Platform | Size | Aspect Ratio |
|----------|------|--------------|
| Instagram Post | 1080x1080 | 1:1 |
| Instagram Story | 1080x1920 | 9:16 |
| Twitter/X | 1200x675 | 16:9 |
| LinkedIn | 1200x627 | 1.91:1 |
| Facebook | 1200x630 | 1.91:1 |
| YouTube Thumbnail | 1280x720 | 16:9 |

### Video Specs

| Platform | Duration | Aspect |
|----------|----------|--------|
| TikTok/Reels | 15-60s | 9:16 |
| YouTube Shorts | 60s max | 9:16 |
| Twitter/LinkedIn | 30-60s | 16:9 or 1:1 |

## Models Reference

| Type | Model | Best For |
|------|-------|----------|
| Image | `vertex/gemini-2.5-flash-image-preview` | Primary choice, fast |
| Image | `vertex/gemini-3-pro-image-preview` | High quality |
| Image | `replicate/black-forest-labs/flux-schnell` | Fallback option |
| TTS | `elevenlabs/eleven_multilingual_v2` | Professional voiceover |
| TTS | `minimax/speech-01-turbo` | Chinese content |
| Video | `vertex/veo-3.1-fast-generate-preview` | Short promotional videos |

## Tips

- Maintain consistent visual style across assets
- Use the same color palette and typography
- Generate multiple variations for A/B testing
- Optimize images for each platform's requirements
- Keep video scripts concise (15-30 seconds for social)
