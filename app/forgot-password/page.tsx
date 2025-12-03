"use client";

import { Header } from "@/components/custom/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { requestPasswordReset } from "@/lib/auth-client";
import { updateEmailSchema } from "@/schema/auth.schema";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import { env } from "@/env/client";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: updateEmailSchema },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      const { error } = await requestPasswordReset({
        email: value.email,
        redirectTo: `${env.NEXT_PUBLIC_BETTER_AUTH_URL}/new-password`,
      });

      setIsLoading(false);
      if (error) {
        toast.error("Failed to send password reset email");
        form.reset();
      } else {
        toast.success("Check your email for a password reset link.");
      }
    },
  });

  return (
    <div>
      <Header />
      <div className="mx-auto max-w-lg px-6">
        <Card className="md:min-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="forgot-password"
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.Field name="email">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Email Address
                        </FieldLabel>
                        <Input
                          type="email"
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="johndoe@domain.com"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex flex-row">
            <Field
              orientation="horizontal"
              className="w-full flex justify-between"
            >
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => form.reset()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="forgot-password"
                className="w-40 cursor-pointer gap-2"
                disabled={isLoading}
              >
                {isLoading && <Spinner />}
                {isLoading ? "Loading..." : "Continue"}
              </Button>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
