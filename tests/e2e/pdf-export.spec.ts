import fs from "fs";
import path from "path";
import { expect, test } from "@playwright/test";

const testEmail = process.env.E2E_TEST_EMAIL;
const testPassword = process.env.E2E_TEST_PASSWORD;

async function login(page: import("@playwright/test").Page, email: string, password: string) {
  await page.goto("/auth/login");
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByRole("button", { name: /^Log in$/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("PDF export", () => {
  test.skip(!testEmail || !testPassword, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run PDF export tests.");

  test("downloads a non-empty PDF for Pro users", async ({ page }, testInfo) => {
    const unique = Date.now();
    const title = `E2E PDF Export ${unique}`;
    const fullName = `RoleArc PDF Tester ${unique}`;
    const summary =
      "Customer-focused operations specialist with experience improving order workflows, handling client issues, and keeping records accurate across fast-moving teams.";

    await login(page, testEmail!, testPassword!);
    await page.getByRole("button", { name: /Create New Resume|Create your first resume/i }).first().click();
    await expect(page).toHaveURL(/\/builder\/[0-9a-f-]+/i);

    const personalInfoSection = page.locator("section", { hasText: "Personal Info" });
    const experienceCard = page
      .getByText("Experience #1")
      .locator("xpath=ancestor::div[contains(@class, 'rounded-2xl')][1]");

    await page.getByPlaceholder("Untitled Resume").fill(title);
    await personalInfoSection.getByPlaceholder("Full name").fill(fullName);
    await personalInfoSection.getByPlaceholder("Email").fill(testEmail!);
    await personalInfoSection.getByPlaceholder("Phone").fill("604-555-0118");
    await personalInfoSection.getByPlaceholder("Location").fill("Vancouver, BC");
    await page.locator("textarea").first().fill(summary);

    await experienceCard.getByPlaceholder("Role").first().fill("Operations Coordinator");
    await experienceCard.getByPlaceholder("Company").first().fill("RoleArc Labs");
    await experienceCard.getByPlaceholder("Location").first().fill("Remote");
    await experienceCard.getByPlaceholder("One bullet per line").first().fill(
      "Reduced response delays by standardizing support workflows.\nTracked issue patterns and updated internal notes for faster handoffs."
    );

    const skillsInput = page.getByPlaceholder("Excel, Customer Service, Inventory Control");
    await skillsInput.fill("Customer Support, Process Improvement, Excel");

    await expect(page.locator("#resume-preview-export")).toContainText(fullName);
    await expect(page.locator("#resume-preview-export")).toContainText("Operations Coordinator @ RoleArc Labs");
    await expect(page.locator("#resume-preview-export")).toContainText("Customer Support");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /Download PDF/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/e2e-pdf-export-\d+\.pdf/i);

    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();

    const savedPath = path.join(testInfo.outputDir, download.suggestedFilename());
    await download.saveAs(savedPath);

    const stats = fs.statSync(savedPath);
    expect(stats.size).toBeGreaterThan(25_000);

    const fileBuffer = fs.readFileSync(savedPath);
    expect(fileBuffer.slice(0, 4).toString("utf8")).toBe("%PDF");

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
