"use client";

import useCreateChannelId from "@/services/action/useCreateChannelId";
import { useGetStreamToken } from "@/services/query/useGetStreamToken";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { DefaultGenerics, StreamChat } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

const apiKey = "vhu2sga7ea4q";

export default function ChatPage() {
  const session = useSession();
  const { mutate, isPending } = useGetStreamToken();
  const client = useRef<StreamChat<DefaultGenerics>>();
  const searchParams = useSearchParams();

  const channelId = searchParams.get("channelId");
  const username = searchParams.get("username");

  const userId = session?.data?.user.id;
  const filters = { members: { $in: [userId] }, type: "messaging" };
  const options = { presence: true, state: true };
  const sort = { last_message_at: undefined };
  const { mutate: createChannelId, isPending: PendingChannelId } =
    useCreateChannelId();

  useEffect(() => {
    const chatClient = StreamChat.getInstance(apiKey);
    mutate(
      { userId, username: session?.data?.user.name ?? "" },
      {
        onSuccess: async (data) => {
          console.log("Data: ", data);
          try {
            await chatClient.connectUser(
              { id: userId },
              data // token from server
            );
            client.current = chatClient;

            if (channelId && username) {
              createChannelId(
                {
                  userId1: userId,
                  userId2: channelId,
                  username,
                },
                {
                  onError: () => {},
                  onSuccess: async (data) => {
                    if (data) {
                      const channel = chatClient.channel(
                        "messaging",
                        `chat-${channelId}`,
                        {
                          members: [userId, channelId], // Add both users as members
                        }
                      );

                      await channel.create();
                      channel.watch();
                    }
                  },
                }
              );
            }
          } catch (error) {
            console.log("Api key, ", { error, apiKey });
          }
        },
        onError: (error) => {
          console.log("Error: ", error);
        },
      }
    );

    // Cleanup function to disconnect client when component unmounts
    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, [userId]);

  if (isPending || !client.current) return <div>Loading...</div>;

  return (
    <main className="pt-[120px] max-w-[1300px] mx-auto px-8">
      <Chat client={client.current}>
        <ChannelList sort={sort} filters={filters} options={options} />
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </main>
  );
}
