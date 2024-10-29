import { getSupportByUserId } from "@/model/support";

const isValidUUID = (id: string) => {
  const regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regex.test(id);
};

export const revalidate = 0;

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  console.log("user id: ", userId);

  if (!userId || typeof userId !== "string") {
    return Response.json(
      {
        data: null,
        code: 400,
        message:
          "User ID is missing or invalid. Please provide a valid user ID.",
      },
      { status: 400 }
    );
  }

  if (!isValidUUID(userId)) {
    return Response.json(
      {
        data: null,
        code: 400,
        message:
          "The provided user ID is not a valid UUID. Please check the ID and try again.",
      },
      { status: 400 }
    );
  }

  try {
    const supports = await getSupportByUserId(userId);

    console.log("Supports: ", supports);

    if (supports.length) {
      return Response.json(
        {
          data: supports,
          code: 200,
          message: "Supports retrieved successfully.",
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
          message: "Support not found. You have no supports to show right now.",
        },
        {
          status: 404,
        }
      );
    }
  } catch (error) {
    console.error("Error fetching supports: ", error);
    return Response.json(
      {
        data: null,
        code: 500,
        message:
          "An error occurred while retrieving the supports. Please try again later.",
      },
      { status: 500 }
    );
  }
}
