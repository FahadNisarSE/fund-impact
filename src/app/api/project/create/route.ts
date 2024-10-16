import { z } from "zod";

import { auth } from "@/../auth";
import { createProjectModel } from "@/model/project";
import {
  projectBasicsServerSchema,
  projectDurationServerSchema,
  projectFundSchema,
} from "@/schema/project.schema";

const threshold = 0.4;

// function checkCategoriesAndFlag(result: Moderation) {
//   const { categories, category_scores } = result;
//   let anyCategoryFlagged = false;

//   for (const category in categories) {
//     if (category_scores[category] >= threshold) {
//       categories[category] = true; // Set category flag to true
//       anyCategoryFlagged = true; // If any category is flagged, mark that a flag was set
//     } else {
//       categories[category] = false; // Set category flag to false if below threshold
//     }
//   }

//   result.flagged = anyCategoryFlagged;

//   console.log("Result from moderation : ", result);

//   if (result.flagged) {
//     return Response.json(
//       {
//         data: result,
//         message:
//           "The post contains flagged content based on moderation guidelines.",
//         code: 422,
//       },
//       { status: 422 }
//     );
//   }
// }

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

    // try {
    //   const result = await moderation(
    //     `title: ${projectBasics.title}, subtitle:${projectBasics.subtitle} description: ${projectBasics.description}`
    //   );
    //   console.log("Moderation Result Server Sider: ", {
    //     result,
    //     title: projectBasics.title,
    //     descriptioon: projectBasics.description,
    //   });

    //   if (result.results.length) {
    //     checkCategoriesAndFlag(result.results[0]);
    //   }
    // } catch (error) {}

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
