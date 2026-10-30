import type { Request, Response } from "express";
import { replyToChat } from "../services/chat.service.js";
import type { ChatInput } from "../validation/chat.schema.js";

export async function sendChatMessage(request: Request, response: Response): Promise<void> {
  const reply = await replyToChat(request.body as ChatInput);
  response.status(200).json({ reply });
}
