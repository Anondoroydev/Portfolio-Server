import type { Request, Response } from "express";
import { login as loginService } from "../services/auth.service.js";
import type { LoginInput } from "../validation/auth.schema.js";

export async function login(request: Request, response: Response): Promise<void> {
  const result = await loginService(request.body as LoginInput);
  response.status(200).json(result);
}
