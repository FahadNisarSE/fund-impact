import { getLatestProjectWithPagination } from "@/model/project";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit");
  const page = searchParams.get("page");

  if (!limit || !page) {
    return Response.json(
      {
        data: null,
        code: 400,
        message:
          "Limit or page number missing. Please provide required attributes.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const projects = await getLatestProjectWithPagination(limit, page);

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
    return Response.json(
      {
        data: null,
        code: 500,
        message: "Something went wrong while fetching projects.",
      },
      { status: 500 }
    );
  }
}
