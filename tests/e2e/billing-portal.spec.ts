import fs from "fs";
import path from "path";
import Stripe from "stripe";
import { expect, test } from "@playwright/test";

const proEmail = process.env.E2E_TEST_EMAIL;
const proPassword = process.env.E2E_TEST_PASSWORD;
const runBillingCancellation = process.env.E2E_BILLING_CANCEL === "1";
const baseURL = process.env.E2E_BASE_URL || "https://rolearc.xyz";

function resolveWorkspaceFile(fileName: string) {
  return path.resolve(__dirname, "..", "..", fileName);
}

function findUpwards(startDir: string, fileName: string) {
  let current = startDir;

  while (true) {
    const candidate = path.join(current, fileName);
    if (fs.existsSync(candidate)) {
      return candidate;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }

    current = parent;
  }
}

function readLocalEnv(name: string) {
  const direct = process.env[name];
  if (direct) return direct;

  const envPath =
    findUpwards(process.cwd(), ".env.local") ??
    findUpwards(__dirname, ".env.local") ??
    resolveWorkspaceFile(".env.local");

  if (!envPath || !fs.existsSync(envPath)) return undefined;

  const line = fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .find((entry) => entry.startsWith(`${name}=`));

  return line ? line.slice(name.length + 1).trim() : undefined;
}

