import { getSupportForProject } from "@/model/support";

const isValidUUID = (id: string) => {
  const regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regex.test(id);
};

export const revalidate = 0;

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const projectId = params.projectId;

  if (!projectId || typeof projectId !== "string") {
    return Response.json(
      {
        data: null,
        code: 400,
        message:
          "Project ID is missing or invalid. Please provide a valid Project ID.",
      },
      { status: 400 }
    );
  }

  if (!isValidUUID(projectId)) {
    return Response.json(
      {
        data: null,
        code: 400,
        message:
          "The provided Project ID is not a valid UUID. Please check the ID and try again.",
      },
      { status: 400 }
    );
  }

  try {
    const supports = await getSupportForProject(projectId);

    return Response.json(
      {
        data: supports,
        code: 200,
        message: "Project support retrieved successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching Project supports: ", error);
    return Response.json(
      {
        data: null,
        code: 500,
        message:
          "An error occurred while retrieving the Project supports. Please try again later.",
      },
      { status: 500 }
    );
  }
}
