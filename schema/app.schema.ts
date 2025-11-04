import { PREDEFINED_TAGS } from "@/data";
import * as z from "zod";

export const createAppSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(32, "Name must be at most 32 characters."),
  slug: z
    .string()
    .regex(
      /^[a-z_]+$/,
      "Slug must contain only lowercase letters and underscores.",
    ),
  description: z
    .string()
    .min(15, "Description must be at least 15 characters.")
    .max(1000, "Description must be at most 1000 characters."),
  tags: z
    .array(z.string())
    .min(1, "Select at least one tag.")
    .refine(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (tags) => tags.every((tag) => PREDEFINED_TAGS.includes(tag as any)),
      { message: "Invalid tag selected." },
    )
    .refine((tags) => new Set(tags).size === tags.length, {
      message: "Tags must be unique.",
    }),
  websiteUrl: z
    .url("Must be a valid URL")
    .min(10, "URL must be at least 10 characters")
    .max(200, "URL must be at most 200 characters")
    .or(z.literal("")),
  repoUrl: z
    .url("Must be a valid URL")
    .min(10, "URL must be at least 10 characters")
    .max(200, "URL must be at most 200 characters")
    .or(z.literal("")),
  demoUrl: z
    .url("Must be a valid URL")
    .min(10, "URL must be at least 10 characters")
    .max(200, "URL must be at most 200 characters")
    .or(z.literal("")),
  status: z.enum(["draft", "published", "published"], "Invalid app status"),
});
