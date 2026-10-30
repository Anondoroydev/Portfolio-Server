import { z } from "zod";

const optionalUrl = z.union([z.string().url().max(2048), z.literal(""), z.null()]).optional();

export const createProjectSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().min(1).max(6000),
  techStack: z.array(z.string().trim().min(1).max(50)).max(30),
  liveLink: optionalUrl,
  githubLink: optionalUrl,
  featured: z.boolean().default(false),
  imageUrl: optionalUrl,
});

export const updateProjectSchema = createProjectSchema.partial().refine(
  (project) => Object.keys(project).length > 0,
  { message: "At least one project field must be provided." },
);

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
