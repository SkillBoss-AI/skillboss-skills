# Talking Head Video

Create AI-generated talking head videos from any topic. Research → Script → Video — fully automated.

（从任意主题自动生成口播视频：搜索资料 → 写文案/分镜 → AI 生成视频）

## Overview

This workflow generates short-form talking head videos (15-60 seconds per scene) by combining:

1. **AI Search** — research the topic with citations
2. **LLM Script Writing** — generate a spoken script and scene descriptions
3. **Video Generation** — create talking head scenes with AI video models
4. **Audio Narration** — generate professional voiceover (optional, for scenes without built-in speech)

The output is one or more video clips of an AI-generated person speaking about the topic, suitable for TikTok, YouTube Shorts, LinkedIn, or any social platform.

## Quick Start (3 Steps)

```bash
# 1. Research the topic
skb api call perplexity/sonar-pro \
  -b '{"messages":[{"role":"user","content":"Summarize the top 3 AI trends in 2026 with key statistics"}]}'

# 2. Generate the video (use the research to craft a prompt)
skb api call vertex/veo-3.1-fast-generate-preview \
  -b '{"prompt":"A professional tech presenter speaking to camera in a modern studio, explaining that AI agents now handle 40% of enterprise workflows. Confident tone, natural gestures, 16:9 format."}' \
  -o talking-head.mp4

# 3. (Optional) Generate narration audio separately
skb task tts -b '{"text":"AI agents are transforming the enterprise. In 2026, over 40 percent of workflows are now handled by autonomous AI systems."}' --prefer quality -o narration.mp3
```

（快速开始：搜索 → 生成视频 → 可选配音）

## Step-by-Step Guide

### Step 1: Research the Topic（搜索研究）

Use Perplexity AI Search to gather factual, cited information:

```bash
# AI search with citations (recommended)
skb api call perplexity/sonar-pro \
  -b '{"messages":[{"role":"user","content":"What are the biggest AI trends in 2026? Include statistics and sources."}]}'

# Alternative: broader web search
skb api call linkup/search \
  -b '{"query":"AI trends 2026 statistics","output_type":"sourcedAnswer","depth":"deep"}'
```

**What to extract from results:**
- Key facts and statistics (with sources)
- Quotes from industry leaders
- Specific numbers that make the script credible

### Step 2: Generate Script & Storyboard（文案 & 分镜生成）

As an AI assistant, YOU write the script directly based on the search results. No need to call a chat API for this step — you are the scriptwriter.

**Script structure for a 60-second video:**

```
SCENE 1 — Hook (0-10s)
[Presenter looks at camera, energetic tone]
"Did you know that AI agents now handle 40% of enterprise workflows?"

SCENE 2 — Main Point (10-35s)
[Presenter gesturing naturally, moderate pace]
"In 2026, three trends are reshaping the industry. First, autonomous AI agents
are replacing entire departments. Second, multimodal AI can now see, hear, and
create simultaneously. Third, AI-native companies are growing 5x faster than
traditional competitors."

SCENE 3 — Call to Action (35-60s)
[Presenter leaning in slightly, direct tone]
"If you're not building with AI agents today, you're already behind.
Follow for more AI insights every week."
```

**If you prefer using an LLM to draft the script:**

```bash
skb api call openai/gpt-5 \
  -b '{"messages":[
    {"role":"system","content":"You are a professional video scriptwriter. Write a 60-second talking head script based on the research provided. Format: SCENE N — Title (timestamp)\n[Stage direction]\n\"Dialogue\""},
    {"role":"user","content":"Research: [PASTE SEARCH RESULTS HERE]. Write a 3-scene talking head script about AI trends in 2026."}
  ]}'
```

**Script guidelines:**
- Keep each scene under 30 seconds of spoken content
- Write for spoken delivery: short sentences, conversational tone
- Include stage directions in brackets: `[looks at camera]`, `[gestures]`
- Add a hook in the first 5 seconds
- End with a clear call to action

