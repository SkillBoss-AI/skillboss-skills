#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * SkillBoss Product Manager
 *
 * Manage products in the HeyBoss shopping service.
 *
 * Usage:
 *   node product-manager.js <command> [options]
 *
 * Commands:
 *   list                     List all products for a project
 *   create                   Create a new product
 *   update <productId>       Update an existing product
 *   delete <productId>       Delete a product
 *
 * Options:
 *   --project-id <id>        Project ID (required)
 *   --name <name>            Product name (for create/update)
 *   --description <desc>     Product description (for create/update)
 *   --price <cents>          Price in cents (for create/update)
 *   --currency <code>        Currency code, default: usd (for create/update)
 *   --billing-type <type>    one_time or recurring (for create/update)
 *   --billing-period <p>     day/week/month/year for recurring (for create/update)
 *   --status <status>        active or inactive (for create/update)
 *   --help                   Show this help message
 */

// Load config
const CONFIG_PATH = path.join(__dirname, "..", "config.json");
const SKILLBOSS_FILE = ".skillboss";

function loadConfig() {
  try {
    const configData = fs.readFileSync(CONFIG_PATH, "utf8");
    return JSON.parse(configData);
  } catch (err) {
    console.error("Error loading config.json:", err.message);
    process.exit(1);
  }
}

/**
 * Load .skillboss config from a folder (for auto-detecting projectId)
 */
