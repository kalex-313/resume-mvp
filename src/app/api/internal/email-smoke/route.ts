import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { sendLifecycleEmail } from "@/lib/email/lifecycle";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

const allowedRecipientHash =
  "db3f9cc1262487b2f6d82ff60b6f9f999af2cd8826419a229ce6b8ac353ff946";
const emailSmokeRateLimitResponse = rateLimitResponse(
  "Too many email smoke test attempts. Please wait and try again."
);

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function POST(request: Request) {
  const rateLimit = await checkRateLimit({
    action: "email:smoke",
    limit: 2,
    windowMs: 60 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return emailSmokeRateLimitResponse(rateLimit);
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();

  if (!email || sha256(email) !== allowedRecipientHash) {
    return NextResponse.json({ error: "Recipient is not allowed." }, { status: 403 });
  }

  const result = await sendLifecycleEmail({
    to: email,
    subject: "RoleArc email test",
    text:
      "Hi,\n\n" +
      "This is a short test email from RoleArc.\n\n" +
      "If you received this, the email setup is working.\n\n" +
      "Best,\n" +
      "The RoleArc team",
  });

  const status = result.status === "sent" ? 200 : 500;
  return NextResponse.json(result, { status });
}
