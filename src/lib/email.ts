import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error("RESEND_API_KEY is not configured.");
}

const resend = new Resend(apiKey);

export async function sendPasswordResetCode(
  email: string,
  code: string,
) {
  const from: string = process.env.MAIL_FROM ?? "";

  if (!from) {
    throw new Error("MAIL_FROM is not configured.");
  }

  return resend.emails.send({
    from: from,
    to: email,
    subject: "Your Student Portal password reset code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; color: #0f172a;">
        <h1 style="margin-bottom: 8px;">Password Reset</h1>

        <p style="color: #475569; line-height: 1.6;">
          We received a request to reset your Student Portal password.
        </p>

        <div style="margin: 28px 0; padding: 24px; border-radius: 16px; background: #f1f5f9; text-align: center;">
          <p style="margin: 0 0 8px; color: #64748b; font-size: 13px;">
            Your verification code
          </p>

          <div style="font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #2563eb;">
            ${code}
          </div>
        </div>

        <p style="color: #475569; line-height: 1.6;">
          This code expires in <strong>10 minutes</strong> and can only be used once.
        </p>

        <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}