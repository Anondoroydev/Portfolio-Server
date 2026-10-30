import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().email().max(254),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(10000),
});

export type ContactInput = z.infer<typeof contactSchema>;
