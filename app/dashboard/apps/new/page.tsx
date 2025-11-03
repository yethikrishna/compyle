"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createAppSchema } from "@/schema/app.schema";
import { useForm } from "@tanstack/react-form";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function CreateApp() {
  const form = useForm({
    defaultValues: { name: "", slug: "", description: "" },
    validators: { onSubmit: createAppSchema },
  });

  return (
    <div className="flex-1 mt-2">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="mb-10">
        <h1 className="text-2xl lg:text-4xl font-bold mb-3 gradient-text">
          Submit New App
        </h1>
        <p className="text-muted-foreground text-lg">
          Launch your applications built with Compyle AI. Fill in the details
          below to get started.
        </p>
      </div>

      <form
        id="create-app-form"
        className="max-w-4xl space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card>
          <CardContent>
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-secondary/50 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-semibold mb-1">
                  Basic Information
                </h2>
                <p className="text-muted-foreground text-sm">
                  Tell us more about your app
                </p>
              </div>
            </div>
            <div className="pl-16 mt-2 space-y-6">
              <FieldGroup>
                <form.Field name="name">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>App Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Amazing App"
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
                <form.Field name="slug">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>App Slug</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="amazing_app"
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
                <form.Field name="description">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Description
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="off"
                          className="min-h-24"
                          placeholder="Describe what your app does, its key features, and who it's for..."
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
