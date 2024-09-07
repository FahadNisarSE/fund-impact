import { auth } from "@/../auth";
import { getUsersSupport } from "@/model/user";

export const revalidate = 60;

export async function GET(
  req: Request,
  { params }: { params: { user_id: string } }
) {
  try {
    const response = await getUsersSupport(params.user_id);

    return new Response(
      JSON.stringify({
        data: response,
        message: "Users support retrieved successfully.",
        code: 200,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error user support project:", error);
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
