import { expect, test } from "@playwright/test";

test.skip(!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(process.env.E2E_BASE_URL || ""), "Requires an isolated local app.");

for (const query of ["", "?token_hash=synthetic&type=signup", "?type=recovery"]) {
  test(`recovery rejects missing or wrong-type tokens (${query || "empty"})`, async ({ request, baseURL }) => {
    const response = await request.get(`/auth/recovery${query}`, { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toBe(`${baseURL}/auth/reset-password?error=invalid_link`);
    expect(response.headers()["cache-control"]).toContain("no-store");
    // Next may append the route policy to the global policy. Browsers use the
    // last recognized value, so verify the effective policy remains private.
    expect(response.headers()["referrer-policy"].split(",").at(-1)?.trim()).toBe("no-referrer");
  });
}

test("missing recovery code returns to reset instructions", async ({ request, baseURL }) => {
  const response = await request.get("/auth/callback?next=/auth/reset-password", { maxRedirects: 0 });
  expect(response.headers().location).toBe(`${baseURL}/auth/reset-password?error=invalid_link`);
});

for (const next of ["https://other.example/auth/reset-password", "//other.example/", "http://["]) {
  test(`callback cannot redirect to untrusted or malformed return URLs (${next})`, async ({ request, baseURL }) => {
    const response = await request.get(`/auth/callback?next=${encodeURIComponent(next)}`, { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toBe(`${baseURL}/auth/login`);
  });
}
