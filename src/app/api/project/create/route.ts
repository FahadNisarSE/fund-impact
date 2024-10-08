import { z } from "zod";

import { auth } from "@/../auth";
import { createProjectModel } from "@/model/project";
import {
  projectBasicsServerSchema,
  projectDurationServerSchema,
  projectFundSchema,
} from "@/schema/project.schema";
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

  if (!payload.imageUrl) {
    return Response.json(
      {
        data: null,
        message: "Invalid data is passed!",
        code: 400,
      },
      {
        status: 400,
      }
    );
  }

  try {
    const projectBasics = await projectBasicsServerSchema.parseAsync(
      payload.projectBasics
    );
    const projectDuration = await projectDurationServerSchema.parseAsync(
      payload.projectDuration
    );
    const projectFund = await projectFundSchema.parseAsync(payload.projectFund);

    try {
      const result = await moderation(
        `title: ${projectBasics.title}, subtitle:${projectBasics.subtitle} description: ${projectBasics.description}`
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

    await createProjectModel({
      category: projectBasics.category,
      description: projectBasics.description,
      goalAmount: String(projectFund.goalAmount),
      currentAmout: String(projectFund.currentAmout),
      image: payload.imageUrl,
      projectDuration: String(projectDuration.projectDuration),
      title: projectBasics.title,
      lauchDate: projectDuration.launchDate,
      user_id: session.user.id,
      subtitle: projectBasics.subtitle,
    });

    return Response.json(
      { data: null, message: "Project created successfully!", code: 201 },
      { status: 201 }
    );
  } catch (error) {
    console.log("Create Project: ", error);
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
