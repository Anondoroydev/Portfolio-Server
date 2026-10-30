import { Router } from "express";
import {
  createReview,
  deleteReview,
  listAdminReviews,
  listPublicReviews,
  updateReview,
} from "../controllers/review.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createReviewSchema, updateReviewSchema } from "../validation/review.schema.js";

const router = Router();

router.get("/", asyncHandler(listPublicReviews));
router.get("/admin", requireAuth, asyncHandler(listAdminReviews));
router.post("/", requireAuth, validateBody(createReviewSchema), asyncHandler(createReview));
router.put("/:id", requireAuth, validateBody(updateReviewSchema), asyncHandler(updateReview));
router.delete("/:id", requireAuth, asyncHandler(deleteReview));

export default router;
