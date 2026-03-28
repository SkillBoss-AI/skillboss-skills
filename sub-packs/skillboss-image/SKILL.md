---
name: skillboss-image
description: "Generate, upscale, transform, and edit images with AI. Text-to-image via Flux Schnell/Dev and Gemini Flash/Pro. Upscale photos 2x/4x with FAL. Image-to-image style transfer. Remove backgrounds. All through SkillBoss's unified API with --prefer price/quality/balanced model selection."
synonyms:
  - "generate an image"
  - "create a picture"
  - "make art"
  - "draw something"
  - "text to image"
  - "AI art"
  - "generate illustration"
  - "create graphic"
  - "upscale photo"
  - "enhance image resolution"
  - "improve image quality"
  - "enlarge image"
  - "transform image"
  - "edit photo"
  - "style transfer"
  - "change image style"
  - "remove background"
  - "make transparent"
  - "cut out subject"
  - "create product photo"
  - "generate thumbnail"
  - "make a logo"
  - "design a banner"
  - "AI image generator"
  - "Flux image"
  - "Gemini image"
negative-use-cases:
  - "Video generation — use skillboss-video for text-to-video or image-to-video"
  - "Precise manual image editing (Photoshop-style layers, selections, brushes) — this is AI generation, not a raster editor"
  - "3D model or 3D scene generation — image-only; use a 3D modeling tool"
  - "OCR or text extraction from images — use the main skillboss skill with document parsing (Reducto)"
  - "Image annotation or labeling for ML datasets — no bounding-box or segmentation tools"
  - "Batch processing thousands of images in one call — processes one image per request"
  - "Animated GIFs or image sequences — generates still images; use skillboss-video for motion"
allowed-tools: Bash, Read
---

# SkillBoss Image

Generate, upscale, transform, and remove backgrounds from images using AI. Supports text-to-image (Flux Schnell, Flux Dev, Gemini Flash, Gemini Pro), upscaling (FAL 2x/4x), image-to-image style transfer (FAL FLUX), and background removal.

## Quick Execute

```bash
# Text-to-image (balanced — best cost/quality tradeoff)
skb task image -b '{"prompt": "A sunset over mountains"}' -o out.png

# Text-to-image (cheapest)
skb task image -b '{"prompt": "A sunset over mountains"}' --prefer price -o out.png

# Text-to-image (highest quality)
skb task image -b '{"prompt": "A sunset over mountains"}' --prefer quality -o out.png

# Upscale an image (2x or 4x)
skb task image --capability upscale -b '{"image": "input.png"}' -o upscaled.png

# Image-to-image transformation (style transfer)
skb task image --capability img2img -b '{"image": "input.png", "prompt": "Make it look like a watercolor painting"}' -o transformed.png

# Remove background
skb api call replicate/lucataco/remove-bg -b '{"image_url":"https://example.com/photo.jpg"}' -o nobg.png
```

**`--prefer` options:** `price` (cheapest) / `quality` (best) / `balanced` (default)

## When to Use This Skill

Use this skill when the user wants to:
- **Generate images from text** — product photos, illustrations, concept art, social media graphics, blog images, thumbnails
- **Upscale low-resolution images** — enlarge photos 2x or 4x while preserving detail (FAL creative upscaler)
- **Transform image style** — change an existing image to a different artistic style (watercolor, oil painting, anime, photorealistic)
- **Remove backgrounds** — isolate subjects, create transparent PNGs for product listings or compositing
- **Create marketing visuals** — banners, ad creatives, hero images, Open Graph images
- **Design logos and icons** — generate logo concepts, app icons, favicons from descriptions

## When NOT to Use This Skill

Do **not** use this skill for:
- **Video generation** — use `skillboss-video` for text-to-video or image-to-video
- **Photoshop-style editing** — no layers, masks, or pixel-level tools; this is AI generation
- **3D modeling** — generates 2D images only
- **OCR / text extraction** — use the main `skillboss` skill with document parsing
- **Batch processing at scale** — one image per API call

## Available Models

| Model | Type | Best for |
|-------|------|----------|
| `vertex/gemini-2.5-flash-image-preview` | Text-to-image | Fast, cost-effective generation (recommended) |
| `vertex/gemini-3-pro-image-preview` | Text-to-image | Highest quality generation |
| `replicate/black-forest-labs/flux-schnell` | Text-to-image | Fast generation, good quality |
| `replicate/black-forest-labs/flux-dev` | Text-to-image | High quality, more detail |
| `fal/upscale` | Upscale | 2x or 4x creative upscaling |
| `fal/img2img` | Transform | Style transfer, image-to-image |
| `replicate/lucataco/remove-bg` | Background removal | Clean cutouts |
| `replicate/851-labs/background-remover` | Background removal | Alternative remover |

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

Add credits at: https://www.skillboss.co/billing

## More Capabilities

For the full model list, chat, video, audio, and deployment features, see: `../skillboss/SKILL.md`
