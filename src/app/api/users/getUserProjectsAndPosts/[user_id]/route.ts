import { auth } from "@/../auth";
import { getUserProjectandPosts } from "@/model/user";

export const revalidate = 60;

export async function GET(
  req: Request,
  { params }: { params: { user_id: string } }
) {
  const session = await auth();

  try {
    const response = await getUserProjectandPosts(params.user_id);

    return new Response(
      JSON.stringify({
        data: response,
        message: "Users project and posts count retrieved successfully.",
        code: 200,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("User project and posts:", error);
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