（脚本要点：口语化、短句、每场景 < 30 秒、开头有 hook、结尾有 CTA）

### Step 3: Generate Video Scenes（视频生成）

Generate each scene as a separate video clip. Craft detailed prompts that describe:
- **Who**: appearance, age, attire
- **Where**: background/setting
- **What**: speaking, gestures, expression
- **How**: camera angle, lighting, mood

```bash
# Scene 1 — Hook
skb api call vertex/veo-3.1-fast-generate-preview \
  -b '{"prompt":"A young professional woman in a navy blazer speaking directly to camera in a bright modern office. She raises her eyebrows with a surprised expression and says something attention-grabbing. Natural lighting, shallow depth of field, 16:9 cinematic."}' \
  -o /tmp/scene-1-hook.mp4

# Scene 2 — Main content
skb api call vertex/veo-3.1-fast-generate-preview \
  -b '{"prompt":"Same young professional woman in navy blazer, now gesturing with her hands as she explains something complex. She counts points on her fingers. Modern office background, warm lighting, medium shot, 16:9."}' \
  -o /tmp/scene-2-main.mp4

# Scene 3 — Call to action
skb api call vertex/veo-3.1-fast-generate-preview \
  -b '{"prompt":"Same young professional woman, leaning slightly toward the camera with a confident smile. She points at the camera encouragingly. Modern office, warm lighting, close-up shot, 16:9."}' \
  -o /tmp/scene-3-cta.mp4
```

**Alternative models (different quality/cost tradeoffs):**

```bash
# High quality — Seedance 2.0 (async, CLI auto-polls)
skb api call seedance/seedance-2.0 \
  -b '{"prompt":"A professional presenter speaking to camera in a studio...","duration_seconds":10}' \
  -o /tmp/scene-hq.mp4

# Budget option — MiniMax text-to-video
skb api call mm/t2v \
  -b '{"prompt":"A person speaking to camera in an office setting..."}' \
  -o /tmp/scene-budget.mp4

# Image-to-video — Animate a generated portrait
skb task image -b '{"prompt":"Professional headshot of a woman in a blazer, studio lighting, white background"}' -o /tmp/presenter.png
skb api call mm/i2v \
  -b '{"image":"/tmp/presenter.png","prompt":"The person starts speaking and gesturing naturally"}' \
  -o /tmp/scene-animated.mp4
```

（视频生成：每个场景单独生成，prompt 要详细描述人物、场景、动作、镜头）

### Step 4: Add Narration Audio（配音 — 可选）

If the AI-generated video doesn't include speech audio, or you want higher quality narration:

```bash
# Professional multilingual voiceover (recommended)
skb task tts \
  -b '{"text":"Did you know that AI agents now handle 40 percent of enterprise workflows? In 2026, three trends are reshaping the industry..."}' \
  --prefer quality \
  -o /tmp/narration-full.mp3

# Chinese narration
skb api call minimax/speech-01-turbo \
  -b '{"text":"你知道吗？AI 智能体现在已经处理了 40% 的企业工作流..."}' \
  -o /tmp/narration-zh.mp3

# Split long scripts into segments
skb task tts -b '{"text":"[SCENE 1 TEXT]"}' --prefer quality -o /tmp/narration-1.mp3
skb task tts -b '{"text":"[SCENE 2 TEXT]"}' --prefer quality -o /tmp/narration-2.mp3
skb task tts -b '{"text":"[SCENE 3 TEXT]"}' --prefer quality -o /tmp/narration-3.mp3
```

**Voice models:**

| Model | Best For | Languages |
|-------|----------|-----------|
| `elevenlabs/eleven_multilingual_v2` | Professional quality, natural tone | 29 languages |
| `minimax/speech-01-turbo` | Chinese content | Chinese, English |
| `openai/tts-1-hd` | Fast, reliable | Multiple |

### Step 5: Combine & Deliver（合成 & 交付）

Deliver the individual scene files to the user. If they need concatenation:

