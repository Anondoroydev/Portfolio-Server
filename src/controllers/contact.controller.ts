import type { Request, Response } from "express";
import { createContactMessage } from "../services/contact.service.js";
import type { ContactInput } from "../validation/contact.schema.js";

export async function submitContact(request: Request, response: Response): Promise<void> {
  const result = await createContactMessage(request.body as ContactInput);
  response.status(201).json({
    message: "Your message has been received.",
    ...result,
  });
}
