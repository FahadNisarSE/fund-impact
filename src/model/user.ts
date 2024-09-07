import { InferSelectModel, count, eq } from "drizzle-orm";

import { posts, projects, support, users } from "../../db/schema";
import { db } from "../../db/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length === 0) return null;
    return user[0];
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, id));
    if (user.length === 0) return null;

    return user[0];
  } catch (error) {
    return null;
  }
};

export const getUsersSupport = async (id: string) => {
  const supportCount = await db
    .select({ count: count() })
    .from(support)
    .where(eq(support.userId, id));

  return supportCount[0].count;
};

export const getUserProjectandPosts = async (id: string) => {
  const promise1 = db
    .select({ count: count() })
    .from(projects)
    .where(eq(projects.user_id, id));
  const promise2 = db
    .select({ count: count() })
    .from(posts)
    .where(eq(posts.userId, id));

  const [projectArray, postsArray] = await Promise.all([promise1, promise2]);

  return {
    projects: projectArray[0].count,
    posts: postsArray[0].count,
  };
};

export const updateUserEmailStatus = async (id: string) => {
  try {
    const user = await db
      .update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user ?? null;
  } catch {
    return null;
  }
};

export type TUser = InferSelectModel<typeof users>;
