"use client";

import { ImageUploader } from "@/components/custom/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { updateUser, useSession } from "@/lib/auth-client";
import { queryClient } from "@/providers/query.provider";
import { updateProfileSchema } from "@/schema/auth.schema";
import { ImageData } from "@/types";
import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfileSettings() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [initialImageData, setInitialImageData] = useState<ImageData | null>(
    null,
  );

  const { data, error, isPending, refetch } = useSession();

  const form = useForm({
    defaultValues: { name: "", about: "" },
    validators: { onSubmit: updateProfileSchema },
    onSubmit: async ({ value }) => {
      if (value.name === data?.user.name) {
        toast.error("Cannot update name to the same name");
        return;
      }

      if (value.about === data?.user.about) {
        toast.error("Cannot update about to the same about");
        return;
      }

      setIsUpdating(true);
      const id = toast.loading("Updating profile...");
      const { error } = await updateUser({
        name: value.name,
        about: value.about,
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
        form.setFieldValue("about", data.user.about as string);

        if (!data.user.image) {
          setInitialImageData(null);
        }

        setInitialImageData({
          image: data.user.image as string,
          imageProviderFileId: data.user.imageProviderFileId as
            | string
            | undefined,
        });
      }, 0);
    }
  }, [data, error, form, isPending]);

  const handleUpdateImage = async () => {
    const hasChanged =
      imageData?.image !== initialImageData?.image ||
      imageData?.imageProviderFileId !== initialImageData?.imageProviderFileId;

    if (!hasChanged) {
      toast.error("Image hasn't changed");
      return;
    }

    setIsUpdatingImage(true);
    const id = toast.loading("Updating avatar...");

    const { error } = await updateUser({
      image: imageData?.image ?? null,
      imageProviderFileId: imageData?.imageProviderFileId ?? null,
    });

    toast.dismiss(id);
    setIsUpdatingImage(false);

    if (error) {
      toast.error("Failed to update avatar");
    } else {
      setInitialImageData(imageData);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["user-global-auth-session"] });
      toast.success("Avatar updated successfully.");
    }
  };

  return (
    <>
      {isPending && (
        <div className="mt-4 w-full mx-auto">
          <Spinner className="mx-auto size-6" />
        </div>
      )}

      {!isPending && (
        <div className="w-full">
          <Separator />
          <Card className="mt-2 border-none bg-background max-w-lg">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-0">
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
                            Full Name
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

                  <form.Field name="about">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>About</FieldLabel>
                          <Textarea
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="My about information..."
                            className="pr-20 min-h-24 max-w-md"
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

          <Separator className="mt-8" />
          <Card className="mt-2 border-none bg-background max-w-2xl">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl">Avatar</CardTitle>
              <CardContent className="p-0 mt-4">
                <Field>
                  <FieldLabel className="mb-3">Your Avatar</FieldLabel>
                  <ImageUploader
                    type="profile"
                    onImageDataChange={setImageData}
                    initialImageData={initialImageData}
                  />
                </Field>

                <Button
                  onClick={handleUpdateImage}
                  disabled={isUpdatingImage}
                  type="button"
                  className="w-full max-w-md gap-2 cursor-pointer mt-6"
                >
                  {isUpdatingImage && <Spinner />}
                  {isUpdatingImage ? "Loading..." : "Update Avatar"}
                </Button>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      )}
    </>
  );
}
