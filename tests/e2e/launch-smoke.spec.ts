import { expect, test } from "@playwright/test";

const publicPages = [
  { path: "/", title: /RoleArc|resume/i },
  { path: "/pricing", title: /Upgrade|plan|pricing/i },
  { path: "/templates", title: /template/i },
  { path: "/privacy", title: /Privacy Policy/i },
  { path: "/terms", title: /Terms of Service/i },
  { path: "/contact", title: /Support and contact/i },
];

const authPages = [
  { path: "/auth/login", title: /Log in to RoleArc/i },
  { path: "/auth/signup", title: /Start building with RoleArc/i },
  { path: "/auth/forgot-password", title: /reset|password|email/i },
];

test.describe("launch smoke checks", () => {
  for (const pageInfo of publicPages) {
    test(`loads public page: ${pageInfo.path}`, async ({ page }) => {
      await page.goto(pageInfo.path);
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("main")).toContainText(pageInfo.title);
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });
  }

  for (const pageInfo of authPages) {
    test(`loads auth page: ${pageInfo.path}`, async ({ page }) => {
      await page.goto(pageInfo.path);
      await expect(page.getByRole("main")).toContainText(pageInfo.title);
    });
  }

  test("logged-out dashboard redirects to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole("main")).toContainText(/Log in to RoleArc/i);
  });

  test("template CTA sends logged-out users to signup", async ({ page }) => {
    await page.goto("/templates");
    await page.getByRole("link", { name: /Use template|Sign up|Create/i }).first().click();
    await expect(page).toHaveURL(/\/auth\/signup|\/auth\/login/);
  });
});
