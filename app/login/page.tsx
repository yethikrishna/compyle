"use client";

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
import { signIn } from "@/lib/auth-client";
import { loginSchema } from "@/schema/login.schema";
import { useForm } from "@tanstack/react-form";
import { GitPullRequestCreateArrow } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      await signIn.email(
        {
          email: value.email,
          password: value.password,
          rememberMe: true,
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: () => {
            setIsLoading(false);
            form.reset();
          },
          onError: (ctx) => {
            setIsLoading(false);
            form.reset();
            alert(ctx.error.message);
          },
        },
      );
    },
  });

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-3 self-center font-medium"
        >
          <div className="bg-muted-foreground/25 flex items-center justify-center rounded-md p-1">
            <GitPullRequestCreateArrow />
          </div>
          <span className="font-semibold text-2xl">Compyle Apps</span>
        </Link>

        {/* Login Form */}
        <Card className="md:min-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>
              Enter your email and password to login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="login-form"
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

              <FieldGroup>
                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                          type="password"
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder=""
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
                form="login-form"
                className="w-40 cursor-pointer gap-2"
                disabled={isLoading}
              >
                {isLoading && <Spinner />}
                {isLoading ? "Loading..." : "Continue"}
              </Button>
            </Field>
          </CardFooter>
          <p className="text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Signup
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
