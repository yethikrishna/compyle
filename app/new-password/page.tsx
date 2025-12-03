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
import { resetPassword } from "@/lib/auth-client";
import { resetPasswordSchema } from "@/schema/auth.schema";
import { useForm } from "@tanstack/react-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "sonner";

function NewPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const error = searchParams.get("error");
  const token = searchParams.get("token") || "";

  const form = useForm({
    defaultValues: { password: "" },
    validators: { onSubmit: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      const { error } = await resetPassword({
        token,
        newPassword: value.password,
      });

      setIsLoading(false);
      if (error) {
        toast.error(error.message || "Failed reset your password");
        form.reset();
      } else {
        toast.success("Password updated successfully");
        router.push("/login");
      }
    },
  });

  useEffect(() => {
    if (error === "INVALID_TOKEN") {
      setTimeout(() => {
        toast.error("Invalid password reset token. Redirecting...");
      }, 0);

      const timer = setTimeout(() => {
        router.push("/forgot-password");
      }, 1500);

      return () => clearTimeout(timer);
    }

    if (!token) {
      setTimeout(() => {
        toast.error("Password reset token not found. Redirecting...");
      }, 0);

      const timer = setTimeout(() => {
        router.push("/forgot-password");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [token, router, error]);

  return (
    <div className="mx-auto max-w-lg px-6">
      <Card className="md:min-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>Enter your new password to reset it</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="reset-password"
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                      <Input
                        type="password"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
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
              form="reset-password"
              className="w-40 cursor-pointer gap-2"
              disabled={isLoading}
            >
              {isLoading && <Spinner />}
              {isLoading ? "Loading..." : "Save"}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function NewPassword() {
  return (
    <div>
      <Header />
      <Suspense
        fallback={
          <div className="mx-auto max-w-lg px-6">
            <Card className="md:min-w-md">
              <CardContent className="flex justify-center items-center py-8">
                <Spinner />
              </CardContent>
            </Card>
          </div>
        }
      >
        <NewPasswordForm />
      </Suspense>
    </div>
  );
}
