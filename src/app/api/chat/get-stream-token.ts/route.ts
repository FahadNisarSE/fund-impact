import type { NextRequest } from "next/server";
import { StreamChat } from "stream-chat";

if (!process.env.STREAM_APP_KEY || !process.env.STREAM_APP_SECRET) {
  throw new Error("STREAM CREDENTIALS MISSING.");
}

const client = StreamChat.getInstance(
  process.env.STREAM_APP_KEY,
  process.env.STREAM_APP_SECRET
);

export const POST = async (req: NextRequest) => {
  try {
    const { userId, username } = await req.json();
    if (!userId || !username) {
      return Response.json(
        { error: "User ID and username are required" },
        { status: 400 }
      );
    }

    // Upsert user in Stream Chat
    await client.upsertUser({
      id: userId,
      name: username,
      username,
    });

    const token = client.createToken(userId);

    return Response.json({ token });
  } catch (error) {
    return Response.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
};
