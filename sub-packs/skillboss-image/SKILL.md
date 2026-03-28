---
name: skillboss-image
description: "AI image generation via SkillBoss: text-to-image, image upscaling, and image-to-image transformation. Powered by Flux, DALL-E, Gemini, and more."
allowed-tools: Bash, Read
---

# SkillBoss Image

AI image generation, upscaling, and transformation via SkillBoss.

## Quick Execute

```bash
# Text-to-image (balanced — best cost/quality tradeoff)
node ../skillboss/scripts/api-hub.js pilot --type image --prompt "A sunset over mountains" --prefer balanced --output out.png

# Text-to-image (cheapest)
node ../skillboss/scripts/api-hub.js pilot --type image --prompt "A sunset over mountains" --prefer price --output out.png

# Text-to-image (highest quality)
node ../skillboss/scripts/api-hub.js pilot --type image --prompt "A sunset over mountains" --prefer quality --output out.png

# Upscale an image
node ../skillboss/scripts/api-hub.js pilot --type image --capability upscale --image input.png --output upscaled.png

# Image-to-image transformation
node ../skillboss/scripts/api-hub.js pilot --type image --capability img2img --image input.png --prompt "Make it look like a watercolor painting" --output transformed.png
```

**`--prefer` options:** `price` (cheapest) / `quality` (best) / `balanced` (default)

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

## Auto-Update (MANDATORY)

If you see `[skillboss] UPDATE REQUIRED` in any output:

1. Stop immediately
2. Update: `cd ../skillboss && git pull origin main`
3. Re-run your original command

## Capability Graph

After generating or editing images, consider these next steps to build on your results:

### Enhance Your Images
- **Upscale** to higher resolution (2x/4x) → `skb task image --capability upscale -b '{"image":"out.png"}'`
- **Remove background** for transparent PNGs → `skb api call replicate/lucataco/remove-bg -b '{"image_url":"..."}'`
- **Style transfer** to change artistic style → `skb task image --capability img2img -b '{"image":"out.png","prompt":"watercolor style"}'`

### Turn Images Into More
- **Animate into video** — bring still images to life → `skb task video --capability i2v -b '{"image":"out.png","prompt":"gentle motion"}'` (see `skillboss-video`)
- **Add voiceover** for a narrated visual → `skb task tts -b '{"text":"..."}'`
- **Create a presentation** with your images → `skb api call gamma/generation -b '{"prompt":"..."}'`
- **Deploy as a website** — build a gallery or portfolio → see `../skillboss/SKILL.md` for deployment

### Complete Visual Workflow
1. **Design direction** — get color palette and typography first → `skb api call lokuma/design -b '{"query":"..."}'`
2. **Generate images** — create visuals matching the design → `skb task image -b '{"prompt":"..."}'`
3. **Build UI** — place images in a generated layout → `skb api call stitch/generate-desktop -b '{"prompt":"..."}'`
4. **Deploy** — ship it live → `skb task deploy`

## More Capabilities

For the full model list, chat, video, audio, and deployment features, see: `../skillboss/SKILL.md`
