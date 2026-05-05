import { expect, test } from "@playwright/test";

const proEmail = process.env.E2E_TEST_EMAIL;
const proPassword = process.env.E2E_TEST_PASSWORD;
const freeEmail = process.env.E2E_FREE_TEST_EMAIL;
const freePassword = process.env.E2E_FREE_TEST_PASSWORD;

async function login(page: import("@playwright/test").Page, email: string, password: string) {
  await page.goto("/auth/login");
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByRole("button", { name: /^Log in$/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("Pro entitlements", () => {
  test.skip(!proEmail || !proPassword, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run Pro entitlement tests.");

  test("can create a premium template resume and see PDF export", async ({ page }) => {
    await login(page, proEmail!, proPassword!);

    await page.goto("/templates");
    const premiumCard = page
      .getByRole("heading", { name: "Modern Pro" })
      .locator("xpath=ancestor::div[contains(@class, 'rounded-3xl')][1]");
    await premiumCard.getByRole("button", { name: "Use template" }).click();

    await expect(page).toHaveURL(/\/builder\/[0-9a-f-]+/i);
    await expect(page.getByText("Current plan: Pro")).toBeVisible();
    await expect(page.getByRole("button", { name: /Download PDF/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Modern Pro" })).toHaveAttribute("aria-pressed", "true");

    const title = `E2E Pro Entitlement ${Date.now()}`;
    await page.getByPlaceholder("Untitled Resume").fill(title);
    await page.getByRole("button", { name: /Save Draft/i }).click();
    await expect(page.locator("span.text-slate-600").filter({ hasText: "Saved" })).toBeVisible();

    await page.goto("/dashboard");
    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });
    const resumeCard = page.locator(".rounded-2xl", { hasText: title }).first();
    await resumeCard.getByRole("button", { name: /Delete/i }).click();
    await expect(page.getByText(title)).toHaveCount(0);
  });
});

test.describe("Free entitlements", () => {
  test.skip(!freeEmail || !freePassword, "Set E2E_FREE_TEST_EMAIL and E2E_FREE_TEST_PASSWORD to run Free entitlement tests.");

  test("cannot use premium templates or PDF export APIs", async ({ page }) => {
    await login(page, freeEmail!, freePassword!);

    await page.goto("/templates");
    const premiumCard = page
      .getByRole("heading", { name: "Modern Pro" })
      .locator("xpath=ancestor::div[contains(@class, 'rounded-3xl')][1]");
    await expect(premiumCard.getByRole("button", { name: "Upgrade" })).toBeVisible();
    await premiumCard.getByRole("button", { name: "Upgrade" }).click();
    await expect(page).toHaveURL(/\/upgrade/);

    const premiumTemplateResponse = await page.request.post("/api/resumes/from-template", {
      data: { templateId: "modern-pro" },
    });
    expect(premiumTemplateResponse.status()).toBe(403);
    expect(await premiumTemplateResponse.json()).toEqual(
      expect.objectContaining({ code: "PREMIUM_TEMPLATE_LOCKED" })
    );

    const pdfResponse = await page.request.post("/api/pdf/export");
    expect(pdfResponse.status()).toBe(403);
    expect(await pdfResponse.json()).toEqual(expect.objectContaining({ code: "PDF_LOCKED" }));
  });
});
