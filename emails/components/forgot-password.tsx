import { Html, Button, Text, Link, Hr } from "@react-email/components";

interface PasswordResetEmailTemplateProps {
  name: string;
  url: string;
}

export default function PasswordResetEmailTemplate({
  name = "Trace Panic",
  url = "http://localhost:3000/url",
}: PasswordResetEmailTemplateProps) {
  return (
    <Html lang="en">
      <Text>Hi {name}!</Text>
      <Text>
        We received a request to reset the password for your Compyle Apps
        account associated with this email address.
      </Text>
      <Text>Click the button below to reset your password:</Text>
      <Link href={url}>
        <Button href={url}>Reset Password</Button>
      </Link>
      <Text>
        If the button doesn&apos;t work, you can copy and paste the following
        link into your browser:
      </Text>
      <Link href={url}>{url}</Link>
      <Hr />
      <Text>
        If you didn&apos;`t request a password reset, you can safely ignore this
        email. Your password will remain unchanged.
      </Text>
    </Html>
  );
}