```bash
# Concatenate video scenes with ffmpeg (if available on user's machine)
# Create file list
echo "file '/tmp/scene-1-hook.mp4'" > /tmp/scenes.txt
echo "file '/tmp/scene-2-main.mp4'" >> /tmp/scenes.txt
echo "file '/tmp/scene-3-cta.mp4'" >> /tmp/scenes.txt

ffmpeg -f concat -safe 0 -i /tmp/scenes.txt -c copy /tmp/final-video.mp4
```

**Note:** If ffmpeg is not available, deliver scenes as individual clips. Most video editors (CapCut, Premiere, DaVinci) can combine them easily.

## Video Prompt Engineering Tips

（视频 Prompt 写作技巧）

### Character Consistency

Keep the same person across scenes by repeating key descriptors:

```
✅ "A 30-year-old woman with shoulder-length dark hair, wearing a navy blazer and white shirt"
✅ Repeat this exact description in every scene prompt
❌ "A woman" (too vague, will generate different people)
❌ Changing outfit/hair between scenes
```

### Camera & Composition

| Shot Type | When to Use | Prompt Keywords |
|-----------|-------------|-----------------|
| Close-up | Hook, CTA, emotional moments | "close-up shot", "face fills frame" |
| Medium shot | Main content, explanations | "medium shot", "waist-up framing" |
| Wide shot | Establishing, context | "wide shot", "full body visible" |

### Aspect Ratios by Platform

| Platform | Ratio | Prompt Addition |
|----------|-------|-----------------|
| TikTok / Reels / Shorts | 9:16 | "vertical format, 9:16 aspect ratio" |
| YouTube / LinkedIn | 16:9 | "horizontal format, 16:9 cinematic" |
| Instagram Post | 1:1 | "square format, 1:1 aspect ratio" |

### Lighting & Mood

```
Professional/Corporate: "soft studio lighting, neutral background, professional atmosphere"
Casual/Friendly: "natural window lighting, cozy room, warm tones"
Tech/Modern: "cool-toned lighting, minimalist dark background, futuristic feel"
Outdoor: "golden hour sunlight, urban rooftop, cinematic depth of field"
```

## Error Handling & Fallback

### Video Generation (Rate Limit 429)

1. Wait 30 seconds and retry
2. Switch model:
   - Primary: `vertex/veo-3.1-fast-generate-preview`
   - Fallback 1: `seedance/seedance-2.0` (async, higher quality)
   - Fallback 2: `mm/t2v` (fast, lower quality)

### Video Generation (Long-running request)

Some high-quality video models (for example `seedance/seedance-2.0`) may take noticeably longer to finish. The `skb` CLI waits for completion automatically. If you call the API directly, allow the request to run longer instead of assuming a separate public polling endpoint exists.

### TTS (Rate Limit 429)

1. Wait 30 seconds and retry
2. Switch to fallback:
   - Primary: `elevenlabs/eleven_multilingual_v2`
   - Fallback 1: `openai/tts-1-hd`
   - Fallback 2: `minimax/speech-01-turbo`

### Search (Rate Limit 429)

1. Wait and retry `perplexity/sonar-pro`
2. Switch to `perplexity/sonar` (basic tier)
3. Switch to `linkup/search` (structured web search)

### Insufficient Credits (HTTP 402)

Tell user: "Your SkillBoss credits have run out. Visit https://www.skillboss.co/ to add credits or subscribe."

## Cost Estimates（成本估算）

| Step | Model | Approx. Cost |
|------|-------|--------------|
| Search | `perplexity/sonar-pro` | 1-5 credits (~$0.05-$0.25) |
| Script (if using LLM) | `openai/gpt-5` | 2-10 credits (~$0.10-$0.50) |
| Video (per scene) | `vertex/veo-3.1-fast-generate-preview` | 50-100 credits (~$2.50-$5.00) |
| Video (per scene) | `seedance/seedance-2.0` | ~$0.58/s (e.g., 10s = ~116 credits) |
| Video (per scene) | `mm/t2v` | 20-50 credits (~$1.00-$2.50) |
| TTS narration | `elevenlabs/eleven_multilingual_v2` | 5-10 credits (~$0.25-$0.50) |
| **Total (3-scene video)** | | **~$8-$20** |

