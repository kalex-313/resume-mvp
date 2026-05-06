import { expect, test } from "@playwright/test";

const testEmail = process.env.E2E_TEST_EMAIL;
const testPassword = process.env.E2E_TEST_PASSWORD;
const freeEmail = process.env.E2E_FREE_TEST_EMAIL;
const freePassword = process.env.E2E_FREE_TEST_PASSWORD;

async function login(page: import("@playwright/test").Page, email: string, password: string) {
  await page.goto("/auth/login");
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByRole("button", { name: /^Log in$/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("AI rewrite flow", () => {
  test.skip(!testEmail || !testPassword, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run AI rewrite tests.");

  test("rewrites the resume summary and returns provider metadata", async ({ page }) => {
    const originalSummary =
      "I helped customers with orders and answered questions. I worked with my team and helped with inventory.";

    await login(page, testEmail!, testPassword!);
    await page.getByRole("button", { name: /Create New Resume|Create your first resume/i }).first().click();
    await expect(page).toHaveURL(/\/builder\/[0-9a-f-]+/i);

    const title = `E2E AI Rewrite ${Date.now()}`;
    await page.getByPlaceholder("Untitled Resume").fill(title);
    await page.locator("textarea").first().fill(originalSummary);

    const rewriteResponsePromise = page.waitForResponse((response) =>
      response.url().includes("/api/ai/rewrite") && response.request().method() === "POST"
    );

    await page.getByRole("button", { name: /^AI Rewrite$/i }).first().click();
    await expect(page.getByRole("button", { name: /Rewriting/i })).toBeVisible();

    const rewriteResponse = await rewriteResponsePromise;
    expect(rewriteResponse.ok()).toBeTruthy();

    const payload = await rewriteResponse.json();
    expect(payload.provider).toMatch(/gemini|openrouter/);
    expect(typeof payload.text).toBe("string");
    expect(payload.text.trim().length).toBeGreaterThan(20);

    const summaryBox = page.locator("textarea").first();
    await expect(summaryBox).not.toHaveValue(originalSummary);
    await expect(summaryBox).toHaveValue(/customer|order|team|inventory|service/i);

    await expect(page.locator("span.text-slate-600").filter({ hasText: "Saved" })).toBeVisible();

    await page.goto("/dashboard");
    await expect(page.getByText(title)).toBeVisible();

    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    const resumeCard = page.locator(".rounded-2xl", { hasText: title }).first();
    await resumeCard.getByRole("button", { name: /Delete/i }).click();
    await expect(page.getByText(title)).toHaveCount(0);
  });
});

test.describe("AI quota entitlements", () => {
  test.skip(!testEmail || !testPassword, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run Pro quota tests.");

  test("returns unlimited quota for Pro users", async ({ page }) => {
    await login(page, testEmail!, testPassword!);

    const response = await page.request.get("/api/ai/quota");
    expect(response.ok()).toBeTruthy();

    const quota = await response.json();
    expect(quota).toEqual(
      expect.objectContaining({
        plan: "pro",
        used: 0,
        limit: null,
        remaining: null,
      })
    );
  });
});

test.describe("Free AI quota entitlements", () => {
  test.skip(!freeEmail || !freePassword, "Set E2E_FREE_TEST_EMAIL and E2E_FREE_TEST_PASSWORD to run Free quota tests.");

  test("blocks AI rewrite when monthly free quota is exhausted", async ({ page }) => {
    await login(page, freeEmail!, freePassword!);

    const quotaResponse = await page.request.get("/api/ai/quota");
    expect(quotaResponse.ok()).toBeTruthy();

    const quota = await quotaResponse.json();
    expect(quota).toEqual(
      expect.objectContaining({
        plan: "free",
        remaining: 0,
      })
    );

    const rewriteResponse = await page.request.post("/api/ai/rewrite", {
      data: {
        section: "summary",
        tone: "balanced",
        text: "I helped customers with orders and improved internal workflows.",
      },
    });

    expect(rewriteResponse.status()).toBe(403);
    expect(await rewriteResponse.json()).toEqual(
      expect.objectContaining({
        code: "FREE_QUOTA_EXHAUSTED",
        quota: expect.objectContaining({
          plan: "free",
          remaining: 0,
        }),
      })
    );
  });
});
