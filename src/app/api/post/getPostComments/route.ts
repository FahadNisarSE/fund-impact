import { getPostComments } from "@/model/posts";
import { NextRequest } from "next/server";

export const revalidate = 0;

const isValidUUID = (id: string) => {
  const regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regex.test(id);
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const postId = searchParams.get("postId");

  if (!postId) {
    return Response.json(
      {
        data: null,
        code: 400,
        message: "A valid Post ID is required to proceed.",
      },
      {
        status: 400,
      }
    );
  }

  // Validate the format of the post ID
  if (!isValidUUID(postId)) {
    return Response.json(
      {
        data: null,
        code: 400,
        message:
          "The provided post ID is not a valid UUID. Please check the ID and try again.",
      },
      { status: 400 }
    );
  }
  try {
    const postComments = await getPostComments(postId);
    return Response.json(
      {
        data: postComments,
        code: 200,
        message: "Successfully retrieved post commments",
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
          "An internal server error occurred while attempting to retrieve post comments. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}
