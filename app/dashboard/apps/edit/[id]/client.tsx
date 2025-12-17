"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { TECH_COLORS, VALID_CATEGORIES, VALID_TECHNOLOGIES } from "@/data";
import { createAppSchema } from "@/schema/app.schema";
import { getDashboardAppDetails, updateAppDetails } from "@/server/app";
import { AppPublishStatus } from "@/types/app";
import { ImageData } from "@/types/image";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  BookCheck,
  FilePlusCorner,
  FileText,
  Layers,
  LinkIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import NewAppImage from "./image";

export default function EditAPpDetails({ id }: { id: string }) {
  const router = useRouter();
  const [techSearch, setTechSearch] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [initialImageData, setInitialImageData] = useState<ImageData | null>(
    null,
  );

  const { isPending: isLoadingApp, data: appData } = useQuery({
    queryKey: ["dashboard-app-edit", id],
    queryFn: () => getDashboardAppDetails({ id }),
    meta: { showError: true },
  });

  const { mutate, isPending: isSavingApp } = useMutation({
    mutationFn: ({
      values,
      appId,
      imageData,
    }: {
      values: z.infer<typeof createAppSchema>;
      appId: string;
      imageData?: ImageData | null;
    }) => updateAppDetails(values, appId, imageData),
    onSuccess: () => {
      toast.success("App updated successfully");
      router.push("/dashboard/apps/me");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update app");
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      category: "",
      builtWith: [] as string[],
      websiteUrl: "",
      repoUrl: "",
      demoUrl: "",
      status: "published" as AppPublishStatus,
    },
    validators: { onSubmit: createAppSchema },
    onSubmit: ({ value }) => {
      // Only include image data if it has changed
      const hasImageChanged =
        (imageData && !initialImageData) ||
        (imageData &&
          initialImageData &&
          imageData.fileId !== initialImageData.fileId);

      mutate({
        values: value,
        appId: id,
        imageData: hasImageChanged ? imageData : undefined,
      });
    },
  });

  useEffect(() => {
    if (appData?.appDetails) {
      setTimeout(() => {
        form.setFieldValue("name", appData.appDetails.name);
        form.setFieldValue("slug", appData.appDetails.slug);
        form.setFieldValue("description", appData.appDetails.description);
        form.setFieldValue("category", appData.appDetails.category);
        form.setFieldValue("builtWith", appData.appDetails.builtWith || []);
        form.setFieldValue("websiteUrl", appData.appDetails.websiteUrl || "");
        form.setFieldValue("repoUrl", appData.appDetails.repoUrl || "");
        form.setFieldValue("demoUrl", appData.appDetails.demoUrl || "");
        form.setFieldValue("status", appData.appDetails.status || "published");

        // Set the initial image data if available
        if (appData.imageDetails) {
          const imageData = {
            url: appData.imageDetails.url,
            fileId: appData.imageDetails.fileId,
            thumbnailUrl: appData.imageDetails.thumbnailUrl,
          };
          setInitialImageData(imageData);
          setImageData(imageData);
        }
      }, 0);
    }
  }, [appData, form]);

  const filteredTechnologies = VALID_TECHNOLOGIES.filter((tech) =>
    tech.toLowerCase().includes(techSearch.toLowerCase()),
  );

  return (
    <div className="flex-1">
      {isLoadingApp && (
        <div className="mt-4">
          <Spinner className="mx-auto size-6" />
        </div>
      )}

      {!isLoadingApp && !appData && (
        <Empty className="border max-w-4xl mx-auto">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FilePlusCorner />
            </EmptyMedia>
            <EmptyTitle>App Not Found</EmptyTitle>
            <EmptyDescription>
              App with that ID not found. You can continue by submitting your
              own app or viewing other apps.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Link href="/dashboard/apps/new">
                <Button className="cursor-pointer">Submit App</Button>
              </Link>
              <Link href="/dashboard/apps/me">
                <Button className="cursor-pointer" variant="outline">
                  View All Apps
                </Button>
              </Link>
            </div>
          </EmptyContent>
        </Empty>
      )}

      {!isLoadingApp && appData && (
        <form
          id="edit-app-form"
          className="max-w-4xl space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          {/* Basic Information */}
          <Card>
            <div className="mb-10">
              <h1 className="text-2xl lg:text-4xl font-bold mb-3 gradient-text">
                Edit App
              </h1>
              <p className="text-muted-foreground text-lg">
                Update the details for your application.
              </p>
            </div>
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
                          <p className="text-xs text-muted-foreground mt-1">
                            Use only lowercase letters and underscores
                          </p>
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
              {/*</CardContent>
          </Card>*/}

              {/* Category */}
              {/*<Card>
            <CardContent>*/}
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-secondary/50 p-3 rounded-lg">
                  <Layers className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h2 className="text-lg lg:text-xl font-semibold mb-1">
                    Category
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Select the primary category for your app
                  </p>
                </div>
              </div>
              <div className="pl-16 mt-2 space-y-6">
                <FieldGroup>
                  <form.Field name="category">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field orientation="vertical" data-invalid={isInvalid}>
                          <FieldContent>
                            <FieldLabel htmlFor="category-select">
                              Select Category
                            </FieldLabel>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </FieldContent>
                          <Select
                            name={field.name}
                            value={field.state.value || categoryValue}
                            onValueChange={(value) => {
                              field.handleChange(value);
                              setCategoryValue(value);
                            }}
                            key={categoryValue} // Force re-render when value changes
                          >
                            <SelectTrigger
                              id="category-select"
                              aria-invalid={isInvalid}
                              className="w-full"
                            >
                              <SelectValue placeholder="Choose a category...">
                                {categoryValue ||
                                  field.state.value ||
                                  "Choose a category..."}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent position="item-aligned">
                              {VALID_CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      );
                    }}
                  </form.Field>
                </FieldGroup>
              </div>
              {/*</CardContent>
          </Card>*/}

              {/* Built With */}
              {/*<Card>
            <CardContent>*/}
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-secondary/50 p-3 rounded-lg">
                  <Layers className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h2 className="text-lg lg:text-xl font-semibold mb-1">
                    Built With
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Select the technologies and frameworks used in your app
                  </p>
                </div>
              </div>

              <div className="pl-16 mt-2 space-y-4">
                <form.Field name="builtWith">
                  {(field) => {
                    const selectedTechs = field.state.value || [];
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    const addTech = (tech: string) => {
                      if (!selectedTechs.includes(tech)) {
                        field.handleChange([...selectedTechs, tech]);
                        setTechSearch("");
                      }
                    };

                    const removeTech = (tech: string) => {
                      field.handleChange(
                        selectedTechs.filter((t) => t !== tech),
                      );
                    };

                    return (
                      <Field data-invalid={isInvalid}>
                        {/* Selected Technologies Display */}
                        {selectedTechs.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">
                              Selected Technologies ({selectedTechs.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {selectedTechs.map((tech) => {
                                const colorClass =
                                  TECH_COLORS[tech] ||
                                  "bg-primary/20 text-primary border-primary/50";
                                return (
                                  <div
                                    key={tech}
                                    className={`px-3 py-1.5 rounded-lg border font-medium text-sm flex items-center gap-2 ${colorClass}`}
                                  >
                                    {tech}
                                    <button
                                      type="button"
                                      onClick={() => removeTech(tech)}
                                      className="hover:opacity-70 transition-opacity"
                                      aria-label={`Remove ${tech}`}
                                    >
                                      <X className="w-3.5 h-3.5 cursor-pointer" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Search Input */}
                        <div className="space-y-2">
                          <FieldLabel htmlFor="tech-search">
                            Search Technologies
                          </FieldLabel>
                          <Input
                            id="tech-search"
                            type="text"
                            value={techSearch}
                            onChange={(e) => setTechSearch(e.target.value)}
                            placeholder="Search for technologies..."
                            autoComplete="off"
                          />
                        </div>

                        {/* Technology Selection Grid */}
                        <div className="mt-4 max-h-64 overflow-y-auto border rounded-lg p-4">
                          {filteredTechnologies.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {filteredTechnologies.map((tech) => {
                                const isSelected = selectedTechs.includes(tech);

                                return (
                                  <button
                                    key={tech}
                                    type="button"
                                    onClick={() => addTech(tech)}
                                    disabled={isSelected}
                                    className={`px-3 py-2 rounded-lg border transition-all font-medium text-sm text-left ${
                                      isSelected
                                        ? "opacity-50 cursor-not-allowed bg-muted"
                                        : "hover:scale-105 bg-muted/10 text-muted-foreground border-border hover:border-primary/50"
                                    }`}
                                  >
                                    {tech}
                                    {isSelected && " ✓"}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-center text-muted-foreground py-8">
                              No technologies found matching &quot;{techSearch}
                              &quot;
                            </p>
                          )}
                        </div>

                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          Click on technologies to add them. Select at least one
                          technology.
                        </p>
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
              {/*</CardContent>
          </Card>*/}

              {/* Links */}
              {/*<Card>
            <CardContent>*/}
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-secondary/50 p-3 rounded-lg">
                  <LinkIcon className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h2 className="text-lg lg:text-xl font-semibold mb-1">
                    Links
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Provide links to your app (optional)
                  </p>
                </div>
              </div>
              <div className="pl-16 mt-2 space-y-6">
                <FieldGroup>
                  <form.Field name="websiteUrl">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Website URL
                          </FieldLabel>
                          <Input
                            type="url"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="https://amazingapp.com"
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
                  <form.Field name="repoUrl">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Repository URL
                          </FieldLabel>
                          <Input
                            type="url"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="https://github.com/username/repo"
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
                  <form.Field name="demoUrl">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Demo URL</FieldLabel>
                          <Input
                            type="url"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="https://demo.amazingapp.com"
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
              </div>
              {/*</CardContent>
          </Card>*/}

              {/* Image upload */}
              <NewAppImage
                onImageDataChange={setImageData}
                initialImageData={initialImageData}
              />

              {/* Publish Status */}
              {/*<Card>
            <CardContent>*/}
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-secondary/50 p-3 rounded-lg">
                  <BookCheck className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h2 className="text-lg lg:text-xl font-semibold mb-1">
                    Publish Status
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Whether to publish your app or just create a draft.
                  </p>
                </div>
              </div>
              <div className="pl-16 mt-2 space-y-6">
                <FieldGroup>
                  <form.Field name="status">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field orientation="vertical" data-invalid={isInvalid}>
                          <FieldContent>
                            <FieldLabel htmlFor="form-tanstack-select-status">
                              Select Status
                            </FieldLabel>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </FieldContent>
                          <Select
                            name={field.name}
                            value={field.state.value || "published"}
                            onValueChange={(value) =>
                              field.handleChange(value as AppPublishStatus)
                            }
                          >
                            <SelectTrigger
                              id="form-tanstack-select-status"
                              aria-invalid={isInvalid}
                              className="w-full cursor-pointer"
                            >
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="item-aligned">
                              <SelectItem
                                className="cursor-pointer"
                                value="published"
                              >
                                Published (Published Immediately)
                              </SelectItem>
                              <SelectItem
                                className="cursor-pointer"
                                value="draft"
                              >
                                Draft (Save for Later)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      );
                    }}
                  </form.Field>
                </FieldGroup>
              </div>
              <CardFooter className="flex flex-row pl-21">
                <Field
                  orientation="horizontal"
                  className="w-full flex justify-between"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => {
                      form.reset();
                      setTechSearch("");
                      setImageData(initialImageData); // Reset to initial image data
                    }}
                    disabled={isSavingApp}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    form="edit-app-form"
                    className="w-40 cursor-pointer gap-2"
                    disabled={isSavingApp}
                  >
                    {isSavingApp && <Spinner />}
                    {isSavingApp ? "Saving..." : "Save Changes"}
                  </Button>
                </Field>
              </CardFooter>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
