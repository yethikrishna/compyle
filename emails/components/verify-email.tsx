import { Html, Button, Text, Link, Hr } from "@react-email/components";

interface EmailVerificationEmailTempateProps {
  name: string;
  url: string;
}

export default function EmailVerificationEmailTempate({
  name,
  url,
}: EmailVerificationEmailTempateProps) {
  return (
    <Html lang="en">
      <Text>Hii {name}!</Text>
      <Text>Thanks for signup with Compyle Apps!</Text>
      <Text>Please confirm your email address to activate your account.</Text>
      <Link href={url}>
        <Button href={url}>Verify Email</Button>
      </Link>
      <Hr />
      <Text>
        If you didn&apos;t create a Compyle Account you can safely ignore this
        message.
      </Text>
    </Html>
  );
}
