import { getProjectById } from "@/model/project";

export const revalidate = 10;

const isValidUUID = (id: string) => {
  const regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regex.test(id);
};

export async function GET(
  req: Request,
  { params }: { params: { project_id: string } }
) {
  const project_id = params.project_id;

  // Check if the project ID is provided
  if (!project_id || typeof project_id !== "string") {
    return Response.json(
      {
        data: null,
        code: 400,
        message:
          "Project ID is missing or invalid. Please provide a valid project ID.",
      },
      { status: 400 }
    );
  }

  // Validate the format of the project ID
  if (!isValidUUID(project_id)) {
    return Response.json(
      {
        data: null,
        code: 400,
        message:
          "The provided project ID is not a valid UUID. Please check the ID and try again.",
      },
      { status: 400 }
    );
  }

  try {
    // Fetch the project by ID
    const project = await getProjectById(project_id);

    // Check if the project was found
    if (project) {
      return Response.json(
        {
          data: project,
          code: 200,
          message: "Project retrieved successfully.",
        },
        {
          status: 200,
        }
      );
    } else {
      return Response.json(
        {
          data: null,
          code: 404,
          message:
            "Project not found. Please ensure the project ID is correct.",
        },
        {
          status: 404,
        }
      );
    }
  } catch (error) {
    console.error("Error fetching project: ", error);
    return Response.json(
      {
        data: null,
        code: 500,
        message:
          "An error occurred while retrieving the project. Please try again later.",
      },
      { status: 500 }
    );
  }
}
