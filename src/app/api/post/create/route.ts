import { z } from "zod";

import { auth } from "@/../auth";
import { createPost } from "@/model/posts";
import { postServerSchema } from "@/schema/post.schema.server";

export async function POST(req: Request) {
  const payload = await req.json();

  const session = await auth();

  if (!session?.user.id) {
    return Response.json(
      { data: null, message: "Unauthorized! User not logged in.", code: 401 },
      { status: 401 }
    );
  }

  try {
    const parsedData = await postServerSchema.parseAsync(payload);
    const post = await createPost({ ...parsedData, userId: session.user.id });

    return Response.json(
      { data: post, message: "Post created successfully!", code: 201 },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          data: null,
          message: "Invalid data is passed!",
          error: error.errors,
          code: 400,
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          data: null,
          message: "Something went wrong. Please try again.",
          code: 500,
        },
        {
          status: 500,
        }
      );
    }
  }
}
