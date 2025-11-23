import EmailVerificationEmailTempate from "@/emails/components/verify-email";
import { env as envClient } from "@/env/client";
import { env as envServer } from "@/env/server";
import { Resend } from "resend";

const resend = new Resend(envServer.RESEND_API_KEY);

interface SendEmailVerificationEmailProps {
  email: string;
  url: string;
  name: string;
}

export async function sendEmailVerificationEmail({
  email,
  url,
  name,
}: SendEmailVerificationEmailProps) {
  await resend.emails.send({
    to: [email],
    from: `Compyle Team <auth@${envClient.NEXT_PUBLIC_EMAIL_DOMAIN}>`,
    subject: "Compyle: Verify your email address",
    react: EmailVerificationEmailTempate({ url, name }),
  });
}
