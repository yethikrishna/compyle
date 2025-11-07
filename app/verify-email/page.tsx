"use client";

import { Header } from "@/components/custom/header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { sendVerificationEmail, useSession } from "@/lib/auth-client";
import { CheckCircle2, Clock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VerifyEmail() {
  const [time, setTime] = useState<number>(60);
  const [sending, setSending] = useState<boolean>(false);

  const { data: session, isPending, error } = useSession();

  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [time]);

  const handleResend = async () => {
    if (!session?.user.email) {
      toast.error("User not found.");
      return;
    }

    setSending(true);

    try {
      await sendVerificationEmail({
        email: session.user.email,
        callbackURL: "/dashboard",
      });

      toast.success("Email sent successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to send email");
    }

    setTime(60);
    setSending(false);
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto px-6">
        {isPending && !session && <Spinner className="mx-auto w-full size-6" />}
        {!isPending && !error && session && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl">Email Verification</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {session.user.emailVerified && (
                <Alert className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Your email has been successfully verified. You now have full
                    access to your account.
                  </AlertDescription>
                </Alert>
              )}

              {!session.user.emailVerified && (
                <>
                  <Alert>
                    <Mail className="h-4 w-4 text-primary" />
                    <AlertDescription>
                      A verification link has been sent to your email. Please
                      check your inbox and click the link to verify your email
                      address.
                    </AlertDescription>
                  </Alert>

                  <div className="p-4 bg-muted rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <p className="text-sm font-medium text-muted-foreground">
                          Resend Email
                        </p>
                      </div>
                    </div>

                    {time > 0 ? (
                      <div className="space-y-3 pt-3">
                        <Progress value={((60 - time) / 60) * 100} />
                        <p className="text-sm">
                          You can send a new verification email in{" "}
                          <span className="font-bold text-slate-900 dark:text-white">
                            {time}
                          </span>{" "}
                          second
                          {time !== 1 ? "s" : ""}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Didn&apos;t receive the email or the link has expired?
                          You can send a new verification link.
                        </p>
                        <Button
                          className="w-full cursor-pointer"
                          size="lg"
                          disabled={sending}
                          onClick={handleResend}
                        >
                          {sending && <Spinner />}
                          {sending ? "Sending..." : "Send New Email"}
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
