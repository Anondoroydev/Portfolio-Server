import { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginSchema } from "../validation/auth.schema.js";

const router = Router();

router.post("/login", validateBody(loginSchema), asyncHandler(login));

export default router;
