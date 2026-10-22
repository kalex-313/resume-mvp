import { expect, test } from "@playwright/test";

// Synthetic Auth responses only. This suite must never change a real password.
test.skip(!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(process.env.E2E_BASE_URL || ""), "Requires an isolated local app with synthetic Supabase configuration.");

const user = { id: "00000000-0000-4000-8000-000000000001", aud: "authenticated", role: "authenticated", email: "tester@example.test", app_metadata: {}, user_metadata: {}, created_at: "2026-01-01T00:00:00Z" };
const jwt = [Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url"), Buffer.from(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now() / 1000) + 3600, role: "authenticated" })).toString("base64url"), "synthetic-signature"].join(".");
const session = { access_token: jwt, refresh_token: "synthetic-refresh", expires_in: 3600, token_type: "bearer", user };

test("missing session disables submission and offers a fresh reset link", async ({ page }) => {
  let updates = 0;
  await page.route("**/auth/v1/**", async route => {
    expect(new URL(route.request().url()).origin).toBe("https://recovery-test.supabase.co");
    if (route.request().method() === "PUT") updates++;
    await route.fulfill({ status: 401, json: { message: "No session" } });
  });
  await page.goto("/auth/reset-password");
  await expect(page.getByRole("alert")).toContainText("Request a new link");
  await expect(page.getByRole("button", { name: "Update password" })).toBeDisabled();
  await expect(page.getByLabel("New password", { exact: true })).toBeDisabled();
  await expect(page.getByRole("link", { name: "Request a new reset link" })).toHaveAttribute("href", "/auth/forgot-password");
  expect(updates).toBe(0);
});

for (const flow of ["token_hash", "legacy_fragment", "pkce"]) {
  test(`${flow}: validates session before enabling update`, async ({ page, context, baseURL }) => {
    let exchanges = 0;
    let updates = 0;
    let validations = 0;
    await page.route("**/auth/v1/**", async route => {
      const request = route.request();
      const url = new URL(request.url());
      expect(url.origin).toBe("https://recovery-test.supabase.co");
      if (url.pathname.endsWith("/verify") || url.pathname.endsWith("/token")) {
        exchanges++;
        await route.fulfill({ json: session });
      } else if (url.pathname.endsWith("/user") && request.method() === "PUT") {
        updates++;
        expect(validations).toBeGreaterThan(0);
        expect(request.postDataJSON().password).toBe("Synthetic-test-password-123!");
        await route.fulfill({ json: user });
      } else if (url.pathname.endsWith("/user")) {
        validations++;
        await route.fulfill({ json: user });
      } else {
        await route.fulfill({ json: {} });
      }
    });
    let suffix = "?token_hash=synthetic-hash&type=recovery";
    if (flow === "legacy_fragment") {
      suffix = `#access_token=${jwt}&refresh_token=synthetic-refresh&type=recovery`;
    } else if (flow === "pkce") {
      const verifier = "base64-" + Buffer.from(JSON.stringify("synthetic-verifier/PASSWORD_RECOVERY")).toString("base64url");
      await context.addCookies([{ name: "sb-recovery-test-auth-token-code-verifier", value: verifier, url: baseURL! }]);
      suffix = "?code=synthetic-code";
    }
    await page.goto(`/auth/reset-password${suffix}`);
    await expect(page.getByRole("button", { name: "Update password" })).toBeEnabled();
    await expect(page).toHaveURL(/\/auth\/reset-password$/);
    await page.getByLabel("New password", { exact: true }).fill("Synthetic-test-password-123!");
    await page.getByLabel("Confirm new password", { exact: true }).fill("Synthetic-test-password-123!");
    await page.getByRole("button", { name: "Update password" }).click();
    await expect(page.getByText("Password updated successfully. Redirecting to login...")).toBeVisible();
    expect(updates).toBe(1);
    expect(exchanges).toBe(flow === "legacy_fragment" ? 0 : 1);
  });
}
