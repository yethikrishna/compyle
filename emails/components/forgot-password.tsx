import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetEmailTemplateProps {
  name: string;
  url: string;
}

export default function PasswordResetEmailTemplate({
  name,
  url,
}: PasswordResetEmailTemplateProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Reset your Compyle password</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://compyle.tracepanic.com/compyle.svg"
              width="140"
              height="40"
              alt="Compyle"
              style={logoImage}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={heading}>Reset Your Password</Heading>
            <Text style={paragraph}>Hi {name},</Text>
            <Text style={paragraph}>
              We received a request to reset the password for your Compyle Apps
              account. Click the button below to create a new password.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={url}>
                Reset Password
              </Button>
            </Section>

            <Text style={paragraph}>
              If the button doesn&apos;t work, copy and paste this link into
              your browser:
            </Text>
            <Link href={url} style={link}>
              {url}
            </Link>

            <Section style={warningBox}>
              <Text style={warningText}>
                ⏰ This link will expire in 24 hours for security reasons.
              </Text>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              If you didn&apos;t request a password reset, you can safely ignore
              this email. Your password will remain unchanged.
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Compyle Apps. All rights reserved.
            </Text>
            <Text style={footerLinks}>
              <Link href="https://compyle.tracepanic.com" style={footerLink}>
                Visit Compyle
              </Link>
              {" • "}
              <Link
                href="https://compyle.tracepanic.com/apps"
                style={footerLink}
              >
                Browse Apps
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const header = {
  backgroundColor: "#4F46E5",
  padding: "32px 40px",
  borderRadius: "8px 8px 0 0",
};

const logoImage = {
  margin: "0 auto",
  display: "block",
};

const content = {
  padding: "40px",
};

const heading = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 16px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#4F46E5",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "14px 32px",
  display: "inline-block",
};

const link = {
  color: "#4F46E5",
  fontSize: "14px",
  wordBreak: "break-all" as const,
};

const warningBox = {
  backgroundColor: "#FEF3C7",
  borderRadius: "6px",
  padding: "16px",
  marginTop: "24px",
};

const warningText = {
  color: "#92400E",
  fontSize: "14px",
  margin: "0",
  textAlign: "center" as const,
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "0",
};

const footer = {
  padding: "24px 40px",
};

const footerText = {
  color: "#9ca3af",
  fontSize: "13px",
  lineHeight: "22px",
  margin: "0 0 8px",
  textAlign: "center" as const,
};

const footerLinks = {
  color: "#9ca3af",
  fontSize: "13px",
  margin: "16px 0 0",
  textAlign: "center" as const,
};

const footerLink = {
  color: "#4F46E5",
  textDecoration: "none",
};
