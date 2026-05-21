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
    subject: "Your first RoleArc resume is ready to shape",
    text:
      "Thanks for starting your first resume in RoleArc.\n\n" +
      "A good next step is to fill in your work, project, or education details, then use AI Rewrite on the sections that sound too plain.\n\n" +
      "When the resume feels ready, you can choose a cleaner template and export a polished PDF with Pro.\n\n" +
      "Open RoleArc: https://www.rolearc.xyz/dashboard\n\n" +
      "RoleArc",
  });
}

export async function sendProActivatedEmail(to?: string | null) {
  await sendLifecycleEmail({
    to,
    subject: "RoleArc Pro is active",
    text:
      "Your RoleArc Pro access is active.\n\n" +
      "You can now use Pro features such as premium templates and polished PDF export for your resume workflow.\n\n" +
      "Open your dashboard: https://www.rolearc.xyz/dashboard\n\n" +
      "RoleArc",
  });
}
