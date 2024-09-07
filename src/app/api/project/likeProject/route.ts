import { redirect } from "next/navigation";

import { auth } from "@/../auth";
import { likeProject } from "@/model/project";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const session = await auth();

    if (!session?.user?.id) {
      redirect("/auth/signin");
      return;
    }

    if (!payload.projectId) {
      return new Response(
        JSON.stringify({
          data: null,
          message: "Project Id is required.",
          code: 400,
        }),
        { status: 400 }
      );
    }

    const response = await likeProject(payload.projectId, session.user.id);

    return new Response(
      JSON.stringify({
        data: response,
        message: response === "liked" ? "Project liked." : "Project unliked.",
        code: 201,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error liking/unliking project:", error);
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
