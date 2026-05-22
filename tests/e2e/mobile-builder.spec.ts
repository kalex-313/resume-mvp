import { expect, test } from "@playwright/test";

const testEmail = process.env.E2E_TEST_EMAIL;
const testPassword = process.env.E2E_TEST_PASSWORD;

test.describe("mobile builder UX", () => {
  test.skip(!testEmail || !testPassword, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run mobile builder tests.");

  test("lets mobile users switch between editing and previewing a resume", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto("/auth/login");
    await page.getByPlaceholder("you@example.com").fill(testEmail!);
    await page.getByPlaceholder("Enter your password").fill(testPassword!);
    await page.getByRole("button", { name: /^Log in$/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await page.getByRole("button", { name: /Create New Resume|Create your first resume/i }).first().click();
    await expect(page).toHaveURL(/\/builder\/[0-9a-f-]+/i);

    await expect(page.getByRole("button", { name: "Edit" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Preview" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Resume Builder" })).toBeVisible();

    const fullName = `Mobile Tester ${Date.now()}`;
    await page.getByPlaceholder("Full name").fill(fullName);
    await page
      .getByPlaceholder("Excel, Customer Service, Inventory Control")
      .fill("Excel, Customer Service\nInventory Control");

    await page.getByRole("button", { name: "Preview" }).click();
    await expect(page.locator("#resume-preview-export")).toBeVisible();
    await expect(page.locator("#resume-preview-export")).toContainText(fullName);
    const preview = page.locator("#resume-preview-export");
    await expect(preview.getByText("Excel", { exact: true })).toBeVisible();
    await expect(preview.getByText("Customer Service", { exact: true })).toBeVisible();
    await expect(preview.getByText("Inventory Control", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Resume Builder" })).toHaveCount(0);

    const overflowX = await page.evaluate(
      () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
    );
    expect(overflowX).toBeLessThanOrEqual(1);

    await page.getByRole("button", { name: "Edit" }).click();
    await expect(page.getByRole("heading", { name: "Resume Builder" })).toBeVisible();
  });
});
