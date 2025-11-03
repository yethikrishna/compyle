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
});
