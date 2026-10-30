import type { Request, Response } from "express";
import {
  createProject as createProjectService,
  deleteProject as deleteProjectService,
  listProjects as listProjectsService,
  updateProject as updateProjectService,
} from "../services/project.service.js";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "../validation/project.schema.js";
import { AppError } from "../utils/appError.js";

function getProjectId(request: Request): string {
  const { id } = request.params;
  if (typeof id !== "string" || id.length === 0) {
    throw new AppError("A valid project id is required.", 400);
  }
  return id;
}

export async function listProjects(_request: Request, response: Response): Promise<void> {
  response.status(200).json({ data: await listProjectsService() });
}

export async function createProject(request: Request, response: Response): Promise<void> {
  const project = await createProjectService(request.body as CreateProjectInput);
  response.status(201).json({ data: project });
}

export async function updateProject(request: Request, response: Response): Promise<void> {
  const project = await updateProjectService(
    getProjectId(request),
    request.body as UpdateProjectInput,
  );
  response.status(200).json({ data: project });
}

export async function deleteProject(request: Request, response: Response): Promise<void> {
  await deleteProjectService(getProjectId(request));
  response.status(204).end();
}
