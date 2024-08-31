import { InferInsertModel } from "drizzle-orm";

import { db } from "@/../../db/db";
import { posts } from "@/../../db/schema";

export async function createPost(payload: InferInsertModel<typeof posts>) {
  await db.insert(posts).values(payload);
}
