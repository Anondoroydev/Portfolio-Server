import { Router } from "express";
import { sendChatMessage } from "../controllers/chat.controller.js";
import { validateBody } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { chatSchema } from "../validation/chat.schema.js";

const router = Router();

router.post("/", validateBody(chatSchema), asyncHandler(sendChatMessage));

export default router;