function loadSkillbossConfig(folderPath) {
  const configPath = path.join(folderPath, SKILLBOSS_FILE);
  try {
    const data = fs.readFileSync(configPath, "utf8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

const config = loadConfig();
// Use skillboss.co proxy for authentication (converts API key to JWT)
// Parse base URL and any query params (e.g., Vercel bypass token)
const proxyUrlRaw = config.stripeConnectUrl || "https://www.skillboss.co";
const proxyUrlParsed = new URL(proxyUrlRaw);
const PROXY_BASE = proxyUrlParsed.origin;
const VERCEL_TOKEN = proxyUrlParsed.searchParams.get("x-vercel-token");
const API_BASE = `${PROXY_BASE}/api/shopping-service`;

// Parse CLI arguments
function parseArgs(args) {
  const parsed = {
    command: null,
    productId: null,
    projectId: null,
    name: null,
    description: null,
    price: null,
    currency: null,
    billingType: null,
    billingPeriod: null,
    status: null,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
    } else if (arg === "--project-id" && args[i + 1]) {
      parsed.projectId = args[++i];
    } else if (arg === "--name" && args[i + 1]) {
      parsed.name = args[++i];
    } else if (arg === "--description" && args[i + 1]) {
      parsed.description = args[++i];
    } else if (arg === "--price" && args[i + 1]) {
      const priceValue = parseInt(args[++i], 10);
      if (!Number.isFinite(priceValue) || priceValue < 0) {
        console.error("Error: --price must be a non-negative integer (cents)");
        process.exit(1);
      }
      parsed.price = priceValue;
    } else if (arg === "--currency" && args[i + 1]) {
      parsed.currency = args[++i];
    } else if (arg === "--billing-type" && args[i + 1]) {
      parsed.billingType = args[++i];
    } else if (arg === "--billing-period" && args[i + 1]) {
      parsed.billingPeriod = args[++i];
    } else if (arg === "--status" && args[i + 1]) {
      parsed.status = args[++i];
    } else if (!arg.startsWith("-")) {
      if (!parsed.command) {
        parsed.command = arg;
      } else if (
        !parsed.productId &&
        ["update", "delete", "get"].includes(parsed.command)
      ) {
        parsed.productId = arg;
      }
    }
  }

  return parsed;
}

function showHelp() {
  console.log(`
SkillBoss Product Manager

Manage products in the HeyBoss shopping service.

Usage:
  node product-manager.js <command> [options]

Commands:
  list                     List all products for a project
  get <productId>          Get a single product
  create                   Create a new product
  update <productId>       Update an existing product
  delete <productId>       Delete a product

Options:
  --project-id <id>        Project ID (auto-detected from .skillboss if not provided)

Product Fields (for create/update):
  --name <name>            Product name
  --description <desc>     Product description
  --price <cents>          Price in smallest currency unit (cents)
  --currency <code>        Currency code (default: usd)
  --billing-type <type>    one_time or recurring (default: one_time)
  --billing-period <p>     day/week/month/year (for recurring)
  --status <status>        active or inactive (default: active)

Examples:
  # List all products
  node product-manager.js list --project-id my-project

  # Create a product
  node product-manager.js create --project-id my-project \\
    --name "Monthly Membership" \\
    --description "1 month gym access" \\
    --price 2999 \\
    --currency usd

  # Create a subscription product
  node product-manager.js create --project-id my-project \\
    --name "Premium Plan" \\
    --price 999 \\
    --billing-type recurring \\
    --billing-period month

  # Update a product
  node product-manager.js update abc-123 --project-id my-project --price 3999

  # Delete a product
  node product-manager.js delete abc-123 --project-id my-project

API Endpoint: ${API_BASE}
`);
}

// API request helper
async function apiRequest(method, endpoint, data = null, projectId) {
  // Build URL with optional Vercel bypass token for staging
  const urlObj = new URL(`${API_BASE}${endpoint}`);
  if (VERCEL_TOKEN) {
    urlObj.searchParams.set("x-vercel-protection-bypass", VERCEL_TOKEN);
  }
  const url = urlObj.toString();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.apiKey}`,
    "x-project-id": projectId,
  };

  const options = {
    method,
    headers,
  };

  if (data && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.message || `Request failed with status ${response.status}`,
    );
  }

  return responseData;
}

// Commands
async function listProducts(projectId) {
  console.log(`\nFetching products for project: ${projectId}`);
  console.log(`Endpoint: ${API_BASE}/admin-products\n`);

  const data = await apiRequest(
    "GET",
    `/admin-products?projectId=${encodeURIComponent(projectId)}`,
    null,
    projectId,
  );

  const products = data.data || data;

  if (!products || products.length === 0) {
    console.log("No products found.");
    return;
  }

  console.log(`Found ${products.length} product(s):\n`);
  console.log("-".repeat(80));

  for (const product of products) {
    console.log(`ID:          ${product.id}`);
    console.log(`Name:        ${product.name}`);
    console.log(
      `Price:       ${product.price} ${(product.currency || "usd").toUpperCase()} (${formatPrice(product.price, product.currency)})`,
    );
    console.log(
      `Billing:     ${product.billingType || "one_time"}${product.billingPeriod ? ` / ${product.billingPeriod}` : ""}`,
    );
    console.log(`Status:      ${product.status}`);
    if (product.description) {
      console.log(
        `Description: ${product.description.substring(0, 60)}${product.description.length > 60 ? "..." : ""}`,
      );
    }
    console.log("-".repeat(80));
  }
}

async function getProduct(projectId, productId) {
  console.log(`\nFetching product: ${productId}`);

  const product = await apiRequest(
    "GET",
    `/admin-products/${productId}`,
    null,
    projectId,
  );

  console.log("\nProduct Details:");
  console.log(JSON.stringify(product, null, 2));
}

async function createProduct(projectId, productData) {
  console.log(`\nCreating product for project: ${projectId}`);
  console.log("Product data:", JSON.stringify(productData, null, 2));

  const product = await apiRequest(
    "POST",
    "/admin-products",
    productData,
    projectId,
  );

  console.log("\nProduct created successfully!");
  console.log(`ID: ${product.id}`);
  console.log(`Name: ${product.name}`);
  console.log(`Price: ${formatPrice(product.price, product.currency)}`);
}

async function updateProduct(projectId, productId, productData) {
  console.log(`\nUpdating product: ${productId}`);
  console.log("Update data:", JSON.stringify(productData, null, 2));

  const product = await apiRequest(
    "PUT",
    `/admin-products/${productId}`,
    productData,
    projectId,
  );

  console.log("\nProduct updated successfully!");
  console.log(JSON.stringify(product, null, 2));
}

async function deleteProduct(projectId, productId) {
  console.log(`\nDeleting product: ${productId}`);

  await apiRequest("DELETE", `/admin-products/${productId}`, null, projectId);

  console.log("\nProduct deleted successfully!");
}

function formatPrice(cents, currency = "usd") {
  const amount = cents / 100;
  const symbols = { usd: "$", eur: "€", gbp: "£", cny: "¥", jpy: "¥" };
  const symbol =
    symbols[currency.toLowerCase()] || currency.toUpperCase() + " ";
  return `${symbol}${amount.toFixed(2)}`;
}

// Main
async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || !args.command) {
    showHelp();
    process.exit(args.help ? 0 : 1);
  }

  // Resolve projectId: CLI arg > .skillboss file > error
  let projectId = args.projectId;
  if (!projectId) {
    const skillbossConfig = loadSkillbossConfig(process.cwd());
    if (skillbossConfig?.projectId) {
      projectId = skillbossConfig.projectId;
      console.log(`Using project ID from .skillboss: ${projectId}`);
    }
  }

  if (!projectId) {
    console.error("Error: --project-id is required");
    console.error(
      "Tip: Run from a directory with .skillboss file, or specify --project-id explicitly",
    );
    process.exit(1);
  }

  try {
    switch (args.command) {
      case "list":
        await listProducts(projectId);
        break;

      case "get":
        if (!args.productId) {
          console.error("Error: Product ID is required for get command");
          process.exit(1);
        }
        await getProduct(projectId, args.productId);
        break;

      case "create":
        if (!args.name) {
          console.error("Error: --name is required for create command");
          process.exit(1);
        }
        if (!args.price && args.price !== 0) {
          console.error("Error: --price is required for create command");
          process.exit(1);
        }
        await createProduct(projectId, {
          name: args.name,
          description: args.description,
          price: args.price,
          currency: args.currency || "usd",
          billingType: args.billingType || "one_time",
          billingPeriod: args.billingPeriod,
          status: args.status || "active",
        });
        break;

      case "update":
        if (!args.productId) {
          console.error("Error: Product ID is required for update command");
          process.exit(1);
        }
        const updateData = {};
        if (args.name) updateData.name = args.name;
        if (args.description) updateData.description = args.description;
        if (args.price !== null) updateData.price = args.price;
        if (args.currency) updateData.currency = args.currency;
        if (args.billingType) updateData.billingType = args.billingType;
        if (args.billingPeriod) updateData.billingPeriod = args.billingPeriod;
        if (args.status) updateData.status = args.status;

        if (Object.keys(updateData).length === 0) {
          console.error("Error: No update fields provided");
          process.exit(1);
        }
        await updateProduct(projectId, args.productId, updateData);
        break;

      case "delete":
        if (!args.productId) {
          console.error("Error: Product ID is required for delete command");
          process.exit(1);
        }
        await deleteProduct(projectId, args.productId);
        break;

      default:
        console.error(`Unknown command: ${args.command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error("\nError:", error.message);
    process.exit(1);
  }
}

main();
