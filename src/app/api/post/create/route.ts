import { z } from "zod";

import { auth } from "@/../auth";
import { createPost } from "@/model/posts";
import { postServerSchema } from "@/schema/post.schema.server";
import moderation from "@/model/moderation";
import { Moderation } from "openai/resources/index.mjs";

const threshold = 0.05;

function checkCategoriesAndFlag(result: Moderation) {
  const { categories, category_scores } = result;
  let anyCategoryFlagged = false;

  for (const category in categories) {
    // @ts-ignore
    if (category_scores[category] >= threshold) {
      // @ts-ignore
      categories[category] = true;
      anyCategoryFlagged = true;
    } else {
      // @ts-ignore
      categories[category] = false;
    }
  }

  result.flagged = anyCategoryFlagged;

  console.log("Result from moderation : ", result);

  if (result.flagged) {
    return Response.json(
      {
        data: result,
        message:
          "The post contains flagged content based on moderation guidelines.",
        code: 422,
      },
      { status: 422 }
    );
  }

  return null; // Return null if no flag is raised
}

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

    const result = await moderation(
      `title: ${parsedData.title}, content: ${parsedData.content}`
    );

    const flaggedResponse = checkCategoriesAndFlag(result.results[0]);

    if (flaggedResponse) {
      return flaggedResponse;
    }

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
