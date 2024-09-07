import { InferInsertModel, and, count, desc, eq, ne } from "drizzle-orm";

import { db } from "../../db/db";
import {
  likes,
  postComments,
  postLikes,
  posts,
  projects,
  users,
} from "../../db/schema";

export async function createPost(payload: InferInsertModel<typeof posts>) {
  const result = await db.insert(posts).values(payload).returning();
  return result[0];
}

export async function getPostById(postId: string) {
  const result = await db.select().from(posts).where(eq(posts.postId, postId));
  if (result.length) {
    return result[0];
  }

  return null;
}

export async function getPostDetail(postId: string) {
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.postId, postId))
    .leftJoin(users, eq(posts.userId, users.id));

  return result[0];
}

export async function getLatestPosts(limit: number) {
  const result = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(limit);

  return result;
}

export async function getPostsExcept(postId: string, limit: number) {
  const result = db
    .select()
    .from(posts)
    .where(ne(posts.postId, postId))
    .limit(limit);

  return result;
}

export async function getPostsLikesAndComments(
  postId: string,
  userId: string | undefined
) {
  const [likesCount, commentsCount] = await Promise.all([
    db
      .select({
        count: count(),
      })
      .from(postLikes)
      .where(eq(postLikes.postId, postId)),
    db
      .select({ count: count() })
      .from(postComments)
      .where(eq(postComments.postId, postId)),
  ]);

  let isLiked = false;

  if (userId) {
    const likesResult = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
    isLiked = likesResult.length > 0;
  }

  return {
    likes: likesCount.length ? likesCount[0].count : 0,
    comments: commentsCount.length ? commentsCount[0].count : 0,
    isLiked,
  };
}

export async function likePost(postId: string, userId: string) {
  const liked = await db
    .select({ userId: postLikes.userId })
    .from(postLikes)
    .where(and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)));

  if (liked.length && liked[0].userId === userId) {
    await db
      .delete(postLikes)
      .where(and(eq(postLikes.userId, userId), eq(postLikes.userId, userId)));
    return "unliked";
  } else {
    await db.insert(postLikes).values({
      postId: postId,
      userId: userId,
    });
    return "liked";
  }
}

export async function getPostComments(postId: string) {
  const result = await db
    .select()
    .from(postComments)
    .where(eq(postComments.postId, postId))
    .leftJoin(users, eq(postComments.userId, users.id));

  return result;
}

export async function postComment(
  postId: string,
  userId: string,
  comment: string
) {
  const result = await db
    .insert(postComments)
    .values({
      commentText: comment,
      postId,
      userId,
    })
    .returning();

  return result[0];
}
