"use client";

import useCreateChannelId from "@/services/action/useCreateChannelId";
import Image from "next/image";
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

  const userId = session?.data?.user.id ?? "";
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

  if (isPending || !client.current)
    return (
      <div className="h-[90vh] w-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-8 max-w-md">
          <Image
            src="/logo.svg"
            alt="Fund Impact"
            className="object-contain"
            width={200}
            height={200}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            className="text-green-500"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
            >
              <animateTransform
                attributeName="transform"
                dur="0.75s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              />
            </path>
          </svg>
          <p className="text-center text-muted-foreground">
            &quot;The only way to discover the limits of the possible is to go
            beyond them into the impossible.&quot; - Arthur C. Clarke
          </p>
        </div>
      </div>
    );

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
