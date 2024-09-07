import { getPostDetail } from "@/model/posts";

export const revalidate = 0;

const isValidUUID = (id: string) => {
  const regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regex.test(id);
};

export async function GET(
  req: Request,
  { params }: { params: { post_id: string } }
) {
  const post_id = params.post_id;

  // Check if the post ID is provided
  if (!post_id || typeof post_id !== "string") {
    return Response.json(
      {
        data: null,
        code: 400,
        message:
          "Post ID is missing or invalid. Please provide a valid Post ID.",
      },
      { status: 400 }
    );
  }

  // Validate the format of the post ID
  if (!isValidUUID(post_id)) {
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
    // Fetch the post by ID
    const post = await getPostDetail(post_id);

    // Check if the post was found
    if (post) {
      return Response.json(
        {
          data: post,
          code: 200,
          message: "Post successfully retrieved.",
        },
        {
          status: 200,
        }
      );
    } else {
      return Response.json(
        {
          data: null,
          code: 404,
          message: "Post not found. Please ensure the post ID is correct.",
        },
        {
          status: 404,
        }
      );
    }
  } catch (error) {
    console.error("Error fetching post: ", error);
    return Response.json(
      {
        data: null,
        code: 500,
        message:
          "An error occurred while retrieving the post. Please try again later.",
      },
      { status: 500 }
    );
  }
}
