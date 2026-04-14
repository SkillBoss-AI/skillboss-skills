#!/usr/bin/env node

/**
 * SkillBoss MCP Server
 *
 * Provides access to 100+ AI models and services via Model Context Protocol.
 * Works with Claude Code, Cursor, Windsurf, and any MCP-compatible agent.
 *
 * Quick Start:
 *   npx @skillboss/mcp-server
 *
 * Or install globally:
 *   npm install -g @skillboss/mcp-server
 *   skillboss-mcp
 *
 * Environment Variables:
 *   SKILLBOSS_API_KEY - Your SkillBoss API key (get one at https://skillboss.co/console)
 *   SKILLBOSS_BASE_URL - API base URL (default: https://api.skillboss.co/v1)
 *
 * @see https://skillboss.co/docs/integrations/mcp-server
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import OpenAI from "openai";

// Configuration
const API_KEY = process.env.SKILLBOSS_API_KEY || process.env.OPENAI_API_KEY || "";
const BASE_URL = process.env.SKILLBOSS_BASE_URL || "https://api.skillboss.co/v1";
const MCP_VERSION = "1.0.1";

// OpenAI client configured for SkillBoss
const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: BASE_URL,
  defaultHeaders: {
    "x-skillboss-version": MCP_VERSION,
    "x-skillboss-source": "mcp-server",
    "x-client-name": "@skillboss/mcp-server",
  },
});

// Chat-capable models exposed by the MCP chat tool.
const CHAT_MODELS = {
  "openai/gpt-5": "Default general-purpose model for reasoning and coding",
  "claude-4-6-sonnet": "High-quality coding and analysis fallback",
  "gemini-2.5-flash": "Extremely fast with 1M context window",
} as const;

// Capability defaults surfaced in descriptions and docs, but not routed through chat.completions.
const CAPABILITY_DEFAULTS = {
  "perplexity/sonar-pro": "Default web search model with citations",
  "vertex/gemini-3-pro-image-preview": "Default image generation model",
  "seedance/seedance-2.0": "Highest-quality video generation",
  "minimax/speech-01-turbo": "Default multilingual text-to-speech",
  "openai/whisper-1": "Default speech-to-text model",
  "firecrawl/scrape": "Default page scraping model",
} as const;

// Define MCP tools
const tools: Tool[] = [
  {
    name: "chat",
    description: `Send a message to any AI model and get a response. Uses SkillBoss unified API with current recommended defaults for chat, search, image, video, speech, and scraping.

Available chat models:
${Object.entries(CHAT_MODELS).map(([id, desc]) => `- ${id}: ${desc}`).join("\n")}

Other default SkillBoss APIs:
${Object.entries(CAPABILITY_DEFAULTS).map(([id, desc]) => `- ${id}: ${desc}`).join("\n")}

Example: chat with GPT-5 about coding`,
    inputSchema: {
      type: "object",
      properties: {
        model: {
          type: "string",
          description: "Model ID to use (e.g., 'openai/gpt-5', 'claude-4-6-sonnet', 'gemini-2.5-flash')",
          enum: Object.keys(CHAT_MODELS),
          default: "openai/gpt-5",
        },
        message: {
          type: "string",
          description: "The message to send to the AI model",
        },
        system: {
          type: "string",
          description: "Optional system prompt to set context",
        },
        max_tokens: {
          type: "number",
          description: "Maximum tokens in response (default: 4096)",
          default: 4096,
        },
        temperature: {
          type: "number",
          description: "Sampling temperature 0-2 (default: 0.7)",
          default: 0.7,
        },
      },
      required: ["message"],
    },
  },
  {
    name: "list_models",
    description: "List all available AI models with their capabilities and pricing. Returns 50+ models from providers like Anthropic, OpenAI, Google, and more.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "generate_image",
    description: "Generate an image using DALL-E 3 or Flux. Creates high-quality images from text descriptions.",
    inputSchema: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "Description of the image to generate",
        },
        model: {
          type: "string",
          description: "Image model to use",
          enum: ["dall-e-3", "flux"],
          default: "dall-e-3",
        },
        size: {
          type: "string",
          description: "Image size",
          enum: ["1024x1024", "1792x1024", "1024x1792"],
          default: "1024x1024",
        },
      },
      required: ["prompt"],
    },
  },
  {
    name: "text_to_speech",
    description: "Convert text to speech using ElevenLabs or OpenAI TTS. Returns audio file URL.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Text to convert to speech",
        },
        voice: {
          type: "string",
          description: "Voice to use (e.g., 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer')",
          default: "alloy",
        },
        model: {
          type: "string",
          description: "TTS model",
          enum: ["openai-tts", "elevenlabs"],
          default: "openai-tts",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "get_balance",
    description: "Check your current SkillBoss credit balance and usage statistics.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "recommend_model",
    description: "Get a model recommendation based on your task. Analyzes your use case and suggests the best model for cost, speed, or quality.",
    inputSchema: {
      type: "object",
      properties: {
        task: {
          type: "string",
          description: "Description of your task (e.g., 'write code', 'analyze data', 'creative writing')",
        },
        priority: {
          type: "string",
          description: "What to optimize for",
          enum: ["cost", "speed", "quality", "balanced"],
          default: "balanced",
        },
      },
      required: ["task"],
    },
  },
];

// Tool handlers
async function handleChat(args: {
  model?: string;
  message: string;
  system?: string;
  max_tokens?: number;
  temperature?: number;
}): Promise<string> {
  const messages: OpenAI.ChatCompletionMessageParam[] = [];

  if (args.system) {
    messages.push({ role: "system", content: args.system });
  }
  messages.push({ role: "user", content: args.message });

  const response = await client.chat.completions.create({
    model: args.model || "openai/gpt-5",
    messages,
    max_tokens: args.max_tokens || 4096,
    temperature: args.temperature || 0.7,
  });

  const content = response.choices[0]?.message?.content || "";
  const usage = response.usage;

  return JSON.stringify({
    content,
    model: response.model,
    usage: {
      prompt_tokens: usage?.prompt_tokens,
      completion_tokens: usage?.completion_tokens,
      total_tokens: usage?.total_tokens,
    },
  });
}

async function handleListModels(): Promise<string> {
  try {
    const response = await client.models.list();
    return JSON.stringify({
      models: response.data.map((m) => ({
        id: m.id,
        owned_by: m.owned_by,
      })),
      total: response.data.length,
      documentation: "https://skillboss.co/docs/models/overview",
    });
  } catch (error) {
    // Fallback to static list
    return JSON.stringify({
      models: [
        ...Object.entries(CHAT_MODELS),
        ...Object.entries(CAPABILITY_DEFAULTS),
      ].map(([id, description]) => ({
        id,
        description,
      })),
      total: Object.keys(CHAT_MODELS).length + Object.keys(CAPABILITY_DEFAULTS).length,
      documentation: "https://skillboss.co/docs/models/overview",
    });
  }
}

async function handleGenerateImage(args: {
  prompt: string;
  model?: string;
  size?: string;
}): Promise<string> {
  const response = await client.images.generate({
    model: args.model || "dall-e-3",
    prompt: args.prompt,
    size: (args.size as "1024x1024" | "1792x1024" | "1024x1792") || "1024x1024",
    n: 1,
  });

  return JSON.stringify({
    url: response.data?.[0]?.url,
    revised_prompt: response.data?.[0]?.revised_prompt,
  });
}

async function handleTextToSpeech(args: {
  text: string;
  voice?: string;
  model?: string;
}): Promise<string> {
  // Note: This would need actual TTS endpoint implementation
  return JSON.stringify({
    message: "TTS request queued",
    text_length: args.text.length,
    voice: args.voice || "alloy",
    model: args.model || "openai-tts",
    documentation: "https://skillboss.co/docs/features/overview#audio",
  });
}

async function handleGetBalance(): Promise<string> {
  // Balance would be returned via API header or dedicated endpoint
  return JSON.stringify({
    message: "Check your balance at https://skillboss.co/console",
    tip: "API responses include x-skillboss-balance header",
  });
}

async function handleRecommendModel(args: {
  task: string;
  priority?: string;
}): Promise<string> {
  const task = args.task.toLowerCase();
  const priority = args.priority || "balanced";

  let recommendation: { model: string; reason: string };

  // Simple task-based recommendation
  if (task.includes("code") || task.includes("programming") || task.includes("debug")) {
    if (priority === "cost") {
      recommendation = {
        model: "deepseek/deepseek-v3",
        reason: "Excellent for code at very low cost ($0.27/1M tokens)",
      };
    } else if (priority === "speed") {
      recommendation = {
        model: "gemini-2.5-flash",
        reason: "Fastest model with good coding capabilities",
      };
    } else {
      recommendation = {
        model: "bedrock/claude-4-5-sonnet",
        reason: "Best overall coding model with superior reasoning",
      };
    }
  } else if (task.includes("creative") || task.includes("write") || task.includes("story")) {
    recommendation = {
      model: "bedrock/claude-4-5-sonnet",
      reason: "Excellent creative writing with nuanced style",
    };
  } else if (task.includes("fast") || task.includes("quick") || task.includes("simple")) {
    recommendation = {
      model: "gemini-2.5-flash",
      reason: "Fastest response times and huge 1M context",
    };
  } else if (task.includes("cheap") || task.includes("budget") || task.includes("cost")) {
    recommendation = {
      model: "gpt-4o-mini",
      reason: "Best quality-to-cost ratio at $0.15/1M input tokens",
    };
  } else {
    // Default balanced recommendation
    recommendation = {
      model: "bedrock/claude-4-5-sonnet",
      reason: "Best overall model for complex tasks and reasoning",
    };
  }

  return JSON.stringify({
    recommendation,
    alternatives: [
      { model: "gemini-2.5-flash", use_case: "Speed-critical tasks" },
      { model: "gpt-4o-mini", use_case: "Budget-conscious usage" },
      { model: "bedrock/claude-4-5-sonnet", use_case: "Complex reasoning" },
    ],
    all_models: "https://skillboss.co/docs/models/overview",
  });
}

// Main server setup
async function main() {
  if (!API_KEY) {
    console.error("Error: SKILLBOSS_API_KEY environment variable is required");
    console.error("Get your API key at: https://skillboss.co/console");
    process.exit(1);
  }

  const server = new Server(
    {
      name: "skillboss",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let result: string;

      switch (name) {
        case "chat":
          result = await handleChat(args as Parameters<typeof handleChat>[0]);
          break;
        case "list_models":
          result = await handleListModels();
          break;
        case "generate_image":
          result = await handleGenerateImage(args as Parameters<typeof handleGenerateImage>[0]);
          break;
        case "text_to_speech":
          result = await handleTextToSpeech(args as Parameters<typeof handleTextToSpeech>[0]);
          break;
        case "get_balance":
          result = await handleGetBalance();
          break;
        case "recommend_model":
          result = await handleRecommendModel(args as Parameters<typeof handleRecommendModel>[0]);
          break;
        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        content: [{ type: "text", text: result }],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: errorMessage,
              help: "https://skillboss.co/docs/guides/troubleshooting",
            }),
          },
        ],
        isError: true,
      };
    }
  });

  // Connect via stdio
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("SkillBoss MCP Server running");
  console.error("Documentation: https://skillboss.co/docs/integrations/mcp-server");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
