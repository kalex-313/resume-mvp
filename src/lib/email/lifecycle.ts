type LifecycleEmail = {
  to?: string | null;
  subject: string;
  text: string;
};

const fromEmail = process.env.EMAIL_FROM || "RoleArc <support@rolearc.xyz>";

function isEmailEnabled() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendLifecycleEmail(message: LifecycleEmail) {
  if (!message.to) return;

  if (!isEmailEnabled()) {
    console.info("Lifecycle email skipped; email provider is not configured:", {
      to: message.to,
      subject: message.subject,
    });
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: message.to,
        subject: message.subject,
        text: message.text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("Lifecycle email failed:", response.status, errorText);
    }
  } catch (error) {
    console.error(
      "Lifecycle email request failed:",
      error instanceof Error ? error.message : "Unknown email error"
    );
  }
}

export async function sendFirstResumeEmail(to?: string | null) {
  await sendLifecycleEmail({
    to,
    subject: "Welcome to RoleArc",
    text:
      "Hi,\n\n" +
      "Thanks for creating your first resume in RoleArc.\n\n" +
      "You can continue editing it here:\n" +
      "https://www.rolearc.xyz/dashboard\n\n" +
      "Best,\n" +
      "The RoleArc team",
  });
}

export async function sendProActivatedEmail(to?: string | null) {
  await sendLifecycleEmail({
    to,
    subject: "RoleArc Pro is active",
    text:
      "Hi,\n\n" +
      "Your RoleArc Pro access is now active.\n\n" +
      "You can manage your resumes here:\n" +
      "https://www.rolearc.xyz/dashboard\n\n" +
      "Best,\n" +
      "The RoleArc team",
  });
}
