import z from "zod";

export const createCommentSchema = z.object({
  comment: z
    .string()
    .min(5, "Comment must be at least 5 characters")
    .max(500, "Comment must be at most 500 characters"),
});
