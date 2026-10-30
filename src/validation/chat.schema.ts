import { z } from "zod";

export const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "model"]),
    text: z.string().trim().min(1).max(2000),
  })).min(1).max(12).superRefine((messages, context) => {
    messages.forEach((message, index) => {
      if (index > 0 && message.role === messages[index - 1]?.role) {
        context.addIssue({
          code: "custom",
          message: "Chat messages must alternate between user and model.",
          path: [index, "role"],
        });
      }
    });

    if (messages.at(-1)?.role !== "user") {
      context.addIssue({
        code: "custom",
        message: "The latest chat message must be from the user.",
        path: ["messages"],
      });
    }
  }),
});

export type ChatInput = z.infer<typeof chatSchema>;
