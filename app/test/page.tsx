"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Clock, Mail } from "lucide-react";

interface EmailVerificationState {
  id: string;
  email: string;
  isVerified: boolean;
  sentAt: Date;
  canResendAt?: Date;
}

const DEMO_STATES: EmailVerificationState[] = [
  {
    id: "1",
    email: "verified.user@example.com",
    isVerified: true,
    sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    email: "pending.user@example.com",
    isVerified: false,
    sentAt: new Date(Date.now() - 5 * 60 * 1000),
    canResendAt: new Date(Date.now() + 55 * 1000),
  },
  {
    id: "3",
    email: "ready.to.resend@example.com",
    isVerified: false,
    sentAt: new Date(Date.now() - 61 * 1000),
    canResendAt: new Date(Date.now() - 1 * 1000),
  },
];

export default function VerifyEmailPage() {
  const [selectedState, setSelectedState] = useState<EmailVerificationState>(
    DEMO_STATES[1],
  );
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isResending, setIsResending] = useState(false);

  // Calculate cooldown timer
  useEffect(() => {
    if (!selectedState.canResendAt) return;

    const updateTimer = () => {
      const now = new Date();
      const remaining = Math.max(
        0,
        Math.ceil(
          (selectedState.canResendAt!.getTime() - now.getTime()) / 1000,
        ),
      );
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [selectedState.canResendAt]);

  const handleResend = async () => {
    setIsResending(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsResending(false);
    // Update the state to show new cooldown
    setSelectedState({
      ...selectedState,
      sentAt: new Date(),
      canResendAt: new Date(Date.now() + 60 * 1000),
    });
    setTimeRemaining(60);
  };

  const canResend = timeRemaining === 0 && !selectedState.isVerified;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Email Verification
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your email verification status
          </p>
        </div>

        {/* Demo Selector */}
        <div className="mb-8 flex flex-col sm:flex-row gap-2 justify-center">
          {DEMO_STATES.map((state, index) => (
            <Button
              key={state.id}
              onClick={() => {
                setSelectedState(state);
                setTimeRemaining(
                  state.canResendAt
                    ? Math.max(
                        0,
                        Math.ceil(
                          (state.canResendAt.getTime() - new Date().getTime()) /
                            1000,
                        ),
                      )
                    : null,
                );
              }}
              variant={selectedState.id === state.id ? "default" : "outline"}
              className="text-xs sm:text-sm"
            >
              {index === 0
                ? "✓ Verified"
                : index === 1
                  ? "⏱ Pending (5s ago)"
                  : "→ Ready to Resend"}
            </Button>
          ))}
        </div>

        {/* Main Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              {selectedState.isVerified ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  <div>
                    <CardTitle className="text-2xl">Email Verified</CardTitle>
                    <CardDescription>
                      Your email address has been confirmed
                    </CardDescription>
                  </div>
                </>
              ) : (
                <>
                  <Mail className="w-8 h-8 text-blue-500" />
                  <div>
                    <CardTitle className="text-2xl">
                      Verify Your Email
                    </CardTitle>
                    <CardDescription>
                      Check your inbox to verify your email address
                    </CardDescription>
                  </div>
                </>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Email Display */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Email Address
              </p>
              <p className="font-mono text-lg font-semibold text-slate-900 dark:text-white">
                {selectedState.email}
              </p>
            </div>

            {/* Status Messages */}
            {selectedState.isVerified && (
              <Alert className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Your email has been successfully verified. You now have full
                  access to your account.
                </AlertDescription>
              </Alert>
            )}

            {!selectedState.isVerified && (
              <>
                <Alert className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    A verification link has been sent to your email. Please
                    check your inbox (and spam folder) and click the link to
                    verify your address.
                  </AlertDescription>
                </Alert>

                {/* Cooldown Timer or Resend Button */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Resend Email
                      </p>
                    </div>
                  </div>

                  {timeRemaining && timeRemaining > 0 ? (
                    <div className="space-y-3">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full transition-all duration-1000"
                          style={{
                            width: `${((60 - timeRemaining) / 60) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        You can send a new verification email in{" "}
                        <span className="font-bold text-slate-900 dark:text-white">
                          {timeRemaining}
                        </span>{" "}
                        second
                        {timeRemaining !== 1 ? "s" : ""}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Didn't receive the email? You can send a new
                        verification link.
                      </p>
                      <Button
                        onClick={handleResend}
                        disabled={!canResend || isResending}
                        className="w-full"
                        size="lg"
                      >
                        {isResending
                          ? "Sending..."
                          : "Send New Verification Email"}
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Help Text */}
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <p>
                <strong>Tips:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Check your spam or junk folder if you don't see the email
                </li>
                <li>Verification links typically expire after 24 hours</li>
                <li>You can only request a new email every 60 seconds</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
