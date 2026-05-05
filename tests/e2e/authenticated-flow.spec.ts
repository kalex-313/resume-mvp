import { expect, test } from "@playwright/test";

const testEmail = process.env.E2E_TEST_EMAIL;
const testPassword = process.env.E2E_TEST_PASSWORD;

test.describe("authenticated resume flow", () => {
  test.skip(!testEmail || !testPassword, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run authenticated tests.");

  test("logs in, creates a resume, edits it, autosaves, and deletes it", async ({ page }) => {
    const unique = Date.now();
    const title = `E2E Resume ${unique}`;
    const fullName = `RoleArc Tester ${unique}`;
    const summary = "Customer support specialist with experience handling order inquiries and improving service workflows.";

    await page.goto("/auth/login");
    await page.getByPlaceholder("you@example.com").fill(testEmail!);
    await page.getByPlaceholder("Enter your password").fill(testPassword!);
    await page.getByRole("button", { name: /^Log in$/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: "Your resumes" })).toBeVisible();

    await page.getByRole("button", { name: /Create New Resume|Create your first resume/i }).first().click();
    await expect(page).toHaveURL(/\/builder\/[0-9a-f-]+/i);
    await expect(page.getByRole("heading", { name: "Resume Builder" })).toBeVisible();

    await page.getByPlaceholder("Untitled Resume").fill(title);
    await page.getByPlaceholder("Full name").fill(fullName);
    await page.getByPlaceholder("Email").fill(testEmail!);
    await page.locator("textarea").first().fill(summary);
    await page.getByRole("button", { name: /Save Draft/i }).click();

    await expect(page.locator("span.text-slate-600").filter({ hasText: "Saved" })).toBeVisible();

    await page.goto("/dashboard");
    await expect(page.getByText(title)).toBeVisible();

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Delete this resume");
      await dialog.accept();
    });

    const resumeCard = page.locator(".rounded-2xl", { hasText: title }).first();
    await resumeCard.getByRole("button", { name: /Delete/i }).click();
    await expect(page.getByText(title)).toHaveCount(0);
  });
});
