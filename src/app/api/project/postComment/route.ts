import { redirect } from "next/navigation";
import { z } from "zod";

import { postComment } from "@/model/project";
import { projectCommentSchema } from "@/schema/project.schema";
import { auth } from "../../../../../auth";

export async function POST(req: Request) {
  const payload = await req.json();

  // Check if the user is authenticated
  const session = await auth();

  console.log("Session: ", session)

  if (!session?.user.id) {
    redirect("/auth/signin");
    return;
  }

  try {
    // Validate the payload against the schema
    const comment = await projectCommentSchema.parseAsync(payload);

    // Process the comment submission
    const commentResult = await postComment(
      comment.comment,
      comment.projectId,
      session.user.id
    );

    return Response.json(
      {
        data: commentResult,
        message: "Comment posted successfully!",
        code: 201,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation error
      return Response.json(
        {
          data: null,
          message:
            "Validation failed: Please ensure all fields are filled out correctly.",
          error: error.errors,
          code: 400,
        },
        { status: 400 }
      );
    } else {
      // Internal server error
      return Response.json(
        {
          data: null,
          message:
            "Internal server error: Unable to process your request at this time. Please try again later.",
          code: 500,
        },
        { status: 500 }
      );
    }
  }
}
