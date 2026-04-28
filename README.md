[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/heeyo-life-skillboss-skills-badge.png)](https://mseep.ai/app/heeyo-life-skillboss-skills)

<div align="center">

# <img src="assets/skillboss-logo.svg" alt="SkillBoss" width="56" /> SkillBoss Skills

**Production-ready skills for AI coding agents**

[![Website](https://img.shields.io/badge/Website-skillboss.co-blue?style=for-the-badge)](https://skillboss.co)
[![Discord](https://img.shields.io/badge/Discord-Join%20Us-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/U9eM6Vn6g7)
[![Docs](https://img.shields.io/badge/Docs-Help%20Center-green?style=for-the-badge)](https://skillboss.co/help)

</div>

---

SkillBoss is an AI skills platform by HeyBoss (backed by an OpenAI fund) that equips Claude Code, Codex, and other agent platforms with production-ready capabilities for content generation, application building, product deployment, and real-world workflow automation. By providing a unified, modular skills layer, SkillBoss helps AI agents move beyond text and reliably execute real-world tasks at scale.

## What's New

**Claude 4.6 Opus** -- SkillBoss now supports Claude 4.6 Opus, the first Opus model with 1M token context, Agent Teams, and Adaptive Thinking. Top scores on Terminal-Bench 2.0 (65.4%) and GDPval-AA (1606 Elo).

**Music Generation** -- Generate music with AI using ElevenLabs Music, Google Lyria 2, Meta MusicGen, and Stable Audio 2.5. Text-to-music with customizable duration.

**One-Click Deploy** -- Deploy full-stack apps (React + Hono) to Cloudflare Workers with a single command. Auto-provisions D1 databases, KV, and R2 storage.

<!-- Keep the 3 most recent items above. When adding a new one, move the oldest into the <details> block below. -->
<details>
<summary>Previous updates</summary>

*(No older updates yet)*

</details>

## Features

- **100+ AI Services** --LLMs (Claude, GPT, Gemini, DeepSeek), image/video generation, TTS, and more
- **MCP Server** --Native Model Context Protocol support for Claude Code, Cursor, Windsurf
- **Skills Package** --Production-ready skills for AI coding agents
- Deploy websites to Cloudflare Workers
- Auto-provision D1/KV/R2 databases
- Stripe payments integration
- Google OAuth / Email OTP authentication
- AI Image/Audio/Video generation
- Email sending
- Web scraping and search

<div align="center">

https://github.com/user-attachments/assets/7bb8c3ff-593d-45f5-821d-9cd3fc05d33e

</div>

## Get Started

### Option 1: CLI (recommended)

```bash
# Install
npm install -g @skillboss/cli

# Login
skb login -k sk-your-api-key

# Browse APIs
skb api types
skb api list --type chat
skb api show openai/gpt-5

# Call any model
skb api call openai/gpt-5 -b '{"messages":[{"role":"user","content":"Hello"}]}'
skb api call replicate/black-forest-labs/flux-1.1-pro -b '{"prompt":"A sunset"}' -o sunset.png

# Smart task navigator
skb task image -b '{"prompt":"A sunset"}' -o sunset.png
skb task search "web scraping"
```

Or with npx (no install): `npx -y @skillboss/cli api types -k sk-your-key`

Get your API key at [skillboss.co/console](https://skillboss.co/console).

### Option 2: Skill Pack (for AI agents)

Send this to your AI agent (Claude Code, Codex, OpenClaw, etc.):

```
set up skillboss.co/skill.md
```

### Option 3: MCP Server

For MCP-compatible clients (Claude Code, Cursor, Windsurf, Cline):

```bash
# Claude Code
claude mcp add skillboss -- npx -y @skillboss/mcp-server

# Or add to MCP config manually
```

```json
{
  "mcpServers": {
    "skillboss": {
      "command": "npx",
      "args": ["-y", "@skillboss/mcp-server"],
      "env": { "SKILLBOSS_API_KEY": "sk-your-key" }
    }
  }
}
```

### Alternative Installation Methods

<details>
<summary>Manual Install</summary>

Copy or clone the `skillboss/` folder to your AI tool's skills directory:

**Global Installation (auto-detected)**

| Platform | Path |
|----------|------|
| Claude Code | `~/.claude/skills/` |
| Codex CLI | `~/.codex/skills/` |
| OpenClaw | `*/openclaw/skills/` |
| Continue.dev | `~/.continue/` |

**Project-Level Installation (manual)**

| Platform | Path |
|----------|------|
| Cursor | `.cursor/rules/` |
| Windsurf | `.windsurf/rules/` |
| Cline | `.clinerules/` |

</details>

## Quick Usage

Ask your AI agent to:

- "Deploy a landing page to Cloudflare Workers"
- "Create an e-commerce site with Stripe checkout"
- "Generate an AI image for my blog post"
- "Send an email notification"
- "Scrape product data from a website"

## Documentation

See `skillboss/SKILL.md` for complete documentation.

## License

Apache 2.0
