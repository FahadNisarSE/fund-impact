import { getLatestPostsWithPagination } from "@/model/posts";
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
    const posts = await getLatestPostsWithPagination(limit, page);

    return Response.json(
      {
        data: posts,
        code: 200,
        message: "Posts retrieved successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error while fetching posts: ", error)
    return Response.json(
      {
        data: null,
        code: 500,
        message: "Something went wrong while fetching posts.",
      },
      { status: 500 }
    );
  }
}
