// CreateApp.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { createApp } from "@/server/app";
import { ImageData } from "@/types/image";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookCheck,
  FileText,
  Layers,
  LinkIcon,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import NewAppImage from "./image";

export default function CreateApp() {
  const router = useRouter();
  const [techSearch, setTechSearch] = useState("");
  const [imageData, setImageData] = useState<ImageData | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: createApp,
    onSuccess: () => {
      toast.success("App submitted successfully");
      router.push("/dashboard/apps/me");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit app");
      form.reset();
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
      status: "published",
    },
    validators: { onSubmit: createAppSchema },
    onSubmit: ({ value }) => {
      if (!imageData) {
        toast.error("Please upload an image for your app");
        return;
      }

      mutate({
        values: {
          ...value,
          status: value.status as "draft" | "published",
        },
        imageData: imageData,
      });
    },
  });

  const filteredTechnologies = VALID_TECHNOLOGIES.filter((tech) =>
    tech.toLowerCase().includes(techSearch.toLowerCase()),
  );

  return (
    <div className="flex-1 mt-2">
      <form
        id="create-app-form"
        className="max-w-4xform l space-y-8 mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card>
          <CardContent>
            <div className="mb-10">
              <h2 className="text-xl lg:text-2xl font-bold mb-3 gradient-text">
                Submit New App
              </h2>
              <p className="text-muted-foreground text-lg">
                Launch your applications built with Compyle AI. Fill in the details below
                to get started.
              </p>
            </div>

          </CardContent>
          <CardContent className="my-5">
            {/* <div className="flex items-start gap-4 mb-8">
              <div className="bg-secondary/50 p-3 rounded-lg shrink-0">
                <FileText className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg lg:text-xl font-semibold whitespace-nowrap">
                    Basic Information
                  </h3>
                  <div className="h-px flex-1 bg-white/80" />
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  Tell us more about your app
                </p>
              </div>
            </div> */}

            {/* Form Fields */}
            <div className="pl-0 lg:pl-16 space-y-6">
              {/* App Name */}
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

              {/* App Slug */}
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

              {/* Description */}
              <FieldGroup>
                <form.Field name="description">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Description</FieldLabel>
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
            {/* Section Separator (before next section) */}
          </CardContent>
          <CardContent className="my-5">
            {/* <div className="flex items-start gap-4 mb-8">
              <div className="bg-secondary/50 p-3 rounded-lg shrink-0">
                <Layers className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg lg:text-xl font-semibold whitespace-nowrap">
                    Category
                  </h3>
                  <div className="h-px flex-1 bg-white/80" />
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  Select the primary category for your app
                </p>
              </div>
            </div> */}
            <div className="pl-0 lg:pl-16 mt-2 space-y-6">
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
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        >
                          <SelectTrigger
                            id="category-select"
                            aria-invalid={isInvalid}
                            className="w-full"
                          >
                            <SelectValue placeholder="Choose a category..." />
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

          </CardContent>
          <CardContent className="my-5">
            {/* =========================
               Built With Section
               ========================= */}
            {/* <div className="flex items-start gap-4 mb-8">
              <div className="bg-secondary/50 p-3 rounded-lg shrink-0">
                <Layers className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg lg:text-xl font-semibold whitespace-nowrap">
                    Built With
                  </h3>
                  <div className="h-px flex-1 bg-white/80" />
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  Select the technologies and frameworks used in your app
                </p>
              </div>
            </div> */}

            <div className="pl-0 lg:pl-16 mt-2 space-y-4">
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
                    field.handleChange(selectedTechs.filter((t) => t !== tech));
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
                                  className={`px-3 py-2 rounded-lg border transition-all font-medium text-sm text-left ${isSelected
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
          </CardContent>
          <CardContent className="my-5">
            {/* =========================
               Links Section
               ========================= */}
            {/* <div className="flex items-start gap-4 mb-8">
              <div className="bg-secondary/50 p-3 rounded-lg shrink-0">
                <LinkIcon className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg lg:text-xl font-semibold whitespace-nowrap">
                    Links
                  </h3>
                  <div className="h-px flex-1 bg-white/80" />
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  Provide links to your app (optional)
                </p>
              </div>
            </div> */}
            <div className="pl-0 lg:pl-16 mt-2 space-y-6">
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
          </CardContent>
          <CardContent className="my-5">
            <NewAppImage
              onImageDataChange={setImageData}
              initialImageData={imageData}
            />
          </CardContent>

          <CardContent className="my-5">
            {/* =========================
               Publish Status Section
               ========================= */}
            <div className="flex items-start gap-4 mb-8">
              <div className="bg-secondary/50 p-3 rounded-lg shrink-0">
                <BookCheck className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg lg:text-xl font-semibold whitespace-nowrap">
                    Publish Status
                  </h3>
                  <div className="h-px flex-1 bg-white/80" />
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  Whether to publish your app or just create a draft.
                </p>
              </div>
            </div>
            <div className="pl-0 lg:pl-16 mt-2 space-y-6">
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
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        >
                          <SelectTrigger
                            id="form-tanstack-select-status"
                            aria-invalid={isInvalid}
                            className="w-full"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            <SelectItem value="published">
                              Published (Published Immediately)
                            </SelectItem>
                            <SelectItem value="draft">
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
          </CardContent>
        </Card>
        <CardFooter className="flex flex-row pl-6 lg:pl-21 pt-4 pb-6 bg-secondary/5">
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
                setImageData(null);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-app-form"
              className="w-40 cursor-pointer gap-2"
              disabled={isPending}
            >
              {isPending && <Spinner />}
              {isPending ? "Loading..." : "Submit App"}
            </Button>
          </Field>
        </CardFooter>
      </form>
    </div >
  );
}