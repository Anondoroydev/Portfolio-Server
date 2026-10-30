import { prisma } from "../config/prisma.js";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "../validation/project.schema.js";

export function listProjects() {
  return prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });
}

export function createProject(input: CreateProjectInput) {
  return prisma.project.create({ data: input });
}

export function updateProject(id: string, input: UpdateProjectInput) {
  return prisma.project.update({ where: { id }, data: input });
}

export function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}
