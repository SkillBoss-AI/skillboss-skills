# Podcast Maker

Create professional podcast episodes and audio content from text.

## Workflow

### Step 1: Prepare Script

As an AI assistant, YOU prepare the script directly. No need to call chat API.

**If converting existing content:**
1. Read the source text
2. Optimize for audio:
   - Remove visual references ("as shown below", "see figure")
   - Shorten sentences to 15-20 words max
   - Add natural transitions ("Now, let's discuss...", "Moving on to...")
   - Use contractions ("don't" not "do not")
   - Break into logical segments

**If creating from topic:**
Write a conversational script with:
- Hook/intro (grab attention)
- Main points (organized clearly)
- Transitions between sections
- Conclusion/outro

### Step 2: Save Script to File

Save the optimized script to a text file:

```bash
# The script should be saved as a .txt file
# Example: /tmp/podcast-script.txt
```

### Step 3: Generate Audio

**For short content (< 5000 characters):**
```bash
node ./scripts/api-hub.js tts \
  --model "minimax/speech-01-turbo" \
  --text "$(cat /tmp/podcast-script.txt)" \
  --output /tmp/podcast-episode.mp3
```

**For long content, split into segments:**
```bash
# Generate intro
node ./scripts/api-hub.js tts \
  --model "minimax/speech-01-turbo" \
  --text "$(cat /tmp/intro.txt)" \
  --output /tmp/podcast-intro.mp3

# Generate main content
node ./scripts/api-hub.js tts \
  --model "minimax/speech-01-turbo" \
  --text "$(cat /tmp/main.txt)" \
  --output /tmp/podcast-main.mp3

# Generate outro
node ./scripts/api-hub.js tts \
  --model "minimax/speech-01-turbo" \
  --text "$(cat /tmp/outro.txt)" \
  --output /tmp/podcast-outro.mp3
```

### Step 4: Combine Segments (Optional)

```bash
ffmpeg -i "concat:intro.mp3|main.mp3|outro.mp3" -c copy /tmp/final-episode.mp3
```

## Error Handling & Fallback

### Rate Limit (HTTP 429)
If `minimax/speech-01-turbo` hits rate limit:
1. Wait 30 seconds and retry
2. Switch to fallback: `elevenlabs/eleven_multilingual_v2`

```bash
# Fallback example
node ./scripts/api-hub.js tts \
  --model "elevenlabs/eleven_multilingual_v2" \
  --text "$(cat /tmp/script.txt)" \
  --output /tmp/podcast-fallback.mp3
```

### Insufficient Credits (HTTP 402)
Tell user: "Your SkillBoss credits have run out. Visit https://www.skillboss.co/ to add credits or subscribe."

### Text Too Long
If TTS fails due to text length:
1. Split script into smaller chunks (< 4000 chars each)
2. Generate each chunk separately
3. Combine with ffmpeg

## Voice Models

| Model | Best For | Quality |
|-------|----------|---------|
| `minimax/speech-01-turbo` | Primary choice, multilingual | High |
| `elevenlabs/eleven_multilingual_v2` | Professional podcasts, 29 languages | Highest |
| `elevenlabs/eleven_turbo_v2` | English content, faster | High |

## Script Writing Tips

- Keep sentences short (15-20 words max)
- Use conversational language
- Include verbal signposts: "First...", "Next...", "Finally..."
- Add pauses with punctuation (commas, periods)
- Avoid jargon or explain technical terms
- Read aloud mentally to test flow

## Audio Length Estimates

| Text Length | Approx. Duration |
|-------------|------------------|
| 500 words | ~3-4 minutes |
| 1000 words | ~7-8 minutes |
| 2000 words | ~15 minutes |
| 5000 words | ~35-40 minutes |
