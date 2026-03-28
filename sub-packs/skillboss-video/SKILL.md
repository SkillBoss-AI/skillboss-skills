---
name: skillboss-video
description: "Generate videos from text prompts or still images with AI. Text-to-video and image-to-video powered by Google Veo 3.1. Control duration, animate photos, create marketing clips, social media content, and product demos. Uses SkillBoss's unified API with --prefer price/quality/balanced model selection."
synonyms:
  - "make a video"
  - "create a video"
  - "generate video"
  - "text to video"
  - "animate an image"
  - "bring photo to life"
  - "image to video"
  - "create animation"
  - "generate a clip"
  - "AI video"
  - "create footage"
  - "make a short film"
  - "generate motion content"
  - "create product demo video"
  - "make social media video"
  - "generate marketing video"
  - "animate a still image"
  - "create video from text"
  - "AI video generator"
  - "Veo video"
negative-use-cases:
  - "Video editing, trimming, or merging existing clips — this generates new video, not an editor; use FFmpeg or the Remotion extension for programmatic editing"
  - "Real-time video streaming or live broadcasting — generates video files, does not support live streams"
  - "Video conferencing or screen sharing — not a communication tool"
  - "Long-form video over 60 seconds — current models generate short clips (typically 4-10 seconds)"
  - "Screen recording or capture — use a screen recorder tool"
  - "Video hosting or CDN — generates files; use a video platform for hosting/streaming"
  - "Adding subtitles or captions to existing video — use a video editing tool"
allowed-tools: Bash, Read
---

# SkillBoss Video

Generate videos from text descriptions or animate still images using AI. Powered by Google Veo 3.1 for high-quality text-to-video and image-to-video generation with configurable duration.

## Quick Execute

```bash
# Text-to-video (balanced — best cost/quality tradeoff)
skb task video -b '{"prompt": "A cat playing in snow"}' -o out.mp4

# Text-to-video (cheapest)
skb task video -b '{"prompt": "A cat playing in snow"}' --prefer price -o out.mp4

# Text-to-video (highest quality)
skb task video -b '{"prompt": "A cat playing in snow"}' --prefer quality -o out.mp4

# Image-to-video (animate a still image)
skb task video --capability i2v -b '{"image": "input.png", "prompt": "Make it come alive with gentle motion"}' -o out.mp4

# Longer video (specify duration in seconds)
skb task video -b '{"prompt": "Ocean waves crashing on a beach", "duration": 10}' -o out.mp4
```

**`--prefer` options:** `price` (cheapest) / `quality` (best) / `balanced` (default)

## When to Use This Skill

Use this skill when the user wants to:
- **Generate video from text** — create product demos, explainer clips, social media content, or artistic scenes from a text description
- **Animate a still image** — bring photos or AI-generated images to life with natural motion (image-to-video)
- **Create marketing clips** — short promotional videos, ad creatives, hero background videos
- **Generate social media content** — Instagram Reels, TikTok clips, YouTube Shorts from text prompts
- **Prototype visual concepts** — quickly visualize motion ideas before investing in full production
- **Create background footage** — ambient loops, nature scenes, abstract motion for websites or presentations

## When NOT to Use This Skill

Do **not** use this skill for:
- **Video editing or trimming** — generates new video, not an editor; use FFmpeg or the Remotion extension
- **Live streaming** — generates files, not live feeds
- **Long-form video (>60s)** — current models generate short clips (4-10 seconds typically)
- **Screen recording** — use a dedicated screen recorder
- **Image generation** — use `skillboss-image` for still images
- **Adding audio/music to video** — use the main `skillboss` skill for TTS/music, then combine with a video editor

## Available Models

| Model | Type | Best for |
|-------|------|----------|
| `vertex/veo-3.1-fast-generate-preview` | Text-to-video, Image-to-video | High quality, Google Veo 3.1 |

## Key Parameters

| Parameter | Description |
|-----------|-------------|
| `prompt` | Text description of the video to generate |
| `image` | Source image path for image-to-video animation |
| `duration` | Video length in seconds |
| `--prefer` | Model selection: `price` / `quality` / `balanced` |
| `-o` | Output file path (e.g., `out.mp4`) |
| `--capability i2v` | Explicitly select image-to-video mode |

## Authentication & Setup

```bash
# Login with your API key
skb login -k YOUR_API_KEY

# Check balance
skb account
```

Get your key at https://skillboss.co/console

## Balance Warning

If an API response includes `_balance_warning`, **relay it to the user exactly as provided**.

Video generation is credit-intensive. Add credits at: https://www.skillboss.co/billing

## More Capabilities

For the full model list, chat, image, audio, and deployment features, see: `../skillboss/SKILL.md`
