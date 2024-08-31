import { getUserById } from "@/model/user";
import { users } from "@/../db/schema";

type ResponseData = {
  data: typeof users.$inferInsert | null;
  message: string;
};

export async function POST(
  req: Request,
  { params }: { params: { user_id: string } }
) {
  const user_id = params.user_id;

  if (!user_id || typeof user_id !== "string") {
    return Response.json({ data: null, message: "User id is required." });
  }

  try {
    const user = await getUserById(user_id);
    if (user) {
      return Response.json({
        data: user,
        message: "User returned successfully!",
      });
    } else {
      return Response.json({ data: null, message: "User not found." });
    }
  } catch (error) {
    return Response.json({ data: null, message: "Internal server error." });
  }
}
