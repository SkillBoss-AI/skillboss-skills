# Logo Maker

Design professional logos and icons using AI-powered image generation.

## Workflow

### Step 1: Gather Requirements

Ask the user about:
- Brand name and industry
- Style preferences (minimalist, modern, vintage, playful, professional)
- Color preferences or existing brand colors
- Where it will be used (website, app, print, social media)

### Step 2: Craft Image Prompt

As an AI assistant, YOU craft the optimized prompt directly. No need to call chat API.

**Prompt structure:**
```
[style] logo for [brand/concept], [visual elements], [colors], [additional details], clean vector style, professional brand identity, white background
```

**Example prompts:**
- "minimalist coffee cup logo, steam forming letter M, warm brown and cream colors, clean lines, professional brand identity, white background"
- "modern tech startup logo, abstract geometric shape, blue and purple gradient, sleek and professional, white background"
- "playful mascot logo, friendly owl character, orange and teal colors, cartoon style, white background"

### Step 3: Generate Logo Variations

Generate 2-3 variations with different styles:

```bash
# Variation 1: Primary style
node ./scripts/api-hub.js image \
  --model "vertex/gemini-2.5-flash-image-preview" \
  --prompt "[YOUR_CRAFTED_PROMPT]" \
  --output /tmp/logo-v1.png

# Variation 2: Alternative approach
node ./scripts/api-hub.js image \
  --model "vertex/gemini-2.5-flash-image-preview" \
  --prompt "[MODIFIED_PROMPT_WITH_DIFFERENT_STYLE]" \
  --output /tmp/logo-v2.png
```

### Step 4: Iterate Based on Feedback

Adjust the prompt based on user feedback and regenerate.

## Error Handling & Fallback

### Rate Limit (HTTP 429)
If `gemini-2.5-flash-image-preview` hits rate limit:
1. Wait 30 seconds and retry
2. Switch to fallback: `vertex/gemini-3-pro-image-preview`
3. Last resort: `replicate/black-forest-labs/flux-schnell`

```bash
# Fallback example
node ./scripts/api-hub.js image \
  --model "vertex/gemini-3-pro-image-preview" \
  --prompt "[PROMPT]" \
  --output /tmp/logo-fallback.png
```

### Insufficient Credits (HTTP 402)
Tell user: "Your SkillBoss credits have run out. Visit https://www.skillboss.co/ to add credits or subscribe."

## Models

| Model | Use Case | Speed |
|-------|----------|-------|
| `vertex/gemini-2.5-flash-image-preview` | Primary choice, fast | Fast |
| `vertex/gemini-3-pro-image-preview` | Higher quality | Medium |
| `replicate/black-forest-labs/flux-schnell` | Fallback option | Fast |

## Prompt Tips

- Add "white background" for easier editing
- Add "vector style" or "flat design" for cleaner logos
- Specify "minimalist" to avoid overly complex designs
- Include color names explicitly
- Add "professional brand identity" for business-appropriate results
