import { InferInsertModel, desc, ne, eq } from "drizzle-orm";

import { db } from "@/../../db/db";
import { projects } from "@/../../db/schema";

export async function createProjectModel(
  payload: InferInsertModel<typeof projects>
) {
  await db.insert(projects).values(payload);
}

export async function getProjectById(projectId: string) {
  const _projects = await db
    .select()
    .from(projects)
    .where(eq(projects.projectId, projectId));

  if (_projects.length) return _projects[0];

  return null;
}

export async function getLatestProject(limit: number) {
  const project = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.createdAt))
    .limit(limit);
  return project;
}

export async function getProjectsExcept(projectId: string, limit: number) {
  const project = await db
    .select()
    .from(projects)
    .where(ne(projects.projectId, projectId))
    .orderBy(desc(projects.createdAt))
    .limit(limit);

  return projects;
}
