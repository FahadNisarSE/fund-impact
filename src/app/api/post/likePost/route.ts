import { redirect } from "next/navigation";

import { auth } from "@/../auth";
import { likePost } from "@/model/posts";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const session = await auth();

    if (!session?.user?.id) {
      redirect("/auth/signin");
      return;
    }

    if (!payload.postId) {
      return new Response(
        JSON.stringify({
          data: null,
          message: "Post Id is required.",
          code: 400,
        }),
        { status: 400 }
      );
    }

    const response = await likePost(payload.postId, session.user.id);

    return new Response(
      JSON.stringify({
        data: response,
        message: response === "liked" ? "Post liked." : "Post unliked.",
        code: 201,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error liking/unliking post:", error);
    return new Response(
      JSON.stringify({
        data: null,
        message: "Something went wrong. Please try again.",
        code: 500,
      }),
      { status: 500 }
    );
  }
}