（一个 3 场景的口播视频大约 $8-$20，取决于模型选择和视频时长）

## FAQ

**Q: Can I make the same person appear in all scenes?**
A: AI video generation doesn't guarantee perfect character consistency across separate clips. Use detailed, identical character descriptions in every prompt. For best results, generate a character reference image first, then use image-to-video (`mm/i2v`) to animate it in each scene.

**Q: How long can each video clip be?**
A: Veo 3.1 generates ~5-8 second clips. Seedance 2.0 supports 5, 10, or 15 seconds. MiniMax generates ~5 second clips. For longer videos, generate multiple scenes and concatenate.

**Q: Can I generate videos in languages other than English?**
A: Video generation is prompt-based and language-agnostic. For non-English narration, use `minimax/speech-01-turbo` (Chinese) or `elevenlabs/eleven_multilingual_v2` (29 languages) for TTS.

**Q: What if I need lip-sync (mouth matching the audio)?**
A: Current SkillBoss video models generate video from text prompts and don't support audio-driven lip-sync. For best results, describe the speaking action in the prompt and add a separate audio track. The visual "speaking" motion will be approximate.

**Q: Can I use my own face/avatar?**
A: Use image-to-video (`mm/i2v`): upload a photo and prompt it to animate with speaking motion. This gives the closest result to a custom avatar.

（FAQ：角色一致性、视频时长、多语言、口型同步、自定义头像）

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Video is too short | Generate multiple scenes and concatenate; use `seedance/seedance-2.0` with `duration_seconds: 15` for longer clips |
| Person looks different across scenes | Use identical character description in every prompt; consider image-to-video approach |
| No audio in generated video | Most AI video models generate silent video; add TTS narration as a separate step |
| Video quality too low | Switch to `seedance/seedance-2.0` (highest quality) or add `"high quality, 4K, cinematic"` to prompt |
| Video generation takes longer than expected | Allow 2-5 minutes for long-running models such as `seedance/seedance-2.0`; prefer the `skb` CLI so waiting is handled automatically |

## Models Reference

### Video Generation

| Model | Quality | Duration | Cost | Speed |
|-------|---------|----------|------|-------|
| `vertex/veo-3.1-fast-generate-preview` | High | ~5-8s | Medium | Fast |
| `seedance/seedance-2.0` | Highest | 5/10/15s | High (~$0.36/s) | Slow (async) |
| `mm/t2v` | Standard | ~5s | Low | Fast |
| `mm/i2v` | Standard | ~5s | Low | Fast |

### AI Search

| Model | Features | Cost |
|-------|----------|------|
| `perplexity/sonar-pro` | Citations, comprehensive | 3-5 credits |
| `perplexity/sonar` | Basic search | 1-2 credits |
| `linkup/search` | Structured, filterable | 1-3 credits |

### Text-to-Speech

| Model | Quality | Languages | Cost |
|-------|---------|-----------|------|
| `elevenlabs/eleven_multilingual_v2` | Highest | 29 | 5-10 credits |
| `minimax/speech-01-turbo` | High | Chinese, EN | 2-5 credits |
| `openai/tts-1-hd` | High | Multiple | 3-8 credits |

## Best Practices

- **Start with research** — factual content with statistics makes better scripts
- **Write for speaking** — short sentences, contractions, conversational tone
- **Describe visuals precisely** — the more detail in the video prompt, the better the result
- **Keep character consistent** — copy-paste the same person description across all scene prompts
- **Test one scene first** — generate Scene 1, review quality, then generate the rest
- **Budget wisely** — use `mm/t2v` for drafts, `seedance/seedance-2.0` for final versions
- **Deliver individually** — give users separate scene clips so they can edit in their preferred tool
