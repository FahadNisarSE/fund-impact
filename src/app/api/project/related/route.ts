import { getProjectsExcept } from "@/model/project";
import { NextRequest } from "next/server";

export const revalidate = 60;

const isValidUUID = (id: string) => {
  const regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regex.test(id);
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit");
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return Response.json(
      {
        data: null,
        code: 400,
        message: "A valid Project ID is required to proceed.",
      },
      {
        status: 400,
      }
    );
  }

  // Validate the format of the project ID
  if (!isValidUUID(projectId)) {
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
    const projects = await getProjectsExcept(
      projectId,
      limit ? Number(limit) : 10
    );

    return Response.json(
      {
        data: projects,
        code: 200,
        message: `Successfully retrieved related projects, excluding project ID: ${projectId}.`,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching related projects: ", error);
    return Response.json(
      {
        data: null,
        code: 500,
        message:
          "An internal server error occurred while attempting to retrieve related projects. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}