async function login(page: import("@playwright/test").Page, email: string, password: string) {
  await page.goto("/auth/login");
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByRole("button", { name: /^Log in$/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

async function getProfile(email: string) {
  const supabaseUrl = readLocalEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = readLocalEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service role credentials for billing tests.");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=id,email,plan,stripe_customer_id,subscription_status,cancel_at_period_end,current_period_end`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Supabase profile lookup failed with ${response.status}`);
  }

  const rows = await response.json();
  return rows[0] ?? null;
}

async function waitForProfile(email: string, predicate: (profile: any) => boolean, timeoutMs = 60_000) {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const profile = await getProfile(email);
    if (profile && predicate(profile)) {
      return profile;
    }
    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }

  throw new Error(`Timed out waiting for profile state for ${email}`);
}

async function sendWebhookEvent(event: Record<string, unknown>) {
  const webhookSecret = readLocalEnv("STRIPE_WEBHOOK_SECRET");

  if (!webhookSecret) {
    throw new Error("Missing Stripe webhook secret for billing tests.");
  }

  const body = JSON.stringify(event);
  const signature = Stripe.webhooks.generateTestHeaderString({
    payload: body,
    secret: webhookSecret,
  });

  const response = await fetch(`${baseURL}/api/stripe/webhook`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "stripe-signature": signature,
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Webhook request failed with ${response.status}: ${await response.text()}`);
  }
}

test.describe("Billing portal", () => {
  test.skip(!proEmail || !proPassword, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run billing portal tests.");

  test("redirects Pro users to Stripe billing portal", async ({ page }) => {
    await login(page, proEmail!, proPassword!);
    await page.goto("/pricing");
    await expect(page.getByText("Current plan:").filter({ hasText: "Pro" })).toBeVisible();

    const navigation = page.waitForURL(/billing\.stripe\.com/, { timeout: 30_000 });
    await page.getByRole("button", { name: /Manage Subscription/i }).click();
    await navigation;

    await expect(page).toHaveURL(/billing\.stripe\.com/);
  });
});

test.describe("Billing cancellation flow", () => {
  test.skip(!runBillingCancellation, "Set E2E_BILLING_CANCEL=1 to run cancellation flow tests.");
  test.skip(!proEmail || !proPassword, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run cancellation flow tests.");

  test("shows scheduled cancellation state after subscription update webhook", async ({ page }) => {
    test.setTimeout(90_000);
    const profile = await getProfile(proEmail!);

    expect(profile?.plan).toBe("pro");
    expect(profile?.stripe_customer_id).toBeTruthy();
    const futurePeriodEnd = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

    try {
      await sendWebhookEvent({
        id: `evt_test_subscription_updated_${Date.now()}`,
        object: "event",
        type: "customer.subscription.updated",
        data: {
          object: {
            id: "sub_test_rolearc_cancel",
            object: "subscription",
            customer: profile.stripe_customer_id,
            status: "active",
            cancel_at_period_end: true,
            items: {
              data: [
                {
                  current_period_end: futurePeriodEnd,
                },
              ],
            },
          },
        },
      });

      const cancelledProfile = await waitForProfile(
        proEmail!,
        (nextProfile) => nextProfile.cancel_at_period_end === true && !!nextProfile.current_period_end
      );

      await login(page, proEmail!, proPassword!);
      await page.goto("/pricing");
      await expect(page.getByText(/scheduled to cancel on/i)).toBeVisible();

      const title = `E2E Billing Cancel ${Date.now()}`;
      await page.goto("/dashboard");
      await page.getByRole("button", { name: /Create New Resume|Create your first resume/i }).first().click();
      await expect(page).toHaveURL(/\/builder\/[0-9a-f-]+/i);
      await page.getByPlaceholder("Untitled Resume").fill(title);
      await page.getByRole("button", { name: /Save Draft/i }).click();
      await expect(page.locator("span.text-slate-600").filter({ hasText: "Saved" })).toBeVisible();
      await expect(page.getByText(/scheduled to end on/i)).toBeVisible();

      expect(cancelledProfile.subscription_status).toMatch(/active|trialing|past_due|unpaid/);

      await page.goto("/dashboard");
      page.once("dialog", async (dialog) => {
        await dialog.accept();
      });
      const resumeCard = page.locator(".rounded-2xl", { hasText: title }).first();
      await resumeCard.getByRole("button", { name: /Delete/i }).click();
      await expect(page.getByText(title)).toHaveCount(0);
    } finally {
      await sendWebhookEvent({
        id: `evt_test_checkout_completed_${Date.now()}`,
        object: "event",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_rolearc_restore",
            object: "checkout.session",
            customer: profile.stripe_customer_id,
            metadata: {
              user_id: profile.id,
            },
          },
        },
      });

      await waitForProfile(
        proEmail!,
        (nextProfile) =>
          nextProfile.plan === "pro" &&
          nextProfile.subscription_status === "active" &&
          nextProfile.cancel_at_period_end === false &&
          nextProfile.current_period_end === null
      );
    }
  });

  test("downgrades to free after subscription deleted webhook and can be restored", async ({ page }) => {
    test.setTimeout(90_000);
    const profile = await getProfile(proEmail!);

    expect(profile?.plan).toBe("pro");
    expect(profile?.stripe_customer_id).toBeTruthy();
    const futurePeriodEnd = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

    try {
      await sendWebhookEvent({
        id: `evt_test_subscription_deleted_${Date.now()}`,
        object: "event",
        type: "customer.subscription.deleted",
        data: {
          object: {
            id: "sub_test_rolearc_cancel",
            object: "subscription",
            customer: profile.stripe_customer_id,
            status: "canceled",
            cancel_at_period_end: false,
            items: {
              data: [
                {
                  current_period_end: futurePeriodEnd,
                },
              ],
            },
          },
        },
      });

      await waitForProfile(
        proEmail!,
        (nextProfile) => nextProfile.plan === "free" && nextProfile.subscription_status === "canceled"
      );

      await login(page, proEmail!, proPassword!);
      await page.goto("/pricing");
      await expect(page.getByText("Current plan:").filter({ hasText: "Free" })).toBeVisible();

      const pdfResponse = await page.request.post("/api/pdf/export");
      expect(pdfResponse.status()).toBe(403);
    } finally {
      await sendWebhookEvent({
        id: `evt_test_checkout_completed_${Date.now()}`,
        object: "event",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_rolearc_restore",
            object: "checkout.session",
            customer: profile.stripe_customer_id,
            metadata: {
              user_id: profile.id,
            },
          },
        },
      });

      await waitForProfile(
        proEmail!,
        (nextProfile) =>
          nextProfile.plan === "pro" &&
          nextProfile.subscription_status === "active" &&
          nextProfile.cancel_at_period_end === false &&
          nextProfile.current_period_end === null
      );
    }
  });
});
