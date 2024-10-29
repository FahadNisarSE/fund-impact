import { and, eq } from "drizzle-orm";

import { db } from "@/../../db/db";
import { projects, support, users } from "../../db/schema";

export async function getSupportForProject(projectId: string) {
  const result = await db
    .select({
      supportId: support.supportId,
      amount: support.amount,
      verified: support.verified,
      createdAt: support.createdAt,
      updatedAt: support.updatedAt,
      userName: users.name,
      userEmail: users.email,
      userImage: users.image,
      userRole: users.userRole,
    })
    .from(support)
    .innerJoin(users, eq(support.userId, users.id))
    .innerJoin(projects, eq(support.projectId, projects.projectId))
    .where(and(eq(support.projectId, projectId), eq(support.verified, true)));

  return result;
}

export async function getSupportByUserId(userId: string) {
  const result = await db
    .select({
      supportId: support.supportId,
      amount: support.amount,
      verified: support.verified,
      createdAt: support.createdAt,
      updatedAt: support.updatedAt,
      projectId: projects.projectId,
      projectTitle: projects.title,
      projectImage: projects.image,
      projectCategory: projects.category,
      projectDescription: projects.description,
      goalAmount: projects.goalAmount,
      currentAmount: projects.currentAmout,
      launchDate: projects.lauchDate,
    })
    .from(support)
    .innerJoin(projects, eq(support.projectId, projects.projectId))
    .where(and(eq(support.userId, userId), eq(support.verified, true)));

  return result;
}
