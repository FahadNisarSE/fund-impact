import { z } from "zod";

import { auth } from "@/../auth";
import { createPost } from "@/model/posts";
import { postServerSchema } from "@/schema/post.schema.server";
import moderation from "@/model/moderation";

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

    try {
      const result = await moderation(
        `title: ${parsedData.title}, content: ${parsedData.content}`
      );

      console.log("Moderation Result Server Sider: ", result);

      if (result.results.length) {
        if (result.results[0].flagged || true) {
          return Response.json(
            {
              data: result.results[0],
              message:
                "The post contains content that violates moderation guidelines.",
              code: 422,
            },
            { status: 422 }
          );
        }
      }
    } catch (error) {}

    const post = await createPost({ ...parsedData, userId: session.user.id });

    return Response.json(
      { data: post, message: "Post created successfully!", code: 201 },
      { status: 201 }
    );
  } catch (error) {
    console.log("Create a post: ", error);
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
