import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";
import type { LoginInput } from "../validation/auth.schema.js";

export async function login(input: LoginInput): Promise<{ token: string }> {
  const email = input.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = jwt.sign({ email: user.email }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: "12h",
  });
  return { token };
}
