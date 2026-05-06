import fs from "fs";
import path from "path";
import Stripe from "stripe";

function loadDotEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadDotEnvFile(path.resolve(".env.local"));

const results = [];

function pushResult(status, label, detail) {
  results.push({ status, label, detail });
}

function isPresent(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isLiveSecretKey(value) {
  return typeof value === "string" && value.startsWith("sk_live_");
}

function isHttpsUrl(value) {
  return typeof value === "string" && /^https:\/\//i.test(value);
}

async function run() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const priceId = process.env.STRIPE_PRICE_ID_PRO_MONTHLY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const allowlist = process.env.STRIPE_TEST_CHECKOUT_ALLOWLIST || "";
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME;

  pushResult(isPresent(secretKey) ? "pass" : "fail", "Stripe secret key present", "Expected `STRIPE_SECRET_KEY`.");
  pushResult(isLiveSecretKey(secretKey) ? "pass" : "fail", "Stripe secret key is live mode", "Live launch requires `sk_live_...`.");
  pushResult(isPresent(priceId) ? "pass" : "fail", "Stripe price id present", "Expected `STRIPE_PRICE_ID_PRO_MONTHLY`.");
  pushResult(isPresent(webhookSecret) ? "pass" : "fail", "Stripe webhook secret present", "Expected `STRIPE_WEBHOOK_SECRET`.");
  pushResult(isHttpsUrl(siteUrl) ? "pass" : "fail", "Production site URL is HTTPS", "Expected `NEXT_PUBLIC_SITE_URL` to be an https URL.");
  pushResult(siteUrl === "https://rolearc.xyz" || siteUrl === "https://www.rolearc.xyz" ? "pass" : "warn", "Production site URL matches domain", "Expected live URL to be `https://rolearc.xyz` or `https://www.rolearc.xyz`.");
  pushResult(!allowlist.trim() ? "pass" : "warn", "Test checkout allowlist cleared", "Clear `STRIPE_TEST_CHECKOUT_ALLOWLIST` after moving to live mode.");
  pushResult(appName === "RoleArc" ? "pass" : "warn", "Public app name set to RoleArc", "Update `NEXT_PUBLIC_APP_NAME` if needed.");
  pushResult(companyName === "RoleArc" ? "pass" : "warn", "Public company name set to RoleArc", "Update `NEXT_PUBLIC_COMPANY_NAME` if needed.");
  pushResult(
    typeof supportEmail === "string" && /@rolearc\.xyz$/i.test(supportEmail) ? "pass" : "warn",
    "Support email uses domain mailbox",
    "Expected `NEXT_PUBLIC_SUPPORT_EMAIL` to use a `@rolearc.xyz` address."
  );

  if (isPresent(secretKey)) {
    try {
      const stripe = new Stripe(secretKey);
      const account = await stripe.accounts.retrieve();
      pushResult("pass", "Stripe API key accepted", `Connected account id: ${account.id}`);

      if (isPresent(priceId)) {
        const price = await stripe.prices.retrieve(priceId);
        pushResult(price.active ? "pass" : "fail", "Price is active", `Price ${price.id} active=${price.active}`);
        pushResult(
          price.type === "recurring" ? "pass" : "fail",
          "Price is recurring",
          `Expected recurring subscription price, got type=${price.type}`
        );
      }

      const webhookEndpoints = await stripe.webhookEndpoints.list({ limit: 20 });
      const liveWebhookUrl = "https://rolearc.xyz/api/stripe/webhook";
      const matchingWebhook = webhookEndpoints.data.find((item) => item.url === liveWebhookUrl);

      pushResult(
        matchingWebhook ? "pass" : "fail",
        "Stripe webhook endpoint uses rolearc.xyz",
        matchingWebhook
          ? `Found webhook endpoint ${matchingWebhook.id}`
          : `Expected a Stripe webhook endpoint pointing to ${liveWebhookUrl}`
      );

      if (matchingWebhook) {
        const requiredEvents = [
          "checkout.session.completed",
          "customer.subscription.updated",
          "customer.subscription.deleted",
        ];
        const missingEvents = requiredEvents.filter(
          (eventName) => !matchingWebhook.enabled_events.includes(eventName)
        );

        pushResult(
          missingEvents.length === 0 ? "pass" : "fail",
          "Stripe webhook subscribes to required events",
          missingEvents.length === 0
            ? "Required subscription events are enabled."
            : `Missing events: ${missingEvents.join(", ")}`
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Stripe API error";
      pushResult("fail", "Stripe API verification", message);
    }
  }

  const grouped = {
    pass: results.filter((item) => item.status === "pass"),
    warn: results.filter((item) => item.status === "warn"),
    fail: results.filter((item) => item.status === "fail"),
  };

  for (const item of results) {
    const prefix = item.status === "pass" ? "PASS" : item.status === "warn" ? "WARN" : "FAIL";
    console.log(`${prefix}  ${item.label}: ${item.detail}`);
  }

  console.log("");
  console.log(
    `Summary: ${grouped.pass.length} passed, ${grouped.warn.length} warnings, ${grouped.fail.length} failures.`
  );

  if (grouped.fail.length > 0) {
    process.exit(1);
  }
}

run().catch((error) => {
  console.error("FAIL  Stripe live readiness script crashed:", error);
  process.exit(1);
});
