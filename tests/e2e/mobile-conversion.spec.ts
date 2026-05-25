import { expect, test } from "@playwright/test";

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => {
    const documentWidth = document.documentElement.scrollWidth;
    const viewportWidth = document.documentElement.clientWidth;
    return documentWidth - viewportWidth;
  });

  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe("mobile conversion flow", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("homepage header CTA stays usable on mobile", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("banner").getByRole("link", { name: "RoleArc" })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("link", { name: "Pricing" })).toBeVisible();
    await expect(page.getByRole("region", { name: "RoleArc live resume rewrite demo" })).toBeVisible();
    await expect(page.getByText("Supported 40+ customer inquiries per day")).toBeVisible();

    const signup = page.getByRole("banner").getByRole("link", { name: "Sign up" });
    await expect(signup).toBeVisible();
    await expect(signup).toHaveCSS("white-space", "nowrap");
    await expectNoHorizontalOverflow(page);

    await signup.click();
    await expect(page).toHaveURL(/\/auth\/signup/);
    await expect(page.getByRole("main")).toContainText(/Start building with RoleArc/i);
  });

  test("pricing page keeps upgrade CTA reachable on mobile", async ({ page }) => {
    await page.goto("/pricing");

    await expect(page.getByRole("heading", { name: /Start free/i })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.getByRole("link", { name: "Start Free" }).click();
    await expect(page).toHaveURL(/\/auth\/signup/);
  });
});
