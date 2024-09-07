import { getLatestPosts } from "@/model/posts";
import { NextRequest } from "next/server";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit");
  try {
    const posts = await getLatestPosts(limit ? Number(limit) : 10);

    return Response.json(
      {
        data: posts,
        code: 200,
        message: "Latest posts retrived successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error fetching latest posts: ", error)
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
