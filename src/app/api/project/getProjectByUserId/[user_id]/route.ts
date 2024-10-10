import { getProjectsByUserId } from "@/model/project";

export const revalidate = 0;

export async function GET(
  req: Request,
  { params }: { params: { user_id: string } }
) {
  const user_id = params.user_id;
  
  if (!user_id) {
    return Response.json(
      {
        data: null,
        code: 400,
        message: "User ID is missing. Please provide a user ID.",
      },
      { status: 400 }
    );
  }

  try {
    const projects = await getProjectsByUserId(user_id);

    return Response.json(
      {
        data: projects,
        code: 200,
        message: "Project retrieved successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching project by userId: ", error);
    return Response.json(
      {
        data: null,
        code: 500,
        message:
          "An error occurred while retrieving the projects. Please try again later.",
      },
      { status: 500 }
    );
  }
}
