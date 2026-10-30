import { Router } from "express";
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
} from "../controllers/project.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createProjectSchema, updateProjectSchema } from "../validation/project.schema.js";

const router = Router();

router.get("/", asyncHandler(listProjects));
router.post("/", requireAuth, validateBody(createProjectSchema), asyncHandler(createProject));
router.put("/:id", requireAuth, validateBody(updateProjectSchema), asyncHandler(updateProject));
router.delete("/:id", requireAuth, asyncHandler(deleteProject));

export default router;
