import { expect, test } from "@playwright/test";

const testEmail = process.env.E2E_TEST_EMAIL;
const testPassword = process.env.E2E_TEST_PASSWORD;

test.describe("AI rewrite flow", () => {
  test.skip(!testEmail || !testPassword, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run AI rewrite tests.");

  test("rewrites the resume summary and returns provider metadata", async ({ page }) => {
    const originalSummary =
      "I helped customers with orders and answered questions. I worked with my team and helped with inventory.";

    await page.goto("/auth/login");
    await page.getByPlaceholder("you@example.com").fill(testEmail!);
    await page.getByPlaceholder("Enter your password").fill(testPassword!);
    await page.getByRole("button", { name: /^Log in$/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
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
