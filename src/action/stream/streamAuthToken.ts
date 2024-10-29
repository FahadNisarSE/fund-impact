"use server";

import { StreamChat } from "stream-chat";
import { db } from "../../../db/db";
import { chatChannel } from "../../../db/schema";
import { and, eq, or } from "drizzle-orm";

import crypto from "crypto";

function generateChannelId(userId1: string, userId2: string): string {
  const sortedIds = [userId1, userId2].sort().join("-");
  return crypto
    .createHash("sha256")
    .update(sortedIds)
    .digest("hex")
    .slice(0, 32);
}

if (!process.env.STREAM_APP_KEY && !process.env.STREAM_APP_SECRET)
  throw new Error("STREAM CREDENTIALS MISSING.");

const client = StreamChat.getInstance(
  process.env.STREAM_APP_KEY as string,
  process.env.STREAM_APP_SECRET as string
);

export const getStreamToken = async ({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) => {
  await client.upsertUser({
    id: userId,
    name: username,
    username,
  });

  const token = client.createToken(userId);

  return token;
};

export const createChannelId = async ({
  userId1,
  userId2,
  username,
}: {
  userId1: string;
  userId2: string;
  username: string;
}) => {
  const result = await db
    .select()
    .from(chatChannel)
    .where(
      or(
        and(eq(chatChannel.userId1, userId1), eq(chatChannel.userId2, userId2)),
        and(eq(chatChannel.userId1, userId2), eq(chatChannel.userId2, userId1))
      )
    );

  if (result.length) {
    return result[0].channelId;
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

    return channel[0].channelId;
  }
};
