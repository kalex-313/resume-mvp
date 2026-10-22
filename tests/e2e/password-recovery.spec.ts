import { expect, test } from "@playwright/test";
import { clearRecoveryParameters, initializePasswordRecovery, RECOVERY_LINK_ERROR } from "../../src/lib/password-recovery";

function mockAuth(options: { user?: boolean; otpError?: boolean; tokenError?: boolean; delay?: Promise<void> } = {}) {
  const calls: string[] = [];
  const auth = {
    async getSession() { calls.push("initialize"); await options.delay; return { data: { session: null }, error: null }; },
    async getUser() { calls.push("validate"); return { data: { user: options.user === false ? null : { id: "synthetic-user" } }, error: null }; },
    async verifyOtp(input: unknown) { calls.push("verify"); expect(input).toEqual({ token_hash: "synthetic-hash", type: "recovery" }); return { error: options.otpError ? new Error("expired") : null }; },
    async setSession(input: unknown) { calls.push("setSession"); expect(input).toEqual({ access_token: "synthetic-access", refresh_token: "synthetic-refresh" }); return { error: options.tokenError ? new Error("invalid") : null }; },
  };
  return { auth: auth as unknown as Parameters<typeof initializePasswordRecovery>[0], calls };
}

test("waits for SDK PKCE initialization before validating the session", async () => {
  let complete!: () => void;
  const delay = new Promise<void>(resolve => { complete = resolve; });
  const { auth, calls } = mockAuth({ delay });
  const ready = initializePasswordRecovery(auth, new URL("https://example.test/auth/reset-password?code=synthetic-code"));
  expect(calls).toEqual(["initialize"]);
  complete();
  await ready;
  expect(calls).toEqual(["initialize", "validate"]);
});

test("legacy recovery fragments establish a session before validation", async () => {
  const { auth, calls } = mockAuth();
  await initializePasswordRecovery(auth, new URL("https://example.test/auth/reset-password#access_token=synthetic-access&refresh_token=synthetic-refresh&type=recovery"));
  expect(calls).toEqual(["initialize", "setSession", "validate"]);
});

test("recovery token hashes are verified before validation", async () => {
  const { auth, calls } = mockAuth();
  await initializePasswordRecovery(auth, new URL("https://example.test/auth/reset-password?token_hash=synthetic-hash&type=recovery"));
  expect(calls).toEqual(["initialize", "verify", "validate"]);
});

for (const suffix of ["", "?code=missing-verifier"]) {
  test(`missing session is rejected with recovery instructions (${suffix || "direct visit"})`, async () => {
    const { auth } = mockAuth({ user: false });
    await expect(initializePasswordRecovery(auth, new URL(`https://example.test/auth/reset-password${suffix}`))).rejects.toThrow(RECOVERY_LINK_ERROR);
  });
}

for (const suffix of ["?error=otp_expired", "#error_code=otp_expired", "?token_hash=synthetic-hash&type=signup", "#access_token=synthetic-access&type=recovery", "#access_token=synthetic-access&refresh_token=synthetic-refresh&type=signup"]) {
  test(`invalid recovery input does not authorize password entry (${suffix})`, async () => {
    const { auth, calls } = mockAuth();
    await expect(initializePasswordRecovery(auth, new URL(`https://example.test/auth/reset-password${suffix}`))).rejects.toThrow(RECOVERY_LINK_ERROR);
    expect(calls).not.toContain("validate");
  });
}

test("expired tokens do not fall back to an existing session", async () => {
  const { auth, calls } = mockAuth({ otpError: true });
  await expect(initializePasswordRecovery(auth, new URL("https://example.test/auth/reset-password?token_hash=synthetic-hash&type=recovery"))).rejects.toThrow(RECOVERY_LINK_ERROR);
  expect(calls).not.toContain("validate");
});

test("invalid legacy tokens are rejected", async () => {
  const { auth } = mockAuth({ tokenError: true });
  await expect(initializePasswordRecovery(auth, new URL("https://example.test/auth/reset-password#access_token=synthetic-access&refresh_token=synthetic-refresh&type=recovery"))).rejects.toThrow(RECOVERY_LINK_ERROR);
});

test("URL cleanup removes codes, errors and fragment tokens", () => {
  expect(clearRecoveryParameters(new URL("https://example.test/auth/reset-password?code=secret&token_hash=secret&type=recovery&error=x&error_code=x&error_description=x&lang=en#access_token=secret"))).toBe("/auth/reset-password?lang=en");
});
