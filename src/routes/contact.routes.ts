import { Router } from "express";
import { submitContact } from "../controllers/contact.controller.js";
import { validateBody } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { contactSchema } from "../validation/contact.schema.js";

const router = Router();

router.post("/", validateBody(contactSchema), asyncHandler(submitContact));

export default router;
