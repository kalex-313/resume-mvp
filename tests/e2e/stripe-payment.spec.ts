import { expect, type Frame, type Page, test } from "@playwright/test";

const testEmail = process.env.E2E_TEST_EMAIL;
const testPassword = process.env.E2E_TEST_PASSWORD;
const completeStripePayment = process.env.E2E_STRIPE_COMPLETE === "1";

type FillRoot = Page | Frame;

async function fillStripeInput(page: Page, labelOrPlaceholder: RegExp, value: string) {
  const roots: FillRoot[] = [page, ...page.frames()];

  for (const root of roots) {
    const candidates = [
      root.getByLabel(labelOrPlaceholder),
      root.getByPlaceholder(labelOrPlaceholder),
      root.locator("input").filter({ hasText: labelOrPlaceholder }),
    ];

    for (const candidate of candidates) {
      if ((await candidate.count()) === 0) {
        continue;
      }

      await candidate.first().fill(value, { timeout: 10_000 });
      return;
    }
  }

  throw new Error(`Could not find Stripe input: ${labelOrPlaceholder}`);
}

test.describe("Stripe test payment", () => {
  test.skip(!completeStripePayment, "Set E2E_STRIPE_COMPLETE=1 to run Stripe test card payment.");
  test.skip(!testEmail || !testPassword, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run Stripe payment tests.");

  test("completes a test mode subscription payment", async ({ page }) => {
    test.setTimeout(90_000);

    await page.goto("/auth/login");
    await page.getByPlaceholder("you@example.com").fill(testEmail!);
    await page.getByPlaceholder("Enter your password").fill(testPassword!);
    await page.getByRole("button", { name: /^Log in$/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto("/upgrade");
    await page.getByRole("button", { name: /Continue to Payment/i }).click();
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30_000 });

    await expect(page.locator("body")).toContainText(/test mode|test payment|sandbox|沙盒/i, { timeout: 15_000 });

    await page.getByText(/^Card$/).click({ force: true });

    await fillStripeInput(page, /card number|1234 1234/i, "4242424242424242");
    await fillStripeInput(page, /expiration|expiry|MM\s*\/\s*YY/i, "1234");
    await fillStripeInput(page, /security code|cvc|cvv/i, "123");
    await fillStripeInput(page, /cardholder name|full name on card/i, "RoleArc Test");
    await fillStripeInput(page, /zip|postal/i, "M5V 2T6");

    await page.locator('[data-testid="hosted-payment-submit-button"]').click();
    await page.waitForURL(/\/pricing\?upgrade=success/, { timeout: 60_000 });

    await expect(page.locator("body")).toContainText(/pro|success|upgrade/i);
  });
});
