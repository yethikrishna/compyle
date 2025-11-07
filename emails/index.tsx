import EmailVerificationEmailTempate from "@/emails/components/verify-email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    from: `Luzin Team <auth@${process.env.NEXT_PUBLIC_EMAIL_DOMAIN}>`,
    subject: "Compyle: Verify your email address",
    react: EmailVerificationEmailTempate({ url, name }),
  });
}
