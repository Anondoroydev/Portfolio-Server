import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";

export interface AuthenticatedRequest {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthenticatedRequest;
    }
  }
}

export const requireAuth: RequestHandler = (request, _response, next) => {
  const authorization = request.get("authorization");
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    next(new AppError("Authentication token is required.", 401));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload === "string" || typeof payload.sub !== "string") {
      throw new AppError("Invalid authentication token.", 401);
    }

    request.auth = { userId: payload.sub };
    next();
  } catch {
    next(new AppError("Invalid or expired authentication token.", 401));
  }
};
