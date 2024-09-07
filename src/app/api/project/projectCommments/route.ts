import { getProjectComment } from "@/model/project";
import { NextRequest } from "next/server";

export const revalidate = 0;

const isValidUUID = (id: string) => {
  const regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regex.test(id);
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
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
    const projectComments = await getProjectComment(projectId);
    return Response.json(
      {
        data: projectComments,
        code: 200,
        message: "Successfully retrieved project commments",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching comments: ", error);

    return Response.json(
      {
        data: null,
        code: 500,
        message:
          "An internal server error occurred while attempting to retrieve project comments. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}
