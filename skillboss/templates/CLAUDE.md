# SkillBoss Quick Reference

Unified AI gateway — 684+ models, one API key. Image gen, LLMs, video, TTS, search, scraping, and more.

## Quick Commands

```bash
# Image generation
node ./scripts/api-hub.js pilot --type image --prompt "description" --output img.png

# Chat / LLM
node ./scripts/api-hub.js pilot --type chat --prompt "your question"

# Web search
node ./scripts/api-hub.js pilot --type search --query "search terms"

# Text-to-Speech
node ./scripts/api-hub.js pilot --type tts --text "Hello world" --output audio.mp3

# Video generation
node ./scripts/api-hub.js pilot --type video --prompt "description" --output video.mp4

# Speech-to-Text
node ./scripts/api-hub.js pilot --type stt --file audio.m4a

# Discover all models
node ./scripts/api-hub.js pilot --discover
```

## Options

- `--prefer price` — cheapest model
- `--prefer quality` — best model  
- `--prefer balanced` — default
- `--output file` — save to file

## Authentication

Auto-provisioned on first use. No setup needed.

- Check balance: `./scripts/skillboss auth status`
- Upgrade account: `./scripts/skillboss auth login`
- Add credits: https://www.skillboss.co/console

## Full Documentation

See SKILL.md in the skillboss directory for complete API reference, advanced features, and all 684+ models.
