import genericSearch from "@/model/search";
import { NextRequest } from "next/server";

export const revalidate = 60;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return Response.json(
      {
        data: null,
        code: 400,
        message: "Search query is required.",
      },
      { status: 400 }
    );
  }

  if (query.length < 3) {
    return Response.json(
      {
        data: null,
        code: 400,
        message: "Search query is should have atleast 3 letters.",
      },
      { status: 400 }
    );
  }

  try {
    const result = await genericSearch(query);

    return Response.json(
      {
        data: result,
        code: 200,
        message: "Search result retrieved successfully.",
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
