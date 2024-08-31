import { getLatestProject } from "@/model/project";
import { NextRequest } from "next/server";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit");
  try {
    const projects = await getLatestProject(limit ? Number(limit) : 10);

    return Response.json(
      {
        data: projects,
        code: 200,
        message: "Latest project retrived successfully.",
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
        message: "Internal Server Error.",
      },
      { status: 500 }
    );
  }
}
