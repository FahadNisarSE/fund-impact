import { sql } from "drizzle-orm";
import { db } from "../../db/db";

export default async function genericSearch(query: string) {
  const searchQuery = `%${query}%`;

  const postsQuery = sql`SELECT * FROM posts WHERE title ILIKE ${searchQuery} OR content ILIKE ${searchQuery}`;

  const projectsQuery = sql`SELECT * FROM projects WHERE title ILIKE ${searchQuery} OR description ILIKE ${searchQuery}`;

  const posts = (await db.execute(postsQuery)).rows;
  const projects = (await db.execute(projectsQuery)).rows;

  return {
    posts,
    projects,
  };
}
