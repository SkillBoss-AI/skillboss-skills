#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { fetchWithRetry } = require("./lib/fetch-retry");

/**
 * SkillBoss Stripe Connect - Connect your Stripe account for payments
 *
 * Usage:
 *   node stripe-connect.js [options]
 *
 * Options:
 *   --status          Check current Stripe account status
 *   --no-browser      Don't auto-open browser (just print URL)
 *   --help            Show this help message
 *
 * This script helps you connect a Stripe Express account for accepting payments.
 * The actual onboarding happens in your browser (Stripe requirement for KYC).
 */

// Load config from config.json (sibling to scripts folder)
const CONFIG_PATH = path.join(__dirname, "..", "config.json");

function loadConfig() {
  try {
    const configData = fs.readFileSync(CONFIG_PATH, "utf8");
    return JSON.parse(configData);
  } catch (err) {
    return {};
  }
}

const config = loadConfig();
// heyboss-frontend URL for Stripe Connect API
// Parse base URL and any query params (e.g., Vercel bypass token for staging)
const connectUrlRaw = config.stripeConnectUrl || "https://skillboss.co";
const connectUrlParsed = new URL(connectUrlRaw);
const CONNECT_BASE_URL = connectUrlParsed.origin;
const VERCEL_TOKEN = connectUrlParsed.searchParams.get("x-vercel-token");

/**
 * Build URL with optional Vercel bypass token for staging
 */
function buildUrl(baseUrl, path) {
  const url = new URL(path, baseUrl);
  if (VERCEL_TOKEN) {
    url.searchParams.set("x-vercel-protection-bypass", VERCEL_TOKEN);
  }
  return url.toString();
}

/**
 * Check current Stripe account status
 */
async function checkAccountStatus(apiKey, baseUrl) {
  const res = await fetchWithRetry(buildUrl(baseUrl, "/api/stripe/connect/account"), {
    headers: {
      "X-API-Key": apiKey,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || `HTTP ${res.status}: Failed to check account status`,
    );
  }
  // {success: boolean, data: IStripeAccountInfo }
  const result = await res.json();
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.message || `Failed to check account status`);
  }
}

/**
 * Create or continue Stripe onboarding
 */
async function createOnboardingLink(apiKey, baseUrl) {
  const res = await fetchWithRetry(buildUrl(baseUrl, "/api/stripe/connect"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      returnUrl: "/settings/connect/return",
      refreshUrl: "/settings/connect/refresh",
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || `HTTP ${res.status}: Failed to create onboarding link`,
    );
  }

  return res.json();
}

/**
 * Open URL in browser (cross-platform)
 */
