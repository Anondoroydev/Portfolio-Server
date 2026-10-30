import { z } from "zod";

export const createReviewSchema = z.object({
  reviewerName: z.string().trim().min(1).max(120),
  role: z.string().trim().max(120).nullable().optional(),
  projectName: z.string().trim().max(150).nullable().optional(),
  content: z.string().trim().min(1).max(3000),
  rating: z.number().int().min(1).max(5),
  published: z.boolean().default(false),
});

export const updateReviewSchema = createReviewSchema.partial().refine(
  (review) => Object.keys(review).length > 0,
  { message: "At least one review field must be provided." },
);

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
