import { InferInsertModel, and, count, desc, eq, ne, sql } from "drizzle-orm";

import { db } from "@/../../db/db";
import { comments, likes, projects, support, users } from "@/../../db/schema";

export async function createProjectModel(
  payload: InferInsertModel<typeof projects>
) {
  await db.insert(projects).values(payload);
}

export async function getProjectById(projectId: string) {
  const projectsArray = await db
    .select()
    .from(projects)
    .where(eq(projects.projectId, projectId));

  if (!projectsArray.length) {
    return null;
  }

  const project = projectsArray[0];
  const PROJECTID = project.projectId as string;

  const totalSupport = await db
    .select({
      totalAmount: sql`SUM(${support.amount})`.as("totalAmount"),
    })
    .from(support)
    .where(and(eq(support.projectId, PROJECTID), eq(support.verified, true)));

  const totalAmount = totalSupport[0]?.totalAmount ?? 0;
  const currentAmount = Number(totalAmount) + Number(project.currentAmout ?? 0);

  return {
    ...project,
    currentAmout: currentAmount,
  };
}

export async function getLatestProject(limit: number) {
  const project = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.createdAt))
    .limit(limit);
  return project;
}

export async function getLatestProjectWithPagination(
  limit: string,
  page: string
) {
  const offset = (Number(page) - 1) * Number(limit);

  const projectsArray = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.createdAt))
    .limit(Number(limit))
    .offset(offset)
    .innerJoin(users, eq(projects.user_id, users.id));

  return projectsArray;
}

export async function getProjectsByUserId(userId: string) {
  const projectsArray = await db
    .select()
    .from(projects)
    .where(eq(projects.user_id, userId))
    .orderBy(desc(projects.createdAt))
    .limit(10);

  return projectsArray;
}

export async function getProjectsExcept(projectId: string, limit: number) {
  const project = await db
    .select()
    .from(projects)
    .where(ne(projects.projectId, projectId))
    .orderBy(desc(projects.createdAt))
    .limit(limit);

  return project;
}

export async function getProjectLikesAndComments(
  projectId: string,
  userId: string | undefined
) {
  const [likesCount, commentsCount] = await Promise.all([
    db
      .select({
        count: count(),
      })
      .from(likes)
      .where(eq(likes.projectId, projectId)),
    db
      .select({ count: count() })
      .from(comments)
      .where(eq(comments.projectId, projectId)),
  ]);

  let isLiked = false;

  if (userId) {
    const likesResult = await db
      .select()
      .from(likes)
      .where(and(eq(likes.projectId, projectId), eq(likes.userId, userId)));
    isLiked = likesResult.length > 0;
  }

  return {
    likes: likesCount.length ? likesCount[0].count : 0,
    comments: commentsCount.length ? commentsCount[0].count : 0,
    isLiked,
  };
}

export async function likeProject(projectId: string, userId: string) {
  const liked = await db
    .select({ userId: likes.userId })
    .from(likes)
    .where(and(eq(likes.userId, userId), eq(likes.projectId, projectId)));

  if (liked.length && liked[0].userId === userId) {
    await db
      .delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.projectId, projectId)));
    return "unliked";
  } else {
    await db.insert(likes).values({
      projectId: projectId,
      userId: userId,
    });
    return "liked";
  }
}

export async function getProjectComment(projectId: string) {
  const commentsArray = await db
    .select()
    .from(comments)
    .where(eq(comments.projectId, projectId))
    .leftJoin(users, eq(comments.userId, users.id));

  return commentsArray;
}

export async function postComment(
  comment: string,
  projectId: string,
  userId: string
) {
  const commenstResult = await db
    .insert(comments)
    .values({
      commentText: comment,
      projectId,
      userId,
    })
    .returning();

  return commenstResult[0];
}

export async function addSupport(
  projectId: string,
  userId: string,
  totalAmount: string,
  stripeSessionId: string
) {
  await db.insert(support).values({
    stripeSessionId,
    projectId,
    userId,
    amount: totalAmount,
  });
}

export async function updateSupport(stripeSessionId: string) {
  await db
    .update(support)
    .set({
      verified: true,
    })
    .where(eq(support.stripeSessionId, stripeSessionId));
}

export async function getProjectDetail(projectId: string) {
  const result = await db.batch([
    db
      .select()
      .from(projects)
      .where(eq(projects.projectId, projectId))
      .leftJoin(users, eq(users.id, projects.user_id)),
    db.select().from(support).where(eq(support.projectId, projectId)),
  ]);

  // Simplifying the structure
  const simplifiedResult = {
    project: result[0][0].projects,
    user: result[0][0].user,
    support: result[1],
  };

  return simplifiedResult;
}