function openBrowser(url) {
  const platform = process.platform;
  try {
    if (platform === "darwin") {
      execSync(`open "${url}"`, { stdio: "ignore" });
    } else if (platform === "win32") {
      execSync(`start "" "${url}"`, { stdio: "ignore" });
    } else {
      // Linux and others
      execSync(`xdg-open "${url}"`, { stdio: "ignore" });
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Poll until onboarding is complete
 */
async function waitForOnboarding(apiKey, baseUrl, timeoutMs = 10 * 60 * 1000) {
  const startTime = Date.now();
  const pollInterval = 5000; // 5 seconds

  console.log("\nWaiting for Stripe onboarding to complete...");
  console.log("(Complete the setup in your browser, then return here)\n");

  while (Date.now() - startTime < timeoutMs) {
    await new Promise((r) => setTimeout(r, pollInterval));

    try {
      const status = await checkAccountStatus(apiKey, baseUrl);

      if (status.charges_enabled && status.payouts_enabled) {
        return status;
      }

      // Show progress
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      process.stdout.write(
        `\r  Checking... (${elapsed}s) - charges_enabled: ${status.charges_enabled || false}`,
      );
    } catch (err) {
      // Continue polling even if individual checks fail
      process.stdout.write(`\r  Checking... (retrying after error)`);
    }
  }

  throw new Error("Timeout waiting for Stripe onboarding to complete");
}

/**
 * Display account status
 * @param {TStripeAccountInfo} status
 */
function displayStatus(status) {
  console.log("\nStripe Account Status:");
  console.log("-".repeat(40));

  if (status.id) {
    console.log(`  Account ID:      ${status.id}`);
  } else {
    console.log("  Account ID:      (not connected)");
  }

  console.log(`  Type:            ${status.type || "none"}`);
  console.log(`  Charges Enabled: ${status.charges_enabled ? "Yes" : "No"}`);
  console.log(`  Payouts Enabled: ${status.payouts_enabled ? "Yes" : "No"}`);
  console.log(`  Details Done:    ${status.details_submitted ? "Yes" : "No"}`);

  if (status.requirements?.currently_due?.length > 0) {
    console.log(
      `  Requirements:    ${status.requirements.currently_due.length} item(s) pending`,
    );
  }

  console.log("-".repeat(40));
}

// CLI argument parsing
function parseArgs(args) {
  const parsed = {
    status: false,
    noBrowser: false,
    help: false,
  };

  for (const arg of args) {
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
    } else if (arg === "--status") {
      parsed.status = true;
    } else if (arg === "--no-browser") {
      parsed.noBrowser = true;
    }
  }

  return parsed;
}

function showHelp() {
  console.log(`
SkillBoss Stripe Connect - Connect your Stripe account for payments

Usage:
  node stripe-connect.js [options]

Options:
  --status          Check current Stripe account status only
  --no-browser      Don't auto-open browser (just print URL)
  --help, -h        Show this help message

Description:
  This script helps you connect a Stripe Express account for accepting
  payments in your e-commerce projects. The onboarding process happens
  in your browser (required by Stripe for identity verification).

  Once connected, your Stripe account ID is stored with your SkillBoss
  profile and automatically used when deploying e-commerce Workers.

Examples:
  node stripe-connect.js              # Start/continue onboarding
  node stripe-connect.js --status     # Check connection status
`);
}

// Main CLI handler
async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  // Validate config
  if (!config.apiKey) {
    console.error("Error: API key not found in config.json");
    console.error("Please ensure your config.json contains a valid apiKey.");
    process.exit(1);
  }

  const baseUrl = CONNECT_BASE_URL;

  try {
    // Check current status
    console.log("Checking Stripe account status...");
    let status;

    try {
      status = await checkAccountStatus(config.apiKey, baseUrl);
    } catch (err) {
      // If status check fails with 401, API key auth not yet supported
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        console.error(
          "\nError: API key authentication not yet enabled on the server.",
        );
        console.error(
          "The backend needs to be updated to support X-API-Key authentication.",
        );
        console.error(
          "\nPlease use the web interface at https://heyboss.ai to connect Stripe.",
        );
        process.exit(1);
      }
      throw err;
    }

    // Status-only mode
    if (args.status) {
      displayStatus(status);
      process.exit(0);
    }

    // Check if already connected
    if (status.charges_enabled && status.payouts_enabled) {
      console.log("\nStripe account already connected!");
      displayStatus(status);
      console.log("\nYour account is ready to accept payments.");
      process.exit(0);
    }

    // Need to connect or continue onboarding
    if (status.id && status.type !== "none") {
      console.log("\nStripe account exists but onboarding incomplete.");
      console.log("Continuing onboarding process...");
    } else {
      console.log("\nNo Stripe account connected.");
      console.log("Starting Stripe Express account setup...");
    }

    // Get onboarding URL
    const { url } = await createOnboardingLink(config.apiKey, baseUrl);

    if (!url) {
      throw new Error("Failed to get onboarding URL from server");
    }

    console.log("\nOnboarding URL:");
    console.log(`  ${url}\n`);

    // Open browser (unless --no-browser)
    if (!args.noBrowser) {
      const opened = openBrowser(url);
      if (opened) {
        console.log("Browser opened. Please complete the Stripe setup.");
      } else {
        console.log(
          "Could not open browser. Please open the URL above manually.",
        );
      }
    } else {
      console.log("Please open the URL above in your browser to continue.");
    }

    // Wait for completion
    const finalStatus = await waitForOnboarding(config.apiKey, baseUrl);

    console.log("\n\nStripe account connected successfully!");
    displayStatus(finalStatus);
    console.log(
      "\nYou can now deploy e-commerce Workers with payment support.",
    );
  } catch (error) {
    console.error("\nError:", error.message);
    process.exit(1);
  }
}

// Run CLI if executed directly
if (require.main === module) {
  main();
}

// Export for module usage
module.exports = { checkAccountStatus, createOnboardingLink };
