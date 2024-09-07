import { getPostsLikesAndComments } from "@/model/posts";
import { NextRequest } from "next/server";
import { auth } from "../../../../../auth";

export const revalidate = 0;

const isValidUUID = (id: string) => {
  const regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regex.test(id);
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const postId = searchParams.get("postId");
  const session = await auth();

  console.log("Post Id: ", postId);

  if (!postId) {
    return Response.json(
      {
        data: null,
        code: 400,
        message: "A valid post ID is required to proceed.",
      },
      {
        status: 400,
      }
    );
  }

  console.log("Post Id: ", postId);

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
    const likesAndComments = await getPostsLikesAndComments(
      postId,
      session?.user.id
    );

    return Response.json(
      {
        data: likesAndComments,
        code: 200,
        message: `Successfully retrieved related posts comments and likes.`,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching comments and likes: ", error);
    return Response.json(
      {
        data: null,
        code: 500,
        message:
          "An internal server error occurred while attempting to retrieve posts likes and comments.. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}
