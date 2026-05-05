import { expect, test } from "@playwright/test";

const testEmail = process.env.E2E_TEST_EMAIL;
const testPassword = process.env.E2E_TEST_PASSWORD;
const runStripeCheckout = process.env.E2E_STRIPE_CHECKOUT === "1";

test.describe("Stripe checkout smoke", () => {
  test.skip(!runStripeCheckout, "Set E2E_STRIPE_CHECKOUT=1 to run Stripe checkout smoke tests.");
  test.skip(!testEmail || !testPassword, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run Stripe checkout tests.");

  test("creates a checkout session for a logged-in free user", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByPlaceholder("you@example.com").fill(testEmail!);
    await page.getByPlaceholder("Enter your password").fill(testPassword!);
    await page.getByRole("button", { name: /^Log in$/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto("/upgrade");
    await expect(page.getByRole("heading", { name: /Get hired faster/i })).toBeVisible();

    await page.getByRole("button", { name: /Continue to Payment/i }).click();
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30_000 });

    await expect(page).toHaveURL(/checkout\.stripe\.com/);
    await expect(page.locator("body")).toContainText(/RoleArc|Pro|\$9|payment|subscription/i);
  });
});
