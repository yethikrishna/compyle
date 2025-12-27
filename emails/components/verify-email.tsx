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
import {
  button,
  buttonContainer,
  container,
  content,
  featureItem,
  featuresSection,
  featuresTitle,
  footer,
  footerLink,
  footerLinks,
  footerText,
  header,
  heading,
  hr,
  legalLink,
  legalLinks,
  link,
  logoImage,
  main,
  paragraph,
  socialLink,
  socialSection,
  tagline,
} from "../styles";

interface EmailVerificationEmailTemplateProps {
  name: string;
  url: string;
}

export default function EmailVerificationEmailTemplate({
  name = "Trace Panic",
  url = "http://localhost:3000/url",
}: EmailVerificationEmailTemplateProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Verify your email address to get started with Compyle</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://compyle.ai/compyle.svg"
              width="140"
              height="40"
              alt="Compyle"
              style={logoImage}
            />
            <Text style={tagline}>Apps Built With Compyle.ai</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={heading}>Welcome to Compyle! 🎉</Heading>
            <Text style={paragraph}>Hi {name},</Text>
            <Text style={paragraph}>
              Thanks for signing up for Compyle Apps! We&apos;re excited to have
              you join our community of builders.
            </Text>
            <Text style={paragraph}>
              Please verify your email address to activate your account and
              start exploring.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={url}>
                Verify Email Address
              </Button>
            </Section>

            <Text style={paragraph}>
              If the button doesn&apos;t work, copy and paste this link into
              your browser:
            </Text>
            <Link href={url} style={link}>
              {url}
            </Link>

            {/* Features Section */}
            <Section style={featuresSection}>
              <Text style={featuresTitle}>What you can do with Compyle:</Text>
              <Text style={featureItem}>✨ Discover amazing apps</Text>
              <Text style={featureItem}>🚀 Submit your own creations</Text>
              <Text style={featureItem}>💬 Connect with other builders</Text>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              If you didn&apos;t create a Compyle account, you can safely ignore
              this email.
            </Text>

            {/* Social Links */}
            <Section style={socialSection}>
              <Link href="https://x.com/compyle_ai" style={socialLink}>
                𝕏
              </Link>
              <Link href="https://discord.gg/U9djmRTDB4" style={socialLink}>
                Discord
              </Link>
              <Link
                href="https://www.linkedin.com/company/compyle-ai/"
                style={socialLink}
              >
                LinkedIn
              </Link>
            </Section>

            <Text style={footerText}>
              © {new Date().getFullYear()} SmartAppetite Corporation. All rights
              reserved.
            </Text>
            <Text style={footerLinks}>
              <Link href="https://compyle.ai" style={footerLink}>
                Visit Compyle
              </Link>
              {" • "}
              <Link
                href="https://compyle.ai/apps"
                style={footerLink}
              >
                Browse Apps
              </Link>
              {" • "}
              <Link href="https://docs.compyle.ai" style={footerLink}>
                Docs
              </Link>
            </Text>
            <Text style={legalLinks}>
              <Link
                href="https://app.termly.io/policy-viewer/policy.html?policyUUID=ffe987c4-1452-4c5f-8f9d-4dd1abd70f86"
                style={legalLink}
              >
                Terms of Service
              </Link>
              {" • "}
              <Link
                href="https://app.termly.io/policy-viewer/policy.html?policyUUID=0168892b-56de-455b-8e10-fbf1666a4f83"
                style={legalLink}
              >
                Privacy Policy
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
