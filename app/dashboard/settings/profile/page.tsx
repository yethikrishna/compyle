"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { updateUser, useSession } from "@/lib/auth-client";
import { updateProfileSchema } from "@/schema/auth.schema";
import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfileSettings() {
  const [isUpdating, setIsUpdating] = useState(false);

  const { data, error, isPending, refetch } = useSession();

  const form = useForm({
    defaultValues: { name: "" },
    validators: { onSubmit: updateProfileSchema },
    onSubmit: async ({ value }) => {
      if (value.name === data?.user.name) {
        toast.error("Cannot update name to the same name");
        return;
      }

      setIsUpdating(true);
      const id = toast.loading("Updating profile...");
      const { error } = await updateUser({
        name: value.name,
      });

      toast.dismiss(id);
      setIsUpdating(false);
      if (error) {
        toast.error("Failed to update profile");
      } else {
        refetch();
        toast.success("Profile updated successfully.");
      }
    },
  });

  useEffect(() => {
    if (data && !isPending && !error) {
      setTimeout(() => {
        form.setFieldValue("name", data.user.name);
      }, 0);
    }
  }, [data, error, form, isPending]);

  return (
    <>
      {isPending && (
        <div className="mt-4 w-full mx-auto">
          <Spinner className="mx-auto size-6" />
        </div>
      )}

      {!isPending && (
        <div className="container mx-auto px-6">
          <p className="leading-none font-semibold text-xl">Profile Settings</p>
          <p className="text-muted-foreground mt-1">
            Update your general profile information
          </p>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-2xl">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form
                id="update-profile"
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
              >
                <FieldGroup>
                  <form.Field name="name">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Email Address
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="John Doe"
                            autoComplete="off"
                            className="max-w-md"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                  <Button
                    disabled={isUpdating}
                    type="submit"
                    form="update-profile"
                    className="w-full max-w-md gap-2 cursor-pointer"
                  >
                    {isUpdating && <Spinner />}
                    {isUpdating ? "Loading..." : "Update Profile"}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
    // <div className="container mx-auto px-6">
    //   <Card className="max-w-4xl mx-auto">
    //     <CardHeader>
    //       <CardTitle>Profile Settings</CardTitle>
    //       <CardDescription>Update your profile details</CardDescription>
    //     </CardHeader>
    //     <CardContent>
    //       <form
    //         id="profile-settings"
    //         className="space-y-6"
    //         onSubmit={(e) => {
    //           e.preventDefault();
    //           form.handleSubmit();
    //         }}
    //       >
    //         <FieldGroup>
    //           <form.Field name="name">
    //             {(field) => {
    //               const isInvalid =
    //                 field.state.meta.isTouched && !field.state.meta.isValid;
    //               return (
    //                 <Field data-invalid={isInvalid}>
    //                   <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
    //                   <Input
    //                     id={field.name}
    //                     name={field.name}
    //                     value={field.state.value}
    //                     onBlur={field.handleBlur}
    //                     onChange={(e) => field.handleChange(e.target.value)}
    //                     aria-invalid={isInvalid}
    //                     placeholder="John Doe"
    //                     autoComplete="off"
    //                     className="max-w-md"
    //                   />
    //                   {isInvalid && (
    //                     <FieldError errors={field.state.meta.errors} />
    //                   )}
    //                 </Field>
    //               );
    //             }}
    //           </form.Field>
    //         </FieldGroup>
    //       </form>
    //     </CardContent>
    //   </Card>
    // </div>
  );
}
