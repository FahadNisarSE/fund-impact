import { db } from "@/../db/db";
import { chatChannel } from "@/../db/schema";
import crypto from "crypto";
import { and, eq, or } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { StreamChat } from "stream-chat";

if (!process.env.STREAM_APP_KEY || !process.env.STREAM_APP_SECRET) {
  throw new Error("STREAM CREDENTIALS MISSING.");
}

const client = StreamChat.getInstance(
  process.env.STREAM_APP_KEY,
  process.env.STREAM_APP_SECRET
);

function generateChannelId(userId1: string, userId2: string): string {
  const sortedIds = [userId1, userId2].sort().join("-");
  return crypto
    .createHash("sha256")
    .update(sortedIds)
    .digest("hex")
    .slice(0, 32);
}

export const POST = async (req: NextRequest) => {
  try {
    const { userId1, userId2, username } = await req.json();
    if (!userId1 || !userId2 || !username) {
      return Response.json(
        { error: "userId1, userId2, and username are required" },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(chatChannel)
      .where(
        or(
          and(
            eq(chatChannel.userId1, userId1),
            eq(chatChannel.userId2, userId2)
          ),
          and(
            eq(chatChannel.userId1, userId2),
            eq(chatChannel.userId2, userId1)
          )
        )
      );

    if (result.length) {
      return Response.json({ channelId: result[0].channelId });
    } else {
      await client.upsertUser({
        id: userId2,
        name: username,
        username,
      });

      const channelId = generateChannelId(userId1, userId2);
      const channel = await db
        .insert(chatChannel)
        .values({
          channelId,
          userId1: userId1,
          userId2: userId2,
        })
        .returning();

      return Response.json({ channelId: channel[0].channelId });
    }
  } catch (error) {
    return Response.json(
      { error: "Failed to create or fetch channel ID" },
      { status: 500 }
    );
  }
};
